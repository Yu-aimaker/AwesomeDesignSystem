# Discovery and mobility: Gestalt and Uber Base

## Pinterest Gestalt — media is content with state

**Pages:** [Gestalt](https://gestalt.pinterest.systems/), [accessibility](https://gestalt.pinterest.systems/web/accessibility), and [implementation](https://github.com/pinterest/gestalt).

Image-led discovery needs predictable loading, aspect-ratio reservation, meaningful alternatives, responsive composition and component-quality visibility. Masonry is appropriate only when visual comparison outweighs strict reading order.

**AwesomeDS adoption:** media components declare intrinsic dimensions or aspect ratio, loading/error/empty states, alt-text policy, focal cropping behavior, directionality, bandwidth strategy and keyboard/screen-reader traversal. Each component publishes a quality status rather than implying equal maturity.

**Do not copy:** Pinterest's feed model, masonry by default, visual identity or engagement mechanics. Use linear order when sequence, comprehension or task completion depends on it.

## Uber Base and Base Web — separate brand doctrine from implementation

**Pages:** [Base](https://base.uber.com/), [Base Web](https://baseweb.design/), and [Base Web source](https://github.com/uber/baseweb).

Base is a company design language; Base Web is an open implementation artifact. Treating them as interchangeable hides scope and licensing differences. Their strongest transferable contexts are mobility, maps, global localization, multimodal input, status under changing real-world conditions and extensible component composition.

**AwesomeDS adoption:** map/mobility surfaces must expose location freshness, permission state, uncertainty, route/status changes, offline degradation and a non-map alternative. Component overrides are governed escape hatches: typed, documented, tested and measured for divergence.

**Do not copy:** Uber identity, mobility assumptions or override-heavy APIs as the default. Extension power without constraints turns a system into unrelated forks.

## Combined doctrine

- Preserve a stable semantic and DOM order even when visual layout reflows.
- Reserve geometry before media loads; never let a stream or grid shift the active target.
- Make freshness and uncertainty visible for location, availability and remote state.
- Provide list/text alternatives to spatial or image-dominant representations.
- Track component maturity: researched, specified, implemented, tested, adopted, measured.
- Treat overrides as debt with owner, reason, expiry and regression coverage.
