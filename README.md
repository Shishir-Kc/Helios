# Helios

> Local Intelligence, Refined.

The landing page for **Helios** — a family of fine-tuned language models handcrafted and trained on personal/home-server hardware. Each Helios model family is a deliberate experiment in fine-tuning, personality, and performance, built from curiosity rather than a datacenter.

The first family, **Aurora** (Helios Gen I), is a warm conversational general-purpose assistant fine-tuned from Gemma 3.

This repository contains the marketing/landing site, built with **React 19 + Vite 8**.

## Status

🚧 **In development.** The site is a work in progress and will become fully functional after the owner's exams are wrapped up. Navigation and primary actions currently open a "Site in Development" popup.

## Tech Stack

- [React](https://react.dev) `19`
- [Vite](https://vite.dev) `8` (with `@vitejs/plugin-react` / Oxc)
- ESLint (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

No TypeScript yet — plain JSX with a minimal ESLint setup.

## Project Structure

```
Helios/
├── index.html                  # App shell / Vite entry HTML
├── vite.config.js              # Vite config (React plugin)
├── eslint.config.js            # ESLint flat config
├── package.json
├── public/
│   ├── favicon.png
│   └── icons.svg
└── src/
    ├── main.jsx                # React root bootstrap
    ├── App.jsx                 # Page composition (sections + dev popup)
    ├── index.css               # Global base styles / design tokens
    ├── AppLayout.css           # Page-level layout (sections, grids, popup)
    ├── App.css                 # App-level styles
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    └── components/
        ├── Header.jsx / .css   # Sticky nav with scroll state, animated "HELIOS" logo
        ├── Footer.jsx / .css   # Footer (currently disabled in App)
        ├── Button.jsx / .css   # Variant button (primary | secondary)
        ├── Card.jsx   / .css   # Variant card (feature | standard) for model families
        └── Badge.jsx  / .css   # Variant badge (neutral) for tags/specs
```

## Page Sections

`src/App.jsx` composes the landing page in this order:

1. **Header** — sticky navigation that gains a `scrolled` state past 30px. Animated logo that collapses "HELIOS" → "HI".
2. **Hero** — eyebrow, title, subtitle, description, and primary/secondary CTAs.
3. **Model Families** — cards introducing each Helios family:
   - **Aurora** (Gen I) — 8B params, 128k context, fine-tuned from Gemma 3.
   - **???** (Gen II) — upcoming, in research.
4. **Philosophy** — four feature pillars: Home Server Native, Fine-tuned Personality, Growing Family, Open Learning.
5. **CTA** — "The sun is rising" closing section.
6. **Site-in-development popup** — shown when any nav link / CTA is clicked.
7. **Footer** — implemented but currently commented out.

## Getting Started

```bash
# install deps
npm install

# start the dev server (Vite HMR)
npm run dev

# production build
npm run build

# preview the production build
npm run preview

# lint
npm run lint
npm run preview
```

## Components API

| Component | Props | Notes |
|-----------|-------|-------|
| `Header`  | `onOpenPopup: () => void` | Triggers the dev popup on nav clicks |
| `Button`  | `variant: 'primary' \| 'secondary'`, `className`, `...buttonProps` | |
| `Card`    | `variant: 'feature' \| 'standard'`, `className`, `...divProps` | Used for model family cards |
| `Badge`   | `variant: 'neutral'`, `className`, `...spanProps` | Inline tags (params, context, status) |
| `Footer`  | — | Currently disabled in `App.jsx` |

## Roadmap

- Functional docs / model detail pages
- Research notes for the Gen II family
- Footer re-enablement and final CTAs ("Get Early Access", "Follow the Journey")
- Optional TypeScript + type-aware lint migration

---

A solo fine-tuning project · Built with curiosity · © 2026 Helios
