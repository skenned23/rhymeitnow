// Small word list made by scripts/split-words.js at build time (not the 18 MB words-content.json).
const WORDS = require('../data/generated/word-index.json')

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://rhymeitnow.com'
const staticPages = ['', '/about', '/contact', '/rap-builder', '/freestyle', '/poetry-builder']

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${WORDS.map(word => `  <url>
    <loc>${baseUrl}/rhymes-for/${word}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  // Let Vercel's CDN serve the sitemap for a day instead of rebuilding it on every crawler hit.
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
  res.write(xml)
  res.end()

  return { props: {} }
}
