# ⭐ **Next.js Caching**

---

## 📌 Overview

Next.js is **heavily cached by default** to improve performance and reduce cost.

There are **4 main caching mechanisms** in Next.js:

1️⃣ Request Memoization <br>
2️⃣ Data Cache <br>
3️⃣ Full Route Cache <br>
4️⃣ Router Cache

![types_of_caching](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fcaching-overview.png&w=3840&q=75)

---

# 1️⃣ **Request Memoization**

## 📌 What is Request Memoization?

**Request Memoization** means, during a **single render/request**, identical data requests are executed **only once**, and the result is reused.

This prevents **duplicate work** inside the same request lifecycle.

![request_memoization](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fdeduplicated-fetch-requests.png&w=3840&q=75)

---

## 🧠 How it works

![request_memoization_working](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Frequest-memoization.png&w=3840&q=75)

---

## 🧠 Where it works

✔ Server Components <br>
✔ Layouts <br>
✔ Pages <br>
✔ `generateMetadata()` <br>
✔ `generateStaticParams()`

❌ Route Handlers <br>
❌ Client Components

---

## 🧪 Default behavior (automatic)

```ts
async function getTodos() {
  return fetch("https://api.com/todos").then((res) => res.json());
}

const todos1 = await getTodos();
const todos2 = await getTodos(); // reused, not re-fetched
```

✔ Only **one fetch request**
✔ Happens **automatically**

---

## ⏱ Scope & Duration

| Property              | Value          |
| --------------------- | -------------- |
| Cache lifetime        | Single request |
| Shared across users   | ❌ No          |
| Shared across reloads | ❌ No          |
| Needs configuration   | ❌ No          |

Once rendering finishes, the cache is **cleared**.

---

## 📌 What exactly is memoized?

- `fetch()` calls (GET / HEAD only)
- Same URL + same options

⚠️ Your **function is NOT memoized** by default — only the fetch.

---

## 📌 Manual memoization using `cache()`

Use `cache()` when you want to memoize **any async function**, not just `fetch`.

```ts
import { cache } from "react";

const getTodos = cache(async () => {
  return fetch("https://api.com/todos").then((res) => res.json());
});
```

✔ Function runs once per request
✔ Subsequent calls reuse result

---

## 🧠 When to use `cache()`

Use it for:

- database queries
- CMS clients
- GraphQL clients
- expensive computations

Do NOT use it for:

- user-specific data
- data that must be fresh per request

---

## ❌ What Request Memoization is NOT

| Expectation            | Reality |
| ---------------------- | ------- |
| Persistent cache       | ❌      |
| Shared across requests | ❌      |
| Time-based             | ❌      |
| Needs revalidation     | ❌      |

---

## 🎯 Mental Model

```
Request Memoization
= avoid duplicate work during one render
```

Think:

> “Don’t do the same thing twice **in the same request**.”

---

Perfect. Here are **clean, revision-ready notes for Data Cache**, written in the **same style and level** as your Request Memoization notes.
You can paste this directly into `NOTES.md`.

---

# 2️⃣ **Data Cache**

## 📌 What is the Data Cache?

The **Data Cache** stores the result of **server-side `fetch()` calls** so they can be reused:

- across **multiple user requests**
- across **page reloads**
- across **deployments** (unless invalidated)

---

## 🧠 Where it works

✔ Server Components <br>
✔ Layouts <br>
✔ Pages <br>
✔ `generateMetadata()` <br>
✔ `generateStaticParams()`

❌ Client Components <br>
❌ Route Handlers (do not affect Router Cache immediately)

---

## 📌 Default behavior (important)

When using `fetch()` **on the server**:

| Scenario      | Behavior                  |
| ------------- | ------------------------- |
| Static route  | Data is cached            |
| Dynamic route | Data fetched per request  |
| Dev mode      | Cache behavior is relaxed |
| Prod mode     | Cache works fully         |

---

## 📌 Basic cached fetch

```ts
await fetch("https://api.com/posts", {
  cache: "force-cache",
});
```

✔ Stored in Data Cache
✔ Reused across requests

---

## ❌ Opt out of Data Cache

```ts
await fetch("https://api.com/posts", {
  cache: "no-store",
});
```

Use when:

- data is user-specific
- data must always be fresh
- auth/session-based data

![data_cache_working](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fdata-cache.png&w=3840&q=75)

---

## ⏱ Time-based Revalidation (ISR)

Use when data changes **occasionally**.

```ts
await fetch("https://api.com/posts", {
  next: { revalidate: 3600 }, // seconds
});
```

### What happens:

1. First request → fetch & cache
2. Requests within 1 hour → cached data
3. After 1 hour:

   - stale data is returned
   - fresh data is fetched in background

4. Cache updates silently

➡ **stale-while-revalidate**

![reavlidation_working](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Ftime-based-revalidation.png&w=3840&q=75)

---

## 🔔 On-demand Revalidation

Used when data changes due to an **event**.

### Revalidate by path

```ts
revalidatePath("/posts");
```

### Revalidate by tag

```ts
revalidateTag("posts");
```

Used in:

- Server Actions
- Route Handlers (webhooks)

---

## 🧠 Tags-based caching

```ts
await fetch("https://api.com/posts", {
  next: { tags: ["posts"] },
});
```

Later:

```ts
revalidateTag("posts");
```

✔ Fine-grained invalidation <br>
✔ Ideal for CMS content

![reavlidation_tags](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fon-demand-revalidation.png&w=3840&q=75)

---

## 🧱 Route Segment Cache Controls (Page / Layout Level)

These exports define **default caching behavior for all server data used in a route segment** (page + nested layouts).

---

### ⏱ `export const revalidate = 60`

```ts
export const revalidate = 60;
```

**What it does:**

- Sets a **default revalidation time (ISR)** for:

  - all `fetch()` calls
  - `generateMetadata()`
  - `generateStaticParams()`

- Applies **only if fetch does NOT override it**

**Effect:**

- Data is cached
- Cache is considered stale after 60 seconds
- Uses **stale-while-revalidate**

✅ Data Cache → enabled <br>
✅ Full Route Cache → enabled <br>
❌ Per-request fetching

---

### 🧊 `export const dynamic = "force-static"`

```ts
export const dynamic = "force-static";
```

**What it does:**

- Forces the route to be treated as **static**
- Allows:

  - Data Cache
  - Full Route Cache

- Even if Next _thinks_ it should be dynamic

**Use when:**

- Data is public
- No cookies / headers / auth
- You want **maximum caching**

---

### 🔥 `export const dynamic = "force-dynamic"`

```ts
export const dynamic = "force-dynamic";
```

**What it does:**

- Forces the route to be treated as **fully dynamic**
- Disables:

  - Data Cache
  - Full Route Cache
  - ISR

**Effect:**

- All server logic runs **on every request**
- All `fetch()` behave like `cache: "no-store"`
- Soft refresh = refetch
- Hard refresh = refetch

**Use when:**

- Auth / session-based pages
- Dashboards
- Admin panels
- User-specific data

❌ Data Cache → disabled <br>
❌ Full Route Cache → disabled <br>
✅ Per-request fetching

---

### ⚠️ Important Interactions (READ THIS ONCE, NEVER FORGET)

#### `force-static` + `revalidate`

```ts
export const dynamic = "force-static";
export const revalidate = 60;
```

➡ Route becomes:

- **Static**
- **ISR-enabled**
- Cached HTML + cached data
- Revalidated every 60 seconds

✅ Classic ISR setup (App Router)

---

#### `force-dynamic` overrides everything

```ts
export const dynamic = "force-dynamic";
export const revalidate = 60; // ignored
```

➡ Result:

- Route is dynamic
- No caching
- `revalidate` is ignored

---

## 🧠 One-line mental model

```
force-static  → allow caching
revalidate    → time-based caching
force-dynamic → disable all caching
```

---

## ⏱ Duration

| Property              | Value      |
| --------------------- | ---------- |
| Cache lifetime        | Persistent |
| Shared across users   | ✅ Yes     |
| Shared across reloads | ✅ Yes     |
| Revalidation needed   | Optional   |

---

## ❌ What Data Cache is NOT

| Expectation       | Reality |
| ----------------- | ------- |
| Per-request only  | ❌      |
| Client-side cache | ❌      |
| Auto-refreshing   | ❌      |
| For user data     | ❌      |

---

## 🧠 Relationship with other caches

- Revalidating Data Cache ⟶ invalidates **Full Route Cache**
- Opting out of Data Cache ⟶ route becomes **dynamic**
- Router Cache is NOT immediately affected by Route Handlers

---

## 🎯 Mental Model

```
Request Memoization → same request
Data Cache          → across requests
```

Or:

> **Data Cache = “Remember fetched data for future requests.”**

---

# 3️⃣ **Full Route Cache**

## 📌 What is the Full Route Cache?

The **Full Route Cache** stores:

- Rendered **HTML**
- **React Server Component (RSC) payload**

So when the same route is requested again, Next.js can:

- skip server rendering
- serve the cached result instantly

![full_route_cache](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Ffull-route-cache.png&w=3840&q=75)

---

## 🧠 Where it works

✔ Entire routes (`page.tsx`) <br>
✔ Layouts <br>
✔ Static route segments

❌ Client Components <br>
❌ Dynamic routes (by default)

---

## 📌 Default behavior

| Route Type        | Full Route Cache |
| ----------------- | ---------------- |
| Static route      | ✅ Cached        |
| Dynamic route     | ❌ Not cached    |
| Revalidated route | ✅ Cached        |
| Dev mode          | ⚠️ Limited       |

> By default, **Next.js tries to statically cache routes** whenever possible.

---

## 📌 What makes a route **STATIC**

A route is static if it **does NOT use dynamic APIs**, such as:

- `searchParams`
- `cookies`
- `headers`
- `fetch({ cache: "no-store" })`
- `dynamic = "force-dynamic"`

Static routes are: <br>
✔ rendered once <br>
✔ cached <br>
✔ reused across users

---

## 📌 What makes a route **DYNAMIC**

Using **any** of the following opts the route out:

```ts
export default async function Page({ searchParams }) {}
```

```ts
cookies();
headers();
```

```ts
fetch(url, { cache: "no-store" });
```

```ts
export const dynamic = "force-dynamic";
```

Dynamic routes:
❌ not cached
✔ rendered on every request

---

## 📌 Relationship with Data Cache

This is **very important**:

> **Full Route Cache depends on Data Cache**

- Cached data ⟶ cached route
- Revalidated data ⟶ route re-rendered
- Uncached data ⟶ route becomes dynamic

---

## 🔁 Revalidation behavior

If a route uses **time-based revalidation**:

```ts
fetch(url, {
  next: { revalidate: 60 },
});
```

Then:

1. Route is cached
2. Cached route served
3. After 60s → background re-render
4. Cache updated silently

➡ Same ISR behavior as Pages Router

---

## ⛔ Opting out explicitly

### Force dynamic rendering

```ts
export const dynamic = "force-dynamic";
```

### Disable caching completely

```ts
export const revalidate = 0;
```

Both:

- disable Full Route Cache
- render route on every request

---

## 📌 Deployment behavior

| Action         | Effect                 |
| -------------- | ---------------------- |
| New request    | Uses cached route      |
| Revalidate     | Route cache updated    |
| New deployment | ❌ Route cache cleared |

⚠️ Unlike Data Cache, **Full Route Cache is cleared on redeploy**.

---

## 🧠 Mental Model

```
Request Memoization → avoid duplicate work
Data Cache          → cache fetched data
Full Route Cache    → cache rendered page
```

Or simply:

> **Full Route Cache = “Remember the page output.”**

---

## ❌ What Full Route Cache is NOT

| Expectation               | Reality |
| ------------------------- | ------- |
| Client-side cache         | ❌      |
| Per-user cache            | ❌      |
| Persistent across deploys | ❌      |
| Works with dynamic APIs   | ❌      |

---

# 4️⃣ **Router Cache**

## 📌 What is the Router Cache?

The **Router Cache** stores:

- React Server Component (RSC) payloads
- Split by:

  - layouts
  - pages
  - loading states

This allows Next.js to:

- avoid re-requesting data from the server
- reuse previously visited routes
- enable instant navigation

![router_cache](https://velog.velcdn.com/images/j_wisdom_h/post/a1f72b52-24d0-466a-ad5d-8ec4ac5a5246/image.png)

---

## 🧠 Where it works

✔ Client-side only <br>
✔ During navigation (`<Link>`, `router.push`) <br>
✔ Back / forward navigation

❌ Page refresh <br>
❌ New browser session

---

## 📌 What the Router Cache enables

- Instant back/forward navigation
- No full page reload between routes
- Layout persistence
- Preserved React state in shared layouts

---

## 📌 Default behavior

| Segment Type      | Cached             |
| ----------------- | ------------------ |
| Layouts           | ✅ Yes             |
| Loading states    | ✅ Yes             |
| Pages             | ❌ No (by default) |
| Prefetched routes | ✅ Yes             |

> Pages are reused only for **back/forward navigation**, not general caching.

---

## ⏱ Cache duration

Router Cache lives in **browser memory**.

It is cleared when:

- the page is refreshed
- the tab is closed
- the session ends

---

## 📌 Prefetching and Router Cache

By default, `<Link>` **prefetches routes** when visible in the viewport.

```tsx
<Link href="/posts">Posts</Link>
```

This:

- fetches RSC payload in advance
- stores it in Router Cache
- makes navigation instant

---

## ❌ Disable prefetching

```tsx
<Link href="/posts" prefetch={false}>
  Posts
</Link>
```

Use when:

- page is heavy
- route is rarely visited
- dynamic content

---

## 🔁 Manual Router Cache APIs

### Prefetch manually

```ts
router.prefetch("/posts");
```

Adds route to Router Cache ahead of time.

---

### Refresh Router Cache

```ts
router.refresh();
```

What it does:

- clears Router Cache
- refetches current route from server
- preserves browser & React state

❌ Does NOT invalidate Data Cache <br>
❌ Does NOT invalidate Full Route Cache

---

## 🧠 Router Cache vs other caches

| Cache               | Location | Purpose              |
| ------------------- | -------- | -------------------- |
| Request Memoization | Server   | Avoid duplicate work |
| Data Cache          | Server   | Cache fetched data   |
| Full Route Cache    | Server   | Cache rendered pages |
| Router Cache        | Client   | Fast navigation      |

---

## 🔔 Invalidation triggers

Router Cache is invalidated when:

- `router.refresh()` is called
- `revalidatePath()` is used in a Server Action
- `revalidateTag()` is used in a Server Action
- `cookies.set()` / `cookies.delete()` is called
- page refresh happens

---

## 🧠 Mental Model

```
Router Cache
= remember routes during navigation
```

Or:

> **“If I’ve already been there, don’t ask the server again.”**

---

## ❌ What Router Cache is NOT

| Expectation                | Reality |
| -------------------------- | ------- |
| Persistent cache           | ❌      |
| Server-side cache          | ❌      |
| Shared across users        | ❌      |
| Replacement for Data Cache | ❌      |
