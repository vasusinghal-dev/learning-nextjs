# ⭐ **NEXT.JS REVISION NOTES**

---

# 📌 **1. What is Next.js?**

Next.js is a **React framework** that provides:

- File-based routing
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Server Components
- Automatic optimization
- Full-stack capabilities

It combines **frontend + backend** inside one React project.

---

# 📁 **2. Two Routing Systems**

Next.js used to have **two routes**:

### **1️⃣ Pages Router (OLD)**

- Uses `pages/` folder
- Uses `getServerSideProps`, `getStaticProps`
- Works like CRA + Router
- Legacy, NOT recommended

### **2️⃣ App Router (NEW, RECOMMENDED)**

- Uses `app/` folder
- File-based routing
- Server Components
- Layouts
- Server Actions
- Better data fetching
- Modern rendering model

---

# 🧭 **3. Routing Basics (App Router)**

### ✔ Folder = URL segment

`app/about/page.tsx` → `/about`

### ✔ `page.tsx` = route entry

Required for each route.

### ✔ `layout.tsx` = wrapper layout

Defines HTML structure and shared UI.

### ✔ Nested routes

```
app/dashboard/settings/page.tsx → /dashboard/settings
```

---

# 🔁 **4. Nested Layouts**

Layouts wrap everything in their folder.

Example:

```
app/dashboard/layout.tsx → wraps ALL dashboard pages
```

Root layout (`app/layout.tsx`) is **required**.

---

# ⚡ **5. Server vs Client Components**

### **Server Component (default)**

- No “use client”
- Runs on the server
- Can access DB, filesystem
- Faster, more secure
- Cannot use hooks like useState/useEffect

### **Client Component**

- Must include `"use client"` at top
- Runs in browser
- Can use interactivity
- Required for event handlers

Layouts should ideally be **Server Components** unless interactivity is needed.

---

# 🧪 **6. Special Route Files**

Inside any route folder you may use:

| File            | Purpose                  |
| --------------- | ------------------------ |
| `page.tsx`      | Required route component |
| `layout.tsx`    | Wrapper layout           |
| `loading.tsx`   | Loading UI               |
| `error.tsx`     | Error UI                 |
| `not-found.tsx` | 404 page                 |
| `route.ts`      | API route handler        |

---

# 🛣 **7. Navigation with `<Link>`**

```tsx
<Link href="/dashboard">Dashboard</Link>
```

### Relative routes:

```tsx
<Link href="settings">      → /dashboard/settings
<Link href="./settings">    → always relative
<Link href="/settings">     → root
```

`"./"` is the **safest** inside nested layouts.

---

# 🚦 **8. Prefetching**

Next.js automatically prefetches pages when links appear in the viewport.

Turn off with:

```tsx
<Link href="/settings" prefetch={false}>
  Settings
</Link>
```

Use for:

- heavy pages
- rare pages
- dynamic lists

---

# 📄 **9. No index.html in Next.js**

Next.js handles HTML rendering internally.

- `layout.tsx` → `<html>` + `<body>` wrapper
- `page.tsx` → actual page content

No `public/index.html` like CRA.

---

# 🚀 **10. When to Use Client Component Layout**

Only when layout needs:

- Sidebar toggle
- Interactivity
- Local state
- Animations

Otherwise, keep it **server** for better performance.

---

# 🎯 **11. Key Differences: Pages vs App Router**

| Feature       | Pages               | App                     |
| ------------- | ------------------- | ----------------------- |
| Folder        | `/pages`            | `/app`                  |
| Type          | Client-first        | Server-first            |
| Data Fetching | GSSP/GSP            | fetch(), server actions |
| Layouts       | `_app`, `_document` | nested layouts          |
| Best For      | Legacy projects     | Modern Next.js apps     |

---
