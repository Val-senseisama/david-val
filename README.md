# 🪐 David's Galaxy Portfolio

A stunning, interactive 3D portfolio built with React, Three.js, and Framer Motion featuring a space/galaxy theme.

## ✨ Features

- **Interactive 3D Scene**: Rotating moon, spaceship, space rover, and space station models
- **Animated UI**: Smooth animations powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Space Theme**: Beautiful galaxy backgrounds with animated stars
- **Portfolio Sections**: About, Skills, Experience, and Contact sections
- **Interactive Elements**: Hover effects, smooth scrolling, and 3D model interactions

## 🚀 Technologies Used

- **React 18.2.0** - UI framework
- **Vite** - Build tool and development server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **TypeScript** - Type safety

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero3D.tsx          # Main 3D hero scene
│   ├── MoonModel.tsx       # 3D moon model component
│   ├── SpaceshipModel.tsx  # 3D spaceship model component
│   ├── SpaceRoverModel.tsx # 3D space rover model component
│   ├── SpaceStationModel.tsx # 3D space station model component
│   ├── About.tsx           # About section
│   ├── Skills.tsx          # Skills section
│   ├── Experience.tsx      # Experience timeline
│   └── Contact.tsx         # Contact form and info
├── hooks/
│   └── usePortfolioData.ts # Custom hook for portfolio data
├── data/
│   └── detail.json         # Portfolio data
├── App.tsx                 # Main app component
└── main.tsx               # App entry point

public/
└── models/                # 3D model files (.glb)
    ├── Moon.glb
    ├── Spaceship.glb
    ├── SpaceRover.glb
    └── SpaceStation.glb
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd david-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Customization

### Updating Portfolio Data

Edit `src/data/detail.json` to update your personal information:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "summary": "Your summary...",
  "skills": {
    "languagesAndFrameworks": ["React", "TypeScript"],
    "databases": ["MySQL", "PostgreSQL"],
    "toolsPlatforms": ["Docker", "AWS"],
    "specialties": ["Fullstack Development", "AI/ML"]
  },
  "experience": [
    {
      "role": "Your Role",
      "company": "Company Name",
      "duration": "Duration",
      "location": "Location",
      "technologies": ["Tech1", "Tech2"],
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ]
}
```

### 3D Models

Replace the 3D models in `public/models/` with your own `.glb` files:
- `Moon.glb` - Hero section model
- `Spaceship.glb` - Experience section model
- `SpaceRover.glb` - Skills section model
- `SpaceStation.glb` - About section model

### Styling

The portfolio uses inline styles with a consistent color scheme:
- Primary Blue: `#4a9eff`
- Dark Blue: `#357abd`
- Background: `#0c0c0c` to `#1a1a2e`
- Text: `#e0e0e0` and `#a0a0a0`

## 🌟 Key Features Explained

### 3D Scene Management
Each section has its own 3D canvas with:
- Animated stars background
- Interactive 3D models
- Orbit controls for user interaction
- Proper lighting setup

### Animation System
- **Framer Motion**: Handles UI animations and transitions
- **Three.js Animation**: Models rotate and float using `useFrame`
- **Scroll-triggered animations**: Elements animate when they come into view

### Responsive Design
- Grid layouts that adapt to screen size
- Mobile-friendly navigation
- Optimized 3D scenes for different devices

## 🚀 Deployment

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### GitHub Pages
1. Add to `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   })
   ```
2. Deploy using GitHub Actions

## 📱 Performance Optimization

- 3D models are optimized and compressed
- Lazy loading for sections
- Efficient animation loops
- Optimized bundle size with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: valizevbigiedavid@gmail.com
- **LinkedIn**: [David Uyi Val-Izevbigie](https://linkedin.com/in/david-uyi-val-izevbigie)
- **Location**: Lagos, Nigeria

---

Built with ❤️ and ☕ by David Uyi Val-Izevbigie
# david-val
