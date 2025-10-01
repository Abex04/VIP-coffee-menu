<div align="center">
	<h1>VIP Coffee Menu</h1>
	<p><strong>High‑performance, accessible, literal digital café menu built with React 19, Vite 7, Tailwind CSS 4, and progressive enhancement best practices.</strong></p>
</div>

---

## 1. Executive Summary

VIP Coffee Menu is a single‑page, offline‑capable, performance‑focused web application that presents a strictly literal product catalog (no marketing adjectives) for in‑store or NFC/QR access. It emphasizes fast first render, accessibility compliance, predictable updates, and structured data for search visibility.

Core pillars:
1. Performance: Lean bundles, responsive images, content-visibility, code-splitting.
2. Accuracy: Enforced data rules & validation script.
3. Accessibility: Keyboard navigation, ARIA semantics, motion controls, update announcements.
4. Reliability: Service worker offline fallback + update toast + versioned caching.
5. SEO / Discovery: JSON-LD (ItemList + Product + Organization), canonical metadata.

---

## 2. Feature Highlights

| Category | Capabilities |
|----------|--------------|
| UI & Layout | Responsive grid, full-bleed hero, dynamic categories |
| Images | `<picture>` strategy, responsive widths, preconnect hints, LQ-style low-res variants (where used) |
| Performance | Code-split hero, content-visibility, preload critical hero image, Web Vitals instrumentation |
| Accessibility | Skip link, tablist categories, hero pause/play, accessible update toast, reduced-motion respect |
| Data Integrity | Central `products.js` + validation script (banned words, required fields) |
| Offline / PWA | Manifest, service worker with offline fallback & SW update flow |
| Structured Data | ItemList + Product graph + Organization brand node |
| Security (Static) | Hardened security headers & CSP recommendations |
| Observability | Web Vitals batching stub (ready for `/analytics` endpoint) |

---

## 3. Tech Stack Overview

| Layer | Technology | Notes |
|-------|-----------|-------|
| Build Tool | Vite 7 | Fast dev & optimized production output |
| Framework | React 19 | Modern JSX runtime, Suspense for hero split |
| Styling | Tailwind CSS 4 + custom CSS | Tokens & utility-driven design |
| Data | In-memory catalog (ES module) | Zero network fetch for menu load |
| Service Worker | Custom SW (v2) | Stale-while-revalidate + LRU image cache |
| Structured Data | Schema.org JSON-LD graph | SEO richness |
| Tooling Scripts | Validation, dist audit | Quality & size governance |

---

## 4. Project Structure (Essentials)

```
src/
	App.jsx               # Root composition
	main.jsx              # Entry, ErrorBoundary, SW logic, vitals
	Hero.jsx              # Code-split hero carousel with pause control
	ProductGrid.jsx       # Responsive cards + responsive images
	CategoryFilter.jsx    # Keyboardable category navigation
	StructuredData.jsx    # Combined ItemList + Products + Org graph
	data/products.js      # Product catalog (literal policy)
	constants.js          # Shared constants (e.g., scroll offset)
	reportVitals.js       # Web Vitals batching transport
	ErrorBoundary.jsx     # Graceful runtime fallback
public/
	sw.js                 # Service worker (core/img/runtime caches)
	offline.html          # Offline navigation fallback
	_redirects / _headers # Netlify routing + security headers
	robots.txt / sitemap.xml
scripts/
	validateProducts.mjs  # Enforces data quality rules
	auditDist.mjs         # Asset size auditing script
```

---

## 5. Data & Content Validation

Rules enforced by `scripts/validateProducts.mjs` before build:
1. Each product has: name, description, price (>0), category, image.
2. Description must be literal (no speculative or marketing adjectives).
3. Banned terms rejected (e.g., `delicious`, `premium`, `best`, `authentic`, etc.).
4. Keeping `sourceUrl` internally for image provenance (not displayed unless requirement changes).

Run manually:
```bash
npm run validate:products
```
Build will fail if violations exist.

---

## 6. Development & Build

Local dev:
```bash
npm install
npm run dev
# open http://localhost:5173
```

Production build + preview:
```bash
npm run build
npm run preview
```

Asset size governance:
```bash
npm run audit:dist
```
Warns for large JS (>180KB) or images (>300KB) — adjust thresholds in `scripts/auditDist.mjs`.

---

## 7. Performance Engineering

| Technique | Purpose |
|-----------|---------|
| Code-split Hero | Reduces initial JS parse/execute cost |
| `content-visibility: auto` | Skips rendering work for off-screen grid |
| Responsive `srcset` (cards / hero) | Delivers appropriately sized images |
| Preload first hero image | Faster, more stable LCP |
| Stale-while-revalidate (images) | Instant repeat view + background freshness |
| LRU image cache (60 entries) | Prevents uncontrolled cache growth |
| Web Vitals batching | Real-user metrics pipeline readiness |

Budgets (guidance): LCP ≤ 2.5s, CLS ≤ 0.05, INP ≤ 200ms, JS transfer ≤ 170KB, initial images ≤ 250KB.

---

## 8. Accessibility

Implemented measures:
- Skip link to `#main-content`.
- Category tabs use ARIA `tablist` semantics with keyboard arrow navigation.
- Hero autoplay pause/play control (fulfills WCAG 2.2.2 Pause/Stop/Hide intent).
- Update toast: role="status", focus management, keyboard activation & dismissal.
- Reduced Motion respect (transitions minimized for motion-sensitive users).
- Descriptive alt text (product name only; avoids redundancy).

Recommended audits: Axe browser extension + manual keyboard traversal every release.

---

## 9. Structured Data (SEO)

JSON-LD graph includes:
- `Organization` (brand) node.
- `ItemList` providing positional context.
- Individual `Product` nodes each referencing the brand and containing an `Offer` (price in ETB, availability InStock).

Future optional enrichments: breadcrumbs, category `MenuSection`, `aggregateRating` (only with real data), multi-currency offers.

---

## 10. Service Worker & Offline

Capabilities:
- Versioned caches: core, images (SW LRU), runtime.
- Navigation network-first with offline fallback (`offline.html`).
- Stale-while-revalidate for images & generic runtime requests.
- Update toast prompts immediate activation (SKIP_WAITING pattern).

Testing checklist:
1. Load site online (SW installs).
2. Toggle DevTools → Offline → refresh → offline page served.
3. Make a code change, rebuild, redeploy → update toast appears → click Update → new version loads.

---

## 11. Security & Headers

Security baseline provided via `_headers` and `netlify.toml`:
- HSTS, CSP (relaxed inline styles for Tailwind), Referrer-Policy, Permissions-Policy.
- Frame & object embedding disabled.

See "Recommended Security / HTTP Headers" section below for detailed values and hardening roadmap.

---

## 12. Deployment (Netlify)

Quick deploy steps:
1. Push repository to Git provider.
2. Netlify → Import project → build command `npm run build`, publish `dist`.
3. Domain configuration (e.g., `menu.yourdomain.com`).
4. Update canonical URL in `index.html`, `robots.txt`, `sitemap.xml`.
5. Run final Lighthouse (mobile) + structured data validation.

Included deployment artifacts:
| File | Purpose |
|------|---------|
| `_redirects` | SPA fallback routing |
| `_headers` | Security & CSP headers |
| `netlify.toml` | Build + redundancy |

NFC integration: encode canonical HTTPS root; optionally print QR fallback.

---

## 13. Observability Roadmap

Current: Web Vitals console + batching stub (sendBeacon or fetch to `/analytics`).
Next steps:
1. Implement edge/worker endpoint to store metrics.
2. Aggregate p75 daily (LCP, CLS, INP) and compare to Lighthouse medians.
3. Add error tracking (Sentry or lightweight endpoint) inside `ErrorBoundary` catch.

---

## 14. Maintenance Tasks

| Cadence | Task |
|---------|------|
| Per deploy | Run Lighthouse, audit dist sizes, validate products |
| Weekly | Dependency check (`npm outdated`) |
| Monthly | Axe accessibility scan; verify security headers |
| Quarterly | Tighten performance budgets if consistently green |

---

## 15. Roadmap (Optional Enhancements)

- Analytics ingestion endpoint & dashboard.
- Dark mode variant via prefers-color-scheme or toggle.
- Preload likely next-category images using idle callbacks.
- MenuSection structured data + category anchor deep-links.
- Real-time price update back-end (webhook/edge function).
- Feature flags (hero autoplay default, experimental promotions).
- Bundle visualizer integrated in `npm run audit:dist` flow.

---

## 16. Contributing

1. Fork / branch.
2. Add / update products (respect validation rules).
3. Run: `npm run validate:products && npm run build`.
4. Provide screenshot or Lighthouse diff (if perf impact).
5. Open PR.

Coding standards: minimalist components, avoid premature abstractions, keep literal descriptions.

---

## 17. License & Attribution

Images: Unsplash / Pexels per their licenses (attribution available via internal `sourceUrl`).
Code: MIT (add LICENSE file if distribution requires).

---

## 18. Quick Start (TL;DR)
```bash
git clone <repo>
cd vip-coffee-menu
npm install
npm run dev
# open http://localhost:5173
npm run build && npm run preview
npm run audit:dist
```

---

## 19. Recommended Security / HTTP Headers

| Header | Suggested Value | Purpose |
|--------|-----------------|---------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | Enforce HTTPS |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Limit referrer leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Deny unused features |
| X-Frame-Options (legacy) | DENY | Clickjacking protection |
| Cross-Origin-Resource-Policy | same-origin | Resource sharing scope |
| Cross-Origin-Opener-Policy | same-origin | Isolation for performance/security |
| Cross-Origin-Embedder-Policy | require-corp | (Add once third-party compliance ensured) |
| Content-Security-Policy | See baseline below | Restrict sources |

Baseline CSP:
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' https://images.unsplash.com https://images.pexels.com data: blob:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
```

Hardening next steps:
1. Replace `'unsafe-inline'` with hashed styles after auditing Tailwind injection.
2. Add analytics origin to `connect-src` when backend exists.
3. Consider COEP/COOP pair only if SharedArrayBuffer or advanced isolation required.

---

## 20. Appendix: SW Cache Keys & Versioning

| Cache | Purpose | Eviction |
|-------|---------|----------|
| `vip-core-v2` | HTML shell + essentials | On version bump |
| `vip-img-v2`  | Product & hero images | LRU > 60 entries |
| `vip-runtime-v2` | JSON/runtime future | Replaced on version bump |

Version bump triggers: structural layout change, offline page revision, dependency major upgrade.

---

Maintained with a focus on authenticity, speed, and resilience. Contributions and performance-minded improvements welcome.


## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Build | Vite 7 | Fast dev server + optimized production bundle |
| UI | React 19 | Function components & hooks |
| Styles | Tailwind CSS 4 + custom CSS | Tokens for colors, spacing, typography |
| A11y | Custom patterns | Carousel (if reintroduced), skip link, tablist semantics |
| Validation | Node script | `scripts/validateProducts.mjs` |

## Project Structure

```
src/
	App.jsx            # Root composition (products imported)
	data/products.js   # Product catalog (literal descriptions)
	ProductGrid.jsx    # Responsive product card layout
	CategoryFilter.jsx # Keyboardable tab-style category selector
	Hero.jsx           # (Optional hero carousel already implemented earlier)
	Footer.jsx         # Footer utilities and back-to-top button
	index.css          # Tailwind preflight + design tokens + custom utilities
```

## Data & Content Rules

1. Descriptions must literally reflect what is visible.
2. Banned marketing terms (enforced): `delicious`, `tasty`, `mouthwatering`, `scrumptious`, `yummy`, `wooden table`, `best`, `premium`, `authentic`.
3. Every product requires: `name`, `description`, `price > 0`, `category`, `image`.
4. `sourceUrl` retained for license traceability (not currently shown in UI).

## Validation Script

Run manually:
```
npm run validate:products
```
It fails the build if any rule is violated (see `scripts/validateProducts.mjs`). The `build` script chains validation automatically.

## Development

```
npm install
npm run dev
```
Open http://localhost:5173 (default Vite port may vary).

## Production Build

```
npm run build
npm run preview   # Serve built assets locally
```

Output (example sizes will vary slightly):
```
dist/index.html
dist/assets/index-<hash>.js
dist/assets/index-<hash>.css
```

## Deployment Guidelines

- Serve `dist/` via any static host (Netlify, Vercel, GitHub Pages, Nginx, etc.).
- Recommended headers:
	- `cache-control: public, max-age=31536000, immutable` for hashed assets
	- Shorter cache (e.g. 5–15m) for `index.html`.
- Consider adding a service worker only if offline viewing becomes a requirement (not included yet to keep complexity low).

## Accessibility Notes

- Skip link lands on `#main-content`.
- Category selector implements a tablist pattern; arrow keys navigate.
- Images use short alt equal to product name (price is conveyed textually elsewhere, so not duplicated).
- Aspect-ratio wrapper prevents content shift while images load.
- Reduced motion query neutralizes most transitions for motion-sensitive users.

## Adding a Product

1. Edit `src/data/products.js`.
2. Include fields: `name`, `description`, `price`, `category`, `image` (canonical Unsplash CDN URL), optional `sourceUrl`.
3. Run `npm run validate:products` – ensure it passes.
4. Commit & deploy.

## Future Enhancements (Optional)

- JSON-LD structured data (`ItemList` / custom "Menu") for SEO
- Pause/Play control for hero carousel (if hero is sliding automatically)
- Low-quality image placeholders (LQIP) or dominant color backgrounds
- Dark mode activation using existing token scaffold (`data-theme="auto"`)
- License metadata badges for Unsplash+ items
- Simple admin generation script to add new products interactively

## Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| Validation fails | Banned word in description | Rewrite using purely visual terms |
| Image not loading | CDN URL incorrect / missing params | Use canonical `?auto=format&fit=crop&w=1200&q=80` form |
| Layout shift | Missing aspect ratio class | Ensure `.product-media` wrapper present |
| Build slow | Uncached deps / cold start | Re-run, Vite caches after first build |

## License & Image Attribution

All images pulled from Unsplash / Unsplash+ under their respective licenses. Internal `sourceUrl` fields are preserved for audit and potential future disclosure but intentionally not shown in the UI per current product requirement.

## Security Considerations

- No server code: purely static bundle → low attack surface.
- Keep dependencies patched (`npm outdated`).
- If adding forms later, sanitize user input at edge or API layer.

## Contributing

1. Fork / branch
2. Make changes
3. Run: `npm run validate:products` & `npm run build`
4. Open PR / merge

---

Maintained as an internal menu experience emphasizing content authenticity and accessibility. Feel free to adapt for wider deployment.

## Netlify Deployment

### Quick Steps
1. Push repository to GitHub (or GitLab/Bitbucket).
2. In Netlify dashboard: "Add new site" → "Import an existing project".
3. Select repo; set build command: `npm run build`; publish directory: `dist`.
4. Deploy. Netlify will detect the `_redirects` and `_headers` files in `public/`.
5. Add custom domain (e.g., `menu.yourdomain.com`). Netlify provisions SSL automatically.

### Included Netlify Files
| File | Purpose |
|------|---------|
| `public/_redirects` | SPA fallback `/* /index.html 200` |
| `public/_headers` | Security & CSP headers |
| `netlify.toml` | Build config + redundant headers (future flexibility) |

### Replace Placeholder Domains
Update the following after choosing a production domain:
- `public/robots.txt` → `Sitemap: https://YOUR-DOMAIN.example/sitemap.xml`
- `public/sitemap.xml` `<loc>` value
- `index.html` `<link rel="canonical" href="..." />`

### NFC Card Usage
When encoding NFC cards, use the canonical HTTPS URL (no trailing query params). Recommendations:
- Prefer a subdomain like `https://menu.yourdomain.com/` (short, brandable, easier to print/encode).
- Avoid deep hash fragments unless you later add category anchor links (e.g., `#coffee`).
- Use a URL shortener only if the domain is long; direct domain is usually faster and more trustworthy.

### Post-Deploy Validation
| Check | Tool |
|-------|------|
| Service worker active | Browser DevTools → Application → Service Workers |
| Offline fallback works | Simulate offline & reload root |
| Structured data valid | Rich Results Test / Schema.org validator |
| Security headers present | curl -I or securityheaders.com |
| Lighthouse passes budgets | Lighthouse (mobile, production URL) |

### Updating the Site
1. Commit & push changes.
2. Netlify triggers a new build.
3. After publish, user’s open tabs get the update toast (service worker) → clicking Update reloads new cache.

### Optional Enhancements on Netlify
- Add a redirect rule for `http://` to `https://` (usually automatic).
- Activate Netlify Analytics (paid) or deploy your own edge analytics endpoint.
- Add password protection (if staging) via Netlify site settings.

### NFC Operational Tips
- Print a short instruction near the NFC card (e.g., "Tap for today’s menu").
- Consider generating a fallback QR code that points to the same URL for non‑NFC devices.
- Periodically test cards after site updates to ensure no path changes affected the root.


## Recommended Security / HTTP Headers

Add these at your hosting platform (Netlify `_headers`, Cloudflare Pages `_headers`, Vercel `vercel.json`, or reverse proxy config). Start with relaxed CSP and harden iteratively.

| Header | Suggested Value | Purpose |
|--------|-----------------|---------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | Enforce HTTPS long-term |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Limit leak of full URLs |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Deny unneeded powerful APIs |
| X-Frame-Options (legacy) | DENY | Disallow framing (clickjacking) |
| Cross-Origin-Resource-Policy | same-origin | Restrict resource sharing |
| Cross-Origin-Opener-Policy | same-origin | Enable cross-origin isolation (future perf/security) |
| Cross-Origin-Embedder-Policy | require-corp | (Add when all resources compliant) |
| Content-Security-Policy | see below | Script/style/image restrictions |

### Baseline CSP (Adjust Domains As Needed)
```
Content-Security-Policy: default-src 'self'; \
	script-src 'self'; \
	style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
	img-src 'self' https://images.unsplash.com https://images.pexels.com data: blob:; \
	font-src 'self' https://fonts.gstatic.com; \
	connect-src 'self'; \
	object-src 'none'; \
	base-uri 'self'; \
	frame-ancestors 'none';
```

If you add a Web Vitals analytics endpoint at `/analytics`, keep `connect-src 'self'` (still valid). If you add third‑party monitoring, append its origin to `connect-src`.

### Example `_headers` (Netlify / Cloudflare Pages)
```
/*
	Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
	X-Content-Type-Options: nosniff
	Referrer-Policy: strict-origin-when-cross-origin
	Permissions-Policy: camera=(), microphone=(), geolocation=()
	Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://images.unsplash.com https://images.pexels.com data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

### Vercel `vercel.json` Snippet
```json
{
	"headers": [
		{
			"source": "/(.*)",
			"headers": [
				{"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload"},
				{"key": "X-Content-Type-Options", "value": "nosniff"},
				{"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
				{"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"},
				{"key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://images.unsplash.com https://images.pexels.com data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"}
			]
		}
	]
}
```

### Hardening Next Steps
1. Remove `'unsafe-inline'` once you inline a nonce or hash for styles (Tailwind’s injected utilities make this optional; keep for now).
2. Append analytics endpoint or third-party origins to `connect-src` when introduced.
3. Only enable `Cross-Origin-Embedder-Policy: require-corp` after ensuring all fonts/images support CORP/COEP (may affect some CDNs).
4. Periodically run securityheaders.com scan to verify grade improvements.


## Lighthouse CI & Performance Budgets (Tier 4)

To keep performance from regressing, establish both synthetic (Lighthouse) and real-user (Web Vitals) feedback loops. Web Vitals batching is already implemented in `reportVitals.js`; below adds Lighthouse CI guidance.

### Suggested Budgets (Initial Mobile Focus)

| Metric | Budget | Rationale |
|--------|--------|-----------|
| LCP | <= 2500 ms | Keeps above-the-fold imagery fast on 4G throttled |
| CLS | <= 0.05 | Protects layout stability |
| INP (or FID fallback) | <= 200 ms | Ensures crisp interactivity |
| Total JS (transfer) | <= 170 KB | Encourages lean bundle as features grow |
| Total Images (initial) | <= 250 KB | Controls hero + first viewport payload |
| Unused JS | <= 10% | Surfaces dead code early |

Tune after your first baseline run (tighten when consistently green).

### Local One-Off Audit
```
npx lighthouse http://localhost:5173 --view --only-categories=performance
```

### Adding Lighthouse CI (Local / Manual)
1. Install (dev dependency recommended): `npm i -D @lhci/cli`
2. Create `.lighthouserc.json` with assertions & (optionally) budgets.
3. Run: `npx lhci autorun` (will build & collect by default if configured).

Example minimal `.lighthouserc.json` (add to project root):
```json
{
	"ci": {
		"collect": {
			"staticDistDir": "dist",
			"url": ["/"],
			"numberOfRuns": 3
		},
		"assert": {
			"assertions": {
				"categories:performance": ["error", {"minScore": 0.95}],
				"largest-contentful-paint": ["warn", {"numericValue": 2500}],
				"cumulative-layout-shift": ["error", {"numericValue": 0.05}],
				"interactive": ["warn", {"numericValue": 3500}],
				"total-byte-weight": ["warn", {"maxNumericValue": 350000}],
				"unused-javascript": ["warn", {"maxNumericValue": 10}],
				"uses-responsive-images": "warn",
				"uses-optimized-images": "warn"
			}
		}
	}
}
```

Add a convenience script to `package.json` (optional):
```json
"scripts": {
	"lhci": "npm run build && lhci autorun"
}
```

### CI Pipeline (Future)
When a remote repository exists (e.g., GitHub), add a workflow:
- Install deps
- Build
- Run `lhci autorun`
- Fail PR if assertions fail

### Interpreting Results
Run 3+ samples; look at median. If LCP flirts near 2500 ms, inspect:
- Hero image priority & compression
- Unnecessary blocking scripts (none expected now)
- Network waterfalls (DevTools) for slow third-party assets

### Iterative Tightening
After two stable weeks, consider:
- Lower LCP budget to 2200 ms
- Lower JS budget to 150 KB (transfer)
- Add separate image budget per resource type

### Pairing with Real-User Data
When backend endpoint `/analytics` is implemented, aggregate metrics:
- Store per metric name (LCP, CLS, INP)
- Compute p75 (75th percentile) daily
- Compare against Lighthouse synthetic to detect variance (e.g., CDN slowness)

### Troubleshooting Failing Budgets
| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| LCP regression | Larger hero image or slower network | Compress hero, consider 640w source for mobile |
| CLS spike | Late-loaded font or dimensionless image | Ensure width/height attributes or aspect-ratio wrapper |
| JS size creep | Added dependency | Evaluate tree-shaking or dynamic import |
| Unused JS | Dead code from feature removal | Prune module & rebuild |

---

## Performance (Tier 2 Additions)

- Hero first slide image is eagerly loaded with `fetchpriority="high"`; remaining slides lazy.
- Product grid section uses `content-visibility: auto` via `.cv-auto`, deferring rendering cost until scrolled into view.
- Categories derived dynamically to prevent over-fetch or stale duplication.
- Constants extracted to `src/constants.js` (e.g., `SCROLL_OFFSET`) to remove magic numbers.

### Next Candidates (Tier 3+)
## Tier 3 Enhancements Implemented

- Local Open Graph image (`/og-cover.jpg`) referenced for stable social previews.
- Web App Manifest (`public/manifest.json`) enables installability; theme/background colors aligned with design tokens.
- Basic service worker (`/sw.js`) providing cache-first strategy for same-origin static assets.
- JSON-LD `ItemList` injected (`StructuredData.jsx`) to improve semantic discoverability.
- Hero component code-split via `React.lazy` + `<Suspense>` reducing initial bundle parse cost.
- Central constants module (`src/constants.js`) already leveraged for scroll offset (from Tier2 foundation).

### Post-Tier 3 Suggested (Optional)
## Offline Support

An `offline.html` fallback page is precached and served when a navigation request fails due to loss of connectivity. Behavior:

- Service worker tries network first for navigations; on failure returns `offline.html`.
- Static same-origin assets use a cache-first strategy with runtime population.
- When the user comes back online, a manual refresh (or automatic redirect script on the offline page) restores normal content.

Testing locally:
1. Build & preview (`npm run build && npm run preview`).
2. Open in Chrome, verify service worker is active (Application > Service Workers).
3. Simulate offline (DevTools > Network > Offline) and navigate to a different route (or refresh) → offline page should appear.
4. Disable offline → refresh returns live app.

Limitations:
- No offline API/data sync (static only).
- Not currently versioned for stale purge (update `ASSET_CACHE` string to bust).
- Does not precache product images (bandwidth optimization choice).

## Tier 4 Mini (Operational Maturity)

Implemented:

- Error boundary (`ErrorBoundary.jsx`) wrapping the app for graceful UI fallback.
- Web Vitals logging (`reportVitals.js`) for CLS, LCP, INP, FID, TTFB (console output in production build).
- Service Worker update notification toast with one-click refresh (SKIP_WAITING message pattern).
- Local caching continues: now update flow is user-visible; new chunk (Hero) updates are signaled.

Testing SW Update Flow:
1. Load site in browser (service worker active).
2. Deploy a new build (or change any file + rebuild + serve).
3. Refresh open tab → toast appears “New version available”.
4. Click Update → page reloads after controllerchange.

Next (Optional) Additions:
- Send Web Vitals to an endpoint instead of console.
- Add stale-while-revalidate image strategy.
- Versioned cache purge & asset hashing manifest.
- Toast auto-dismiss & accessibility (role="status").


- Add a richer offline strategy: fallback page when offline.
- Implement Offer currency formatting/ISO logic if multi-currency needed.
- Generate a raster + WebP OG pair for broader compatibility.
- Introduce Lighthouse CI script and performance budget enforcement in CI pipeline.
- Integrate monitoring (e.g., simple Web Vitals logging endpoint or Sentry) for real-user performance.

- Replace remote OG image with locally hosted static capture `/og-cover.jpg`.
- Add `manifest.json` + icons for basic PWA.
- Introduce JSON-LD `ItemList` for structured data enhancement.
- Use `prefetch` for likely next-view images (e.g., other categories) once analytics confirm navigation patterns.

---

## Deployment (Current Live Setup)

Domain: https://vipcoffee.netlify.app/

Build & publish:
```
npm run build
```
Netlify settings:
- Build command: `npm run build`
- Publish directory: `dist`
- Headers & CSP: managed in `netlify.toml`
- SW version: bump `VERSION` in `public/sw.js` when changing cached assets

Post‑deploy checklist:
1. Open site → verify no CSP violations in console.
2. DevTools Application → confirm manifest icons (192 & 512) recognized.
3. Toggle offline → refresh → `offline.html` served.
4. Bump SW version, redeploy → update toast appears → Refresh loads new assets.
5. Run Lighthouse (Mobile) ensure Performance > 85, A11y > 95.

Web Vitals: Temporarily disabled in `src/main.jsx` (commented). Re-enable when `/analytics` endpoint exists.

---

