export const packageInfo = {
  name: 'ytsearch.js',
  version: '2.1.3',
  domain: 'https://ytsearch.rjryt.com',
  github: 'https://github.com/RJRYT/ytsearch.js',
  npm: 'https://www.npmjs.com/package/ytsearch.js',
  authorUrl: 'https://rjryt.com/',
  supportUrl: 'https://rjryt.com/contact/',
  description: 'TypeScript and Node.js library for searching YouTube videos, channels, playlists, movies, and live streams, fetching video details and paginated playlist items without the official YouTube Data API.',
  node: '>=14.0.0'
};

export const routes = [
  { path: '/', title: 'ytsearch.js — YouTube Search for Node.js & TypeScript', description: 'ytsearch.js documentation: search YouTube videos, channels, playlists, movies and live streams from Node.js and TypeScript without an official YouTube Data API key.' },
  { path: '/docs/', title: 'Documentation — ytsearch.js', description: 'Learn how to install and use ytsearch.js for YouTube search, playlist pagination and video metadata in Node.js and TypeScript.' },
  { path: '/docs/installation/', title: 'Installation — ytsearch.js', description: 'Install ytsearch.js with npm and use it in Node.js, TypeScript, CommonJS or ES modules.' },
  { path: '/docs/quick-start/', title: 'Quick Start — ytsearch.js', description: 'Start searching YouTube with ytsearch.js in a few lines of Node.js or TypeScript code.' },
  { path: '/docs/search/', title: 'YouTube Search — ytsearch.js', description: 'Learn the ytsearch.js searchYouTube API, search types, sorting, limits, normalized results and pagination.' },
  { path: '/docs/search/videos/', title: 'Video Search — ytsearch.js', description: 'Search YouTube videos from Node.js with ytsearch.js and inspect normalized video result fields.' },
  { path: '/docs/search/channels/', title: 'Channel Search — ytsearch.js', description: 'Search YouTube channels with ytsearch.js and work with channel metadata and normalized results.' },
  { path: '/docs/search/playlists/', title: 'Playlist Search — ytsearch.js', description: 'Search YouTube playlists with ytsearch.js and access playlist result metadata.' },
  { path: '/docs/search/movies/', title: 'Movie Search — ytsearch.js', description: 'Search YouTube movie results with ytsearch.js using the unified search API.' },
  { path: '/docs/search/live/', title: 'Live Search — ytsearch.js', description: 'Search YouTube live streams with ytsearch.js using the unified search API.' },
  { path: '/docs/search/pagination/', title: 'Search Pagination — ytsearch.js', description: 'Fetch additional YouTube search pages with the nextPage method in ytsearch.js.' },
  { path: '/docs/playlists/', title: 'Playlist Items — ytsearch.js', description: 'Fetch YouTube playlist metadata and video items with pagination using getPlaylistItems.' },
  { path: '/docs/playlists/pagination/', title: 'Playlist Pagination — ytsearch.js', description: 'Use nextPage to paginate large YouTube playlists with ytsearch.js.' },
  { path: '/docs/videos/', title: 'Video Details — ytsearch.js', description: 'Fetch normalized YouTube video metadata with getVideoDetails in Node.js and TypeScript.' },
  { path: '/docs/typescript/', title: 'TypeScript — ytsearch.js', description: 'Use ytsearch.js with TypeScript declarations, exported interfaces, unions and constants.' },
  { path: '/docs/esm/', title: 'ES Modules — ytsearch.js', description: 'Import ytsearch.js in modern Node.js ES module applications.' },
  { path: '/docs/commonjs/', title: 'CommonJS — ytsearch.js', description: 'Use ytsearch.js from CommonJS applications with require().' },
  { path: '/api/', title: 'API Reference — ytsearch.js', description: 'Complete API reference for ytsearch.js functions, options, return values and errors.' },
  { path: '/api/search-youtube/', title: 'searchYouTube API — ytsearch.js', description: 'API reference for searchYouTube, the main YouTube search function in ytsearch.js.' },
  { path: '/api/get-playlist-items/', title: 'getPlaylistItems API — ytsearch.js', description: 'API reference for getPlaylistItems and paginated YouTube playlist results.' },
  { path: '/api/get-video-details/', title: 'getVideoDetails API — ytsearch.js', description: 'API reference for getVideoDetails and normalized YouTube video metadata.' },
  { path: '/types/', title: 'TypeScript Types — ytsearch.js', description: 'Browse all exported TypeScript types, interfaces, unions and constants in ytsearch.js.' },
  { path: '/types/search/', title: 'Search Types — ytsearch.js', description: 'Reference SearchOptions, SearchResult, SearchResultMeta, SearchType and SortType.' },
  { path: '/types/video/', title: 'Video Types — ytsearch.js', description: 'Reference VideoResult and VideoDetailsResult fields returned by ytsearch.js.' },
  { path: '/types/playlist/', title: 'Playlist Types — ytsearch.js', description: 'Reference playlist result, metadata, item and pagination types.' },
  { path: '/types/channel/', title: 'Channel Types — ytsearch.js', description: 'Reference ChannelResult and Author types returned by ytsearch.js.' },
  { path: '/types/common/', title: 'Common Types — ytsearch.js', description: 'Reference common thumbnail, author and base result types in ytsearch.js.' },
  { path: '/errors/', title: 'Errors & Error Codes — ytsearch.js', description: 'Handle YtSearchError and all documented ytsearch.js error codes.' },
  { path: '/guides/', title: 'Guides — ytsearch.js', description: 'Practical guides for YouTube search, playlist scraping, video metadata and TypeScript with ytsearch.js.' },
  { path: '/guides/youtube-search-nodejs/', title: 'YouTube Search in Node.js — ytsearch.js', description: 'A practical guide to building YouTube search in Node.js with ytsearch.js.' },
  { path: '/guides/youtube-search-without-api-key/', title: 'YouTube Search Without an API Key — ytsearch.js', description: 'Learn how ytsearch.js can retrieve public YouTube search data without an official YouTube Data API key.' },
  { path: '/guides/youtube-playlist-scraper-nodejs/', title: 'YouTube Playlist Scraper for Node.js — ytsearch.js', description: 'Fetch YouTube playlist metadata and videos with pagination in Node.js.' },
  { path: '/guides/youtube-video-metadata-nodejs/', title: 'YouTube Video Metadata in Node.js — ytsearch.js', description: 'Fetch normalized YouTube video metadata by ID with ytsearch.js.' },
  { path: '/guides/youtube-search-typescript/', title: 'YouTube Search with TypeScript — ytsearch.js', description: 'Use ytsearch.js type declarations to build typed YouTube search applications.' },
  { path: '/examples/', title: 'Examples — ytsearch.js', description: 'Copy-paste Node.js, TypeScript, ESM and CommonJS examples for ytsearch.js.' },
  { path: '/examples/basic-search/', title: 'Basic YouTube Search Example — ytsearch.js', description: 'Minimal ytsearch.js example for searching YouTube videos.' },
  { path: '/examples/all-types/', title: 'Search All YouTube Result Types — ytsearch.js', description: 'Example using ytsearch.js to retrieve videos, channels and playlists together.' },
  { path: '/examples/pagination/', title: 'Pagination Example — ytsearch.js', description: 'Example for fetching additional YouTube search pages with nextPage().' },
  { path: '/examples/playlist/', title: 'Playlist Example — ytsearch.js', description: 'Example for fetching YouTube playlist videos and pagination.' },
  { path: '/examples/video-details/', title: 'Video Details Example — ytsearch.js', description: 'Example for fetching normalized YouTube video metadata by ID.' },
  { path: '/examples/typescript/', title: 'TypeScript Example — ytsearch.js', description: 'Typed TypeScript example using ytsearch.js search results.' },
  { path: '/changelog/', title: 'Changelog — ytsearch.js', description: 'Release history and current package information for ytsearch.js.' },
  { path: '/search/', title: 'Search Documentation — ytsearch.js', description: 'Search the ytsearch.js documentation and find relevant guides, APIs, types and examples.' },
  { path: '/404/', title: 'Page Not Found — ytsearch.js', description: 'The requested ytsearch.js documentation page was not found.' }
];

export const navGroups = [
  { label: 'Getting Started', items: [
    ['/docs/', 'Introduction'], ['/docs/installation/', 'Installation'], ['/docs/quick-start/', 'Quick Start']
  ]},
  { label: 'YouTube Search', items: [
    ['/docs/search/', 'Search Overview'], ['/docs/search/videos/', 'Video Search'], ['/docs/search/channels/', 'Channel Search'], ['/docs/search/playlists/', 'Playlist Search'], ['/docs/search/movies/', 'Movie Search'], ['/docs/search/live/', 'Live Search'], ['/docs/search/pagination/', 'Search Pagination']
  ]},
  { label: 'Data', items: [['/docs/playlists/', 'Playlist Items'], ['/docs/playlists/pagination/', 'Playlist Pagination'], ['/docs/videos/', 'Video Details']] },
  { label: 'Runtime & Language', items: [['/docs/typescript/', 'TypeScript'], ['/docs/esm/', 'ES Modules'], ['/docs/commonjs/', 'CommonJS']] },
  { label: 'Reference', items: [['/api/', 'API Reference'], ['/types/', 'Types'], ['/errors/', 'Errors']] },
  { label: 'Learn', items: [['/guides/', 'Guides'], ['/examples/', 'Examples'], ['/changelog/', 'Changelog']] }
];

export const code = {
  install: 'npm install ytsearch.js',
  cjs: `const { searchYouTube } = require("ytsearch.js");\n\n(async () => {\n  const results = await searchYouTube("Black Panther", {\n    type: "video",\n    limit: 10,\n  });\n\n  results.videos.forEach((item) => {\n    console.log(item.type, item.title);\n  });\n})();`,
  esm: `import { searchYouTube } from "ytsearch.js";\n\nconst results = await searchYouTube("Black Panther", {\n  type: "channel",\n  limit: 10,\n});\n\nresults.channels.forEach((item) => {\n  console.log(item.type, item.title);\n});`,
  search: `import { searchYouTube } from "ytsearch.js";\n\nconst results = await searchYouTube("JavaScript tutorial", {\n  type: "video",\n  sort: "relevance",\n  limit: 20,\n});\n\nconsole.log(results.videos);\nconsole.log(results.metadata);`,
  any: `const results = await searchYouTube("lofi hip hop", {\n  type: "any",\n  limit: 20,\n});\n\nconsole.log(results.videos);\nconsole.log(results.channels);\nconsole.log(results.playlists);`,
  playlist: `import { getPlaylistItems } from "ytsearch.js";\n\nconst result = await getPlaylistItems("PLBCF2DAC6FFB574DE", {\n  limit: 50,\n});\n\nconsole.log(result.playlist);\nconsole.log(result.videos);`,
  details: `import { getVideoDetails } from "ytsearch.js";\n\nconst video = await getVideoDetails("dQw4w9WgXcQ");\n\nconsole.log(video.title);\nconsole.log(video.channel.name);\nconsole.log(video.views);`,
  paginate: `let page = await searchYouTube("node.js", { limit: 20 });\n\nwhile (page) {\n  for (const video of page.videos) {\n    console.log(video.title);\n  }\n\n  page = await page.nextPage();\n}`
};

export const types = {
  SearchOptions: `interface SearchOptions {\n  type?: SearchType;\n  sort?: SortType;\n  limit?: number;\n}`,
  PlaylistOptions: `interface PlaylistOptions {\n  limit?: number;\n}`,
  Thumbnail: `interface Thumbnail {\n  url: string;\n  width: number;\n  height: number;\n}`,
  Author: `interface Author {\n  name: string;\n  url: string;\n  logo?: string;\n  verified?: boolean;\n  isArtist?: boolean;\n}`,
  BaseResult: `interface BaseResult {\n  id: string;\n  title: string;\n  image: string;\n  thumbnail: Thumbnail;\n  url: string;\n}`,
  VideoResult: `interface VideoResult extends BaseWithAuthor {\n  type: "video";\n  viewCount: number;\n  shortViewCount: string;\n  duration: string;\n  seconds: number;\n  publishedAt: string;\n  isLive: boolean;\n}`,
  ChannelResult: `interface ChannelResult extends BaseResult {\n  type: "channel";\n  description: string;\n  subscriberCount: string;\n  verified: boolean;\n  isArtist: boolean;\n}`,
  PlaylistResult: `interface PlaylistResult extends BaseWithAuthor {\n  type: "playlist";\n  contentType: string;\n  videoCount: number;\n}`,
  SearchResultMeta: `interface SearchResultMeta {\n  estimatedPages: number;\n  estimatedResults: number;\n  hasNextPage: boolean;\n  ytPage: number;\n  ytPageSize: number;\n  userPage: number;\n  userPageSize: number;\n  searchType: SearchType;\n  sortType: SortType;\n  query: string;\n  resultRange: [number, number];\n}`,
  SearchResult: `interface SearchResult extends SearchResultBuffer {\n  metadata: SearchResultMeta;\n  nextPage: () => Promise<SearchResult | null>;\n}`,
  PlaylistMetadata: `interface PlaylistMetadata {\n  ytPage: number;\n  ytPageSize: number;\n  userPage: number;\n  userPageSize: number;\n  hasNextPage: boolean;\n  totalVideos: number;\n  resultRange: [number, number];\n  expectedPages: number;\n}`,
  PlaylistInfo: `interface PlaylistInfo extends BaseWithAuthor {\n  description: string;\n  videoCount: string;\n  viewsCount: string;\n}`,
  PlaylistVideo: `interface PlaylistVideo extends BaseWithAuthor {\n  type: "video";\n  index: string;\n  views: string;\n  duration: string;\n  seconds: number;\n  publishedAt: string;\n}`,
  PlaylistDetailsResult: `interface PlaylistDetailsResult {\n  playlist: PlaylistInfo;\n  videos: PlaylistVideo[];\n  metadata: PlaylistMetadata;\n  nextPage: () => Promise<PlaylistDetailsResult | null>;\n}`,
  VideoDetailsResult: `interface VideoDetailsResult extends BaseResult {\n  description: string;\n  duration: string;\n  views: number;\n  viewsShort: string;\n  uploadDate: string;\n  channel: {\n    id: string;\n    name: string;\n    url: string;\n    avatar: string;\n    subscribers: string;\n    verified: boolean;\n    isArtist: boolean;\n  };\n  likes: number;\n  likesShort: string;\n  isLive: boolean;\n  isPrivate: boolean;\n  isUnlisted: boolean;\n  category: string;\n  allowRatings: boolean;\n}`,
  YtSearchError: `class YtSearchError extends Error {\n  code: YtSearchErrorCode;\n  metadata?: Record<string, any>;\n}`
};

export const errorCodes = [
  ['INVALID_QUERY', 'The search query is missing, empty, or not a string.'],
  ['INVALID_TYPE', 'The search type is not one of the supported SearchType values.'],
  ['INVALID_SORT', 'The requested sort value is not supported.'],
  ['INVALID_LIMIT', 'The requested page size is outside the function’s accepted range.'],
  ['PARSE_ERROR', 'The response could not be parsed into the expected normalized structure.'],
  ['NO_RESULTS', 'No matching search results were available.'],
  ['RATE_LIMIT', 'The upstream service appears to have rate-limited the request.'],
  ['YOUTUBE_ERROR', 'YouTube returned an error response while processing the request.'],
  ['YOUTUBE_UNAVAILABLE', 'YouTube was unavailable for the requested operation.'],
  ['NETWORK_UNAVAILABLE', 'A network request could not be completed.'],
  ['INVALID_PLAYLIST', 'The supplied playlist identifier or playlist response was invalid.'],
  ['NO_PLAYLIST_RESULTS', 'No videos were found in the requested playlist response.'],
  ['INVALID_VIDEO', 'The supplied video identifier or video response was invalid.'],
  ['UNKNOWN', 'An error occurred that does not match another documented code.']
];
