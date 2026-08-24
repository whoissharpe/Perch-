# Brand

## The name

**Perch.** A perch is any place you stop briefly and comfortably. It is short,
verbable ("perched at the miradouro"), and — the reason it beat the
alternatives — it does not cap the product at benches. When the map grows into
shade, fountains, low walls and step-free ledges, the name still fits. A name
like *BenchApp* would have needed replacing at exactly the moment replacing it
became expensive.

Rejected: *Loiter* (the policing connotation clashes badly with the
accessibility positioning), *Benchmark* (permanently SEO-poisoned by the
software and finance meanings), *Sitwell* (reads as a wellness brand).

## Voice

Plain, specific, unhurried. The product is about slowing down; the copy should
sound like it.

- Say the concrete thing. "Shade at 2pm", not "optimised comfort insights".
- Short sentences are allowed to be very short.
- Dry, never zany. The subject is already faintly funny; leaning on the joke
  makes it a one-post gag, which is precisely the failure mode.
- Never write "Elevate", "Seamless", "Unleash", "Next-gen", "Game-changer",
  "Delve", or "Discover the power of".
- No emoji, anywhere — not in UI, not in copy, not in alt text.

On accessibility copy specifically: write about people, not about compliance,
and never make someone's mobility sound like a market segment.

## Palette

Warm monochrome canvas with moss and clay as scarce spot colour. Colour is used
semantically — a rating that is filled, a tag that is confirmed — never as
decoration.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#fbf9f4` | `#14130f` | Page ground |
| `--canvas-raised` | `#fffdf9` | `#1c1a16` | Cards, nav |
| `--canvas-sunk` | `#f3efe6` | `#100f0c` | Bezel trays, bands |
| `--ink` | `#171512` | `#f3efe7` | Primary text — never pure black |
| `--ink-2` | `#423c33` | `#c9c1b4` | Body |
| `--muted` | `#7a7167` | `#8b8175` | Meta |
| `--moss` | `#46543f` | `#a8bb9c` | Filled ratings, confirmed tags |
| `--clay` | `#a6553c` | `#d89a80` | Step numerals, warnings |

No gradients as decoration. No glassmorphism outside fixed chrome (nav bar, map
HUD). No AI-default purple, ever.

## Type

| Role | Family | Notes |
|---|---|---|
| Display | Instrument Serif | `-0.028em` tracking, `0.94` line-height. Italic is the emphasis mechanism, paired with moss |
| UI and body | Plus Jakarta Sans | `1.62` line-height |
| Meta, eyebrows, numerals | JetBrains Mono | `0.2em` tracking, uppercase |

Banned: Inter, Roboto, Arial, Open Sans, Helvetica.

## Surfaces

Nothing premium sits flat on the canvas. The `.bezel` pattern is an outer tray
(sunk background, hairline border, 6px padding, 30px radius) holding an inner
plate (raised background, `24px` radius, inset top highlight). The radii are
concentric on purpose — mismatched corners are the single fastest way to make a
card look cheap.

Shadows are ultra-diffuse and low opacity. Harsh dark drop shadows are banned.

## Motion

- Easing is always `cubic-bezier(0.32, 0.72, 0, 1)` — weighted, physical.
  Never `linear`, never bare `ease-in-out`.
- Scroll entry: fade up 28px with a 6px blur dissolve, 900ms, staggered 90ms
  by index. Driven by `IntersectionObserver`, never a scroll listener.
- Buttons scale to `0.978` on press. The trailing arrow lives in its own
  circular well and translates diagonally on hover.
- Everything animates via `transform` and `opacity` only.
- `prefers-reduced-motion` disables all of it and reveals content immediately.

## The mark

A dot resting on a bench: circle above a horizontal rail with two legs and a
stretcher. Four strokes, `1.6` weight, `currentColor`. It reads as a person on
a bench, a bird on a perch, and a map pin, which is the whole product in one
glyph.
