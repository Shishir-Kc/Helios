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
    ├── index.html                # Title "Helios", favicon, preloaded Minecraft fonts
    ├── vite.config.ts            # React + Tailwind plugins, dev proxy /api -> localhost:8787
    ├── tsconfig.json
    ├── package.json              # name "helios"; scripts: dev/build/preview/clean/lint (tsc --noEmit)
    ├── metadata.json             # AI Studio artifact (name "Helios")
    ├── .env.example
    ├── README.md
    ├── public/
    │   ├── favicon.png
    │   ├── bglicon.png           # Helios logo raster asset (1024x1024)
    │   ├── fonts/                # Self-hosted Minecraft webfonts
    │   │   ├── Minecraft-Regular.woff
    │   │   ├── Minecraft-Italic.woff
    │   │   ├── Minecraft-Bold.woff
    │   │   └── Minecraft-BoldItalic.woff
    │   ├── animation/
    │   │   └── loading.lottie    # DotLottie loading animation
    │   └── dotlottie-player.wasm # Self-hosted Lottie wasm (setWasmUrl)
    └── src/
        ├── main.tsx              # React root, renders <App/>
        ├── App.tsx               # State-based SPA nav (no router); header/footer; paper-detail state
        ├── api.ts                # fetchPapers / fetchPaper / formatDate
        ├── data.ts               # MANIFESTO_TEXT (remaining shared content)
        ├── index.css             # Tailwind import + @font-face (Minecraft) + theme tokens
        ├── vite-env.d.ts         # VITE_API_URL typing
        └── components/
            ├── AboutView.tsx     # About page (mission + 3 pillars)
            ├── DocsView.tsx      # Fetches docs category, list -> detail
            ├── Manifesto.tsx     # Manifesto page (signable offline ledger)
            ├── Markdown.tsx      # react-markdown + remark-gfm, Tailwind-styled
            ├── ModelExplorer.tsx # "Models Under Development" card
            ├── NavigationDrawer.tsx # Unused AI Studio artifact (dead code, not imported)
            ├── PaperDetail.tsx   # Markdown detail view (back nav)
            ├── PapersView.tsx    # Fetches papers category, list -> detail
            ├── ResearchView.tsx  # Fetches research category, list -> detail
            └── Loading.tsx       # DotLottie loading animation component
```

---

## 1. Frontend Setup

> **Note:** The frontend was migrated from the original plain-CSS / react-router design (in `newfrontend`) into the current Tailwind + TypeScript single-page app. The descriptions below reflect the **current** implementation.

### Technology Stack
- **Framework:** React 19 + Vite 6 (TypeScript)
- **Navigation:** State-based SPA (no `react-router`); `App.tsx` holds `currentPage` + `paperDetail` state
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`), custom `@theme` tokens
- **Animation:** `motion` (motion/react)
- **Icons:** `lucide-react`
- **Markdown Rendering:** `react-markdown` + `remark-gfm`
- **Loading Animation:** `@lottiefiles/dotlottie-react` (DotLottie)
- **Fonts:** Minecraft (self-hosted `.woff`, preloaded)

### Navigation (App.tsx)
State-driven pages (no URL routing): `home`, `models`, `research`, `papers`, `docs`, `about`, `manifesto`. The header is a sticky `HELIOS` wordmark that **collapses to "HI" on scroll** — the middle letters (E, L, O, S) fade and collapse width while H and I remain (Anthropic-style). The footer shows an **inline SVG Helios logo** (rendered at `h-14 w-14`, ~56px) placed inline **before** the `HELIOS` text on the same flex row, followed by the "The Sun Is Rising" tagline; nav links are Research / Docs / Papers / Company (About). There is no Twitter/X link.

### Views
| View | Component | Description |
|------|-----------|-------------|
| Home | (in `App.tsx`) | Hero + "decentralizing AI" manifesto banner |
| Models | `ModelExplorer` | "Models Under Development" card (no hardcoded models) |
| Research | `ResearchView` | Lists `research` papers (API), card → detail |
| Papers | `PapersView` | Lists `papers` papers (API), card → detail |
| Docs | `DocsView` | Lists `docs` papers (API), card → detail |
| About | `AboutView` | Mission copy + 3 pillars |
| Manifesto | `Manifesto` | Editorial content + offline signable ledger |
| Paper detail | `PaperDetail` | Single paper detail (markdown), in-app `paperDetail` state (not a URL) |

### Hero Buttons (Home)
- **"Explore Models"** — opens the Models page
- **"Read Our Manifesto"** — opens the Manifesto page

### Category List (PapersView / ResearchView / DocsView)
- Fetches `GET /api/helios/papers?category={category}` via `VITE_API_URL` env var (defaults to `https://api.helios.shishirkhatri.com.np/api`)
- Displays cards with title, description, and formatted date
- Clicking a card sets `paperDetail` (category + slug) and renders `PaperDetail`

### Category Detail (PaperDetail.tsx)
- Fetches `GET /api/helios/papers/{slug}` via `VITE_API_URL`
- Renders markdown content using `react-markdown` + `remark-gfm` via the `Markdown.tsx` component (Tailwind-styled headings, lists, blockquotes, code blocks, tables)
- Shows category badge, title, description, publish/update dates, and a "Back to {Category}" button

### Loading Animation (Loading.tsx)
- Uses `DotLottieReact` playing `public/animation/loading.lottie` (autoplay + loop)
- Wasm is self-hosted at `public/dotlottie-player.wasm` and wired via `setWasmUrl("/dotlottie-player.wasm")` (avoids CDN dependency)
- Shown in all four loading states: Papers, Research, Docs lists and the Paper detail

### Fonts (index.css)
- Minecraft is self-hosted under `public/fonts/` with `@font-face` + `font-display: block`
- Preloaded via `<link rel="preload" as="font">` in `index.html` (renders in Minecraft from first paint, no fallback flash)
- The root container uses `overflow-x-clip` (not `overflow-x-hidden`) so it clips horizontal overflow **without breaking** the sticky header

### Styling / Theme
- Tailwind v4 with `@theme` tokens: `--font-serif/--font-sans/--font-mono` all set to Minecraft; accent color `#F27D26`
- No separate CSS-module files — components use Tailwind utility classes directly

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

# Terminal 2 — Main Frontend (port 3000)
cd frontend && npm run dev   # runs `vite --port=3000 --host=0.0.0.0`

# Terminal 3 — Studio Admin (port 5174)
cd studio && npm run dev
```

Both Vite dev servers proxy `/api` requests to `http://localhost:8787`.

### Building & Linting

```bash
# Frontend
cd frontend && npm run build  # Output: frontend/dist/
cd frontend && npm run lint   # TypeScript typecheck (tsc --noEmit)

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

### Phase 11 — Frontend Redesign & Migration (newfrontend → frontend)
- **Migrated functionality** from the original `frontend/` (plain CSS + react-router) into the new Tailwind + TypeScript design that lived in `newfrontend/`, then removed the old `frontend/` and renamed `newfrontend/` → `frontend/`
- **Stack change:** React 19 + Vite 6 + TypeScript + Tailwind CSS v4 + `motion` + `lucide-react`; state-based SPA navigation (no `react-router`)
- **API client (`src/api.ts`):** `fetchPapers(category)` and `fetchPaper(slug)` hitting `GET /api/helios/papers?category=` and `GET /api/helios/papers/:slug` via `VITE_API_URL`
- **Markdown (`src/components/Markdown.tsx` + `PaperDetail.tsx`):** `react-markdown` + `remark-gfm`, Tailwind-styled; detail is an in-app `paperDetail` state (not a URL route)
- **Category pages wired to API:** `PapersView`, `ResearchView`, `DocsView` now fetch their category and open `PaperDetail` on click (replacing fake `data.ts` content)
- **Models page:** `ModelExplorer` now shows a "Models Under Development" card; removed hardcoded `HELIOS_MODELS` from `data.ts`
- **Logo collapse:** `HELIOS` header wordmark collapses to `HI` on scroll (middle letters fade + collapse width)
- **Minecraft font:** self-hosted `.woff` files under `public/fonts/`, `@font-face` with `font-display: block`, preloaded in `index.html` (no fallback flash)
- **Sticky header fix:** root container uses `overflow-x-clip` instead of `overflow-x-hidden` so sticky nav works
- **Footer:** added "The Sun Is Rising" tagline under HELIOS; removed the Twitter/X link; enlarged
- **Loading animation (`src/components/Loading.tsx`):** DotLottie (`public/animation/loading.lottie`) with self-hosted `public/dotlottie-player.wasm` via `setWasmUrl`; replaces the old `Loader2` spinners in all four loading states
- **About copy:** "founded in late 2024" → "founded in early 2026"
- **Build/lint:** `npm run lint` runs `tsc --noEmit`; removed `eslint.config.js`

### Phase 12 — Footer Inline SVG Logo
- Replaced the footer `HELIOS` plain-text wordmark (and an earlier `bglicon.png` `<img>` attempt that rendered blurry) with an **inline `<svg>` of the Helios logo** in `frontend/src/App.tsx`.
- The SVG uses `viewBox="0 0 1080 1080"`, `fill="#111111"`, and is rendered at `h-14 w-14` (~56px), placed inline **before** the `HELIOS` text on the same flex row (`flex items-center gap-3`).
- Inline vector keeps the logo crisp at any size (no raster blur from downscaling a PNG).
- Added `frontend/public/bglicon.png` (1024×1024 Helios logo raster asset) to `public/` as a standalone asset.

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
