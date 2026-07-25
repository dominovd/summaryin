# SummaryIn.com

Programmatic utility-SEO site: a free client-side resume summary generator plus
copy-ready examples by profession. Built with [Astro](https://astro.build),
static output, zero runtime dependencies — deploys to Vercel as-is.

## Quick start

```bash
npm install
npm run dev      # local dev at localhost:4321
npm run build    # static build into dist/
```

## Publish to GitHub + Vercel

The repo already has a git history. To publish:

```bash
# 1. Create an empty repo on GitHub (no README), then:
git remote add origin git@github.com:YOUR_USER/summaryin.git
git push -u origin main

# 2. In Vercel: Add New Project → import the repo.
#    Framework preset "Astro" is detected automatically. No env vars needed.
```

Connect the `summaryin.com` domain in Vercel → Project → Settings → Domains.

## Where things live

| Path | What it is |
|---|---|
| `src/data/site.ts` | Site config: affiliate CTA URL, email form endpoint, nav hubs |
| `src/data/professions.json` | **All profession page content.** One entry = one page |
| `src/data/generatorTemplates.json` | Sentence banks for the generator (tone × level) |
| `src/pages/index.astro` | Homepage |
| `src/pages/resume-summary/[job].astro` | The 11-block profession template |
| `src/pages/resume-summary/index.astro` | Hub page |
| `src/styles/global.css` | Design tokens (single blue accent system) |

## Add a profession page

Add one entry to `src/data/professions.json` (copy an existing one as the
schema), rebuild — the page, hub tile, and homepage tile appear automatically.
Per the playbook, aim for 12–15 examples per page before calling it done
(the template ships with 6 per profession as a starting point).

Planned-but-not-built professions are listed in
`src/components/ProfessionGrid.astro` (`planned` array) and render as
"coming soon" tiles — no dead links. When you build one, remove it from
`planned`.

## Before going live (operator checklist)

- [ ] `src/data/site.ts` → `resumeBuilderUrl`: replace with your tracked
      CPA link (Zety / Resume.io / Kickresume). Links carry `rel="sponsored"`.
- [ ] `src/data/site.ts` → `emailFormAction`: point at Formspree / Buttondown /
      ConvertKit. Until set, the form is a safe no-op showing "Coming soon".
- [ ] Replace `.img-slot` placeholders with real images (CTA banner + the
      "anatomy of a summary" visual on profession pages).
- [ ] Google Search Console: verify the domain on day one (playbook rule).
- [ ] Expand each profession to 12–15 examples.

## Design rules baked in

- One primary blue for all main actions; green appears only as transient
  "Copied!" feedback. No competing accent colors.
- Year in `<title>` and footer is an auto token (`SITE.year`) — never hardcoded.
- No dead links: unbuilt hubs are hidden from nav, unbuilt professions render
  as non-link tiles.
- Honest CTA copy: no "100% free" claims about third-party builders.
- Pages stay far under the 300KB HTML budget (~40KB today).
