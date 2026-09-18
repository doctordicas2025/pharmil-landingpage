# Pharmil — Design System

Extracted from the codebase on 2026-09-18 by frequency analysis of `styles/*.css`
and `components/**/*.tsx`, then resolved into a single system.

This file is the source of truth. Where it disagrees with `.impeccable/design.json`
(generated 2026-08-04, before the redesign), this file wins — that snapshot still
describes components that no longer exist.

---

## Intent

**Who:** Someone comparing suppliers of a high-value, cold-chain pharmaceutical
product on a phone, usually at night. They have been burned by vague sellers. They
are not browsing — they are verifying.

**What they must do:** Confirm the thing is real and traceable, then reach a human.
Every path terminates in WhatsApp.

**How it must feel:** Clinical warmth. Not the cold blue of a lab, not the soft
pastel of wellness. Paper and pharmacy — a printed lab report, an orange seal on a
white box. The product photography is cold (glass, foil, blue labels); the interface
around it is warm (paper, wine, peach). That contrast is the point: the interface
is the hand holding the vial, not the vial.

---

## Color

13 tokens in `styles/tokens.css`, all oklch. **Zero hardcoded hex in CSS** — this
discipline is intact and must stay that way.

| Token | Role | Uses |
|---|---|---|
| `--color-paper` | base surface, text on dark | 42 |
| `--color-wine` | primary action, price, link | 41 |
| `--color-line` | borders, all separation | 21 |
| `--color-ink` | primary text, footer ground | 21 |
| `--color-muted` | secondary text | 19 |
| `--color-orange` | numerals, icons, accents | 11 |
| `--color-red` | CTA hover, display emphasis, CTA band | 10 |
| `--color-surface` | section alternation, image wells | 7 |
| `--color-peach` | halos, hover fills | 5 |
| `--color-navy` | cold-chain section only | 2 |
| `--color-focus` | focus ring | 1 |

**One accent, three registers.** Wine acts, red heats (hover, emphasis), orange
marks (numerals, icons). They are one family walking up in lightness and chroma —
never three competing accents. Navy appears exactly once, for the cold-chain
section, and that scarcity is what gives it meaning: it is the only cold surface
in a warm system.

**Gaps:**
- **Text hierarchy is two levels** (`ink`, `muted`). A third level for metadata
  would stop `muted` from doing two jobs.
- `--color-wine-deep` and `--color-navy-light` are declared and never used.
- Eight product tints live as raw hex in `lib/catalog.ts` (`#FFF3E6`, `#ECF0F7`, …).
  They are per-product photographic backdrops, not UI surfaces, so keeping them as
  data is defensible — but they are outside the system and should be labeled as such.

---

## Typography

**Archivo Variable** (400–900), local, one family for display and body. No serif,
no mono.

Weight carries the hierarchy, not size alone:

| Weight | Role |
|---|---|
| 900 | display, section titles, prices, stat figures |
| 800 | buttons, labels, card titles, nav headings |
| 700 | body emphasis, FAQ questions, nav links |
| 600 | chips, fact values |
| 400 | body |

Tracking is the tell: **negative tightens display, positive opens labels.**

| Tracking | Applied to |
|---|---|
| `-0.045em` | hero display |
| `-0.035em` | section titles, modal title |
| `-0.02em` | card titles, prices |
| `+0.1em` → `+0.14em` | uppercase labels and buttons |

Every heading is fluid: `clamp(min, vw, max)`. Never a fixed heading size.

---

## Spacing

**The codebase forked.** The redesign introduced a px scale that bypasses the rem
tokens. Measured: 20px (19×), 18px (13×), 16px (11×), 14px (10×), 28px (9×),
24px/22px/12px (8× each) — against a legacy rem set led by 1rem (12×) and 0.5rem (5×).

**Resolution: px is canonical for layout, rem stays for type-relative insets.**
The px scale is what production renders and what the design handoff specified as
final. Base unit **2px**, practical scale:

```
4 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 48
```

**Section rhythm:** `clamp(56px, 8vw, 92px)`, top padding only — sections stack
their own space and never add bottom padding. This is the single most repeated
value in the system (8×) and must not be varied.

> `--section-space: clamp(5.5rem, 10vw, 9.5rem)` in tokens.css is a **stale legacy
> rhythm** (88–152px). It does not match production (56–92px) and is used twice.
> Do not reach for it.

**Page gutter:** 20px flat. **Container:** `--content-width` (82rem / 1312px).

---

## Radius

Measured: `999px` (12×), `22px` (5×), then singletons at 28, 26, 18, 16, 12.

The pill is the system's loudest signal — every action is fully round. Cards are
22px. The scattered singletons are the weak point.

**Resolution:**

| Value | Applies to |
|---|---|
| `999px` | buttons, pills, filters, badges, icon buttons |
| `22px` | cards — product, step, testimonial, category |
| `26–28px` | modal dialog, CTA band (larger surfaces only) |
| `12–16px` | icon containers, thumbnails |
| `50%` | avatars, dots |

> `--radius-md` is declared and unused. The `--radius-*` token scale (8/16/28/44px)
> does not match the values production actually uses. Tokens describe an older system.

---

## Depth

**Borders-primary.** 30 border declarations against 11 `box-shadow` and 3
`drop-shadow`. Commit to this.

- **Structure** is always `1px solid var(--color-line)`. Filters use `1.5px` to
  survive the pill shape.
- **Shadow is reserved for motion and lift** — never for resting structure. It
  appears on hover (`translateY(-3/-4px)` + wine-tinted shadow), on the primary CTA,
  and on floating product cutouts (`drop-shadow`).
- **Hover shadows are wine-tinted, never neutral black.** `color-mix(in oklch,
  var(--color-wine) 14–15%, transparent)`. A gray shadow on this palette reads dirty.

Sections separate by **background change** (paper → navy → paper → red band → ink),
not by rules.

---

## Motion

Two easing curves, two jobs — do not cross them.

| Curve | Job | Durations |
|---|---|---|
| `cubic-bezier(.16, 1, .3, 1)` (`--ease-out`) | UI response | 180ms hover, 200ms fade, 280ms dialog |
| `cubic-bezier(.45, 0, .55, 1)` | ambient loops | 5.2s float, 8.2s sway, 6.4/7.6s drift |

Deceleration for anything the user caused. Sinusoidal-with-`alternate` for anything
that runs on its own — `ease-in-out` visibly stalls at the extremes of a loop.

**Loop durations are deliberately coprime** (5.2s vertical vs 8.2s lateral) so the
hero showcase never resolves into a mechanical beat.

**Reduced motion:** the global reset in `base.css` excludes `[data-float]`,
`[data-ground]` and `[data-sway]`. This is a **conscious accessibility trade** — the
three showcase animations are interdependent, and freezing them mid-course separates
the object from its own shadow. Revisit if anyone reports discomfort; the honest fix
is a static composed frame, not a frozen one.

---

## Component patterns

| Pattern | Spec |
|---|---|
| **Primary CTA** | `18px 32px`, pill, 800, `+0.1em`, uppercase, wine → red on hover, `translateY(-3px)` |
| **Inline buy button** | `12px 16px`, pill, 800, `flex: 1` |
| **Filter pill** | `11px 20px`, pill, `1.5px` border, 700; active inverts to wine fill |
| **Card** | `1px` line, `22px` radius, paper ground, `translateY(-4px)` + wine shadow on hover |
| **Card media well** | `216px` fixed height, product tint ground, cutout inset `16px` `object-fit: contain` |
| **Icon container** | `38×38`, `12px` radius, `1px` line, paper ground |
| **Icon button** | `44×44` — the minimum touch target, never smaller |
| **Text link** | `1.5px` bottom border at 30% wine, opaque on hover |
| **Modal** | `26px` radius, `900px` max, `88vh` cap, ink overlay at 55% + `blur(3px)` |
| **Eyebrow label** | `0.72–0.76rem`, 800, `+0.12em`, uppercase, wine or orange |

All grids are `auto-fit`/`auto-fill` + `minmax()`. **Layout never uses breakpoints** —
columns collapse on their own through `minmax()`. Media queries only handle what
fluid sizing cannot: swapping the nav for a menu, and loosening touch targets.

Six width breakpoints exist, which is more than the system needs:

| Breakpoint | px | Job |
|---|---|---|
| `72rem` | 1152 | desktop nav → mobile menu |
| `62rem` | 992 | footer columns |
| `53.75rem` | 860 | CTA band, footer legal row |
| `48rem` | 768 | header height, hero display size |
| `40rem` | 640 | hero action stack |
| `28rem` | 448 | touch adjustments |

`53.75rem` is an artifact of the design handoff's `860px`, unrelated to the rem
ladder around it. Consolidating to three (`72rem` / `48rem` / `28rem`) is safe
cleanup — the middle three each govern a single rule.

---

## Rules

1. **No hex in CSS.** Every color resolves to a token. The codebase is at zero
   violations — keep it there.
2. **One accent family.** Wine acts, red heats, orange marks. Nothing else earns color.
3. **Borders structure, shadows lift.** Never a resting shadow.
4. **Sections pad top only,** `clamp(56px, 8vw, 92px)`.
5. **Actions are pills.** Cards are 22px. No new radius values.
6. **Weight before size** for hierarchy; tracking negative on display, positive on labels.
7. **Navy is scarce by design.** One section. Spending it again cheapens it.
8. **Fluid over breakpoints.** Reach for `clamp` and `auto-fit` first.

## Known debt

- `tokens.css` describes the pre-redesign system: `--section-space`, the `--radius-*`
  scale, `--color-wine-deep` and `--color-navy-light` no longer match production.
  Reconciling them is a mechanical but visual-risk change — do it deliberately, not
  in passing.
- Light-mode text hierarchy has two levels where it wants three.
- Six width breakpoints where three would do (see Component patterns).
- No dark mode. The palette is built on `paper`; inverting is not a token flip.
- Token names describe pigments (`wine`, `peach`, `paper`), not this product's world
  (`vial`, `seal`, `thermal`, `frost`). They pass the "evocative" bar but evoke a
  stationery shop rather than a cold chain. Worth revisiting if the brand is ever
  re-articulated — not worth a rename on its own.
