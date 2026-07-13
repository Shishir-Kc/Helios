# Helios — Project Log

## Project Structure

```
Helios/
├── .git/
├── .gitignore
├── README.md
├── z.md                          # This file
├── backend/
│   ├── .dev.vars                 # Local secrets (ADMIN_API_KEY)
│   ├── wrangler.jsonc            # Worker config, D1 binding
│   ├── package.json
│   ├── tsconfig.json
│   ├── worker-configuration.d.ts # Auto-generated types
│   ├── migrations/
│   │   ├── 0001_create_papers.sql
│   │   └── 0002_add_category.sql
│   └── src/
│       ├── index.ts              # Hono API entry point
│       ├── db.ts                 # D1 query helpers
│       └── auth.ts               # Admin auth middleware
├── studio/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Dev proxy: /api -> localhost:8787
│   ├── dist/                     # Build output (Cloudflare Pages)
│   └── src/
│       ├── main.jsx              # BrowserRouter wrapper
│       ├── App.jsx               # Routes + auth gate
│       ├── App.css               # Dark theme (self-contained)
│       ├── api.js                # Fetch wrapper with Bearer auth
│       └── pages/
│           ├── Login.jsx         # API key entry
│           ├── Dashboard.jsx     # Papers table + CRUD
│           └── PaperForm.jsx     # Create/edit + live markdown preview
└── frontend/
    ├── index.html
    ├── vite.config.js            # Dev proxy: /api -> localhost:8787
    ├── package.json
    ├── eslint.config.js
    ├── public/
    │   ├── favicon.png
    │   └── icons.svg
    └── src/
        ├── main.jsx              # BrowserRouter wrapper
        ├── App.jsx               # Routes: /, /papers, /research, /docs + detail pages
        ├── AppLayout.css
        ├── index.css             # Design tokens (colors, spacing, typography)
        ├── components/
        │   ├── Header.jsx        # Nav with Home, Papers, Research, Docs, Models, About
        │   ├── Header.css
        │   ├── Button.jsx
        │   ├── Button.css
        │   ├── Card.jsx
        │   ├── Card.css
        │   ├── Badge.jsx
        │   ├── Badge.css
        │   ├── Footer.jsx
        │   └── Footer.css
        └── pages/
            ├── CategoryList.jsx   # Reusable list page (papers/research/docs)
            ├── CategoryDetail.jsx # Markdown detail page with back navigation
            └── Papers.css
```

---

## 1. Frontend Setup

### Technology Stack
- **Framework:** React 19 + Vite 8
- **Routing:** react-router-dom v7
- **Markdown Rendering:** react-markdown + remark-gfm
- **Styling:** Plain CSS with custom design tokens

### Navigation (Header.jsx)
- **Home** — `/`
- **Papers** — `/papers`
- **Research** — `/research`
- **Docs** — `/docs`
- **Models** — placeholder (no page yet)
- **About** — placeholder (no page yet)

Active link detection is based on `location.pathname` prefix matching.

### Routes (App.jsx)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page with hero, model families, philosophy, CTA |
| `/papers` | `CategoryList category="papers"` | Lists papers with category = "papers" |
| `/research` | `CategoryList category="research"` | Lists papers with category = "research" |
| `/docs` | `CategoryList category="docs"` | Lists papers with category = "docs" |
| `/papers/:slug` | `CategoryDetail` | Single paper detail (markdown rendered) |
| `/research/:slug` | `CategoryDetail` | Single research paper detail |
| `/docs/:slug` | `CategoryDetail` | Single docs article detail |

### Hero Buttons (HomePage)
- **"Explore Models"** — navigates to `/papers`
- **"Read the Docs"** — navigates to `/docs`

### Category List (CategoryList.jsx)
- Fetches `GET /api/helios/papers?category={category}` via `VITE_API_URL` env var (defaults to production URL)
- Displays paper cards with title, description, and date
- Each card links to `/{category}/{slug}`

### Category Detail (CategoryDetail.jsx)
- Fetches `GET /api/helios/papers/{slug}` via `VITE_API_URL` env var
- Renders markdown content using `react-markdown` + `remark-gfm`
- Shows category badge, title, description, date
- "Back to {Category}" link dynamically navigates to the correct category page
- Custom components for: headings, paragraphs, lists, blockquotes, code blocks, tables

### Design Tokens (index.css)
- Colors: brand blue, neutral scale, surface colors, semantic colors
- Spacing: 4px–96px scale (--space-1 through --space-24)
- Typography: Söhne font, Inter fallback, h1/h2/h3/p/body-small/caption classes
- Shadows: flat, raised, elevated, modal, focus

---

## 2. Backend Setup

### Technology Stack
- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Database:** Cloudflare D1 (SQLite)
- **Language:** TypeScript
- **CLI:** Wrangler v4

### Project Initialization
```bash
cd backend
npm init -y
npm install hono
npm install -D wrangler typescript @cloudflare/workers-types
```

### Wrangler Config (wrangler.jsonc)
- Worker name: `helios-api`
- Compatibility date: `2026-07-13`
- D1 binding: `DB` → `helios-db`
- `ADMIN_API_KEY` is NOT in `vars` — must be set via `.dev.vars` (local) or `wrangler secret put ADMIN_API_KEY` (production)

### Auth (auth.ts)
- Middleware that checks `Authorization: Bearer <token>` header
- Token validated against `env.ADMIN_API_KEY`
- Used for all admin CRUD operations and the `GET /api/helios/verify` login check

### D1 Database (helios-db)
- **Database ID:** `85451268-a925-495b-b122-29d10ab1d26e`
- **Location:** APAC region

#### Migration 0001 — Create papers table
```sql
CREATE TABLE IF NOT EXISTS papers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_papers_slug ON papers(slug);
```

#### Migration 0002 — Add category column
```sql
ALTER TABLE papers ADD COLUMN category TEXT NOT NULL DEFAULT 'papers';
```

### API Routes (index.ts)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/helios/verify` | Bearer token | Verify admin key. Returns `{ ok: true }` (200) or `401` |
| `GET` | `/api/helios/papers` | No | List all papers. Optional `?category=` filter |
| `GET` | `/api/helios/papers/:slug` | No | Get single paper by slug |
| `POST` | `/api/helios/papers` | Bearer token | Create paper (requires: title, description, slug, content, category) |
| `PUT` | `/api/helios/papers/:slug` | Bearer token | Update paper fields |
| `DELETE` | `/api/helios/papers/:slug` | Bearer token | Delete paper |

#### Validation
- Slug must be lowercase alphanumeric with hyphens only
- Category must be one of: `research`, `docs`, `papers`
- Duplicate slugs return 409 Conflict
- Missing fields return 400 Bad Request

### Database Helpers (db.ts)
- `getAllPapers(db)` — Returns all papers ordered by created_at DESC
- `getPapersByCategory(db, category)` — Filtered by category
- `getPaperBySlug(db, slug)` — Single paper lookup
- `createPaper(db, input)` — Insert with all fields including category
- `updatePaper(db, slug, input)` — Partial update with dynamic SET clause
- `deletePaper(db, slug)` — Delete by slug
- `isValidCategory(cat)` — Runtime validation helper

### Seeded Data

5 demo records across 3 categories:

| Category | Title | Slug |
|----------|-------|------|
| papers | Helios Aurora v1 | helios-aurora-v1 |
| research | Fine-Tuning LLMs on Consumer Hardware | fine-tuning-on-consumer-hardware |
| research | Comparing PEFT Methods for Instruction Tuning | comparing-peft-methods |
| docs | Getting Started with Helios | getting-started-with-helios |
| docs | API Reference | api-reference |

### Deployment Commands
```bash
# Create database
npx wrangler d1 create helios-db

# Apply migrations
npx wrangler d1 migrations apply helios-db --local
npx wrangler d1 migrations apply helios-db --remote

# Run queries
npx wrangler d1 execute helios-db --local --command "SELECT * FROM papers"
npx wrangler d1 execute helios-db --remote --file ./seed.sql

# Set production secret (after Worker is deployed)
npx wrangler secret put ADMIN_API_KEY

# Deploy worker
npm run deploy

# Deploy frontend to Pages
cd frontend && npm run build && npx wrangler pages deploy dist --project-name helios

# Deploy studio to Pages
cd studio && npm run build && npx wrangler pages deploy dist --project-name helios-studio
```

### Production URLs
- **Backend API:** `https://api.helios.shishirkhatri.com.np` (Workers + custom domain)
- **Frontend:** `https://helios.shishirkhatri.com.np` (Cloudflare Pages)
- **Studio:** `https://7723e449.helios-studio-1wi.pages.dev` (Cloudflare Pages, preview URL)

---

## 3. Development Workflow

### Running Locally

```bash
# Terminal 1 — Backend (port 8787)
cd backend && npm run dev

# Terminal 2 — Main Frontend (port 5173)
cd frontend && npm run dev

# Terminal 3 — Studio Admin (port 5174)
cd studio && npm run dev
```

Both Vite dev servers proxy `/api` requests to `http://localhost:8787`.

### Building

```bash
# Frontend
cd frontend && npm run build  # Output: frontend/dist/

# Backend (typecheck)
cd backend && npx tsc --noEmit
```

### Admin API Key

- **Local:** Stored in `backend/.dev.vars` (gitignored): `ADMIN_API_KEY=helios-admin-dev-key`
- **Production:** Set via `wrangler secret put ADMIN_API_KEY`

---

## 4. Changes Made

### Phase 1 — Project Restructure
- Created `frontend/` and `backend/` directories
- Moved all frontend code (src/, public/, etc.) into `frontend/`
- Installed fresh node_modules in `frontend/`
- Root retained: `.git/`, `.gitignore`, `README.md`

### Phase 2 — Remove Development Popup
- Removed `showPopup` state and popup JSX from App.jsx
- Removed `onOpenPopup` prop from Header
- Removed popup CSS (`.popup-overlay`, `.popup-content`, keyframes) from Header.css

### Phase 3 — Backend + D1 Database
- Created Cloudflare Worker with Hono framework
- Created `helios-db` D1 database
- Migration 0001: Create `papers` table
- Implemented CRUD API for papers
- Added admin authentication via Bearer token + env variable

### Phase 4 — Frontend Routing + Markdown
- Installed react-router-dom, react-markdown, remark-gfm
- Created `PapersList` and `PaperDetail` pages
- Added BrowserRouter to main.jsx
- Configured Vite proxy for `/api` -> localhost:8787
- Updated Header with active link detection
- Refactored Header logo to use `<Link>`

### Phase 5 — Categories System
- Migration 0002: Added `category` column to `papers` table
- Valid values: `research`, `docs`, `papers`
- Refactored `PapersList` -> `CategoryList` (reusable, takes `category` prop)
- Refactored `PaperDetail` -> `CategoryDetail` (reads category from URL path)
- Category badge displayed on detail pages
- "Back to" link dynamically navigates to correct category list
- Header nav links for Research and Docs are now live `<Link>` components
- Added routes: `/research`, `/docs`, `/research/:slug`, `/docs/:slug`
- Seed data added for all three categories

### Phase 6 — Security Audit & Hardening
- Removed `ADMIN_API_KEY` from `wrangler.jsonc` `vars` (was set to `""`, allowing auth bypass with empty Bearer token)
- Fixed Studio `Login.jsx` to store token only after successful API verification (was storing before check)
- Added **CSP (Content Security Policy)** meta tags to both `frontend/index.html` and `studio/index.html`
  - `connect-src` includes `'self'`, Google Fonts, and `https://api.helios.shishirkhatri.com.np`
- Added security headers middleware to backend: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`

### Phase 7 — Production Deployment
- Backend Worker deployed at `api.helios.shishirkhatri.com.np` with custom domain route
- D1 migrations applied to remote database, seeded with 5 demo records
- Admin secret set via `wrangler secret put ADMIN_API_KEY`
- Frontend deployed to Cloudflare Pages (`helios` project) with preview URL
- Frontend API URL changed from relative `/api` to `VITE_API_URL` env var with production default
- CSP `connect-src` initially blocked API fetches (missing `api.helios.shishirkhatri.com.np`) — fixed
- Backend custom domain: `api.helios.shishirkhatri.com.np`
- Frontend custom domain: `helios.shishirkhatri.com.np`
- Studio deployed to Cloudflare Pages (`helios-studio` project) at preview URL
- Studio `api.js` default URL updated to production (`https://api.helios.shishirkhatri.com.np/api`)

### Phase 8 — Empty State & Polish
- Added friendly empty-state message to `CategoryList.jsx` when no papers/research/docs exist
  - Adapts per category (papers / research / docs)
  - Message: "Something might be going on behind the scenes — please wait a few weeks or months..."
- Frontend rebuilt and redeployed to Pages

### Phase 9 — Studio Auth Bypass Fix
- **Bug:** Studio `Login.jsx` verified the API key against the public `GET /api/helios/papers` endpoint, which never returns 401. Any key (or a bot hitting a random API then Sign in) gained access to the studio UI, though actual uploads failed with 401.
- Added protected `GET /api/helios/verify` endpoint (guarded by `adminAuth`) — returns `200` only for the correct key, `401` otherwise
- Added `verifyKey(token)` helper to `studio/src/api.js` (uses `VITE_API_URL` base, works in dev + prod)
- `Login.jsx` now grants access only when `verifyKey` succeeds; invalid keys are rejected with: "Back off — you are not part of Kartabya."
- Backend Worker + Studio redeployed

### Phase 10 — Homepage Models Section
- Replaced the two model-family cards (Aurora / Helios Gen I and ??? / Helios Gen II) in the HomePage "Model Families" section with a single "Coming Soon" placeholder card
- Section copy changed to generic "Models coming soon" (no model families / traditional ML wording)
- Frontend rebuilt and redeployed to Pages

---

## 5. Common Admin Tasks

### Add a new paper
```bash
curl -X POST http://localhost:8787/api/helios/papers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer helios-admin-dev-key" \
  -d '{
    "title": "Your Title",
    "description": "Short description",
    "slug": "your-slug",
    "content": "# Markdown content here",
    "category": "research"
  }'
```

### Update a paper
```bash
curl -X PUT http://localhost:8787/api/helios/papers/your-slug \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer helios-admin-dev-key" \
  -d '{"title": "Updated Title"}'
```

### Delete a paper
```bash
curl -X DELETE http://localhost:8787/api/helios/papers/your-slug \
  -H "Authorization: Bearer helios-admin-dev-key"
```

### Interact directly with D1
```bash
npx wrangler d1 execute helios-db --remote --command "SELECT * FROM papers"
npx wrangler d1 execute helios-db --local --file ./seed.sql
```

### Studio (Admin CMS)
```bash
# Terminal 3 — Studio (port 5174)
cd studio && npm run dev
```

- Vite proxy forwards `/api` to `http://localhost:8787`
- Login with the local admin key: `helios-admin-dev-key`
- API defaults to `https://api.helios.shishirkhatri.com.np/api`, overridable via `VITE_API_URL`
- **Production URL:** `https://7723e449.helios-studio-1wi.pages.dev`

## 6. Studio (Admin CMS)

### Technology Stack
- **Framework:** React 19 + Vite 8
- **Routing:** react-router-dom v7
- **Markdown Rendering:** react-markdown + remark-gfm
- **Styling:** Plain CSS, dark theme, self-contained in `studio/src/App.css`

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `Login` | API key entry, stored in sessionStorage |
| `/` | `Dashboard` | Table of all papers with create/edit/delete |
| `/papers/new` | `PaperForm` | Create paper with live markdown preview |
| `/papers/:slug/edit` | `PaperForm` | Edit existing paper |

### Features
- **Auth:** Bearer token stored in `sessionStorage`, verified on login against the protected `GET /api/helios/verify` endpoint (`verifyKey` in `api.js`); invalid keys are rejected and never granted access
- **Dashboard:** Sortable table, delete confirmation dialog
- **PaperForm:** Auto-slug from title (lockable), category selector, split-pane markdown editor with live preview
- **API Client:** `api.js` wraps all endpoints, attaches Bearer header, handles 401 redirect
- **API URL:** `import.meta.env.VITE_API_URL ?? 'https://api.helios.shishirkhatri.com.np/api'`
- **Deployment:** Cloudflare Pages; set `VITE_API_URL` env var in Dashboard if overriding
