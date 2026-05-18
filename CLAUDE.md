# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build locally
```

No test runner or linter is configured. There is no `npm test` command.

To add new word content for SEO pages: open `/generator` in the browser while dev server is running. It calls `/api/generate-word` (Claude Sonnet) and returns JSON to merge into `data/words-content.json`.

## Architecture

**Stack:** Next.js 14 (pages router), React 18, Anthropic Claude API. All styling is inline — no Tailwind, no CSS-in-JS library. Georgia serif throughout.

**Routing model:** Pages router only (`pages/`). There is no `app/` directory.

**AI model split:**
- `claude-haiku-4-5` — all real-time user-facing endpoints (`/api/rhymes`, `/api/poetry`, `/api/rap`, `/api/find-a-word`) for low latency
- `claude-sonnet-4-6` — `/api/generate-word` (batch SEO content generation, higher quality, not latency-sensitive)

**Static SEO pages vs. dynamic search:**
`pages/rhymes-for/[word].js` generates static pages from `data/words-content.json` at build time (`getStaticPaths` + `getStaticProps`, fallback: blocking). These are the SEO-targeted pages. The homepage (`pages/index.js`) runs live Claude queries per search. The two paths are intentionally separate — static pages have pre-generated FAQs, famous uses, related words; the live search just returns rhyme lists.

**words-content.json schema** (each key is a word):
```json
{
  "intro": "...",
  "perfect": ["..."],
  "near": ["..."],
  "slant": ["..."],
  "famous_uses": [{ "context": "...", "note": "..." }],
  "faq": [{ "q": "...", "a": "..." }],
  "pro_tip": "...",
  "related": ["..."],
  "seo_benefit": "..."
}
```

**API response convention:** All `/api/*` routes must return raw JSON — no markdown, no code fences. Claude prompts explicitly enforce this. Parsers on the client do not strip backticks.

**State management:** React hooks only (`useState`, `useRef`, `useEffect`). Rap and poetry builders maintain session history in local state to pass `previousBars`/`previousLines` back to the API for contextual continuation.

**SEO configuration:** `next.config.js` sets a `noindex` response header for any request that has a `?word=` or `?ref=` query param — this prevents the live search results from being indexed. Static `/rhymes-for/[word]` pages are indexed normally.

**Analytics:** Google Analytics (`G-G9J2CD6H48`) loaded in `pages/_app.js`. Vercel Analytics and Speed Insights also active at app level.

**Environment:** Only one required env var: `ANTHROPIC_API_KEY` (see `.env.local.example`). Vercel hosts the production deployment; pushes to `main` on GitHub trigger automatic redeploys.

## Blog

Posts live as Markdown files in `data/posts/*.md` with gray-matter frontmatter (`title`, `date`). `pages/blog/index.js` statically generates the listing; `pages/blog/[slug].js` renders individual posts using `react-markdown`.

## Content Strategy Notes

Zero-production vulnerability outperforms polished demos on TikTok/Shorts. A 5-second TikTok of a woman alone on her birthday got 2.4M views and 68K comments — no music, no filters, no editing. The hook was a direct ask that made every viewer feel personally invited to respond. For RhymeItNow: consider raw "I built this alone at 72, can you try it?" style content alongside polished demos.

## Color palette

| Role | Value |
|---|---|
| Background | `#0e0c08` |
| Text | `#f0e4c8` |
| Gold accent | `#c8a86a` |
| Perfect rhymes | `#c8a86a` |
| Near rhymes | `#7aafc8` |
| Slant rhymes | `#8dba8a` |
