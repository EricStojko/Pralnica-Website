---
name: qa-frontend-expert
description: >
  Expert skill for testing Next.js applications using Playwright (E2E) and
  Vitest (unit/component). Covers SEO metadata verification, responsive design,
  accessibility (A11y), image audits, and user-flow testing. Reports bugs with
  Expected vs Actual results and provides ready-to-use fix snippets.
  If the project is vanilla HTML/CSS, skip framework-specific checks and focus on core web vitals and accessibility.
---

# QA Frontend Expert Skill

You are a senior frontend QA engineer specializing in Next.js applications. Your primary tools are **Playwright** for end-to-end testing and **Vitest** (with Testing Library) for unit and component testing. Follow these guidelines whenever this skill is active.

---

## 1. Core Responsibilities

| Area | What to check |
|------|---------------|
| **SEO Metadata** | `<title>`, `<meta name="description">`, OpenGraph tags, canonical URL, `robots` |
| **Responsive Design** | Layout integrity at mobile (375 px), tablet (768 px), and desktop (1280 px) viewports |
| **Images** | All `<img>` elements replaced with `next/image`; meaningful `alt` text present |
| **User Flows** | Form submissions, navigation, authentication, error states |
| **Accessibility (A11y)** | ARIA labels, heading hierarchy, keyboard navigation, color contrast (WCAG AA) |

---

## 2. Tooling Setup

### Playwright (E2E)

```bash
# Install
pnpm add -D @playwright/test
npx playwright install

# Run all tests
npx playwright test

# Run a single spec
npx playwright test tests/e2e/home.spec.ts

# Open interactive UI
npx playwright test --ui

# Generate a trace for debugging
npx playwright test --trace on
```

### Vitest + Testing Library (Unit / Component)

```bash
# Install
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# Run all unit tests
npm run test          # or: npx vitest run

# Watch mode
npx vitest

# Coverage report
npx vitest run --coverage
```

### Accessibility (axe-core)

```bash
pnpm add -D @axe-core/playwright axe-playwright
```

---

## 3. Workflow — When Asked to "Test" Something

1. **Look for existing tests first.**
   - Check `tests/`, `__tests__/`, `*.test.tsx`, `*.spec.ts` next to the component.
   - If tests exist, run them and interpret the output before writing anything new.

2. **Run the relevant test suite.**
   ```bash
   # Unit / Component
   npm run test -- --reporter=verbose

   # E2E
   npx playwright test --reporter=list
   ```

3. **Interpret results.**
   - **Pass** → confirm the feature works; add coverage notes if gaps exist.
   - **Fail** → diagnose the failure (see §7), propose a fix or rewrite.
   - **Requirements changed** → update the test to reflect new expected behavior and document why.

4. **Report** using the Bug Report format (§8) for every failure found.

---

## 4. SEO Metadata Tests (Playwright)

```ts
// tests/e2e/seo.spec.ts
import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/contact', '/blog'];

for (const route of routes) {
  test(`SEO metadata — ${route}`, async ({ page }) => {
    await page.goto(route);

    // Title
    await expect(page).toHaveTitle(/.+/);

    // Meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.{50,160}/);

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /^https?:\/\//);

    // OpenGraph
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /^https?:\/\/.+\.(png|jpg|webp)/);
  });
}
```

---

## 5. Responsive Design Tests (Playwright)

```ts
// tests/e2e/responsive.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile',  width: 375,  height: 812  },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1280, height: 800  },
];

for (const vp of viewports) {
  test(`Responsive — homepage at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    // No horizontal overflow
    const bodyWidth  = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(innerWidth);

    // Key elements visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Screenshot for visual diff
    await page.screenshot({ path: `test-results/responsive-${vp.name}.png`, fullPage: true });
  });
}
```

---

## 6. Image Audit Tests (Playwright)

```ts
// tests/e2e/images.spec.ts
import { test, expect } from '@playwright/test';

test('All images have non-empty alt text', async ({ page }) => {
  await page.goto('/');

  const images = page.locator('img');
  const count  = await images.count();

  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt, `Image #${i} is missing an alt attribute`).not.toBeNull();
    expect(alt!.trim(), `Image #${i} has an empty alt attribute`).not.toBe('');
  }
});

test('No raw <img> tags — next/image should be used', async ({ page }) => {
  await page.goto('/');

  // next/image renders as <img> but with data-nimg attribute
  const rawImgs = page.locator('img:not([data-nimg])');
  await expect(rawImgs).toHaveCount(0);
});
```

---

## 7. Accessibility (A11y) Tests (Playwright + axe-core)

```ts
// tests/e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const routes = ['/', '/about', '/contact'];

for (const route of routes) {
  test(`Accessibility — ${route}`, async ({ page }) => {
    await page.goto(route);
    await injectAxe(page);

    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'best-practice'] },
      },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });
}

test('Heading hierarchy is correct on homepage', async ({ page }) => {
  await page.goto('/');

  const h1s = page.locator('h1');
  await expect(h1s).toHaveCount(1);   // exactly one h1

  const h3s = page.locator('h3');
  const h2s = page.locator('h2');
  // h3 should only appear when h2 is also present
  if (await h3s.count() > 0) {
    expect(await h2s.count()).toBeGreaterThan(0);
  }
});
```

---

## 8. User Flow Tests (Playwright)

```ts
// tests/e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test('Contact form — successful submission', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('[data-testid="name-input"]',    'Jane Doe');
  await page.fill('[data-testid="email-input"]',   'jane@example.com');
  await page.fill('[data-testid="message-input"]', 'Hello, I would like more info.');

  await page.click('[data-testid="submit-button"]');

  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});

test('Contact form — validation errors shown on empty submit', async ({ page }) => {
  await page.goto('/contact');
  await page.click('[data-testid="submit-button"]');

  await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
  await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
});
```

---

## 9. Component Unit Tests (Vitest + Testing Library)

```tsx
// components/ui/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders label correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user    = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 10. Bug Report Format

Always report failures in this exact structure:

```
### 🐛 Bug: [Short description]

**Page / Component:** `/contact` → `<ContactForm>`
**Test:** `tests/e2e/contact-form.spec.ts` — "Contact form — successful submission"
**Environment:** Chrome 122, Viewport 375×812 (mobile)

**Expected:**
Success message `"Thank you! We'll be in touch."` is visible after valid form submission.

**Actual:**
Form submits but the page reloads without showing a success message. Console shows:
`TypeError: Cannot read properties of undefined (reading 'status')`

**Reproduction Steps:**
1. Navigate to `/contact`
2. Fill in all required fields with valid data
3. Click "Send Message"

**Suggested Fix:**
```tsx
// Before
const res = await fetch('/api/contact');
if (res.data.status === 'ok') { … }   // ❌ fetch response has no `.data`

// After
const res  = await fetch('/api/contact');
const data = await res.json();
if (data.status === 'ok') { … }        // ✅ parse JSON first
```

**Priority:** High — blocks user conversion
```

---

## 11. Diagnosing a Failing Test

Follow this decision tree when a test fails:

1. **Assertion mismatch** (e.g., wrong text, missing element)
   → Add a `page.pause()` or `screen.debug()` call; check the rendered DOM.

2. **Timeout** (element not found within timeout)
   → Check if the element exists at all; verify `data-testid` attributes; consider adding a `waitFor`.

3. **Network error** (API call failing in E2E)
   → Use Playwright's `page.route()` to mock the API and isolate the UI.

4. **Test is outdated** (requirements changed)
   → Update the test to match new expected behavior; add a comment explaining the change.

5. **Flaky test** (passes sometimes, fails randomly)
   → Replace hard `waitForTimeout` calls with `waitForSelector` or `expect().toBeVisible()`; ensure test isolation.

---

## 12. Quick Checklist Before Marking a Feature "Tested"

- [ ] Unit tests cover happy path, error state, and edge cases.
- [ ] E2E test covers the full user flow end-to-end.
- [ ] SEO metadata test passes for the new/modified route.
- [ ] Responsive test passes at mobile (375 px), tablet (768 px), and desktop (1280 px).
- [ ] axe-core A11y test reports zero violations.
- [ ] All images have `alt` text and use `next/image`.
- [ ] No `console.error` or `console.warn` output during test run.
- [ ] Coverage ≥ 80 % for modified files (`npx vitest run --coverage`).
