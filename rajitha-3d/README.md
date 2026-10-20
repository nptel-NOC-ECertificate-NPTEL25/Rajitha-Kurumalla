# Rajitha Kurumalla — Structural Studio

A responsive 3D structural engineering portfolio showcasing structural modelling,
steel structures, foundation design, technical skills, certifications, and contact information.

## Built With

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Motion
- Lucide React

## Features

- Interactive 3D structural model
- Responsive navigation and layouts
- Project gallery with category filters
- Project detail modal
- Resume and certificate viewing
- Contact form using the visitor's default email application
- Reduced-motion support
- Lazy-loaded 3D scene

## Requirements

- Node.js compatible with the installed Vite version
- npm

## Getting Started

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Start the development server:

\`\`\`bash
npm run dev -- --host 0.0.0.0
\`\`\`

Create a production build:

\`\`\`bash
npm run build
\`\`\`

Run lint checks:

\`\`\`bash
npm run lint
\`\`\`

Preview the production build:

\`\`\`bash
npm run preview -- --host 0.0.0.0
\`\`\`

## Project Structure

\`\`\`text
rajitha-3d/
├── public/
│   ├── assets/
│   └── favicon.svg
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── HeroScene.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
\`\`\`

## Portfolio Assets

Place the resume, portrait, project images, and certificate in `public/assets/`.
Keep filenames consistent with the paths referenced by the application.

## Deployment

Build the project with `npm run build` and deploy the generated `dist/` directory
to a static hosting provider. Configure the deployment base path correctly if the
site is hosted under a URL subpath.

## Security

Do not commit API keys, passwords, access tokens, or private environment files.

## License

Contact the portfolio owner for permission before reusing personal content, images,
or project materials.
