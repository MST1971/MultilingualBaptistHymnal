## Objectives

* Create a "DocView" page that displays app documentation (Markdown, with optional PDF support) inside the existing React app.

* Provide routing at `/docs` and `/docs/:doc` and add navigation so users can easily access docs.

* Keep style and theme consistent with the app.

## Integration Points

* **Routing**: Update `src/App.js` routes (near `src/App.js:42–58`) to include:

  * `Route path="/docs"` → default document (overview)

  * `Route path="/docs/:doc"` → dynamic docs by slug

* **Navigation**: Add a "Docs" link to `src/components/MobileNav.js` (near `src/components/MobileNav.js:25–87`). Optionally add a link in `Navbar.js`.

## Data & Content

* Place Markdown files under `public/docs/` so CRA can serve them directly:

  * `overview.md` (what the app is, features, structure)

  * `usage.md` (how to use the app pages)

  * `data-schema.md` (explain hymn data structure from `src/data/Edition1956.js`)

* Optional: support PDFs by placing them in `public/docs/` and rendering with a viewer if needed.

## Component Design: `DocView`

* **Location**: `src/components/DocView.js` with `DocView.css` for styles.

* **Behavior**:

  * Read `doc` from URL params; default to `overview` if none.

  * Map slugs (e.g., `overview`, `usage`, `data-schema`) to file paths in `public/docs/`.

  * Fetch the selected `.md` file and render via Markdown.

  * Show a sidebar with a simple table of contents: Overview, Usage, Data Schema.

  * Provide in-page search across the loaded doc (basic keyword filter).

  * Respect `theme` prop for light/dark styles.

* **Dependencies**:

  * Add `react-markdown` and `remark-gfm` for Markdown rendering.

  * Optional: `highlight.js` for code block syntax highlighting.

* **Fallbacks**:

  * If the `doc` slug is unknown or fetch fails, show a friendly 404 with links to available docs.

## Styling

* Use CSS classes consistent with existing components (`*-container`, `*-title`, etc.).

* Support the existing theme states (`light`, `dark`, `blue`) passed from `App`.

## Testing & Verification

* Add route tests verifying `/docs` renders Overview and `/docs/usage` renders Usage.

* Smoke test navigation: links from MobileNav to Docs open and render content.

* Manual check in browser that Markdown renders and theme toggles work.

## Security & UX Notes

* Render Markdown safely; no script execution. Set external links to `target="_blank"` with `rel="noopener noreferrer"`.

* Keep docs small and load on demand; avoid bundling docs into JS for faster startup.

## Steps After Approval

1. Create `DocView.js` and `DocView.css` in `src/components`.
2. Add routes in `src/App.js` and import the component.
3. Add a "Docs" link in `MobileNav.js` (and `Navbar.js` if desired).
4. Add Markdown files in `public/docs/` (`overview.md`, `usage.md`, `data-schema.md`).
5. Install `react-markdown` and `remark-gfm` (and `highlight.js` optionally).
6. Run `npm start` and verify at `http://localhost:3000/docs`.

