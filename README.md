# ytsearch.js Documentation

SEO-focused documentation site for **ytsearch.js**, built with React, Vite, Tailwind CSS and React SSR prerendering for GitHub Pages.

## Stack

- React + Vite
- Tailwind CSS
- React DOM `renderToString` prerendering
- Static route generation for GitHub Pages
- Zero icon-library dependency; the small required SVG icons are embedded locally
- Responsive light/dark documentation UI

## Routes

- `/` — product/documentation landing page
- `/docs/` — getting started and conceptual documentation
- `/api/` — API reference
- `/types/` — TypeScript types
- `/errors/` — errors and error codes
- `/guides/` — SEO-oriented developer guides
- `/examples/` — copy-paste examples
- `/changelog/` — release history
- `/search/?q=...` — client-side documentation search

The search route is intentionally `noindex` and excluded from the sitemap. Canonical documentation pages are indexable.

## SEO

Each prerendered route receives:

- unique `<title>`
- unique meta description
- canonical URL
- robots metadata
- Open Graph metadata
- Twitter metadata
- JSON-LD `WebPage` / `TechArticle`
- `BreadcrumbList`
- homepage `WebSite` + `SearchAction`
- homepage `SoftwareApplication`
- search-page `SearchResultsPage`

The search schema targets:

`https://ytsearch.rjryt.com/search/?q={search_term_string}`

This lets the documentation expose a stable search URL format to search engines and users. Search-engine support for structured search actions is controlled by the search engine itself.

## Build

```bash
npm install
npm run dev
```

Production build + SSR prerender:

```bash
npm run build
```

The prerender step generates:

- static `index.html` files for every documented route
- `404.html`
- `sitemap.xml`
- `robots.txt`

## GitHub Pages

The repository includes `.github/workflows/deploy.yml` for GitHub Pages deployment and `public/CNAME` for:

`ytsearch.rjryt.com`

Configure the repository's GitHub Pages source to **GitHub Actions**, then configure the DNS record for the custom domain.

## Project links

- Developer: https://rjryt.com/
- Support: https://rjryt.com/contact/
- GitHub: https://github.com/RJRYT/ytsearch.js
- npm: https://www.npmjs.com/package/ytsearch.js
