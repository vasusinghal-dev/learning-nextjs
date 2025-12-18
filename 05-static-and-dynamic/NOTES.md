# Static vs Dynamic Rendering

---

## 1. Default rule (most important)

> **Everything is STATIC by default in production.**

If Next.js cannot _prove_ a route is dynamic, it will:

- Pre-render it at **build time**
- Cache the HTML
- Serve it forever

Dev mode does **not** reflect this behavior.

---

## 2. What “Static” really means

### Static Route

- Rendered **at build time**
- Same HTML for all users
- No server execution per request
- Extremely fast

### Triggers static rendering

- No cookies
- No headers
- No dynamic fetch
- No `noStore()`
- No `force-dynamic`
- Pure render logic

```ts
export default function Page() {
  return <h1>Hello</h1>;
}
```

---

## 3. What “Dynamic” really means

### Dynamic Route

- Rendered **on every request**
- Server runs per request
- HTML may differ per user
- Slower but correct

Dynamic rendering is **opt-in or inferred**.

---

## 4. Signals that FORCE dynamic rendering

Any ONE of these makes the route dynamic:

### Explicit

```ts
export const dynamic = "force-dynamic";
```

### Fetch-level

```ts
fetch(url, { cache: "no-store" });
```

### Request-based

```ts
cookies();
headers();
```

### Dynamic params (without static params)

```
/todos/[id]
```

If Next.js does not know all possible param values at build time, it must render dynamically.

---

## 5. `generateStaticParams` (Dynamic routes → Static pages)

> **`generateStaticParams` tells Next.js all valid route params at build time.**

This allows **dynamic routes** to become **static**.

### Example

```ts
// app/todos/[id]/page.tsx
export async function generateStaticParams() {
  const todos = await getTodos();

  return todos.map((todo) => ({
    id: String(todo.id),
  }));
}
```

### Effect

- `/todos/[id]` becomes **static**
- HTML is generated at **build time**
- Route changes from `ƒ` → `○`

Build output changes from:

```
ƒ /todos/[id]
```

to:

```
○ /todos/1
○ /todos/2
○ /todos/3
```

---

### Important rules for `generateStaticParams`

- Runs **only at build time**
- Cannot use:

  - `cookies()`
  - `headers()`
  - request-specific data

- Params must be **finite and known**
- Missing params → **404**

---

## 6. `dynamicParams` (Control fallback behavior)

```ts
export const dynamicParams = false; // default: true
```

> **`dynamicParams` controls whether params NOT returned by `generateStaticParams` are allowed.**

It does **NOT** control caching.
It does **NOT** control ISR.
It controls **what happens when an unknown param is requested**.

---

### Default: `dynamicParams = true`

```ts
export const dynamicParams = true;
```

- Params returned by `generateStaticParams` → **static**
- Any other param → **rendered dynamically**

Example:

```ts
generateStaticParams() → [{ id: "1" }, { id: "2" }]
```

Requests:

- `/todos/1` → static
- `/todos/2` → static
- `/todos/3` → **dynamic render**

Build output:

```
○ /todos/1
○ /todos/2
ƒ /todos/[id]
```

This is equivalent to **fallback behavior enabled**.

---

### `dynamicParams = false`

```ts
export const dynamicParams = false;
```

- ONLY params returned by `generateStaticParams` are valid
- Any unknown param → **404**
- No dynamic fallback

Same example:

```ts
generateStaticParams() → [{ id: "1" }, { id: "2" }]
```

Requests:

- `/todos/1` → static
- `/todos/2` → static
- `/todos/3` → ❌ 404

Build output:

```
○ /todos/1
○ /todos/2
```

This is equivalent to **strict static routing**.

---

### When to use `dynamicParams = false`

Use when:

- All valid params are known
- URLs should be strict
- SEO correctness matters
- Blog, docs, product pages

Avoid when:

- Params are user-generated
- IDs are infinite or unknown
- New content appears without rebuild

---

### Interaction with `revalidate`

```ts
export const revalidate = 60;
export const dynamicParams = false;
```

- Pages are static
- Content revalidates
- **New params will NOT appear**
- Rebuild required for new routes

---

### Mental model (important)

```
generateStaticParams → WHAT routes exist
dynamicParams       → allow unknown routes?
revalidate          → WHEN content updates
```

---

## 7. `revalidate` (ISR – Incremental Static Regeneration)

### `revalidate > 0`

```ts
export const revalidate = 5;
```

- Static at build time
- Cached HTML reused
- Re-generated in background after 5s
- Best for public data

Works **with** `generateStaticParams`.

---

### `revalidate = 0`

```ts
export const revalidate = 0;
```

- No static cache
- Rendered every request
- Behaves like dynamic
- Weaker than `force-dynamic`

---

## 8. Priority order (this matters)

If multiple configs exist, **strongest wins**:

```
fetch(no-store)
  > dynamic = "force-dynamic"
    > revalidate = 0
      > revalidate > 0
        > default static
```

One `no-store` fetch can flip an entire route to dynamic.

---

## 9. Dev mode vs Production (critical)

### Dev mode

- Always dynamic
- No aggressive caching
- Misleading by design

### Production

- Static by default
- Aggressive caching
- Build output is the truth

Always check:

```bash
next build
```

---

## 10. Build output symbols (truth table)

```
○  Static (build-time HTML)
ƒ  Dynamic (per-request render)
```

Example:

```
○ /revalidate-5
○ /todos/1
ƒ /dynamic
```

---

## 11. When to use what (practical)

### Use STATIC when:

- Content is public
- Data rarely changes
- SEO matters
- Performance matters

### Use ISR when:

- Data changes occasionally
- Stale data is acceptable briefly
- Blogs, listings

### Use DYNAMIC when:

- User-specific data
- Auth/session
- Real-time data
- Per-request logic

---

## 12. Best practice rules

✔ Prefer static <br>
✔ Use `generateStaticParams` for dynamic routes with known params <br>
✔ Combine `generateStaticParams + revalidate` for best performance <br>
✔ Push `force-dynamic` as low as possible <br>
✔ Trust build output, not dev behavior

---

### One-line mental model (final lock)

> **`generateStaticParams` decides _WHAT pages exist_. <br> > `revalidate` decides _WHEN they update_. <br> > `dynamic/no-store` decides _IF caching is allowed_.**
