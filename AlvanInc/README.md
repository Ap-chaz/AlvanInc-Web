# AlvanInc

Personal portfolio site. See `design.md` for the phased build plan.

Plain JavaScript + React (JSX) + Vite + Tailwind CSS v4 + React Router.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview
```

## Structure

- `index.html` – entry HTML, fonts and default meta tags
- `src/main.jsx` – React entry, mounts `<BrowserRouter>`
- `src/App.jsx` – all routes
- `src/pages/` – one file per page
- `src/components/alvan/` – site components
- `src/lib/use-head.js` – sets page title and meta tags per route
- `src/index.css` – Tailwind + brand tokens/styles
- `public/` – images, favicon, robots.txt, sitemap.xml

## Deploying

`vercel.json` (Vercel) and `public/_redirects` (Netlify/Cloudflare Pages) send every path to
`index.html` so deep links like `/work/zuno` work on refresh.
