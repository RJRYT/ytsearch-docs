# ytsearch.js Changelog

A consolidated changelog for **ytsearch.js**, compiled from the official GitHub release pages.

> **Repository:** https://github.com/RJRYT/ytsearch.js  
> **Releases:** https://github.com/RJRYT/ytsearch.js/releases

---

## v2.1.3

**Release date:** 22 September 2026  
**Commit:** `f9f5bfc`

### Release notes

GitHub currently provides only a **Full Changelog** link on the v2.1.3 release page:

- Full Changelog: `v2.1.2...v2.1.3`

No additional release-note body is displayed on the release page.

[View v2.1.3 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.3)

---

## v2.1.2

**Release date:** 15 September 2026  
**Commit:** `d99b68c`

### Highlights

- Improved npm discoverability with updated package keywords and description.
- Enhanced the README with clearer YouTube search, playlist, Node.js, and TypeScript documentation.
- Added SEO-focused feature descriptions and FAQs.
- Updated project dependencies, including Axios and build tooling.

### Dependency updates

- Axios: `1.12.2` → `1.20.0`
- `@babel/core`: `7.28.4` → `7.29.7`
- browserslist: `4.26.2` → `4.28.9`
- brace-expansion updated
- picomatch updated
- minimatch updated
- rollup: `4.50.2` → `4.63.3`

### Installation

```bash
npm install ytsearch.js
```

[View v2.1.2 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.2)

---

## v2.1.1

**Release date:** 14 September 2026  
**Commit:** `1158872`

### Fixes

- Fixed `getPlaylistItems` for YouTube's latest playlist-page structure.
- Added support for modern `lockupViewModel` playlist entries.
- Restored playlist pagination by handling the updated continuation-token structure.
- Preserved compatibility with the legacy playlist response format.

### Dependency updates

- TypeScript: updated to `5.9.3`
- tsup: updated to `8.5.1`
- js-yaml: `3.14.1` → `3.14.2`
- glob: `10.4.5` → `10.5.0`

[View v2.1.1 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.1)

---

## v2.1.0

**Release date:** 26 September 2026  
**Commit:** `d1e6613`

### Overview

Introduced flat type exports to improve the TypeScript developer experience while keeping the package compatible with both JavaScript and TypeScript projects.

### Type exports

All public types are now explicitly exported from the main entry point, so TypeScript users can import them without using deep import paths.

```ts
import type {
  SearchResult,
  VideoResult,
  PlaylistDetailsResult
} from "ytsearch.js";
```

### Exported types

- `SearchOptions`
- `PlaylistOptions`
- `SearchType`
- `SortType`
- `Thumbnail`
- `Author`
- `VideoResult`
- `ChannelResult`
- `PlaylistResult`
- `SearchResultMeta`
- `SearchResult`
- `PlaylistMetadata`
- `PlaylistInfo`
- `PlaylistVideo`
- `PlaylistDetailsResult`
- `VideoDetailsResult`

### Compatibility

- No breaking changes for JavaScript users.
- TypeScript developers receive first-class type support out of the box.
- Types use flat exports without namespace wrapping.
- Works with both `import` and `require`, depending on project setup.

[View v2.1.0 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.0)

---

## v2.0.0 — Major Release

**Release date:** 25 September 2026  
**Commit:** `3cd5afc`

This is a **breaking release** introducing structural changes to the search and playlist APIs. The release also adds safety limits designed to reduce unnecessary requests to YouTube.

### Search API changes

#### New `any` search type

Added the `any` type option to `searchYouTube()`.

The combined result structure contains:

```ts
{
  videos: VideoResult[];
  channels: ChannelResult[];
  playlists: PlaylistResult[];
  movies: VideoResult[];
  lives: VideoResult[];
  metadata: SearchMetadata;
  nextPage: () => Promise<SearchResult | null>;
}
```

When `type = "any"`:

- `videos`, `channels`, and `playlists` are populated.
- `movies` and `lives` remain empty because they are video-based result types.

When a specific type is requested, only that corresponding result collection is populated.

### Pagination and metadata

Search results now consistently include a `metadata` object containing:

- `estimatedPages`
- `estimatedResults`
- `hasNextPage`
- `ytPage`
- `ytPageSize`
- `userPage`
- `userPageSize`
- `searchType`
- `sortType`
- `query`
- `resultRange`

The previous `expectedPages` property was renamed to `estimatedPages` and moved into metadata.

`estimatedResults` and `hasNextPage` were also moved into metadata.

### Safe user limits

The user-defined search limit is restricted to **10–50 results**, with a default of **20**.

This is intended to avoid unnecessarily heavy requests to YouTube.

The library now fetches additional YouTube result chunks only when required to satisfy the requested page size.

### Optimized API requests

- YouTube requests are made only when additional data is needed.
- The requested per-page limit is enforced more strictly.
- Local buffering can avoid unnecessary additional requests.

### Playlist API changes

`getPlaylistItems()` now supports a user-facing `limit` option:

- Default: `50`
- Allowed range: `10–100`

Playlist results now include both YouTube page tracking and user page tracking.

The metadata includes:

- `ytPage`
- `ytPageSize`
- `userPage`
- `userPageSize`
- `hasNextPage`
- `totalVideos`
- `resultRange`
- `expectedPages`

### Smarter playlist buffering

When the requested user page size is smaller than YouTube's 100-item response chunk, unused items are retained and reused on subsequent pages.

For example, with `limit = 80`:

- Page 1 can return 80 items.
- The remaining 20 items are retained.
- Page 2 can reuse those 20 items and fetch only the additional 60 required items.

### Unified result structure

- Naming conventions are now consistent across APIs.
- Shared properties are extracted into common base objects.
- Type-specific fields extend the common structures.
- APIs use Promise-based pagination with a unified result structure.

### Breaking changes

- `searchYouTube()` no longer returns a direct array. It returns a structured result containing typed arrays and metadata.
- `getPlaylistItems()` now returns a paginated result instead of a flat 100-item array.
- `expectedPages` was renamed to `estimatedPages` and moved into metadata.
- `estimatedResults` and `hasNextPage` moved into metadata.

### Summary

- `searchYouTube()` → structured results, safe per-page limits, smarter buffering, and improved metadata.
- `getPlaylistItems()` → per-page limits, dual page tracking, smarter buffering, and consistent metadata.
- APIs → Promise-based pagination with a unified result structure.
- Rate-limit safety → unnecessary YouTube requests are reduced.

[View v2.0.0 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.0.0)

---

## v1.5.3

**Release date:** 22 September 2026  
**Commit:** `c8d8537`

### New features

Added two new search types to `searchYouTube()`:

- `movie` — search for full-length movies.
- `live` — search for live streams.

### Examples

Added:

- `examples/search-movie.js`
- `examples/search-live.js`

### Documentation

- Updated the Examples README with `movie` and `live` search types.
- Added the new example files to the examples list.
- Updated API documentation so the `type` option includes:
  - `video`
  - `channel`
  - `playlist`
  - `movie`
  - `live`

[View v1.5.3 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.3)

---

## v1.5.1

**Release date:** 19 September 2026  
**Commit:** `0458625`

### Fixes

Improved the Video Details Fetcher:

- Fixed handling of private videos, both logged-in and logged-out cases.
- Fixed handling of invalid, random, or malformed video IDs.
- These cases now correctly throw a `YtSearchError` with the `YOUTUBE_ERROR` code.

### Reliability

- Ensures consistent error handling for unavailable videos.
- Prevents unexpected crashes and unclear errors for invalid or unavailable videos.

### Upgrade

```bash
npm install ytsearch.js@1.5.1
```

[View v1.5.1 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.1)

---

## v1.5.0

**Release date:** 18 September 2026  
**Commit:** `df9743b`

### Video Details Fetcher

Introduced:

```ts
getVideoDetails(videoId: string)
```

The API fetches detailed metadata for a single YouTube video, including:

- Title
- Duration
- Views
- Publish date
- Author information
- Thumbnails

Also introduced the `FormatVideoObject` utility with safe parsing for consistent video data.

### Utilities

Added:

```ts
formatDuration()
```

Converts seconds into a human-readable duration.

Example:

```text
197 → 3:17
```

Added:

```ts
formatPublishedDate()
```

Converts ISO date strings into friendly, human-readable dates.

### Documentation

- Updated the README with `getVideoDetails()` documentation and examples.
- Added `examples/video-details.js`.

### Tests

- Added tests for `getVideoDetails()`.
- Added coverage for invalid and unavailable video IDs.
- Added error-handling test cases.

[View v1.5.0 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.0)

---

## v1.4.3

**Release date:** 17 September 2026  
**Commit:** `f598a4f`

### Fixes

#### Image and thumbnail URL normalization

Fixed inconsistent or broken image and thumbnail URLs.

All image and thumbnail URLs are now normalized for reliable use.

### Features

#### Playlist video pagination

Added pagination support for fetching playlist videos, improving handling of large playlists.

#### Search sorting

Fully implemented sorting options in the search functionality for more customizable and accurate results.

#### Custom error handling

Introduced the `YtSearchError` class for improved debugging and error management.

### TypeScript

- Enforced strict TypeScript types across the codebase.
- Added proper function documentation.
- Documented the error-handling flow and `YtSearchError` usage.

### Examples and tests

- Updated playlist and video examples.
- Added more examples to the `/examples` directory.
- Updated existing tests.
- Added new Jest test cases for improved coverage.

### Dependency and tooling updates

- Axios: `1.11.0` → `1.12.0`
- Configured Renovate.
- Updated `@types/axios`.
- Updated GitHub Actions checkout to v5.

[View v1.4.3 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.4.3)

---

## v1.4.0

**Release date:** 13 September 2026  
**Commit:** `3e8bdec`

### TypeScript migration

The full codebase was rewritten in TypeScript.

Major source files include:

- `main.ts`
- `fetch.ts`
- `helper.ts`
- `utils/constants.ts`
- `utils/utils.ts`
- `types/index.ts`

This improved type safety and editor autocompletion.

### Function rename and deprecation

Renamed:

```text
extractData → SearchYt
```

`extractData` remains available for backward compatibility but is deprecated.

New projects should use `SearchYt`.

### Project structure

The source tree was reorganized into dedicated type and utility modules:

```text
src/
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   └── utils.ts
├── fetch.ts
├── helper.ts
└── main.ts
```

Utility functions and constants were separated for clarity, while type definitions were organized into a dedicated directory.

### README updates

- Updated examples to use `SearchYt`.
- Clarified CommonJS and ES module support.
- Added sample outputs for videos, channels, and playlists.

### Compatibility

- Node.js v14+ is required.
- `SearchYt` should be used for new projects to avoid deprecation warnings.

[View v1.4.0 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.4.0)

---

## v1.3.0

**Release date:** 11 September 2026  
**Commit:** `685b450`

### Channel and playlist support

`ytsearch.js` was expanded beyond video search and can now retrieve:

- Videos
- Channels
- Playlists

directly from YouTube search results.

### Rich metadata

#### Videos

Video results include:

- `duration`
- `viewCount`
- `shortViewCount`
- `author`
- `watchUrl`
- `publishedAt`

#### Channels

Channel results include:

- `id`
- `title`
- `thumbnail`
- `description`
- `subscriberCount`
- `url`
- `verified`
- `isArtist`

#### Playlists

Playlist results include:

- `id`
- `title`
- `thumbnail`
- `videoCount`
- `author`
- `url`

### Search options

Added:

```ts
type
```

Supports:

- `video`
- `channel`
- `playlist`

Added:

```ts
sort
```

Supports:

- `relevance`
- `upload_date`
- `view_count`
- `rating`

Added:

```ts
limit
```

Controls the maximum number of returned results.

### Documentation

- Updated README with API references.
- Added usage examples.
- Documented output structures for videos, channels, and playlists.

### Optimizations

- Unified parsing logic.
- Improved response consistency across result types.

[View v1.3.0 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.3.0)

---

## v1.2.2

**Release date:** 10 September 2026  
**Commit:** `f7b51e5`

The GitHub release page contains no inline release-note body. It provides a Full Changelog comparison:

- `v1.2.1...v1.2.2`

[View v1.2.2 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.2.2)

---

## v1.2.1 — ESM-first Migration

**Release date:** 10 September 2026  
**Commit:** `28225d4`

### What's new

- Migrated the codebase to an ESM-first architecture with CommonJS compatibility.
- Improved the project structure for maintainability.
- Added examples and documentation to help developers get started.
- Improved `.gitignore` and repository housekeeping.

### Fixes and improvements

- More robust error handling in search logic.
- Cleaner README with badges, usage instructions, and examples.
- General package optimizations for npm publishing.

### Publishing notes

This release marked the migration to an ESM-first architecture.

CommonJS users remain supported through:

```js
require()
```

[View v1.2.1 release](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.2.1)

---

## Release history

| Version | Release date | Major focus |
| --- | --- | --- |
| `v2.1.3` | 22 Sep 2026 | Full changelog comparison |
| `v2.1.2` | 15 Sep 2026 | npm discoverability, SEO documentation, dependency updates |
| `v2.1.1` | 14 Sep 2026 | YouTube playlist structure and pagination fixes |
| `v2.1.0` | 26 Sep 2026 | Flat TypeScript exports |
| `v2.0.0` | 25 Sep 2026 | Breaking search and playlist API redesign |
| `v1.5.3` | 22 Sep 2026 | Movie and live search |
| `v1.5.1` | 19 Sep 2026 | Video-details error handling |
| `v1.5.0` | 18 Sep 2026 | Video details API |
| `v1.4.3` | 17 Sep 2026 | Pagination, sorting, errors, TypeScript improvements |
| `v1.4.0` | 13 Sep 2026 | TypeScript migration and `SearchYt` |
| `v1.3.0` | 11 Sep 2026 | Channel and playlist search |
| `v1.2.2` | 10 Sep 2026 | Full changelog comparison |
| `v1.2.1` | 10 Sep 2026 | ESM-first migration |

---

## Notes about the source release pages

This document consolidates the information displayed on the official GitHub release pages supplied for this changelog.

For releases where GitHub exposes only a **Full Changelog** comparison without an inline release-note body, this document does not infer or fabricate additional changes.

The authoritative release pages are:

- [v1.2.1](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.2.1)
- [v1.2.2](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.2.2)
- [v1.3.0](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.3.0)
- [v1.4.0](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.4.0)
- [v1.4.3](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.4.3)
- [v1.5.0](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.0)
- [v1.5.1](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.1)
- [v1.5.3](https://github.com/RJRYT/ytsearch.js/releases/tag/v1.5.3)
- [v2.0.0](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.0.0)
- [v2.1.0](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.0)
- [v2.1.1](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.1)
- [v2.1.2](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.2)
- [v2.1.3](https://github.com/RJRYT/ytsearch.js/releases/tag/v2.1.3)
