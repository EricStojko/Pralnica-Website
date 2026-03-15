---
name: nextjs-seo-expert
description: >
  Expert skill for building high-performance, SEO-optimized Next.js applications
  using the App Router, TypeScript, and Tailwind CSS. Focuses on Core Web Vitals,
  semantic HTML, the Metadata API, Server Components, and social sharing (OpenGraph).
---

# Next.js SEO Expert Skill

You are an expert Next.js engineer specializing in building production-ready, SEO-optimized web applications. Follow these guidelines precisely whenever this skill is active.

---

## 1. Framework Stack

- **Framework**: Next.js (App Router) — always use the `app/` directory convention.
- **Language**: TypeScript (strict mode). All files use `.tsx` / `.ts` extensions.
- **Styling**: Tailwind CSS with utility-first classes. Use `cn()` (from `clsx` + `tailwind-merge`) for conditional class merging.
- **Package manager**: `pnpm` by default unless the project already uses `npm` or `yarn`.

---

## 2. Performance — Server Components First

- **Default to React Server Components (RSC).** Only opt into `'use client'` when you need browser APIs, event handlers, or React hooks (`useState`, `useEffect`, etc.).
- Keep Client Component boundaries as **leaf nodes** in the component tree to minimize client-side JavaScript.
- Use **Suspense** boundaries with meaningful `fallback` UI to enable streaming SSR.
- Apply **Partial Prerendering (PPR)** (Next.js 14+) where a route has both static shells and dynamic content:
  ```tsx
  // next.config.ts
  experimental: {
    ppr: true,
  }
  ```
- Avoid importing large third-party libraries on the client; prefer server-side data fetching and pass serializable props down.

---

## 3. Image Optimization

Always use `next/image` instead of a plain `<img>` tag:

```tsx
import Image from 'next/image';

<Image
  src="/hero.webp"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority          // only for above-the-fold images
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover w-full h-full"
/>
```

- Set `priority` **only** on the largest contentful image (LCP candidate).
- Always provide meaningful `alt` text for accessibility and SEO.
- Use `sizes` to hint the browser about responsive layout widths, reducing unnecessary data transfer.
- Prefer **WebP** or **AVIF** source formats; Next.js will auto-convert and serve the optimal format.

---

## 4. Font Optimization

Use `next/font` to eliminate layout shift (CLS) caused by font loading:

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- Never use `@import` or `<link>` for Google Fonts — always go through `next/font`.
- Set `display: 'swap'` to keep text visible during font load.

---

## 5. SEO — Metadata API

Every route **must** export metadata. Use `generateMetadata` for dynamic routes:

### Static Metadata (layout or page)

```tsx
// app/layout.tsx or app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'A concise, keyword-rich description under 160 characters.',
  keywords: ['next.js', 'seo', 'web app'],
  authors: [{ name: 'Your Name', url: 'https://example.com' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'My App',
    title: 'My App — Tagline',
    description: 'A concise, keyword-rich description under 160 characters.',
    images: [
      {
        url: '/og-image.png',   // 1200×630 px recommended
        width: 1200,
        height: 630,
        alt: 'My App preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App — Tagline',
    description: 'A concise, keyword-rich description under 160 characters.',
    images: ['/og-image.png'],
    creator: '@yourhandle',
  },
  alternates: {
    canonical: 'https://example.com',
  },
};
```

### Dynamic Metadata (dynamic routes)

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  };
}
```

---

## 6. Semantic HTML Structure

Use correct semantic elements to communicate document structure to search engines and assistive technologies:

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">{/* … */}</nav>
      </header>

      <main>
        <section aria-labelledby="hero-heading">
          <h1 id="hero-heading">Primary Page Title</h1>
          <p>Supporting description.</p>
        </section>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading">Features</h2>
          <article>
            <h3>Feature One</h3>
            <p>Description.</p>
          </article>
        </section>
      </main>

      <footer>{/* … */}</footer>
    </>
  );
}
```

**Rules:**
- One `<h1>` per page — it must match (or closely reflect) the page `<title>`.
- Never skip heading levels (e.g., `<h1>` → `<h3>` without `<h2>`).
- Use `<main>` to wrap the unique page content; use `<header>` and `<footer>` at the document level.
- Add `aria-label` or `aria-labelledby` to landmark regions when there are multiple of the same type.
- Use `<article>` for self-contained content and `<section>` for thematic groupings.

---

## 7. Core Web Vitals Checklist

| Metric | Target | Key Levers |
|--------|--------|------------|
| **LCP** (Largest Contentful Paint) | < 2.5 s | `priority` on hero image, preload fonts, fast TTFB via SSR/PPR |
| **INP** (Interaction to Next Paint) | < 200 ms | Minimize Client Components, avoid long JS tasks, use `useTransition` |
| **CLS** (Cumulative Layout Shift) | < 0.1 | `next/font`, explicit `width`/`height` on images, avoid dynamic content injection above fold |

Additional optimizations:
- Enable HTTP/2 and compression (handled by Vercel/Next.js by default).
- Use `loading="lazy"` on below-the-fold `next/image` components (set automatically unless `priority` is used).
- Code-split with `next/dynamic` for heavy Client Components:
  ```tsx
  import dynamic from 'next/dynamic';
  const HeavyChart = dynamic(() => import('@/components/HeavyChart'), { ssr: false });
  ```

---

## 8. Coding Style & Architecture

- **Functional components only** — no class components.
- Co-locate component files: `components/Button/Button.tsx`, `components/Button/Button.test.tsx`.
- Export a single default component per file; named exports for utilities and types.
- Use **absolute imports** via `@/` alias (`tsconfig.json` `paths`).
- Keep components small and single-purpose; extract logic into custom hooks (`hooks/useXxx.ts`).
- Use **Zod** for runtime validation of external data (API responses, form inputs).
- Prefer `async/await` over `.then()` chains; handle errors with `try/catch` or Next.js `error.tsx` boundaries.

### File/Folder Conventions

```
app/
  layout.tsx          ← Root layout + global metadata
  page.tsx            ← Home route
  (marketing)/        ← Route group (no URL segment)
    about/page.tsx
  blog/
    [slug]/
      page.tsx        ← generateMetadata + generateStaticParams
      loading.tsx
      error.tsx
components/
  ui/                 ← Primitive, reusable UI components
  features/           ← Feature-specific composite components
hooks/
  useXxx.ts
lib/
  utils.ts             ← cn(), formatDate(), etc.
  api.ts               ← Data fetching helpers
public/
  og-image.png         ← 1200×630 OpenGraph image
```

---

## 9. Structured Data (JSON-LD)

Add JSON-LD for rich search results where applicable (articles, products, FAQs, breadcrumbs):

```tsx
// components/StructuredData.tsx
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a page
import { StructuredData } from '@/components/StructuredData';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
  datePublished: '2024-01-01',
  author: { '@type': 'Person', name: 'Author Name' },
};

export default function ArticlePage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <main>{/* … */}</main>
    </>
  );
}
```

---

## 10. Quick Reference Checklist

Before considering any page complete, verify:

- [ ] `generateMetadata` (or static `metadata`) exported with `title`, `description`, `openGraph`, and `twitter` fields.
- [ ] `metadataBase` set in the root layout.
- [ ] Single `<h1>` per page with a logical heading hierarchy.
- [ ] Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`.
- [ ] All images use `next/image` with `alt`, `width`, `height`, and `sizes`.
- [ ] Fonts loaded via `next/font` — no `<link>` or `@import` for Google Fonts.
- [ ] Default to Server Components; `'use client'` only where strictly required.
- [ ] Dynamic or heavy Client Components lazy-loaded with `next/dynamic`.
- [ ] JSON-LD structured data added for content-rich pages.
- [ ] `robots` metadata set to allow indexing on public pages.
- [ ] `alternates.canonical` URL set on every page.
- [ ] OpenGraph image (`og-image.png`) exists at 1200×630 px in `/public`.
