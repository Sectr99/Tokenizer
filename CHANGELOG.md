# Changelog

## [2.1.0] - 2026-06-15

### Added
- **Image adjustments panel** — collapsible sidebar section with brightness, contrast, and saturation sliders (0–200, default 100)
- **Flip horizontal** — mirror the portrait with one click; click again to restore
- **Rotate 90°** — rotate the portrait clockwise in 90° increments
- **Reset adjustments** button — restores all sliders and transforms to default in one click
- All adjustments apply only to the portrait layer; the border is unaffected

## [2.0.0] - 2026-06-15

### Added
- Rebuilt UI with Tailwind CSS v4 and daisyUI v5
- Canvas-first layout: preview is the hero element with compact flanking sidebars
- Collapsible Safe Area panel with clip-radius slider and safe-ring overlay
- Cloudflare Pages deployment with auto CSS build via `wrangler.jsonc`
- Custom torch-glow dark fantasy theme

### Changed
- Moved from self-contained single-file to a build-step static site (Tailwind CLI)
- Header centered with flanking torch emojis using CSS grid (1fr auto 1fr)
- Layout capped at 1400px max-width, centered on wide displays

## [1.1.0] - 2025-06-14

### Added
- 9 high-quality hand-crafted token borders from asset sheet:
  Celtic Gold, Vine Serpent, Blood Ruby, Runic Amethyst,
  Sapphire Knot, Dragon Coil, Dwarven Rune, Iron Barb, Copper Vine
- Black background auto-stripped from border sheet on import

### Changed
- Replaced procedurally generated placeholder borders with real assets
- Iron Ring (original uploaded border) retained as first option

## [1.0.0] - 2025-06-14

### Added
- Initial release with dungeon-themed UI and animated background
- 9 procedural placeholder borders
- Portrait upload, drag/zoom/scale, transparent PNG export
