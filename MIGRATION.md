# HAFS: Next.js App Router migration

The application now runs as a **Next.js 16 / React 19** project.
Its original look, wizard workflow, import/export, browser storage, and Rubika webhook are retained.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. To verify production readiness, run `npm test` and `npm run build`.

## Architecture

- `app/layout.tsx`: RTL Persian document, metadata and global CSS
- `app/page.tsx`: Next.js server-rendered HAFS workspace
- `app/globals.css`: original styles without visual redesign
- `lib/hafs-workspace.ts`: trusted existing interface markup, rendered by React on the server
- `public/hafs/runtime.js`: original vanilla JavaScript behaviors, loaded client-side after hydration
- `app/api/rubika/route.ts`: Next.js GET / POST webhook at `/api/rubika`
- `lib/rubika.js`: preserved Rubika implementation
- `public/assets/`: original static media
- `legacy/index.static.html`: exact previous single-file version for reference / rollback

**Important:** This is a working-framework migration with a compatibility layer, **not**
a full rewrite of the ~65KB DOM-based workflow to idiomatic React components.
Migrating individual sections to typed React components can be a follow-on refactor,
without changing the visual design or corrupting existing LocalStorage records.

## Data compatibility

The original LocalStorage keys and JSON import/export functions are kept unchanged.
Existing records remain stored in the same browser origin; if the site moves domains
or subdomains, export JSON at the old address and import at the new address first.

## Rubika

Configure `RUBIKA_BOT_TOKEN` in your Vercel project environment variables.
Existing webhook URL: `https://YOUR_DOMAIN/api/rubika`.
No credentials are stored in the repository. Never use static-only deployment mode
for the Rubika webhook; it requires a serverless / Node.js runtime.

## Vercel

Vercel should detect this repository as Next.js and run `next build`.
Clear any old manually pinned **Other / Static** framework preset or output-directory
override in Vercel Project Settings if the Next.js auto-detection is blocked.
Pushing to an already connected GitHub repository starts the usual automatic
deployment; there is no need to trigger an extra manual deployment.

## GitHub Pages

The former GitHub Pages static-only workflow has been replaced with Next.js
CI validation. Standard GitHub Pages cannot host the Rubika Node.js API route.
