# Creator Sync Premium Landing Page

A modern React 18 + Vite landing page with Tailwind CSS, React Three Fiber (Three.js), and Framer Motion.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Three Fiber + Drei + Three.js
- react-intersection-observer
- react-countup

## Project Structure

```text
.
|- public/
|  |- placeholders/
|- src/
|  |- assets/
|  |- components/
|  |  |- Footer.jsx
|  |  |- Hero.jsx
|  |  |- ImagePlaceholderSection.jsx
|  |  |- LogoMarquee.jsx
|  |  |- Navbar.jsx
|  |  |- StatsCounters.jsx
|  |  |- ToggleSection.jsx
|  |- scenes/
|  |  |- GlobeCanvas.jsx
|  |- App.jsx
|  |- index.css
|  |- main.jsx
|- index.html
|- package.json
|- postcss.config.js
|- tailwind.config.js
|- vite.config.js
```

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Asset Placeholders

- Main logo is currently: `public/placeholders/logo-placeholder.svg`
- Add final logo and update imports in:
  - `src/components/Navbar.jsx`
  - `src/components/LogoMarquee.jsx`
- Image placeholders are in:
  - `src/components/ImagePlaceholderSection.jsx`

When you share your real 3D model (GLB/GLTF), replace procedural globe logic in:

- `src/scenes/GlobeCanvas.jsx`

## Performance Notes

- Heavy visual sections are lazy loaded via `React.lazy` + `Suspense`.
- Three.js canvas uses DPR cap (`dpr={[1, 1.5]}`) to limit GPU load.
- Orbit controls disable zoom/pan to avoid unnecessary interaction cost.
- Simple reusable SVG logos keep the marquee lightweight.
- Stats counters only start after viewport intersection.

## Accessibility Notes

- Semantic sections, button labels, and ARIA state (`aria-pressed`) are included.
- Loading states use `role="status"` with `aria-live`.

## Suggested Next Features

1. Scroll progress indicator for long sections.
2. Cursor spotlight effect over key CTA cards.
3. Parallax depth layers behind the hero.
4. Theme switch with reduced motion preference handling.
5. Testimonials carousel with keyboard controls.
