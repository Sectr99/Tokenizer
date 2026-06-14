# 🔥 Token Forge

> A self-contained, browser-based VTT token maker for Roll20, Foundry VTT, OwlBear Rodeo, and any other virtual tabletop platform.

![Token Forge](https://img.shields.io/badge/version-1.0.0-gold) ![License](https://img.shields.io/badge/license-MIT-blue) ![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

---

## ✨ Features

- **Upload any portrait** — PNG, JPG, or WEBP
- **9 built-in borders** — Iron Ring, Gold Signet, Blood Pact, Arcane, Nature, Spectral, Infernal, Draconic, Ancient Stone
- **Drag to reposition** — click and drag the portrait inside the token frame
- **Scroll to zoom** — mousewheel over the preview to scale
- **Independent X/Y scaling** — stretch horizontally or vertically with separate sliders
- **Custom borders** — upload your own 512×512 PNG border at any time
- **Export** — downloads a 512×512 transparent PNG ready for any VTT

## 🚀 Usage

No installation, no server, no dependencies. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/Sectr99/Tokenizer.git
cd Tokenizer
open index.html
```

Or download the ZIP and open `index.html` directly.

## 🖼 Custom Borders

To use your own border art:

1. Create a **512×512 PNG** with a transparent background
2. Design your border ring in the center, leaving the middle clear for the portrait
3. Click **+ Add custom border** in the app to load it

## 📁 Project Structure

```
Tokenizer/
├── index.html        # The entire app — self-contained
├── README.md         # This file
├── LICENSE           # MIT License
├── .gitignore        # Git ignore rules
└── CHANGELOG.md      # Version history
```

## 🗺 Roadmap

- [ ] More preset border styles
- [ ] Color tint overlay per border
- [ ] Token size presets (Small / Medium / Large / Huge)
- [ ] Text label beneath token
- [ ] Batch export

## 📜 License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.
