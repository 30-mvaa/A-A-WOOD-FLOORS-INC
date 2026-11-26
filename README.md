# A&A Wood Floors website

Static site (HTML + CSS + JS), no build step or dependencies.

## Files
- `index.html` - page content (all sections)
- `styles.css` - styles (colors are CSS variables at the top, in `:root`)
- `script.js` - estimator calculator, project filters, contact form
- `assets/beaver.webp` - mascot image

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel/FTP).

## Things to customize
- Estimator price ranges: `value="4,7"` on each `<option>` in `index.html` (price per sq ft, min,max).
- Contact form: currently opens the visitor's email app (`mailto:`). Connect it to Formspree, Netlify Forms, or your backend to receive submissions directly.
