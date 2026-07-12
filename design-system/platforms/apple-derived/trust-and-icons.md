# Trust moments and icon systems

## Permission and trust contract

Ask when intent makes the benefit obvious, request the narrowest scope, and
explain purpose in plain language. A denial is a supported product state.

1. Show value without requiring speculative access.
2. Request at the action that needs access, not on launch.
3. Explain what, why, duration, destination, and whether processing leaves the
   device or organization.
4. Support deny, limited access, later enablement, and revocation.
5. Preserve unrelated functionality and never shame, obstruct, or repeatedly
   nag a person into consent.
6. For AI or consequential actions, expose uncertainty, preview effects,
   preserve human edit/undo, and define a do-not-build threshold when safeguards
   cannot bound harm.

Test first run, denial, restricted scope, revoked access, policy-managed access,
offline, account switching, shared devices, and deletion/export requests.

## Icon family contract

Distinguish interface glyphs, product/app icons, status marks, and badges. They
have different jobs and production constraints.

- Define meaning before form; one glyph must not carry unrelated meanings.
- Use a shared grid, baseline, optical weight, stroke logic, corner grammar,
  and filled/outlined state relationship.
- Pair unfamiliar or consequential glyphs with text. Tooltips do not replace
  accessible names.
- Mirror only when direction changes meaning; validate RTL and cultural or
  locale-specific interpretations.
- Color and animation may reinforce state but never carry it alone. Variable or
  animated states need a static, reduced-motion equivalent.
- Test at smallest rendered size, increased contrast, bold text, tinted and
  monochrome contexts, noisy backgrounds, and assistive technology output.
- Route Apple fonts, SF Symbols, Icon Composer files, templates, and product
  bezels to Apple's official downloads and licenses; do not redistribute them.

Sources: [Apple HIG Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy),
[SF Symbols guidance](https://developer.apple.com/design/human-interface-guidelines/sf-symbols),
[SF Symbols](https://developer.apple.com/sf-symbols/), and
[Icon Composer](https://developer.apple.com/icon-composer/), observed 2026-07-13.
