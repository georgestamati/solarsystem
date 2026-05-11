# Solar System App — Improvement & Feature Plans



## Context

The app is an Angular 21 interactive solar system viewer with 3D orbit animations, planet detail pages, voice commands, and a parallax galaxy view. After a major migration (server removal, Angular 21 upgrade, zoneless/signals modernization), several areas need polish: a 1052-line monolithic SCSS file, no error handling, broken proxy config, accessibility gaps, zero mobile support, and animation performance issues. Beyond fixes, the visual nature of the app opens up excellent feature opportunities.



---



# PLAN 1: Improvements



## Phase 1 — Critical Foundation Fixes



### 1.1 Delete stale `proxy.conf.json`

The proxy routes `/api`, `/socket.io`, `/data` to `localhost:3000` (the removed node server). The `/data` proxy is actively harmful — it intercepts the static `planets.json` request.

- **Delete** `proxy.conf.json`

- **Edit** `angular.json` — remove the `"proxyConfig": "proxy.conf.json"` line from the `serve` options



### 1.2 Fix `_variables.scss` typo

Line 1: `$moons: (sun, mercury, menus, earth, ...)` — `menus` → `venus`

- **File**: `src/styles/_variables.scss`



### 1.3 Add HTTP error handling in PlanetDataService

No `catchError` or `retry` — a failed request silently shows nothing.

- **File**: `src/app/services/planet-data.service.ts`

- Add `retry(2)` before `shareReplay(1)`, then `catchError` returning a fallback `{ title: '', records: [] }` and setting an `error` signal



### 1.4 Fix tests (Jest + Angular 21 TestBed)

All 8 suites fail with `TypeError: Cannot read properties of null (reading 'ngModule')`. The `setup-jest.ts` calls `initTestEnvironment` but something in the module resolution is failing.

- **Files**: `setup-jest.ts`, `jest.config.js`, `tsconfig.spec.json`, all `*.spec.ts`

- Verify `transformIgnorePatterns` allows ESM packages (gsap, ngx-cookie-service)

- Add `moduleNameMapper` for SCSS/asset stubs if missing

- Add `provideZonelessChangeDetection()` to each TestBed (already done, verify it sticks)



---



## Phase 2 — SCSS Architecture Overhaul



### 2.1 Decompose `_main.scss` (1052 lines) into component-scoped styles

| Lines | Content | Move to |

|-------|---------|---------|

| 39–170 | `.loader`, `.loader__wrapper`, `.loader__planet`, `.loader__welcome` | `desktop-welcome.component.scss` |

| 172–378 | `.menu__button`, `.menu__overlay`, `.menu`, `.dropdown` | `menu.component.scss` |

| 380–675 | `#universe`, `#galaxy`, `.page-index`, `.orbit`, planet IDs, `.galaxy-view--3D` | `galaxy.component.scss` |

| 677–967 | `.wrapper`, `.info__contents`, `.info__controls`, `.moon`, `.tooltip`, `.info__modal` | `planet-detail.component.scss` |

| Keep | `html,body`, `a`, `.container`, `.planet` (base), `.orbit` (base), `.active`, `.visible`, `.hidden`, `.error` | `_main.scss` (trimmed) |



Each component SCSS gets `@use '../../styles/variables' as *;` and `@use '../../styles/mixins' as *;`.



### 2.2 Replace hardcoded values with CSS custom properties

- Add to `:root` in a new `_tokens.scss`: `--color-accent`, `--color-bg`, `--color-text`, `--shadow-planet`, `--z-modal`, `--z-menu`, etc.

- Replace ~12 `aqua` literals, ~3 repeated box-shadows, scattered z-index values



### 2.3 Remove unused selectors

- `.main-page-link`, `.mobile-menu`, `.menu-item` — no templates reference them



### 2.4 Replace fragile `@extend` with mixins

- `@extend .error__message` → `@mixin section-title`

- `@extend .loader__wrapper--input` → `@mixin action-button`

- `@extend a` in `.error__message` → inline the font properties



---



## Phase 3 — Performance



### 3.1 GPU-accelerate `background-position` animations

`animatedBackground` and `clippingStars` keyframes animate `background-position` (triggers repaints). Replace with `transform: translateX()` on a pseudo-element with 2x-wide background.

- **Files**: `src/styles/_animations.scss`, `_main.scss`



### 3.2 Replace `box-shadow` animation with opacity crossfade

`loaderAnimation` and `sunRays` animate `box-shadow` every frame. Use two pseudo-elements with static box-shadows and animate `opacity` between them (GPU-composited).



### 3.3 Throttle ParallaxDirective to requestAnimationFrame

Currently fires GSAP on every `mousemove` (60+/sec). Replace `@HostListener` with manual `addEventListener({ passive: true })` + `requestAnimationFrame` debounce.

- **File**: `src/app/directives/parallax.directive.ts`



### 3.4 Replace `transition: all` with specific properties

12 instances across `_main.scss`. Change to `transition: transform 0.2s, opacity 0.2s` etc.



### 3.5 Add `will-change: transform` on animated orbit/planet elements



---



## Phase 4 — Accessibility



### 4.1 Keyboard-accessible planets (Critical)

Galaxy planet divs have `(click)` but no keyboard support. Add `role="button"`, `tabindex="0"`, `(keydown.enter)`, `aria-label`.

- **File**: `src/app/galaxy/galaxy.component.html`



### 4.2 Accessible gallery modal

Add `role="dialog"`, `aria-modal="true"`, escape key handler, focus trap, change `<span>` close and `<a>` arrows to `<button>` elements.

- **Files**: `planet-detail.component.html`, `planet-detail.component.ts`



### 4.3 Screen-reader moon tooltips

Add `role="tooltip"`, `aria-describedby`, and `(focus)/(blur)` alongside mouse events on moon elements.



### 4.4 Menu button enhancements

Add `aria-expanded`, `aria-hidden="true"` on hamburger spans, `aria-label` on nav.



### 4.5 Touch target sizes

Increase `.menu__button` from 30×30 to 44×44px minimum.



### 4.6 Focus indicators

Add global `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`.



---



## Phase 5 — Responsive Design



### 5.1 Mobile layout (below 768px)

- `.wrapper` → `flex-direction: column; width: 100%`

- Planet detail planet → responsive sizing with `clamp()`

- `.info__controls` → remove 90° rotation, horizontal layout

- Galaxy view → further scale-down with touch-friendly planet sizes



### 5.2 Add missing breakpoint variables

`$bp-sm: 576px`, `$bp-md: 768px`, etc. in `_variables.scss`



---



## Phase 6 — Code Quality



### 6.1 Make VoiceService planet list data-driven

Inject `PlanetDataService`, load names from data instead of hardcoded array.



### 6.2 Clean up empty `app.scss`

Move inline styles from `app.ts` to `app.scss`, or delete the empty file.



### 6.3 Convert `VoiceService.isListening` to a signal

Currently a plain boolean that won't trigger change detection in zoneless mode.



---



# PLAN 2: New Features



### Feature 1: View Transitions (Planet Morph Animation)

**Effort: Small** | The config already has `withViewTransitions()` — just needs CSS.

- Add `[style.viewTransitionName]="planet.name"` on planet elements in both galaxy and detail views

- Add `::view-transition-old/new` CSS rules for smooth morph between routes

- Planets visually fly from their orbit position to the detail page



### Feature 2: Animated Orbit Speed Control

**Effort: Medium** | Slider on galaxy view to speed up/slow down orbits.

- `speed = signal(1)` in `GalaxyComponent`

- CSS custom property `--orbit-speed` on `#galaxy`, all orbit durations use `calc(var(--base) / var(--orbit-speed))`

- Preset buttons: "Real proportions" vs "Uniform speed" vs custom slider

- Neptune currently takes 27.5 minutes for one orbit — this makes it visible



### Feature 3: Planet Search (Ctrl+K)

**Effort: Medium** | Fuzzy search overlay for quick planet/moon navigation.

- `SearchDialogComponent` triggered by Ctrl+K or search icon

- Signal-based: `query = signal('')`, `results = computed()` filtering all planets + moons

- `role="combobox"`, `aria-autocomplete`, keyboard navigation of results

- Navigates to planet on selection



### Feature 4: Planet Comparison Tool

**Effort: Medium** | Side-by-side stat comparison of 2-3 selected planets.

- New route `/compare`, `PlanetCompareComponent`

- Multi-select from planet list, table/card view of stats

- Proportional size visualization from diameter data

- Data already exists in `planets.json` description fields



### Feature 5: Keyboard Shortcuts + Help Dialog

**Effort: Medium** | Arrow keys navigate planets, Escape → galaxy, `?` shows help.

- `KeyboardService` listening for `document:keydown`

- Tracks `currentPlanetIndex` from route

- Left/Right arrows cycle through planets in solar system order

- `KeyboardHelpComponent` modal with shortcut table



### Feature 6: Facts Carousel ("Did You Know?")

**Effort: Small** | Auto-cycling interesting facts on each planet detail page.

- Add `facts: string[]` to each planet in `planets.json`

- `FactsCarouselComponent` with `currentIndex = signal(0)`, auto-advance with `setInterval`

- Pause on hover/focus, manual next/prev

- Rendered as a new tab or floating card



### Feature 7: Fullscreen Immersive Mode

**Effort: Small** | Button to enter browser fullscreen via Fullscreen API.

- `FullscreenService` with `isFullscreen = signal(false)`, `toggle()` method

- Toggle button on galaxy + planet-detail views

- `.is-fullscreen` CSS class for enhanced visuals



### Feature 8: Sound Effects & Ambient Audio

**Effort: Medium** | Optional ambient space sounds and transition effects.

- `AudioService` with Web Audio API for SFX, `<audio>` for ambient

- `isMuted = signal(false)`, `volume = signal(0.3)`, persisted in localStorage

- Whoosh on route transitions, subtle ambient drone on galaxy view

- Mute toggle in UI



### Feature 9: Dark/Light Theme Toggle

**Effort: Medium** | Switchable themes, preference persisted in localStorage.

- Requires Phase 2.2 (CSS custom properties) first

- `ThemeService` with `theme = signal<'dark'|'light'>('dark')`

- `[data-theme]` attribute on root, two sets of custom properties

- Light theme: cream backgrounds, dark text, blue accent



### Feature 10: Progressive Web App (PWA)

**Effort: Small** | Installable, offline-capable via service worker.

- `ng add @angular/pwa` scaffolds manifest + service worker

- Cache all static assets (images, fonts, planets.json)

- Perfect fit — data is fully static, never changes



### Feature 11: Planet Size Comparison Visualization

**Effort: Medium** | Show planet at proportional size relative to Earth on detail page.

- Add numeric `diameterKm` to `planets.json`

- `relativeSize = computed(() => planet().diameterKm / EARTH_DIAMETER)`

- Small Earth reference circle, planet scaled proportionally

- GSAP entrance animation



---



## Verification

- After each phase: run `npx ng build` (zero errors/warnings), `npx jest` (all tests pass), and `npx ng serve` for visual verification

- Accessibility: test with keyboard-only navigation and screen reader

- Performance: check Chrome DevTools Performance tab for paint/layout thrashing

- Responsive: test at 1600px, 1200px, 992px, 768px, 375px viewports

