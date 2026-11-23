import fs from 'node:fs'
import path from 'node:path'

const HOST = 'https://free-heic-to-jpg.web-free.site'
const dist = path.resolve('dist')
const baseHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const pages = [
  {
    path: '/',
    title: 'Free HEIC to JPG Converter — Batch HEIC/HEIF in Your Browser',
    description:
      'Convert iPhone HEIC and HEIF photos to JPG or PNG locally. Batch convert, quality slider, ZIP download. No upload, no sign-up.',
    h1: 'Free HEIC to JPG Converter',
    snippet:
      '<p>Turn Apple HEIC photos into universal JPG files entirely in your browser. Files never leave your device.</p>',
    faqJsonLd: true,
  },
  {
    path: '/heic-to-png',
    title: 'Free HEIC to PNG Converter — Lossless Browser Export',
    description: 'Convert HEIC and HEIF images to PNG with transparency-friendly output. Private batch conversion and ZIP download.',
    h1: 'Convert HEIC to PNG Online',
    snippet: '<p>Export iPhone HEIC shots as PNG for design tools and the web. 100% client-side.</p>',
  },
  {
    path: '/how-to-convert-heic-to-jpg-in-the-browser',
    title: 'How to Convert HEIC to JPG in the Browser',
    description: 'Step-by-step guide to convert HEIC files to JPG without uploading photos to a server.',
    h1: 'How to convert HEIC to JPG in the browser',
    snippet:
      '<p>Open this tool, drop your .heic files, choose JPG quality, and download single files or a ZIP. Everything runs on your device.</p>',
  },
  {
    path: '/convert-heic-to-jpg-on-windows-11',
    title: 'Convert HEIC to JPG on Windows 11 — Free Browser Tool',
    description: 'Windows 11 often cannot open iPhone HEIC photos. Use this free in-browser converter with no install.',
    h1: 'Convert HEIC to JPG on Windows 11',
    snippet:
      '<p>Copy HEIC files from your phone, open this page in Edge or Chrome, convert to JPG, and save to Pictures.</p>',
  },
  {
    path: '/bulk-convert-heic-to-jpg',
    title: 'Bulk Convert HEIC to JPG — ZIP Download',
    description: 'Convert dozens of HEIC photos at once and download one ZIP of JPG files. No cloud upload.',
    h1: 'Bulk convert HEIC to JPG',
    snippet: '<p>Select multiple .heic/.heif files, set output quality, run batch conversion, and download a ZIP archive.</p>',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Free HEIC to JPG Converter',
    description: 'How this HEIC converter handles your files: local-only processing, cookies, and analytics.',
    h1: 'Privacy policy',
    snippet: '<p>Your photos are decoded in your browser. We do not receive your image files.</p>',
  },
  {
    path: '/terms',
    title: 'Terms of Use — Free HEIC to JPG Converter',
    description: 'Terms for using the free browser-based HEIC to JPG converter.',
    h1: 'Terms of use',
    snippet: '<p>Free tool provided as-is. You must own rights to the images you convert.</p>',
  },
  {
    path: '/about',
    title: 'About — Free HEIC to JPG Converter',
    description: 'Built on the MIT Forma Image project and heic2any. Part of the web-free.site tool family.',
    h1: 'About this converter',
    snippet:
      '<p>Specialized HEIC/HEIF to JPG converter forked from Forma Image (MIT). Powered by heic2any in the browser.</p>',
  },
  {
    path: '/contact',
    title: 'Contact — Free HEIC to JPG Converter',
    description: 'Contact the web-free.site team about the HEIC converter.',
    h1: 'Contact',
    snippet: '<p>Questions or feedback about this converter? Reach us by email.</p>',
  },
]

function buildJsonLd(page) {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free HEIC to JPG Converter',
    url: HOST + page.path,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and WebAssembly-capable browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: page.description,
  }
  if (!page.faqJsonLd) return JSON.stringify(app)
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are my HEIC files uploaded to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Conversion uses heic2any and Canvas entirely in your browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I convert multiple HEIC files at once?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Add several files, convert the batch, and download a ZIP of JPG or PNG outputs.',
        },
      },
    ],
  }
  return JSON.stringify([app, faq])
}

function buildPage(page) {
  const url = HOST + (page.path === '/' ? '/' : page.path)
  let html = baseHtml
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${page.description}" />`,
  )
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${page.title}" />`)
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${page.description}" />`,
  )
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`)
  }
  const seoBlock = `<section id="seo-prerender" class="seo-prerender sr-only"><h1>${page.h1}</h1>${page.snippet}</section>`
  html = html.replace('<div id="root"></div>', `${seoBlock}\n    <div id="root"></div>`)
  const ld = `<script type="application/ld+json">${buildJsonLd(page)}</script>`
  if (html.includes('id="jsonld-main"')) {
    html = html.replace(/<script type="application\/ld\+json" id="jsonld-main">[\s\S]*?<\/script>/, ld)
  } else {
    html = html.replace('</head>', `    ${ld}\n  </head>`)
  }
  return html
}

for (const page of pages) {
  if (page.path === '/') {
    fs.writeFileSync(path.join(dist, 'index.html'), buildPage(page))
    continue
  }
  const dir = path.join(dist, page.path.replace(/^\//, ''))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), buildPage(page))
}

console.log('Prerendered', pages.length, 'route shells into dist/')