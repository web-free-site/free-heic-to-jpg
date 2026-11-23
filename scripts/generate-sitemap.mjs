import fs from 'node:fs'
import path from 'node:path'

const HOST = 'https://free-heic-to-jpg.web-free.site'
const paths = [
  '/',
  '/heic-to-png',
  '/how-to-convert-heic-to-jpg-in-the-browser',
  '/convert-heic-to-jpg-on-windows-11',
  '/bulk-convert-heic-to-jpg',
  '/privacy',
  '/terms',
  '/about',
  '/contact',
]

const urls = paths
  .map(
    (p) => `  <url>
    <loc>${HOST}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

fs.writeFileSync(path.join('dist', 'sitemap.xml'), xml)
console.log('Wrote sitemap.xml')