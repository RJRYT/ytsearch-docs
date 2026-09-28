import React, { useEffect, useMemo, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { packageInfo, routes, navGroups, code, types, errorCodes } from './content';
import changelogMarkdown from './changelog.md?raw';
import './styles.css';


function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': true };
  const paths = {
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    x: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    external: <><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>,
    github: <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.18-3.37-1.18-.46-1.17-1.11-1.48-1.11-1.48-.91-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 7.82c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>,
    npm: <path fill="currentColor" stroke="none" d="M2 6h20v12h-7v-2h5V8h-3v8h-2V8h-3v10H2V6Zm2 2v8h2v-6h3v6h2V8H4Z"/>
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const routeMap = new Map(routes.map(r => [r.path, r]));
const routeIndex = routes.filter(r => r.path !== '/search/' && r.path !== '/404/');

function normalizePath(pathname) {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}
function currentPath() { return typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'; }
function getRoute(path) { return routeMap.get(normalizePath(path)) || routes[0]; }
function navigate(path) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'instant' }); }

function JsonLd({ data }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />; }

function Seo({ route, children }) {
  const canonical = `${packageInfo.domain}${route.path}`;
  const parts = route.path.split('/').filter(Boolean);
  const breadcrumb = route.path === '/' 
  ? null 
  : parts.map((part, i, a) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      item: `${packageInfo.domain}/${a.slice(0, i + 1).join('/')}/`
    }));
  const searchAction = {
    '@type': 'SearchAction',
    target: `${packageInfo.domain}/search/?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  };
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      name: route.title,
      url: canonical,
      description: route.description,
      isPartOf: { '@id': `${packageInfo.domain}#website` }
    },
    {
      '@type': 'TechArticle',
      '@id': `${canonical}#article`,
      headline: route.title,
      description: route.description,
      url: canonical,
      author: { '@type': 'Person', name: 'RJRYT', url: packageInfo.authorUrl },
      isPartOf: { '@id': `${packageInfo.domain}#website` }
    },
    ...(breadcrumb ? [{ '@type': 'BreadcrumbList', itemListElement: breadcrumb }] : [])
  ];
  if (route.path === '/') {
    graph.unshift({
      '@type': 'WebSite',
      '@id': `${packageInfo.domain}#website`,
      name: 'ytsearch.js Documentation',
      url: packageInfo.domain,
      description: packageInfo.description,
      potentialAction: searchAction,
      publisher: { '@type': 'Person', name: 'RJRYT', url: packageInfo.authorUrl }
    });
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${packageInfo.domain}#software`,
      name: 'ytsearch.js',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Node.js',
      softwareVersion: packageInfo.version,
      url: packageInfo.domain,
      downloadUrl: packageInfo.npm,
      codeRepository: packageInfo.github,
      programmingLanguage: ['JavaScript', 'TypeScript'],
      description: packageInfo.description,
      license: 'https://opensource.org/licenses/MIT',
      sameAs: [packageInfo.github, packageInfo.npm]
    });
  }
  if (route.path === '/search/') {
    graph.push({ '@type': 'SearchResultsPage', name: route.title, url: canonical, potentialAction: searchAction });
  }
  useEffect(() => {
    document.title = route.title;
    const setMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement('meta'); if (property) el.setAttribute('property', name); else el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', route.description);
    setMeta('robots', route.path === '/search/' ? 'noindex,follow' : 'index,follow,max-image-preview:large');
    setMeta('og:title', route.title, true);
    setMeta('og:description', route.description, true);
    setMeta('og:url', canonical, true);
    setMeta('theme-color', document.documentElement.classList.contains('dark') ? '#09090b' : '#ffffff');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
  }, [route, canonical]);
  return <>{children}<JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} /></>;
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('ytsearch-theme');
    setDark(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  useEffect(() => {
    if(typeof document !== 'undefined'){ document.documentElement.classList.toggle('dark', dark); if(typeof localStorage !== 'undefined') localStorage.setItem('ytsearch-theme', dark ? 'dark' : 'light'); }
  }, [dark]);
  return [dark, setDark];
}

function Link({ href, children, className='', onClick }) {
  const internal = href.startsWith('/');
  return <a href={href} className={className} onClick={e => { if(internal && href.startsWith('/') && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey){e.preventDefault(); navigate(href);} onClick?.(e); }}>{children}</a>;
}

function Header({ onMenu }) {
  const [dark, setDark] = useTheme();
  return <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/95 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/95">
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-900" aria-label="Open documentation menu"><Icon name="menu" size={20}/></button>
      <Link href="/" className="shrink-0 font-mono text-base font-bold tracking-tight text-zinc-950 dark:text-white">ytsearch<span className="text-zinc-400">.js</span></Link>
      <div className="hidden h-6 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />
      <span className="hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">Documentation</span>
      <div className="ml-auto flex items-center gap-1">
        <Link href="/search/" className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 sm:flex dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"><Icon name="search" size={16}/> Search</Link>
        <a href={packageInfo.npm} target="_blank" rel="noreferrer" aria-label="npm package" className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"><Icon name="npm" size={19}/></a>
        <a href={packageInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"><Icon name="github" size={18}/></a>
        <button onClick={()=>setDark(v=>!v)} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900" aria-label="Toggle dark mode">{dark ? <Icon name="sun" size={18}/> : <Icon name="moon" size={18}/>}</button>
      </div>
    </div>
  </header>
}

function Sidebar({ mobileOpen, close }) {
  const path=currentPath();
  return (
    <aside
      className={`${
        mobileOpen ? "fixed inset-0 z-50 flex" : "hidden"
      } md:sticky md:top-16 md:flex md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0`}
    >
      {mobileOpen && (
        <button
          className="absolute inset-0 bg-black/40 md:hidden"
          onClick={close}
          aria-label="Close menu"
        />
      )}
      <div className="relative h-full w-72 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 md:w-full">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <span className="font-semibold">Documentation</span>
          <button
            onClick={close}
            className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
          <Icon name="search" size={16} className="text-zinc-400" />
          <Link
            href="/search/"
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Search docs
          </Link>
        </div>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {group.label}
            </div>
            <nav className="space-y-0.5">
              {group.items.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={`block rounded-lg px-2.5 py-1.5 text-sm ${
                    path === href
                      ? "bg-zinc-100 font-medium text-zinc-950 dark:bg-zinc-900 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CodeBlock({ children, language = 'ts', title }) {
  const [copied, setCopied] = useState(false);
  const value = String(children).trim();
  return <div className="code-block my-5 overflow-hidden rounded-xl border shadow-sm">
    <div className="code-block-header flex items-center justify-between border-b px-3 py-2 text-xs">
      <span>{title || language}</span>
      <button onClick={async () => { await navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); }} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Copy code">
        <Icon name="copy" size={13}/>{copied ? 'Copied' : 'Copy'}
      </button>
    </div>
    <pre className="code-scroll overflow-x-auto p-4 text-[13px] leading-6"><code>{value}</code></pre>
  </div>;
}

function Callout({ children, tone='info' }) { const cls= tone==='warn' ? 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100' : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300'; return <div className={`my-6 rounded-xl border p-4 text-sm leading-6 ${cls}`}>{children}</div> }
function Table({ headers, rows }) { return <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800"><table className="min-w-full text-left text-sm"><thead className="bg-zinc-50 dark:bg-zinc-900"><tr>{headers.map(h=><th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} className="px-4 py-3 align-top text-zinc-600 dark:text-zinc-300">{c}</td>)}</tr>)}</tbody></table></div> }
function PageTitle({ eyebrow, title, description }) { return <div className="mb-10"><div className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-zinc-400">{eyebrow}</div><h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">{title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p></div> }
function PrevNext() { const path=currentPath(); const i=routeIndex.findIndex(r=>r.path===path); const prev=routeIndex[i-1], next=routeIndex[i+1]; return <div className="mt-14 grid gap-3 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">{prev ? <Link href={prev.path} className="group rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"><span className="flex items-center gap-1 text-xs text-zinc-400"><Icon name="chevronLeft" size={14}/> Previous</span><span className="mt-1 block text-sm font-medium group-hover:underline">{prev.title.replace(' — ytsearch.js','')}</span></Link> : <span/>}{next ? <Link href={next.path} className="group rounded-xl border border-zinc-200 p-4 text-right dark:border-zinc-800"><span className="flex items-center justify-end gap-1 text-xs text-zinc-400">Next <Icon name="chevronRight" size={14}/></span><span className="mt-1 block text-sm font-medium group-hover:underline">{next.title.replace(' — ytsearch.js','')}</span></Link> : null}</div> }

function Home() { return <><section className="border-b border-zinc-200 dark:border-zinc-800"><div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="max-w-4xl"><div className="mb-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">v{packageInfo.version} · Node.js & TypeScript</div><h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">YouTube Search for Node.js & TypeScript</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">ytsearch.js is a TypeScript and Node.js library for searching YouTube videos, channels, playlists, movies and live streams, plus fetching video details and paginated playlist items.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/docs/quick-start/" className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">Get started</Link><Link href="/api/" className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">API reference</Link></div></div></div></section><section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-3"><Feature title="YouTube search" text="Search videos, channels, playlists, movies and live streams with one API."/><Feature title="Playlist pagination" text="Fetch playlist metadata and video items with a built-in nextPage flow."/><Feature title="Typed Node.js" text="Use the same package from TypeScript, ESM and CommonJS applications."/></div><div className="mt-10 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"><h2 className="text-lg font-semibold">Install ytsearch.js</h2><CodeBlock language="bash" title="Terminal">{code.install}</CodeBlock></div></section></> }
function Feature({title,text}) { return <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{text}</p></div> }

function Docs({ slug }) {
  const pages = {
    'docs/': <><PageTitle eyebrow="Getting Started" title="Documentation" description="Everything you need to install ytsearch.js, search YouTube, fetch playlist items, retrieve video metadata and work with the exported TypeScript types."/><h2 className="text-xl font-semibold">What is ytsearch.js?</h2><p>ytsearch.js is a Node.js and TypeScript library that normalizes public YouTube data into developer-friendly result objects. It supports video, channel, playlist, movie and live search, playlist pagination and detailed video metadata.</p><Callout>For API accuracy, this documentation follows the package's generated TypeScript declarations in v{packageInfo.version}. The declarations are treated as the source of truth where the README wording differs.</Callout><h2 className="text-xl font-semibold">Documentation path</h2><Table headers={['Section','Purpose']} rows={[[<Link href="/docs/installation/">Installation</Link>,'Install the package and understand supported module systems.'],[<Link href="/docs/search/">Search</Link>,'Search YouTube and paginate result pages.'],[<Link href="/docs/playlists/">Playlists</Link>,'Fetch playlist metadata and videos.'],[<Link href="/docs/videos/">Video details</Link>,'Fetch normalized video metadata by ID.'],[<Link href="/api/">API reference</Link>,'Function-level signatures and behavior.'],[<Link href="/types/">Types</Link>,'Exported TypeScript interfaces and unions.'],[<Link href="/errors/">Errors</Link>,'Error class and error codes.']]}/></>,
    'docs/installation/': <><PageTitle eyebrow="Getting Started" title="Installation" description="Install ytsearch.js from npm and use it with modern ES modules, CommonJS or TypeScript."/><CodeBlock language="bash" title="Terminal">{code.install}</CodeBlock><h2 className="text-xl font-semibold">Requirements</h2><p>The published package declares Node.js <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-900">&gt;=14.0.0</code>. The package exports both a CommonJS entry and an ES module entry and includes TypeScript declarations.</p><h2 className="text-xl font-semibold">Choose your module system</h2><div className="grid gap-4 sm:grid-cols-2"><Feature title="ES modules" text="Use named imports with import syntax in modern Node.js applications."/><Feature title="CommonJS" text="Use require() when your application uses the CommonJS module system."/></div></>,
    'docs/quick-start/': <><PageTitle eyebrow="Getting Started" title="Quick Start" description="Search YouTube in a few lines and inspect the normalized results returned by ytsearch.js."/><CodeBlock language="js" title="JavaScript / ESM">{code. search}</CodeBlock><h2 className="text-xl font-semibold">Inspect the result</h2><p>A search resolves to a <code className="font-mono">SearchResult</code>. It contains separate arrays for videos, channels, playlists, movies and live results, plus pagination metadata and a <code className="font-mono">nextPage()</code> method.</p><CodeBlock language="js">{`console.log(results.metadata);\nconsole.log(results.videos[0]);`}</CodeBlock><Callout>Start with <Link href="/docs/search/" className="underline">Search</Link> for option details, then use <Link href="/api/" className="underline">API Reference</Link> when you need exact signatures.</Callout></>,
    'docs/search/': <><PageTitle eyebrow="YouTube Search" title="Search YouTube" description="Use searchYouTube to search videos, channels, playlists, movies or live streams and receive normalized, paginated results."/><CodeBlock language="ts">{`searchYouTube(query: string, options?: SearchOptions): Promise<SearchResult>`}</CodeBlock><h2 className="text-xl font-semibold">Search options</h2><Table headers={['Option','Values','Default']} rows={[[<code>type</code>,'any, video, channel, playlist, movie, live','video'],[<code>sort</code>,'relevance, upload_date, view_count, rating','relevance'],[<code>limit</code>,'number, 10–50','20']]}/><h2 className="text-xl font-semibold">Search result groups</h2><p>The returned object exposes <code>videos</code>, <code>channels</code>, <code>playlists</code>, <code>movies</code> and <code>lives</code>. The exact populated collection depends on the selected search type.</p></>,
    'docs/search/videos/': <><PageTitle eyebrow="YouTube Search" title="Video Search" description="Search YouTube videos and consume normalized VideoResult objects."/><CodeBlock language="js">{`const result = await searchYouTube("React tutorial", {\n  type: "video",\n  limit: 20,\n});\n\nfor (const video of result.videos) {\n  console.log(video.id, video.title, video.duration);\n}`}</CodeBlock><h2 className="text-xl font-semibold">Video result fields</h2><Table headers={['Field','Description']} rows={[[<code>id</code>,'YouTube video identifier.'],[<code>title</code>,'Video title.'],[<code>thumbnail</code>,'Thumbnail URL and dimensions.'],[<code>author</code>,'Normalized channel/author information when available.'],[<code>viewCount</code>,'Numeric view count from the normalized search response.'],[<code>duration</code>,'Formatted duration.'],[<code>seconds</code>,'Duration converted to seconds.'],[<code>publishedAt</code>,'Published-time text extracted from YouTube.'],[<code>isLive</code>,'Whether the normalized result is marked as live.']]}/></>,
    'docs/search/channels/': <><PageTitle eyebrow="YouTube Search" title="Channel Search" description="Search YouTube channels and work with normalized ChannelResult objects."/><CodeBlock language="js">{`const result = await searchYouTube("OpenAI", {\n  type: "channel",\n  limit: 10,\n});\n\nconsole.log(result.channels);`}</CodeBlock><Table headers={['Field','Description']} rows={[[<code>id</code>,'Channel identifier.'],[<code>title</code>,'Channel title.'],[<code>description</code>,'Extracted channel description when available.'],[<code>subscriberCount</code>,'Subscriber-count text normalized by the package.'],[<code>verified</code>,'Whether the result carries a verified badge.'],[<code>isArtist</code>,'Whether the result carries the artist badge.'],[<code>thumbnail</code>,'Channel thumbnail information.']]}/></>,
    'docs/search/playlists/': <><PageTitle eyebrow="YouTube Search" title="Playlist Search" description="Search YouTube playlists with the same searchYouTube API and receive PlaylistResult objects."/><CodeBlock language="js">{`const result = await searchYouTube("JavaScript course", {\n  type: "playlist",\n  limit: 20,\n});\n\nconsole.log(result.playlists);`}</CodeBlock><p>Playlist search results expose the playlist identifier, title, thumbnail, URL, content type, video count and optional author information.</p></>,
    'docs/search/movies/': <><PageTitle eyebrow="YouTube Search" title="Movie Search" description="Use the unified search API to request YouTube movie results."/><CodeBlock language="js">{`const result = await searchYouTube("action movies", {\n  type: "movie",\n  limit: 10,\n});\n\nconsole.log(result.movies);`}</CodeBlock><p>Movie results use the <code>VideoResult</code> shape in the generated type declarations. See <Link href="/types/video/" className="underline">Video Types</Link> for its fields.</p></>,
    'docs/search/live/': <><PageTitle eyebrow="YouTube Search" title="Live Search" description="Use searchYouTube to request live-stream results."/><CodeBlock language="js">{`const result = await searchYouTube("news", {\n  type: "live",\n  limit: 20,\n});\n\nconsole.log(result.lives);`}</CodeBlock><p>Live results use the <code>VideoResult</code> shape in the generated declarations and can be inspected through the same normalized video fields.</p></>,
    'docs/search/pagination/': <><PageTitle eyebrow="YouTube Search" title="Search Pagination" description="Fetch additional search pages through the nextPage function returned by searchYouTube."/><CodeBlock language="js">{code.paginate}</CodeBlock><h2 className="text-xl font-semibold">End of pagination</h2><p>The <code>nextPage()</code> method resolves to another <code>SearchResult</code> or <code>null</code> when no continuation is available.</p></>,
    'docs/playlists/': <><PageTitle eyebrow="Data" title="Playlist Items" description="Fetch playlist metadata and normalized video items with getPlaylistItems."/><CodeBlock language="ts">{`getPlaylistItems(playListID: string, options?: PlaylistOptions): Promise<PlaylistDetailsResult>`}</CodeBlock><CodeBlock language="js">{code.playlist}</CodeBlock><p>The result contains a <code>playlist</code> object, an array of <code>videos</code>, pagination <code>metadata</code> and a <code>nextPage()</code> function.</p></>,
    'docs/playlists/pagination/': <><PageTitle eyebrow="Data" title="Playlist Pagination" description="Iterate through large YouTube playlists using the nextPage method returned by getPlaylistItems."/><CodeBlock language="js">{`let page = await getPlaylistItems("PLBCF2DAC6FFB574DE", { limit: 50 });\n\nwhile (page) {\n  for (const video of page.videos) console.log(video.title);\n  page = await page.nextPage();\n}`}</CodeBlock><Table headers={['Metadata','Meaning']} rows={[[<code>ytPage</code>,'Upstream YouTube page number tracked by the package.'],[<code>userPage</code>,'Page number exposed to your application.'],[<code>totalVideos</code>,'Total video count extracted for the playlist.'],[<code>resultRange</code>,'Range represented by the current user page.'],[<code>hasNextPage</code>,'Whether another page can be requested.'],[<code>expectedPages</code>,'Expected number of user pages.']]}/></>,
    'docs/videos/': <><PageTitle eyebrow="Data" title="Video Details" description="Fetch detailed normalized metadata for a YouTube video by ID with getVideoDetails."/><CodeBlock language="js">{code.details}</CodeBlock><p>The returned <code>VideoDetailsResult</code> contains title, description, duration, views, upload date, channel information, likes, privacy flags, category and rating information.</p></>,
    'docs/typescript/': <><PageTitle eyebrow="Runtime & Language" title="TypeScript" description="ytsearch.js ships TypeScript declarations for its public functions, result objects, options and errors."/><p>The generated declaration file exports interfaces and types directly from the package. This means editors can provide completion and compile-time checking without a separate @types package.</p><CodeBlock language="ts">{`import {\n  searchYouTube,\n  SearchOptions,\n  SearchResult,\n  YtSearchError,\n} from "ytsearch.js";`}</CodeBlock><p>Browse the complete <Link href="/types/" className="underline">type reference</Link> for every exported type in v{packageInfo.version}.</p></>,
    'docs/esm/': <><PageTitle eyebrow="Runtime & Language" title="ES Modules" description="Use the ESM export of ytsearch.js with import syntax."/><CodeBlock language="js">{code.esm}</CodeBlock><p>The package's <code>exports</code> map points ESM imports to <code>dist/main.mjs</code>.</p></>,
    'docs/commonjs/': <><PageTitle eyebrow="Runtime & Language" title="CommonJS" description="Use ytsearch.js from CommonJS applications with require()."/><CodeBlock language="js">{code.cjs}</CodeBlock><p>The package's <code>exports</code> map points CommonJS require calls to <code>dist/main.js</code>.</p></>
  };
  return pages[slug] || <NotFoundContent/>;
}

function ApiPage({kind}) {
  const data = {
    search: {title:'searchYouTube', desc:'Search YouTube for videos, channels, playlists, movies or live streams and return normalized, paginated results.', sig:'searchYouTube(query: string, options?: SearchOptions): Promise<SearchResult>', example:code.search, params:[['query','string','Search query. Must be a non-empty string.'],['options','SearchOptions','Optional type, sort and limit settings.']], returns:'SearchResult', errors:['INVALID_QUERY','INVALID_TYPE','INVALID_SORT','INVALID_LIMIT','PARSE_ERROR','NO_RESULTS','RATE_LIMIT','YOUTUBE_ERROR','YOUTUBE_UNAVAILABLE','NETWORK_UNAVAILABLE']},
    playlist: {title:'getPlaylistItems', desc:'Fetch YouTube playlist metadata and video items with paginated access.', sig:'getPlaylistItems(playListID: string, options?: PlaylistOptions): Promise<PlaylistDetailsResult>', example:code.playlist, params:[['playListID','string','YouTube playlist ID.'],['options','PlaylistOptions','Optional page-size configuration.']], returns:'PlaylistDetailsResult', errors:['INVALID_PLAYLIST','NO_PLAYLIST_RESULTS','INVALID_LIMIT','PARSE_ERROR','RATE_LIMIT','YOUTUBE_ERROR','YOUTUBE_UNAVAILABLE','NETWORK_UNAVAILABLE']},
    video: {title:'getVideoDetails', desc:'Fetch and normalize full video details from YouTube by video ID.', sig:'getVideoDetails(videoID: string): Promise<VideoDetailsResult>', example:code.details, params:[['videoID','string','YouTube video ID.']], returns:'VideoDetailsResult', errors:['INVALID_VIDEO','PARSE_ERROR','RATE_LIMIT','YOUTUBE_ERROR','YOUTUBE_UNAVAILABLE','NETWORK_UNAVAILABLE']}
  }[kind];
  return <><PageTitle eyebrow="API Reference" title={data.title} description={data.desc}/><CodeBlock language="ts">{data.sig}</CodeBlock><h2 className="text-xl font-semibold">Parameters</h2><Table headers={['Name','Type','Description']} rows={data.params.map(p=>[<code>{p[0]}</code>,<code>{p[1]}</code>,p[2]])}/><h2 className="text-xl font-semibold">Returns</h2><p>Resolves to <Link href={`/types/${kind==='search'?'search':kind==='playlist'?'playlist':'video'}/`} className="font-mono underline">{data.returns}</Link>.</p><h2 className="text-xl font-semibold">Example</h2><CodeBlock language="js">{data.example}</CodeBlock><h2 className="text-xl font-semibold">Related errors</h2><div className="flex flex-wrap gap-2">{data.errors.map(e=><Link key={e} href="/errors/" className="rounded-md border border-zinc-200 px-2 py-1 font-mono text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">{e}</Link>)}</div></>
}
function ApiIndex(){ return <><PageTitle eyebrow="Reference" title="API Reference" description="Function-level documentation for every primary runtime API exported by ytsearch.js."/><div className="grid gap-4 sm:grid-cols-3">{[['/api/search-youtube/','searchYouTube','Search YouTube content.'],['/api/get-playlist-items/','getPlaylistItems','Fetch playlist metadata and items.'],['/api/get-video-details/','getVideoDetails','Fetch video details by ID.']].map(([href,title,text])=><Link href={href} key={href} className="rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"><code className="text-sm font-semibold">{title}</code><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{text}</p></Link>)}</div></> }

function TypesPage({kind}) {
  const data = {
    search:{title:'Search Types', desc:'Types used by the YouTube search API.', blocks:[['SearchType','type SearchType = (typeof ExpectedTypes)[number];\n\n// "any" | "video" | "channel" | "playlist" | "movie" | "live"'],['SortType','type SortType = (typeof ExpectedSorts)[number];\n\n// "relevance" | "upload_date" | "view_count" | "rating"'],['SearchOptions',types.SearchOptions],['SearchResultMeta',types.SearchResultMeta],['SearchResult',types.SearchResult]]},
    video:{title:'Video Types',desc:'Normalized video result and video detail shapes.',blocks:[['VideoResult',types.VideoResult],['VideoDetailsResult',types.VideoDetailsResult]]},
    playlist:{title:'Playlist Types',desc:'Playlist search, playlist metadata, item and paginated result shapes.',blocks:[['PlaylistResult',types.PlaylistResult],['PlaylistInfo',types.PlaylistInfo],['PlaylistVideo',types.PlaylistVideo],['PlaylistMetadata',types.PlaylistMetadata],['PlaylistDetailsResult',types.PlaylistDetailsResult],['PlaylistOptions',types.PlaylistOptions]]},
    channel:{title:'Channel Types',desc:'Channel and author metadata used by search results.',blocks:[['ChannelResult',types.ChannelResult],['Author',types.Author]]},
    common:{title:'Common Types',desc:'Shared result and thumbnail structures.',blocks:[['Thumbnail',types.Thumbnail],['Author',types.Author],['BaseResult',types.BaseResult]]}
  }[kind];
  return <><PageTitle eyebrow="Types" title={data.title} description={data.desc}/>{data.blocks.map(([name,src])=><section key={name} id={name} className="scroll-mt-24"><h2 className="text-lg font-semibold"><code>{name}</code></h2><CodeBlock language="ts">{src}</CodeBlock></section>)}</>
}
function TypesIndex(){return <><PageTitle eyebrow="Reference" title="TypeScript Types" description="The v2.1.3 declaration surface exported by ytsearch.js, organized by the data each API works with."/><div className="grid gap-4 sm:grid-cols-2">{[['/types/search/','Search Types','Search options, metadata, result collections and pagination.'],['/types/video/','Video Types','Search video results and full video details.'],['/types/playlist/','Playlist Types','Playlist information, items, metadata and pagination.'],['/types/channel/','Channel Types','Channel and author metadata.'],['/types/common/','Common Types','Thumbnail and base result structures.']].map(([h,t,d])=><Link key={h} href={h} className="rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{d}</p></Link>)}</div></>}

function Errors(){return <><PageTitle eyebrow="Reference" title="Errors & Error Codes" description="ytsearch.js exposes YtSearchError with a stable code field so applications can handle known failures programmatically."/><CodeBlock language="ts">{types.YtSearchError}</CodeBlock><h2 className="text-xl font-semibold">Error codes</h2><Table headers={['Code','Meaning']} rows={errorCodes.map(([a,b])=>[<code>{a}</code>,b])}/><Callout tone="warn">Treat upstream YouTube parsing and availability as external conditions. Catch <code>YtSearchError</code> around network-facing operations and branch on <code>error.code</code> where recovery behavior matters.</Callout></>}

function Guides(){return <><PageTitle eyebrow="Learn" title="Guides" description="Search-focused, task-oriented guides for developers using ytsearch.js in Node.js and TypeScript."/><div className="grid gap-4">{[['/guides/youtube-search-nodejs/','YouTube Search in Node.js','Build a practical search flow with options and normalized results.'],['/guides/youtube-search-without-api-key/','YouTube Search Without an API Key','Understand the package’s public-data approach and its practical tradeoffs.'],['/guides/youtube-playlist-scraper-nodejs/','YouTube Playlist Scraper for Node.js','Fetch playlist metadata, videos and additional pages.'],['/guides/youtube-video-metadata-nodejs/','YouTube Video Metadata in Node.js','Retrieve normalized video details from a video ID.'],['/guides/youtube-search-typescript/','YouTube Search with TypeScript','Build typed search code using the exported declaration surface.']].map(([h,t,d])=><Link key={h} href={h} className="rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{d}</p></Link>)}</div></>}
function Guide({kind}){const data={search:{title:'YouTube Search in Node.js',desc:'A practical path from installation to normalized YouTube search results.',steps:[['Install','Run npm install ytsearch.js and choose ESM or CommonJS.'],['Search','Call searchYouTube with a query and options.'],['Read results','Consume videos, channels, playlists and metadata.'],['Paginate','Call nextPage() when another page is available.']]},noapi:{title:'YouTube Search Without an API Key',desc:'How ytsearch.js approaches public YouTube data without requiring an official YouTube Data API key.',steps:[['What the package provides','ytsearch.js exposes normalized search and data functions rather than requiring developers to provision a YouTube Data API project.'],['What this does not guarantee','Public page structures and upstream availability can change. Parsing and network errors therefore remain possible.'],['Handle failures','Use YtSearchError and its code property to make application behavior explicit.']]},playlist:{title:'YouTube Playlist Scraper for Node.js',desc:'Fetch playlist information and iterate through video items with pagination.',steps:[['Fetch the playlist','Call getPlaylistItems with a playlist ID.'],['Choose a page size','Use the optional limit from 10 to 100, defaulting to 50.'],['Iterate','Process videos and call nextPage() until it returns null.']]},video:{title:'YouTube Video Metadata in Node.js',desc:'Fetch normalized metadata for a specific YouTube video ID.',steps:[['Call getVideoDetails','Pass a non-empty video ID.'],['Read metadata','Use title, description, duration, views, channel, likes and privacy fields.'],['Handle errors','Catch YtSearchError for invalid IDs, parsing and network failures.']]},ts:{title:'YouTube Search with TypeScript',desc:'Use ytsearch.js as a typed dependency in TypeScript applications.',steps:[['Import the API','Import functions and types from ytsearch.js.'],['Annotate where useful','SearchResult and SearchOptions can make application boundaries explicit.'],['Handle errors','Use YtSearchError for typed error handling.']]}}[kind]; return <><PageTitle eyebrow="Guide" title={data.title} description={data.desc}/>{data.steps.map(([t,d],i)=><section key={t} className="mb-8"><div className="flex gap-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">{i+1}</div><div><h2 className="text-lg font-semibold">{t}</h2><p>{d}</p></div></div></section>)}{kind==='search'&&<CodeBlock language="js">{code.search}</CodeBlock>}{kind==='playlist'&&<CodeBlock language="js">{code.playlist}</CodeBlock>}{kind==='video'&&<CodeBlock language="js">{code.details}</CodeBlock>}{kind==='ts'&&<CodeBlock language="ts">{`import { searchYouTube, type SearchResult } from "ytsearch.js";\n\nconst result: SearchResult = await searchYouTube("typescript", {\n  type: "video",\n  limit: 20,\n});`}</CodeBlock>}</>}

function Examples(){return <><PageTitle eyebrow="Learn" title="Examples" description="Small, copy-pasteable examples covering the most common ytsearch.js workflows."/><div className="grid gap-4 sm:grid-cols-2">{[['/examples/basic-search/','Basic search'],['/examples/all-types/','Search all result types'],['/examples/pagination/','Search pagination'],['/examples/playlist/','Playlist pagination'],['/examples/video-details/','Video details'],['/examples/typescript/','TypeScript']].map(([h,t])=><Link key={h} href={h} className="rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"><h2 className="font-semibold">{t}</h2></Link>)}</div></>}
function Example({kind}){const data={basic:['Basic YouTube Search',code.search],all:['Search Multiple YouTube Types',code.any],pagination:['Search Pagination',code.paginate],playlist:['Playlist Items',code.playlist],video:['Video Details',code.details],typescript:['TypeScript Search',`import { searchYouTube, type SearchResult } from "ytsearch.js";\n\nconst result: SearchResult = await searchYouTube("Node.js", {\n  type: "video",\n  limit: 10,\n});\n\nresult.videos.forEach(video => console.log(video.title));`]}[kind];return <><PageTitle eyebrow="Example" title={data[0]} description="A focused example you can adapt to a Node.js application."/><CodeBlock language={kind==='typescript'?'ts':'js'}>{data[1]}</CodeBlock></>}

function MarkdownChangelog() {
  const lines = changelogMarkdown.replace(/\r/g, '').split('\n');
  const nodes = [];
  let i = 0;
  const inline = (text) => text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text'; const buf=[]; i++;
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
      i++; nodes.push(<CodeBlock key={`code-${i}`} language={lang}>{buf.join('\n')}</CodeBlock>); continue;
    }
    if (line.startsWith('### ')) { nodes.push(<h3 key={i} className="text-lg font-semibold">{line.slice(4)}</h3>); i++; continue; }
    if (line.startsWith('## ')) { nodes.push(<h2 key={i} className="mt-10 text-2xl font-bold">{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith('# ')) { i++; continue; }
    if (line.startsWith('> ')) { nodes.push(<blockquote key={i} className="my-4 border-l-2 border-zinc-300 pl-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" dangerouslySetInnerHTML={{__html:inline(line.slice(2))}}/>); i++; continue; }
    if (line.startsWith('- ')) {
      const items=[]; while(i<lines.length && lines[i].startsWith('- ')){items.push(lines[i].slice(2));i++;}
      nodes.push(<ul key={i} className="my-4 list-disc space-y-1 pl-6" dangerouslySetInnerHTML={{__html:items.map(x=>`<li>${inline(x)}</li>`).join('')}}/>); continue;
    }
    if (line.startsWith('|')) {
      const rows=[]; while(i<lines.length && lines[i].startsWith('|')){rows.push(lines[i]);i++;}
      const cells=row=>row.split('|').slice(1,-1).map(c=>c.trim());
      const header=cells(rows[0]); const body=rows.slice(2).map(cells);
      nodes.push(<Table key={i} headers={header} rows={body.map(r=>r.map(c=><span dangerouslySetInnerHTML={{__html:inline(c)}}/>))}/>); continue;
    }
    const para=[]; while(i<lines.length && lines[i].trim() && !/^#{1,3} /.test(lines[i]) && !lines[i].startsWith('> ') && !lines[i].startsWith('- ') && !lines[i].startsWith('|') && !lines[i].startsWith('```')){para.push(lines[i]);i++;}
    nodes.push(<p key={i} dangerouslySetInnerHTML={{__html:inline(para.join(' '))}}/>);
  }
  return <>{nodes}</>;
}
function Changelog(){return <><PageTitle eyebrow="Project" title="Changelog" description="Release history for ytsearch.js, consolidated from the supplied official GitHub release changelog."/><MarkdownChangelog/><div className="mt-12 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800">Project maintained by <a className="font-medium underline" href={packageInfo.authorUrl}>RJRYT</a>. For project support, visit <a className="font-medium underline" href={packageInfo.supportUrl}>rjryt.com/contact</a>.</div></>}

function SearchPage() {
  const [q, setQ] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return routeIndex.slice(0, 12);
    return routeIndex.filter(r => (r.title + ' ' + r.description + ' ' + r.path).toLowerCase().includes(s)).slice(0, 30);
  }, [q]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set('q', q.trim()); else url.searchParams.delete('q');
    window.history.replaceState({}, '', `${url.pathname}${url.search}`);
  }, [q]);
  return <>
    <PageTitle eyebrow="Search" title="Search Documentation" description="Search the ytsearch.js documentation directly with a query URL such as /search/?q=ytsearch%20api."/>
    <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
      <Icon name="search" size={18} className="text-zinc-400"/>
      <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search ytsearch.js docs…" aria-label="Search ytsearch.js documentation" className="w-full bg-transparent text-sm outline-none"/>
    </div>
    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Direct URL format: <code>/search/?q=your+query</code>. This route is intentionally excluded from the sitemap and marked <code>noindex</code>; its purpose is interactive search, while the canonical documentation pages remain indexable.</p>
    <div className="mt-8 space-y-2">{results.map(r => <Link href={r.path} key={r.path} className="block rounded-xl border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"><div className="text-sm font-semibold">{r.title}</div><div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{r.path}</div><p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{r.description}</p></Link>)}{!results.length && <p className="text-sm text-zinc-500">No local matches.</p>}</div>
  </>;
}

function NotFoundContent(){return <><PageTitle eyebrow="404" title="Page not found" description="The requested ytsearch.js documentation page does not exist."/><Link href="/docs/" className="font-medium underline">Return to documentation</Link></>}

function Content({path}){
  if(path==='/') return <Home/>;
  if(path==='/search/') return <SearchPage/>;
  if(path==='/api/') return <ApiIndex/>;
  if(path==='/api/search-youtube/') return <ApiPage kind="search"/>;
  if(path==='/api/get-playlist-items/') return <ApiPage kind="playlist"/>;
  if(path==='/api/get-video-details/') return <ApiPage kind="video"/>;
  if(path==='/types/') return <TypesIndex/>;
  if(path.startsWith('/types/')) return <TypesPage kind={path.split('/')[2]}/>;
  if(path==='/errors/') return <Errors/>;
  if(path==='/guides/') return <Guides/>;
  if(path.startsWith('/guides/')) { const k=path.split('/')[2]; return <Guide kind={{'youtube-search-nodejs':'search','youtube-search-without-api-key':'noapi','youtube-playlist-scraper-nodejs':'playlist','youtube-video-metadata-nodejs':'video','youtube-search-typescript':'ts'}[k]}/>; }
  if(path==='/examples/') return <Examples/>;
  if(path.startsWith('/examples/')) { const k=path.split('/')[2]; return <Example kind={{'basic-search':'basic','all-types':'all','pagination':'pagination','playlist':'playlist','video-details':'video','typescript':'typescript'}[k]}/>; }
  if(path==='/changelog/') return <Changelog/>;
  if(path.startsWith('/docs/')) return <Docs slug={path.slice(1)}/>;
  return <NotFoundContent/>;
}

export function App({ ssrPath }={}){const [path,setPath]=useState(ssrPath || currentPath());const [mobile,setMobile]=useState(false);useEffect(()=>{const f=()=>setPath(currentPath());addEventListener('popstate',f);return()=>removeEventListener('popstate',f)},[]);const route=getRoute(path);return <Seo route={route}><Header onMenu={()=>setMobile(true)}/><div className="mx-auto flex max-w-7xl"><Sidebar mobileOpen={mobile} close={()=>setMobile(false)}/><main className="min-w-0 flex-1"><div className={`${path==='/'?'':'max-w-4xl'} mx-auto px-4 py-10 sm:px-6 lg:px-10 lg:py-14`}><div className="prose-doc"><Content path={path}/></div>{path!=='/'&&path!=='/search/'&&<PrevNext/>}</div></main></div><footer className="border-t border-zinc-200 dark:border-zinc-800"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>ytsearch.js documentation · v{packageInfo.version}</span><div className="flex flex-wrap gap-4"><a href={packageInfo.authorUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white">Developer</a><a href={packageInfo.supportUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white">Support</a><a href={packageInfo.github} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white">GitHub</a><a href={packageInfo.npm} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white">npm</a><Link href="/changelog/" className="hover:text-zinc-950 dark:hover:text-white">Changelog</Link></div></div></footer></Seo>}

if (typeof document !== 'undefined') { const root=document.getElementById('root'); if(root.dataset.ssr==='true') hydrateRoot(root,<App/>); else createRoot(root).render(<App/>); }
