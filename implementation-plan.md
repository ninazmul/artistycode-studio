# Data Fetching, DB Indexing, DSA Patterns & Lazy Loading — Implementation Plan

## Background

Full audit of the ArtistyCode Studio Next.js App Router codebase reveals the following performance gaps across four areas:

---

## Audit Findings

### 1. Data Fetching — Current Problems
| Issue | Location |
|---|---|
| Sequential `await connectToDatabase()` on every single action call (no request-level caching) | All 10 `lib/actions/*.ts` files |
| Homepage fetches `getAllProjects()` serially — blocks render | `app/(root)/page.tsx` |
| Blog listing fetches are sequential (count + posts) — already using `Promise.all` ✅ | `blog.actions.ts` |
| `getAllReviews()` fetches ALL reviews, then filters verified in JS | `testimonials/page.tsx` |
| `getAllResources()` / `getAllProjects()` fetch full collection, no field projection | Both actions |
| No Next.js `cache()` wrapping for read actions — same data fetched N times per request if used in multiple places | All read actions |
| No `revalidate` strategy on static-safe pages (projects, resources, testimonials) | Pages missing `export const revalidate` |

### 2. MongoDB Indexing — Current Problems
| Model | Missing Indexes |
|---|---|
| `Project` | No indexes at all — `category` and `_id` sort queries hit full collection scan |
| `Resource` | No indexes at all — `category`, `isFree` filter queries hit full scan |
| `Review` | No indexes at all — `verified` filter in JS (post-fetch!) instead of DB query |
| `Order` | No index on `buyerEmail` — `getOrdersByEmail` hits full collection scan |
| `Lead` | `email` unique ✅ but no index on `status` for filtered queries |
| `BlogPost` | Good: slug, category, sourceUrl, isPublished, publishedAt, sourceArticleId all indexed ✅ |
| `NewsApiUsage` | No index on `date` — used in `$regex` query during every sync |
| `BlogSyncLock` | No index on `key` — looked up on every sync |

### 3. DSA (Data Serialization/Access) — Current Problems
| Issue | Location |
|---|---|
| `JSON.parse(JSON.stringify(doc))` everywhere — slow, double-passes all data | All actions |
| Mongoose `.lean()` not used in `getAllProjects`, `getAllResources`, `getAllReviews`, `getAllLeads`, `getAllOrders` | 5 action files |
| No field projection — fetching every field even when only a subset is needed | All `.find()` calls |
| `getAllReviews()` returns unverified reviews — server filters in the page component | `review.actions.ts` + `testimonials/page.tsx` |
| `Blog.find()` deduplication loop calls `BlogPost.findOne()` **inside a for loop** — N+1 DB calls | `blog.actions.ts` syncBlogArticles |
| `getRelatedBlogPosts` makes a second DB call to fill in gaps — can be merged into one query | `blog.actions.ts` |

### 4. Lazy Loading — Current State
| What exists | Status |
|---|---|
| Several homepage sections use `next/dynamic` ✅ | `app/(root)/page.tsx` |
| No `loading.tsx` Suspense boundaries for individual sections | Missing |
| No Intersection Observer / viewport-triggered loading for below-fold sections | Missing |
| `LatestBlogPosts` is dynamic on homepage but loads entire component at once | Could add skeleton |
| Images in testimonials use `next/image` with fixed width — no `loading="lazy"` attribute | `testimonials/page.tsx` |
| No `<Suspense>` wrapping around async Server Components | All pages |

---

## Proposed Changes

### Layer 1 — Database Indexing

#### [MODIFY] [project.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/project.model.ts)
- Add `index: true` on `category`
- Add compound index `{ category: 1, _id: -1 }` for sorted category queries

#### [MODIFY] [resource.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/resource.model.ts)
- Add `index: true` on `category` and `isFree`
- Add compound index `{ isFree: 1, category: 1, _id: -1 }`

#### [MODIFY] [review.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/review.model.ts)
- Add `index: true` on `verified`

#### [MODIFY] [order.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/order.model.ts)
- Add `index: true` on `buyerEmail`
- Add index on `resource` ref field (used in `$lookup`)
- Add index on `delivered` for filtered admin queries
- Add index on `createdAt` for sort

#### [MODIFY] [lead.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/lead.model.ts)
- Add `index: true` on `status` and `createdAt`

#### [MODIFY] [newsApiUsage.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/newsApiUsage.model.ts)
- Add `index: true` on `date` (used in `findOne` and `$regex` range queries)

#### [MODIFY] [blogSyncLock.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/database/models/blogSyncLock.model.ts)
- Add `index: true` on `key` (looked up on every sync operation)

---

### Layer 2 — DSA: Lean, Projection, DB-level filtering

#### [MODIFY] [project.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/project.actions.ts)
- Add `.lean()` to all `find`/`findById` queries
- Add `select()` projection: public list only needs `title, description, stack, image, url, category`
- Remove `JSON.parse(JSON.stringify(...))` — replace with typed lean result cast

#### [MODIFY] [resource.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/resource.actions.ts)
- Add `.lean()` to all queries
- Add projection for list views: omit heavy/unused fields

#### [MODIFY] [review.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/review.actions.ts)
- Add `getVerifiedReviews()` — filters `verified: true` **at DB level**, not in page component
- Add `.lean()` and projection: only `name, title, quote, image, verified`

#### [MODIFY] [lead.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/lead.actions.ts)
- Add `.lean()` to `getAllLeads()`

#### [MODIFY] [order.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/order.actions.ts)
- Add `.lean()` to `getOrdersByEmail()`

#### [MODIFY] [blog.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/actions/blog.actions.ts)
- **Fix N+1 in sync**: Replace per-article `BlogPost.findOne()` dedup check with a single `$in` batch lookup before the loop
- **Fix `getRelatedBlogPosts`**: Merge the two-query fallback pattern into one `$or` query with `$limit`
- Add `select()` projection to `getLatestBlogPosts` — omit `content` (large field, not needed on listing)
- Add `select()` projection to `getAllBlogPosts` listing — omit `content`

---

### Layer 3 — Data Fetching: React `cache()`, parallel fetching, revalidation

#### [NEW] [lib/cache.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/lib/cache.ts)
- Wrap all public read actions in Next.js `cache()` for request-level deduplication
- Exported as: `cachedGetAllProjects`, `cachedGetAllResources`, `cachedGetVerifiedReviews`, `cachedGetLatestBlogPosts`

#### [MODIFY] [app/(root)/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/page.tsx)
- Use cached action for projects fetch
- Add `export const revalidate = 3600` (1 hour) — projects/homepage data changes infrequently

#### [MODIFY] [app/(root)/projects/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/projects/page.tsx)
- Add `export const revalidate = 3600`
- Use cached action

#### [MODIFY] [app/(root)/resources/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/resources/page.tsx)
- Add `export const revalidate = 3600`
- Use cached action

#### [MODIFY] [app/(root)/testimonials/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/testimonials/page.tsx)
- Replace `getAllReviews()` + JS filter with `getVerifiedReviews()`
- Add `export const revalidate = 86400` (24hr — reviews change rarely)

---

### Layer 4 — Lazy Loading & Suspense

#### [MODIFY] [app/(root)/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/page.tsx)
- Wrap each dynamic section in `<Suspense fallback={<SectionSkeleton />}>`
- Already has `dynamic()` imports — add Suspense boundaries around async RSC sections

#### [NEW] [components/skeletons/SectionSkeleton.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/components/skeletons/SectionSkeleton.tsx)
- Generic dark-theme skeleton block for section-level Suspense fallbacks (animated pulse)

#### [NEW] [components/skeletons/BlogCardSkeleton.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/components/skeletons/BlogCardSkeleton.tsx)
- Blog card skeleton for `LatestBlogPosts` and `/blog` page Suspense fallback

#### [NEW] [components/skeletons/ProjectCardSkeleton.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/components/skeletons/ProjectCardSkeleton.tsx)
- Project card skeleton for `/projects` and homepage project section

#### [MODIFY] [components/LatestBlogPosts.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/components/LatestBlogPosts.tsx)
- Wrap in `<Suspense fallback={<BlogCardSkeleton />}>`

#### [MODIFY] [app/(root)/blog/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/blog/page.tsx)
- Add `export const revalidate = 1800` (30min — blog updates via cron)
- Wrap grid section in Suspense

#### [MODIFY] [app/(root)/testimonials/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/artistycode-studio/app/(root)/testimonials/page.tsx)
- Add `loading="lazy"` to review avatar images

---

## Verification Plan

### Automated
```bash
npm run build
```
- Build must pass with zero TypeScript errors
- All pages must render (static/ISR) without prerender errors

### Manual
1. Open DevTools → Network → filter by "Fetch/XHR" — confirm no redundant DB calls on homepage
2. MongoDB Atlas → Performance Advisor should show 0 "collscan" warnings after index changes
3. Chrome Lighthouse — check LCP and TBT improvement from Suspense + lazy loading
4. Confirm `/blog`, `/projects`, `/resources`, `/testimonials` render with skeleton states briefly visible on first cold load

---

## Execution Order
1. DB Models (indexing — no app code affected)
2. DSA layer (actions — lean, projection, DB-level filter)
3. `lib/cache.ts` (React cache wrappers)
4. Skeleton components (UI — no logic dependency)
5. Page-level wiring (revalidate + cache + Suspense)
6. Build & verify
