# McLaren Frames — Interactive Enhancement Plan

## Goal
Deepen existing sections with interactive elements and add a site-wide UX layer. No new image assets — use only the existing 9 PNGs and 192 frame JPGs.

---

## Phase 1: Foundation (Site-Wide Infrastructure)

### 1.1 GSAP Plugin Consolidation
**Create** `lib/gsap.ts`
- Centralize all plugin registration (`ScrollTrigger`, `ScrollToPlugin`) in one file
- All components import from `@/lib/gsap` instead of directly from `gsap`

### 1.2 Scroll Context
**Create** `context/ScrollContext.tsx`
- React Context providing: `scrollProgress` (0-1), `activeSection`, `sections` registry, `scrollToSection()` (uses GSAP ScrollToPlugin), `frameLoadProgress`, `imagesReady`
- Single `requestAnimationFrame` scroll listener + Intersection Observer for active section detection
- High-frequency values (`scrollY`) stored in refs to avoid unnecessary re-renders

**Modify** `app/layout.tsx`
- Wrap `{children}` with `<ScrollProvider>`

### 1.3 Section ID Anchoring
**Modify** each component's top-level element:
- `HeroSection.tsx` → `id="hero"`, register "Home"
- `BrandHistory.tsx` → `id="history"`, register "History"
- `F1Racing.tsx` → `id="racing"`, register "Racing"
- `CarModels.tsx` → `id="models"`, register "Models"

### 1.4 Loading Screen
**Create** `components/LoadingScreen.tsx`
- Fixed overlay `z-[100]` with `bg-carbon-black`, "McLAREN" text in Orbitron, thin orange progress bar, percentage counter with `tabular-nums`
- Reads `frameLoadProgress` / `imagesReady` from ScrollContext
- Exit animation: bar fills to 100%, title scales up + fades, overlay slides up (`y: -100vh`), then calls `ScrollTrigger.refresh()`
- Locks `overflow: hidden` on `<html>` during load; minimum 1.5s display time to avoid flash

**Modify** `components/ScrollCanvas.tsx`
- In the image preload loop (line 22-26), call `setFrameLoadProgress(Math.round((loadedCount / frameCount) * 100))` on each `img.onload`

**Modify** `app/page.tsx`
- Add `<LoadingScreen />` as first child

### 1.5 Sticky Navigation Bar
**Create** `components/Navbar.tsx`
- `fixed top-0 z-[60]`, `bg-carbon-black/80 backdrop-blur-md`
- Left: "McLAREN" logo in orange Orbitron
- Right: section links reading from context; active link has orange underline (CSS transition)
- Smart hide/show: transparent over hero, solid background after ~100vh, hides on scroll-down, shows on scroll-up
- 2px orange progress bar along bottom edge: `scaleX` driven by ScrollTrigger on `document.body` from `top top` to `bottom bottom`
- Mobile: hamburger menu opening full-screen overlay with section links

**Modify** `app/page.tsx`
- Add `<Navbar />`

### 1.6 Keyboard Navigation
**Create** `hooks/useKeyboardNav.ts`
- ArrowDown / Space / PageDown → next section
- ArrowUp / PageUp → previous section
- Home → hero, End → models
- Escape → close any open modal
- Disabled when input is focused or modal has own keyboard handling
- When `activeSection === "models"`: ArrowLeft/Right dispatches custom `carNav` event for car switching

**Modify** `app/page.tsx`
- Call `useKeyboardNav()` at page level

---

## Phase 2: Section Enhancements

### 2.1 HeroSection — Parallax + Progress Ring
**Modify** `components/HeroSection.tsx`

**Parallax depth:** Add varying `yPercent` ScrollTrigger animations to the 3 `.hero-text-block` elements (speeds: 0.3, 0.5, 0.7) — first block scrolls slowest, third fastest. Subtle alternating `x` offset on subtexts.

**Scroll progress ring:** Replace the "Scroll to Explore" text (lines 115-123) with an SVG circle progress indicator:
- Outer circle: `stroke: white/10`
- Inner circle: `stroke: mclaren-orange`, `strokeDashoffset` animated from full circumference to 0 via ScrollTrigger scrub
- "SCROLL" label centered inside
- Existing fade-out ScrollTrigger on `scrollIndicatorRef` continues to work

### 2.2 BrandHistory — Era Navigation + Hover States
**Modify** `components/BrandHistory.tsx`

**Era state tracking:** Add `useState<number>(0)` for `currentEra`. Insert `tl.call(() => setCurrentEra(n))` at transition points in the existing GSAP timeline.

**Era navigation dots:** Fixed vertical column on the right side (`right-6 top-1/2 -translate-y-1/2 z-30`):
- 3 dots, active one is filled orange + scaled up, inactive are hollow white/30
- Year label appears on hover, always visible for active era
- Click calculates target scroll position from the ScrollTrigger's `start`/`end` and uses GSAP `scrollTo`

**Large era year indicator:** Bottom-left `text-[10rem] font-display text-white/5` showing the start year of current era, fades in/out with `useEffect` watching `currentEra`.

**Quote card hover states (CSS only):**
- `hover:bg-white/15 hover:border-l-[6px]` on wrapper
- `group-hover:text-mclaren-orange/90` on blockquote text
- `group-hover:tracking-[0.3em]` on author footer

### 2.3 F1Racing — Animated Counters + Expandable Cards
**Modify** `components/F1Racing.tsx`

**Animated counters:** Use GSAP object tween `{ val: 0 }` → `{ val: parseInt(stat.value) }` with `onUpdate` setting `el.textContent` directly (avoids React re-renders). Triggered via ScrollTrigger at `top 85%`, `power2.out` ease, 2s duration. Add `tabular-nums` class.

**Expandable stat cards:** Add `details` arrays to each stat (key milestone years/events). Click toggles `expandedCard` state. Details panel uses `max-h-0 → max-h-80` + `opacity-0 → opacity-100` CSS transition. Each detail row shows year in orange + description. Small chevron rotates 180deg when expanded.

**Hover micro-interactions (CSS only):**
- `hover:scale-[1.02]` on card
- `hover:border-l-4 hover:border-l-mclaren-orange` left accent
- Subtle `before:bg-mclaren-orange/5` glow overlay

### 2.4 CarModels — Working Modals + Dots + Hover Zoom
**Create** `components/CarSpecModal.tsx`
- Full-screen modal `fixed inset-0 z-[70]`, backdrop `bg-carbon-black/95 backdrop-blur-lg`
- Shows car image (scaled in), model name, year, and spec grid (engine, power, torque, 0-60, top speed, weight, price, transmission)
- Entry animation: backdrop fade → panel slide up → image scale → spec rows stagger
- Close on Escape or backdrop click

**Modify** `components/CarModels.tsx`

**Add spec data** to each model object (engine, power, torque, 0-60, top speed, weight, price, transmission).

**Wire "Discover More" buttons:** `onClick={() => setSelectedModel(model)}`, render `<CarSpecModal>` when `selectedModel` is set.

**Image hover zoom:** `overflow-hidden` on image container, `group-hover:scale-110 transition-transform duration-700` on `<Image>`.

**Active car indicator dots:** Track `activeCar` via `onUpdate` callback on the existing ScrollTrigger. 3 dots at `bottom-10 right-10`: active dot becomes an orange pill (`w-8`), inactive are small circles. Click each dot to scroll to that car using the ScrollTrigger's position math.

**Keyboard car navigation:** Listen for `carNav` custom events dispatched by `useKeyboardNav`. ArrowLeft/Right scrolls to prev/next car within the horizontal scroll section.

---

## Phase 3: Polish

### 3.1 Section Dividers
**Modify** `app/page.tsx`
- Add `<div className="h-px bg-gradient-to-r from-transparent via-mclaren-orange/30 to-transparent" />` between BrandHistory, F1Racing, and CarModels

### 3.2 ScrollTrigger Refresh
- Call `ScrollTrigger.refresh()` in loading screen's exit `onComplete` callback + a 100ms `setTimeout` buffer to recalculate all trigger positions after layout stabilizes

### 3.3 Responsive Polish
- Navbar: hamburger menu on mobile < 768px
- BrandHistory dots: move to bottom center horizontal on mobile
- CarModels dots: work via native `scrollIntoView` on mobile (horizontal GSAP already disabled via `matchMedia`)

---

## File Manifest

### New files (6)
| File | Purpose |
|------|---------|
| `lib/gsap.ts` | Centralized GSAP + plugin registration |
| `context/ScrollContext.tsx` | Scroll state, section registry, smooth scroll API |
| `components/LoadingScreen.tsx` | Animated preloader with progress bar |
| `components/Navbar.tsx` | Sticky nav + scroll progress bar |
| `components/CarSpecModal.tsx` | Full-screen car specification modal |
| `hooks/useKeyboardNav.ts` | Keyboard section/car navigation |

### Modified files (8)
| File | Changes |
|------|---------|
| `app/layout.tsx` | Wrap children with `<ScrollProvider>` |
| `app/page.tsx` | Add LoadingScreen, Navbar, section dividers, keyboard hook |
| `app/globals.css` | Any additional utility classes needed |
| `components/ScrollCanvas.tsx` | Report frame load progress to context |
| `components/HeroSection.tsx` | Section ID, parallax, progress ring |
| `components/BrandHistory.tsx` | Section ID, era dots, era indicator, quote hovers |
| `components/F1Racing.tsx` | Section ID, animated counters, expandable cards, hover effects |
| `components/CarModels.tsx` | Section ID, specs data, modal trigger, image zoom, dots, keyboard nav |

---

## Build Order
1. `lib/gsap.ts` (consolidation)
2. `context/ScrollContext.tsx` + `app/layout.tsx` (wrap provider)
3. Section ID anchoring (all 4 components)
4. `components/LoadingScreen.tsx` + `ScrollCanvas.tsx` changes
5. `components/Navbar.tsx` + progress bar
6. `hooks/useKeyboardNav.ts`
7. `HeroSection.tsx` enhancements (parallax + ring)
8. `BrandHistory.tsx` enhancements (dots + indicator + hovers)
9. `F1Racing.tsx` enhancements (counters + expandable + hovers)
10. `CarModels.tsx` + `CarSpecModal.tsx` (modal + zoom + dots + keyboard)
11. Section dividers + responsive polish
12. Final `ScrollTrigger.refresh()` integration + testing

---

## Verification
1. `npm run dev` — site loads, loading screen shows progress, dismisses smoothly
2. Scroll through all sections — navbar highlights correct section, progress bar tracks scroll
3. BrandHistory — era dots appear, clicking jumps to correct era, quote hovers work
4. F1Racing — numbers count up on scroll into view, cards expand on click
5. CarModels — "Discover More" opens modal with specs, image zoom on hover, dots track active car
6. Keyboard — arrow keys navigate sections, left/right navigate cars in models section, Escape closes modal
7. Mobile — hamburger nav works, vertical layouts maintained, no horizontal scroll bugs
8. `npm run build` — no TypeScript or build errors
