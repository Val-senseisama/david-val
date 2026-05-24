# 🪐 David's Portfolio — React + Three.js (Galaxy Theme)

## 🚀 Goal

Build a **visually stunning, animated outer space-themed developer portfolio in the current working directory** using:

- **React 18.2.0 (Vite)** – UI framework
- **Three.js** (via `@react-three/fiber`) – interactive 3D experience
- **@react-three/drei** – prebuilt helpers (e.g., `useGLTF`, `Stars`, controls)
- **framer-motion** – UI animations
- **No TailwindCSS**
- Theme: **Galaxy/Outer Space**
- 3D models (`.glb`) of moon, space rover, spaceship, and satellite will live in `/public/models`

---

## 📁 Folder Structure

/src
/assets
/components
/pages
/hooks
/data
detail.json
App.tsx
main.tsx
/public
/models
moon.glb
spacerover.glb
spaceship.glb
spacestation.glb
/vite.config.js

---

## 📦 Install Dependencies

```bash
npm create vite@latest david-portfolio --template react
cd david-portfolio
npm install three @react-three/fiber @react-three/drei framer-motion react-icons

💡 Key Components to Build
1. Hero3D.tsx – Intro Scene

    Renders Canvas with:

        Starry background via Stars from @react-three/drei

        Orbiting 3D moon model

        Floating 3D name text

        OrbitControls enabled

    Add basic lighting + ambient light

<Canvas>
  <ambientLight />
  <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
  <MoonModel />
  <OrbitControls autoRotate />
</Canvas>

2. Models Components (Dynamic & Interactive)

Each model: moon, rover, spaceship, satellite

Example (MoonModel.tsx):

import { useGLTF } from '@react-three/drei';

export default function MoonModel(props) {
  const { scene } = useGLTF('/models/moon.glb');
  return <primitive object={scene} scale={2} {...props} />;
}

📦 All models go into /public/models/*.glb
3. About.tsx

    Load from detail.json

    Animated intro using framer-motion

    Stylized layout with sections like:

        About Me

        Interests

        Quote: “Building for Earth, from Space 🚀”

4. Skills.tsx

    Render categories (Languages, Tools, AI, etc.)

    Cards or grids with icons

    Hover animations or subtle floating effect via framer-motion

5. Experience.tsx

    Vertical timeline

    Fade-in entries from detail.json

    Add sparkly animated elements or constellations behind the timeline

6. Projects.tsx

    For each featured project:

        Project card (image or preview, title, description)

        3D model hovering around or near it (like a satellite)

        GitHub/demo links

7. Contact.tsx

    Simple contact form (name, email, message)

    Social icons (email, LinkedIn)

    Optional starfield background behind the section

🌌 3D Space Background Setup

Use @react-three/drei's <Stars /> and place animated models in the scene.

<Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
  <Stars radius={200} depth={60} count={8000} factor={5} fade />
  <ambientLight intensity={0.5} />
  <MoonModel />
  <SpaceshipModel position={[4, 0, -2]} />
</Canvas>

Enable orbit controls for interaction:

import { OrbitControls } from '@react-three/drei';
<OrbitControls enableZoom autoRotate />

🔄 Load JSON Data

/src/hooks/usePortfolioData.js:

import data from '../data/detail.json';
export const usePortfolioData = () => data;

Usage:

const { name, experience } = usePortfolioData();

🪐 Example detail.json

{
  "name": "David Uyi Val-Izevbigie",
  "title": "Fullstack Developer",
  "summary": "Builder of AI, ERP, and scalable offline-first systems from the edge of the galaxy.",
  "skills": {
    "languages": ["TypeScript", "JavaScript", "Dart"],
    "tools": ["React Native", "Python", "Node.js", "MySQL", "Apollo GraphQL", "AWS"]
  },
  "experience": [
    {
      "company": "Techbox Labs",
      "role": "Junior Fullstack Developer",
      "duration": "Jan 2025 – Present",
      "details": [
        "Built ERP systems with AI forecasting and offline-first features.",
        "Integrated Flutterwave into eCommerce payment workflows."
      ]
    }
  ],
  "contact": {
    "email": "valizevbigiedavid@gmail.com",
    "linkedin": "https://linkedin.com/in/david-uyi-val-izevbigie"
  }
}

🎯 Interactivity Goals

    3D models can be clicked or hovered

    Zoom, pan, and rotate enabled via OrbitControls

    Optionally play animations on click (if .glb includes them)

🛠 Build & Deploy

npm run build

Deploy using:

    Vercel

    Netlify

    GitHub Pages (with Vite config tweak)

✅ Final Deliverables

    🌌 Animated React + Three.js portfolio

    🧑‍🚀 Interactive moon, satellite, rover, spaceship models (.glb)

    🧠 Portfolio data powered by detail.json

    🎯 Fully deployable and modular project with space aesthetics
```
