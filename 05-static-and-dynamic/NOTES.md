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

---

## 5. `revalidate` (ISR – Incremental Static Regeneration)

### `revalidate > 0`

```ts
export const revalidate = 5;
```

- Static at build time
- Cached HTML reused
- Re-generated in background after 5s
- Best for public data

### `revalidate = 0`

```ts
export const revalidate = 0;
```

- No static cache
- Rendered every request
- Behaves like dynamic
- Weaker than `force-dynamic`

---

## 6. Priority order (this matters)

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

## 7. Dev mode vs Production (critical)

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

## 8. Build output symbols (truth table)

```
○  Static (build-time HTML)
ƒ  Dynamic (per-request render)
```

Example:

```
○ /revalidate-5
ƒ /dynamic
ƒ /todos/[id]
```

---

## 9. When to use what (practical)

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
- Randomness / timestamps

---

## 10. Best practice rules

✔ Prefer static <br>
✔ Use ISR over dynamic when possible <br>
✔ Push `force-dynamic` as low as possible <br>
✔ Trust build output, not dev behavior
