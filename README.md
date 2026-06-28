# FuelUp: AI Equality platform to make tokens from product ideas

> Turn idle AI budgets into someone else's breakthrough.

A mobile-first web app that connects **donors** (people/teams with unused AI budget)
with **idea owners** (developers who need AI compute), delivering funded API access
through a platform-managed key layer.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18+

### Install & run

```bash
npm install      # install dependencies (first time / after dependency changes)
npm run dev      # start the dev server → http://localhost:5173
```

Then open **http://localhost:5173** in the browser.

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot-module reload (port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally (port 4173) |

## Tech stack

React + Vite · TypeScript · Tailwind CSS · React Router. Backend (Supabase) and
payments are planned per the [PRD](PRD.md).

## Design

The shared design reference lives in [`design/`](design/). Open
[`design/fuelup-design-reference.html`](design/fuelup-design-reference.html).

## Deployment

Deployed on **Vercel**. Pushes to `main` deploy to production; every pull request
gets a preview URL. 

`main` is protected — all changes land via PR.
