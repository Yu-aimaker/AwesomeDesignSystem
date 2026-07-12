# Marks and lockups

## Principle

A logo system is a responsive interface, not one file. Define the mark roles
before drawing variants. Original artwork is mandatory; never derive geometry
from a reference brand.

## Required contract

Each variant declares: stable ID; role (`wordmark`, `symbol`, `horizontal`,
`stacked`, `avatar`); preferred and fallback contexts; safe-area unit; minimum
CSS-pixel and print-mm size; aspect ratio; approved foreground/background
pairs; monochrome behavior; accessible name; file owner and version.

Selection order: available width → recognition need → context → background →
output medium. Use a lockup when the symbol is not independently recognizable;
use an avatar-specific optical crop only in avatar surfaces. Never silently
scale below the minimum: select a simpler approved variant.

## Misuse contract

Reject non-uniform scaling, recreation in text, unapproved color, effects,
cropping outside the avatar rule, insufficient contrast, busy backgrounds,
unapproved rotation, rearranged lockups, or partner marks inside the safe area.
Third-party use must record permission and must not imply endorsement.

## QA evidence

- Render every variant at minimum, typical, and maximum sizes on all approved backgrounds.
- Check intrinsic ratio, SVG view box, clipping, safe-area overlay, contrast, and raster sharpness.
- Test compact headers, app icons, social avatars, co-branding, print, RTL, and 200% zoom.
- Require visual approval for optical corrections; mathematical centering is not sufficient evidence.

## Agent rule

An agent may select from approved variants but may not redraw, recolor, distort,
or invent a lockup. Missing context produces a review request, not a new mark.

