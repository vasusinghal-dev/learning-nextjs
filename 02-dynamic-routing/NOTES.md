# ⭐ **Next.js App Router — Dynamic Routing**

---

## 1️⃣ `[id]` → **Required single segment** ✅

```
app/blog/[id]/page.tsx
```

### Matches

- `/blog/123`
- `/blog/hello`

### Does NOT match

- `/blog`
- `/blog/123/extra`

👉 **Exactly ONE segment (required)**

```ts
params.id; // string
```

### Use cases

- blog post
- product page
- user profile

---

## 2️⃣ `[...id]` → **Required catch-all** ✅

```
app/docs/[...id]/page.tsx
```

### Matches

- `/docs/a`
- `/docs/a/b`
- `/docs/a/b/c`

### Does NOT match

- `/docs`

👉 **One or more segments required**

```ts
params.id; // string[]
```

### Use cases

- docs
- wiki
- nested categories

---

## ❌ What is NOT supported in App Router

| Pattern     | Status           |
| ----------- | ---------------- |
| `[[id]]`    | ❌ Not supported |
| `[[...id]]` | ❌ Not supported |

> These only work in the **Pages Router (`pages/`)**, not `app/`.

---

## ✅ How to replace optional routes (App Router way)

### ❌ Old Pages Router idea

```
/profile
/profile/123
```

### ✅ App Router solution #1: split routes

```
app/profile/page.tsx
app/profile/[id]/page.tsx
```

### ✅ App Router solution #2: use search params

```
/profile
/profile?id=123
```

```tsx
export default function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return <div>{searchParams.id ?? "No ID"}</div>;
}
```

---

## 🧠 **Correct Mental Model (App Router)**

- `[]` → dynamic segment
- `...` → multiple segments
- **optional behavior → search params**
- **optional folders → not allowed**

If it’s optional → **it belongs in the URL query**, not the folder.

---

## 📌 **Real-World Mapping (App Router)**

| Requirement           | Correct Pattern |
| --------------------- | --------------- |
| Required ID           | `[id]`          |
| Nested paths          | `[...slug]`     |
| Optional filter       | `?filter=value` |
| Optional page variant | separate route  |

---

# ⭐ **Next.js Handling Pages — Loading, Error & Not Found**

---

## ⏳ **1️⃣ `loading.tsx` → Waiting State**

Used when a route is **loading or streaming data**.

```
app/loading.tsx
app/todos/loading.tsx
```

---

### Example

```tsx
export default function Loading() {
  return <h1>Loading...</h1>;
}
```

---

### Key Points

- Server Component
- No props
- Auto-shown during fetch / suspense
- Closest `loading.tsx` wins

---

## ❌ **2️⃣ `error.tsx` → Runtime Errors**

Catches **runtime crashes** in a route segment.

```
app/error.tsx
app/todos/error.tsx
```

---

### Example

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </>
  );
}
```

---

### Key Points

- MUST be a Client Component
- Catches thrown errors & failed fetches
- `reset()` retries the route
- Does NOT catch build/syntax errors

---

## 🚫 **3️⃣ `not-found.tsx` → Missing Page / Data**

Used for **404 handling**.

```
app/not-found.tsx
app/todos/[id]/not-found.tsx
```

---

### Example

```tsx
export default function NotFound() {
  return <h2>Page not found</h2>;
}
```

---

### Trigger Manually

```ts
import { notFound } from "next/navigation";

notFound();
```

Used when:

- resource doesn’t exist
- invalid dynamic param

---

## 🧠 **Scope Resolution Rule**

| File Location                  | Scope         |
| ------------------------------ | ------------- |
| `app/loading.tsx`              | Entire app    |
| `app/error.tsx`                | Entire app    |
| `app/not-found.tsx`            | Entire app    |
| `app/todos/loading.tsx`        | `/todos/*`    |
| `app/todos/[id]/not-found.tsx` | `/todos/[id]` |

👉 **Nearest file wins**

---

# ⭐ **Next.js `searchParams` (App Router)**

---

## 📌 What are `searchParams`?

`searchParams` represent **URL query parameters**.

```
/todos?completed=true&page=2
```

Here:

```txt
completed = "true"
page = "2"
```

They are **NOT part of the route path**.

---

## 📍 Where `searchParams` are available

Available only in:

- `page.tsx`
- `layout.tsx`
- `generateMetadata()`

❌ Not available in normal Server Components
❌ Not available in Client Components (use `useSearchParams()` instead)

---

## ✅ Using `searchParams` (Latest App Router)

In the **latest Next.js**, `searchParams` behave like `params` and must be unwrapped.

### Pattern 1️⃣: Promise + `await` (safe in dev)

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string }>;
}) {
  const { completed } = await searchParams;
  return <div>{completed}</div>;
}
```

---

### Pattern 2️⃣: `React.use()` (future-leaning)

```tsx
import { use } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { completed?: string };
}) {
  const { completed } = use(searchParams);
  return <div>{completed}</div>;
}
```

---

## ⚠️ Important Rules

- All values are **strings**
- Params are **optional**
- Must be type-converted manually
- Treated as **dynamic async APIs**

```ts
Number(searchParams.page ?? 1);
```

---

## 📌 Real-World Use Cases

| Use Case   | Example           |
| ---------- | ----------------- |
| Filtering  | `?completed=true` |
| Pagination | `?page=2`         |
| Sorting    | `?sort=asc`       |
| Search     | `?q=react`        |

---

# ⭐ **Dynamic Routing + Metadata**

---

## 📌 Static Metadata (per route)

```tsx
export const metadata = {
  title: "Todos",
  description: "Todo list page",
};
```

- Works for static routes
- Resolved at build time

---

## 📌 Dynamic Metadata (based on route params)

Used when metadata depends on **dynamic routes**.

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Todo ${id}`,
    description: `Details for todo ${id}`,
  };
}
```

---

## 📌 Real-World Examples

| Page Type    | Metadata Source |
| ------------ | --------------- |
| Blog post    | slug / id       |
| Product page | product data    |
| User profile | username / id   |

---

# ⭐ **`notFound()` in Dynamic Routes**

---

## 📌 What is `notFound()`?

A function used to **trigger a 404 state manually**.

```ts
import { notFound } from "next/navigation";
```

---

## ✅ Usage in Dynamic Routes

```ts
async function getTodo(id: string) {
  const res = await fetch(`/api/todos/${id}`);

  if (!res.ok) {
    notFound();
  }

  return res.json();
}
```

---

## 🧠 What happens when `notFound()` is called?

- Stops rendering immediately
- Shows nearest `not-found.tsx`
- Returns correct HTTP 404

---

## 📌 Scope Resolution

```
app/todos/[id]/not-found.tsx  ← used first
app/not-found.tsx             ← fallback
```

Nearest file always wins.

---

# ⭐ **Suspense vs `loading.tsx`**

---

## 🧠 Core Difference

| Feature | `Suspense`      | `loading.tsx` |
| ------- | --------------- | ------------- |
| Scope   | Component-level | Route-level   |
| Trigger | Async component | Route loading |
| Control | Manual          | Automatic     |
| Re-run  | Via `key`       | On navigation |

---

## 📌 When to use `Suspense`

Use when you want **partial loading**.

```tsx
<Suspense fallback={<p>Loading list...</p>}>
  <TodosList />
</Suspense>
```

✔ Keeps rest of page visible
✔ Best for filters & streaming

---

## 📌 When to use `loading.tsx`

Use when **entire route is loading**.

```tsx
app / todos / loading.tsx;
```

✔ Automatic
✔ Simple
✔ No JSX wrapping

---

## 🎯 Best Practice

- Use `loading.tsx` for **page-level loading**
- Use `Suspense` for **component-level loading**
- Combine both when needed
