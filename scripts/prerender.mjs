import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";

const root = process.cwd();
const dist = path.join(root, "dist");
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

const { App } = await vite.ssrLoadModule("/src/main.jsx");
const { routes, packageInfo } = await vite.ssrLoadModule("/src/content.js");

const built = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const script =
  built.match(
    /<script type="module" crossorigin src="([^"]+)"><\/script>/
  )?.[1] || "/assets/index.js";

const stylesheet = built.match(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/
)?.[1];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function routeHead(route) {
  const canonical = `${packageInfo.domain}${route.path}`;
  const isSearch = route.path === "/search/";
  const robots = isSearch
    ? "noindex,follow"
    : "index,follow,max-image-preview:large";

  return `
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${
      route.path === "/" ? "website" : "article"
    }" />
    <meta property="og:site_name" content="ytsearch.js Documentation" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(
      route.description
    )}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(
      route.description
    )}" />`;
}

function renderHtml(route, markup) {
  const themeScript = `(function(){try{var t=localStorage.getItem('ytsearch-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})();`;

  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta name="theme-color" content="#ffffff"/><meta name="generator" content="ytsearch.js docs / React SSR"/><link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="shortcut icon" href="/favicon.ico" /><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="manifest" href="/site.webmanifest"/><title>${escapeHtml(
    route.title
  )}</title>${routeHead(route)}${
    stylesheet
      ? `<link rel="stylesheet" crossorigin href="${stylesheet}"/>`
      : ""
  }</head><body><div id="root" data-ssr="true">${markup}</div><script>${themeScript}</script><script type="module" crossorigin src="${script}"></script></body></html>`;
}

for (const route of routes) {
  const markup = renderToString(
    React.createElement(App, { ssrPath: route.path })
  );

  const rel =
    route.path === "/"
      ? "index.html"
      : path.join(
          route.path.replace(/^\//, "").replace(/\/$/, ""),
          "index.html"
        );

  const target = path.join(dist, rel);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, renderHtml(route, markup));
}

const notFoundRoute = routes.find((route) => route.path === "/404/") || {
  path: "/404/",
  title: "Page Not Found — ytsearch.js",
  description: "The requested ytsearch.js documentation page was not found.",
};

const notFoundMarkup = renderToString(
  React.createElement(App, { ssrPath: "/404/" })
);

fs.writeFileSync(
  path.join(dist, "404.html"),
  renderHtml(notFoundRoute, notFoundMarkup)
);

// -----------------------------------------------------------------------------
// Sitemap
// -----------------------------------------------------------------------------

const sitemapLastMod = new Date().toISOString();

const urls = routes
  .filter((route) => route.path !== "/search/" && route.path !== "/404/")
  .map((route) => {
    const priority =
      route.path === "/"
        ? "1.0"
        : route.path.startsWith("/docs/")
        ? "0.9"
        : route.path.startsWith("/api/")
        ? "0.8"
        : route.path.startsWith("/guides/")
        ? "0.8"
        : route.path.startsWith("/examples/")
        ? "0.7"
        : route.path.startsWith("/changelog/")
        ? "0.6"
        : "0.5";

    const changefreq =
      route.path === "/"
        ? "weekly"
        : route.path.startsWith("/changelog/")
        ? "monthly"
        : "monthly";

    return `  <url>
    <loc>${packageInfo.domain}${route.path}</loc>
    <lastmod>${sitemapLastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n");

fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /search/
Sitemap: ${packageInfo.domain}/sitemap.xml
`
);

await vite.close();

console.log(
  `Prerendered ${routes.length} routes and generated sitemap.xml + 404.html.`
);
