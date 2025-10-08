Theme / Design Tokens

The project centralizes colors in `src/app/globals.css`. Update tokens there to change global colors.

Brand Colors (applied in `:root`):
- Primary Green: `--primary: #02A684` — Use for logo, headers, navigation, important icons.
- Accent Saffron: `--accent: #F5A623` — Use for Add to Cart, special offers, highlights.

Text Colors:
- Main Text: `--foreground: #2D3748` (dark charcoal for readability)
- Headings: use `--primary` or `--foreground` (classes `.heading-primary` / `.heading-default`)
- Button Text: `--button-text: #FFFFFF` (white for button labels)

Background:
- Main Background: `--background: #FFFFFF` (clean white). You can use a very light gray like `#F8F9FA` if you prefer.

Helpers provided:
- `.bg-primary`, `.text-primary`, `.btn-primary`, `.btn-accent`, `.text-accent`, `.heading-primary`, `.heading-default`

SVGs in `public/` are converted to `fill="currentColor"` so they inherit `color`/`.text-*` classes.

To change the brand colors, edit `src/app/globals.css` and update the `:root` variables. Dark-mode variants live under the `prefers-color-scheme: dark` block.

