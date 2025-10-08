Theme / Design Tokens

Core colors are centralized in `src/app/globals.css` as CSS custom properties.

Primary variables:
- --background: page background
- --foreground: main text color
- --primary: brand primary color (use `.bg-primary` / `.text-primary` or `var(--primary)`) 
- --muted: muted surfaces
- --border: borders
- --grid-stroke: chart/grid lines
- --svg-fill: fallback for inline SVGs

Usage:
- Prefer `var(--primary)` in component styles for brand color.
- For SVG icons, set `fill="currentColor"` and control color with `.text-primary` or `style={{ color: 'var(--primary)' }}`.
- To change the primary brand color, edit `--primary` in `src/app/globals.css`. Dark mode variants are in the same file under the media query `prefers-color-scheme: dark`.

Notes:
- Recharts and some third-party components receive fallback styles in `globals.css` so charts match the site theme.
- If you use a design system or theme provider, make sure to sync those tokens with these variables.
