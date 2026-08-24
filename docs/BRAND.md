# Brand

## The name

**Perch.** A perch is any place you stop briefly and comfortably. Short,
verbable ("perched at the miradouro"), and — the reason it beat the
alternatives — it does not cap the product at benches. When the map is mostly
ridges and rock ledges, the name still fits.

Rejected: *Loiter* (the policing connotation clashes with the accessibility
angle), *Benchmark* (permanently SEO-poisoned by the software meaning),
*Sitwell* (reads as a wellness brand).

## The mark

A slender bird in a bow tie, perched on a park bench. Fine monoline, one
uniform stroke weight, rounded caps, drawn in a single pine green.

It earns its place three ways: the bird *is* the name, the bench says what the
product is about, and the bow tie is the whole personality in one detail —
this is a product about sitting still and enjoying something, treated with
slightly more ceremony than it strictly needs.

Master file: `apps/web/public/logo.png`, transparent. Every other size — iOS
icon, Android adaptive foreground, splash, favicon — is generated from it by
`npm run icons`. Do not hand-edit the derivatives.

At sizes below about 28px the bench stops resolving and the mark reads as a
smudge. Use the wordmark alone there.

## Palette

Crisp paper, one deep pine, and blaze orange reserved strictly for map
semantics. **If something is orange it means something on the map** — a pin, a
new mark, your location, the capture button. Colour is never decoration here.

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#fcfcfa` | `#0e1613` | Page ground |
| `surface` | `#ffffff` | `#16211d` | Cards, nav, sheets |
| `sunk` | `#f0f3f0` | `#0a100e` | Bands, map ground |
| `ink` | `#16211d` | `#edf2ef` | Primary text — never pure black |
| `body` | `#3d4a45` | `#c3cfc9` | Body copy |
| `muted` | `#77837d` | `#7e8c86` | Meta, coordinates |
| `pine` | `#1c4034` | `#8fbba6` | The brand. Primary actions, the mark |
| `blaze` | `#e1622f` | `#f2814f` | Map semantics only |

The neutral is biased warm-green toward the pine rather than a pure grey, so it
reads as chosen rather than inherited.

Single source of truth: `packages/core/src/theme.ts`. The web mirrors it as CSS
custom properties in `apps/web/app/globals.css`.

## Type

| Role | Family | Notes |
|---|---|---|
| Display | **Fraunces** | `SOFT 30, WONK 1`. The wonk is the point — it matches the hand-drawn quality of the mark. Request the axes explicitly in the Google Fonts URL or they silently do nothing |
| Body & UI | **Instrument Sans** | `1.6` line-height |
| Coordinates, meta, eyebrows | **Space Mono** | Uppercase, `0.06em` tracking |

Banned: Inter, Roboto, Arial, Open Sans, Helvetica.

Every spot card carries its real coordinates in Space Mono. This is not
decoration — a shared map should say where things are, and it is the detail
that stops the cards looking like generic social posts.

## Voice

Plain, specific, unhurried. The product is about slowing down; the copy should
sound like it.

- Say the concrete thing. "Shade at 2pm", not "optimised comfort insights".
- Short sentences are allowed to be very short.
- Dry, never zany. The subject is already faintly funny; leaning on the joke
  turns it into a one-post gag, which is exactly the failure mode.
- Never: "Elevate", "Seamless", "Unleash", "Next-gen", "Game-changer",
  "Discover the power of".
- No emoji anywhere — not in UI, not in copy, not in alt text.

On accessibility copy: write about people, not compliance, and never make
someone's mobility sound like a market segment.

## Motion

- Easing is `cubic-bezier(0.32, 0.72, 0, 1)` — weighted, physical. Never
  `linear`, never bare `ease-in-out`.
- Scroll entry: fade up 22px over 800ms, staggered 80ms by index, driven by
  `IntersectionObserver` — never a scroll listener.
- Buttons scale to `0.975` on press.
- `transform` and `opacity` only.
- `prefers-reduced-motion` disables all of it and reveals content immediately.

## Structure

Numbering means sequence. The three steps in "How it works" are numbered
because they happen in order. Parallel facts are not numbered, because implying
an order that does not exist is a lie told in furniture.
