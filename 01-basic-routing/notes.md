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

Perfect notes 👍
Below is a **clean “Metadata” section** you can directly append to your revision notes.
It matches the same style: short, factual, revision-friendly.

---

# 🧾 **12. Metadata (SEO & Social Sharing)**

Next.js provides a **Metadata API** to manage `<head>` tags like title, description, and OpenGraph.

Metadata is defined using the `metadata` export in **layout.tsx** or **page.tsx**.

---

## 📌 **Basic Metadata Example**

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Basic Routing",
  description: "Understanding basic App Router in Next.js",
};
```

- `title` → Browser tab title + SEO
- `description` → Search engine snippet + previews

---

## ⭐ **Most Common Metadata Fields**

### **1️⃣ title**

```ts
title: "Dashboard",
```

Sets the page title.

---

### **2️⃣ description**

```ts
description: "Dashboard overview and analytics",
```

Used by search engines and social platforms.

---

### **3️⃣ openGraph**

Used for social media previews (WhatsApp, LinkedIn, Twitter, etc.).

```ts
openGraph: {
  title: "Dashboard",
  description: "Analytics and insights",
  images: ["/og.png"], // or external URL
},
```

---

### **4️⃣ icons**

Controls favicon and app icons.

```ts
icons: {
  icon: "/favicon.ico",
},
```

⚠️ **Optional**
If `favicon.ico` exists in `/app` or `/public`, Next.js auto-detects it.

---

### **5️⃣ metadataBase**

Required for generating absolute URLs in OpenGraph.

```ts
metadataBase: new URL("https://example.com"),
```

Used mostly in production apps.

---

## 🧠 **Where to Define Metadata**

| Location                   | Effect                        |
| -------------------------- | ----------------------------- |
| `app/layout.tsx`           | Global metadata (all pages)   |
| `app/page.tsx`             | Page-specific metadata        |
| `app/dashboard/layout.tsx` | Metadata for dashboard routes |

Metadata **merges automatically** from parent to child routes.

---

## 🔁 **Metadata vs React Helmet**

| Feature     | React      | Next.js      |
| ----------- | ---------- | ------------ |
| OG Support  | Weak (CSR) | Strong (SSR) |
| SEO         | Poor       | Excellent    |
| JS Required | Yes        | No           |
| Recommended | ❌         | ✅           |

Next.js metadata is **server-rendered**, so social scrapers can read it.

---

# 🧭 **13. Metadata Inheritance & Merging**

Metadata **automatically merges** from parent to child routes.

Example structure:

```
app/layout.tsx          → global metadata
app/dashboard/layout.tsx → dashboard metadata
app/dashboard/page.tsx   → page metadata
```

---

## 📌 **How Merging Works**

- Child metadata overrides parent
- Missing fields are inherited

Example:

### `app/layout.tsx`

```ts
export const metadata = {
  title: "My App",
};
```

### `app/dashboard/page.tsx`

```ts
export const metadata = {
  title: "Dashboard",
};
```

Final title:

```
Dashboard
```

---

## 📌 **Template Titles**

```ts
export const metadata = {
  title: {
    template: "%s | My App",
    default: "My App",
  },
};
```

Child page title `"Dashboard"` becomes:

```
Dashboard | My App
```

---

# 🧠 **14. Metadata vs `<Head>`**

Next.js still supports `<Head>`, but **metadata API is preferred**.

| Feature         | `<Head>` | Metadata API |
| --------------- | -------- | ------------ |
| Server-rendered | ❌       | ✅           |
| SEO-friendly    | ⚠️       | ✅           |
| Type-safe       | ❌       | ✅           |
| Recommended     | ❌       | ✅           |

Use `<Head>` only for **rare edge cases**.

---

# 📌 **15. OpenGraph & Twitter Metadata**

OpenGraph is used by:

- WhatsApp
- LinkedIn
- Facebook
- Discord

```ts
openGraph: {
  title: "My Page",
  description: "Preview description",
  images: ["https://example.com/og.png"],
},
```

Twitter cards:

```ts
twitter: {
  card: "summary_large_image",
  title: "My Page",
  images: ["https://example.com/og.png"],
},
```

---
