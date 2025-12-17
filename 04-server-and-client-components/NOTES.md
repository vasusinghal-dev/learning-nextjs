# Server Components vs Client Components

---

## 1. Default rule (most important)

> **Every component is a Server Component by default.**

You only get a Client Component when you **explicitly opt in**.

```ts
"use client";
```

No directive → Server Component.

---

## 2. What a Server Component is

### Definition

A component that:

- Runs on the **server**
- Produces **HTML + RSC payload**
- Does **not ship JS** to the browser

### Can do

- `fetch()` (with caching, revalidation)
- Access DB directly
- Use secrets / env vars
- Use `cookies()`, `headers()`
- Use `async / await`
- Use `Suspense` for **data streaming**

```tsx
export default async function TodosList() {
  const todos = await getTodos();
  return <ul>{/* render */}</ul>;
}
```

### Cannot do

- `useState`, `useEffect`
- Event handlers
- `window`, `document`
- Browser APIs

---

## 3. What a Client Component is

### Definition

A component that:

- **Can run in the browser**
- Is **hydrated** after server render
- Ships JavaScript to the client

```ts
"use client";

export default function TodoItem() {
  return <li onClick={...}>Todo</li>;
}
```

### Can do

- `useState`, `useEffect`
- Event handlers
- Browser APIs
- Animations
- UI interactions

### Cannot do

- Direct DB access
- `cookies()`, `headers()`
- Server Actions (directly)
- Server-only utilities

---

## 4. Initial render vs navigation (critical)

### Initial request (hard refresh / direct URL)

```
Server:
  Server Components render
  Client Components render (for HTML)

Browser:
  Client Components hydrate
```

### Client navigation (`<Link />`)

```
Server:
  Server Components render

Browser:
  Client Components render + hydrate
```

> **Client Components may skip server render on navigation if HTML is reusable.**

---

## 5. Hydration (what it actually means)

> **Hydration = attaching interactivity to server-rendered HTML**

- HTML already exists
- JS attaches behavior
- `useEffect` runs only after hydration

```ts
useEffect(() => {
  console.log("hydrated");
}, []);
```

Runs **only in browser**.

---

## 6. Client boundary propagation

### Rule

> **Once you enter a Client Component, everything inside it becomes client.**

```
Server
 └─ Client
     └─ Client
```

You **cannot** go back to server inside.

---

## 7. Children do NOT automatically become client

```tsx
// Server Component
<TodoItem>
  <Child />
</TodoItem>
```

> **Children are rendered where they are created, not where they are used.**

Result:

- `Child` → Server Component
- `TodoItem` → Client Component

This is intentional and powerful.

---

## 8. Suspense behavior

### Server Components

- Suspends for **data fetching**
- Streams HTML
- Works on refresh & navigation

### Client Components

- Suspends only for:

  - `React.lazy`
  - code splitting

- ❌ Does NOT suspend for data

---

## 9. Caching interaction

- Server Components:

  - participate in **Request Memoization**
  - use **Data Cache**
  - support `revalidate`

- Client Components:

  - no server cache
  - rely on client state or libraries

---

## 10. Server-only vs Client-only utilities

### Server-only (reliable)

```ts
import "server-only";
```

- Enforced at build time
- Use for DB, auth, secrets

### Client-only (not reliable)

- Exists but **not enforced consistently**
- Do **not** depend on it

### Real client fence

```ts
"use client";
```

---

## 11. Practical architecture rules (use these)

✔ Keep Client Components **as low as possible** <br>
✔ Fetch data in **Server Components** <br>
✔ Pass data **down** to Client Components <br>
✔ Use Client Components for:

- clicks
- animations
- forms
- local state

---

## 12. One-page mental summary

> **Server Components = data, structure, security** > **Client Components = interaction, state, effects**

> **Server renders everything once.
> Client hydrates what needs behavior.**

---
