# 🪐 David's Galaxy Portfolio

A stunning, interactive 3D portfolio built with React, Three.js, and Framer Motion featuring a space/galaxy theme.

## ✨ Features

- **Interactive 3D Scene**: Rotating moon, spaceship, space rover, and space station models
- **Animated UI**: Smooth animations powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Space Theme**: Beautiful galaxy backgrounds with animated stars
- **Portfolio Sections**: About, Skills, Experience, and Contact sections
- **Interactive Elements**: Hover effects, smooth scrolling, and 3D model interactions
- **Contact Form**: Functional contact form with EmailJS integration

## 🚀 Technologies Used

- **React 18.2.0** - UI framework
- **Vite** - Build tool and development server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **TypeScript** - Type safety
- **EmailJS** - Email service integration

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
│   ├── Contact.tsx         # Contact form and info
│   └── ErrorBoundary.tsx   # Error handling component
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

3. **Set up EmailJS (Optional but Recommended)**
   
   The contact form uses EmailJS to send emails. To set it up:
   
   a. Create an account at [EmailJS](https://www.emailjs.com/)
   
   b. Create an email service (Gmail, Outlook, etc.)
   
   c. Create two email templates:
      - **Template for you**: Receives messages from visitors
      - **Template for sender**: Auto-reply confirmation to visitors
   
   d. Copy the `env.example` file to `.env`:
      ```bash
      cp env.example .env
      ```
   
   e. Fill in your EmailJS credentials in `.env`:
      ```env
      VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
      VITE_EMAILJS_SERVICE_ID=your_service_id_here
      VITE_EMAILJS_TEMPLATE_TO_YOU=your_template_id_for_you
      VITE_EMAILJS_TEMPLATE_TO_SENDER=your_template_id_for_sender
      ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📧 EmailJS Setup Guide

### Step 1: Create EmailJS Account
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Add Email Service
1. Go to "Email Services" tab
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the authentication steps
5. Note down your **Service ID**

### Step 3: Create Email Templates
1. Go to "Email Templates" tab
2. Create two templates:

   **Template 1 - For You (David):**
   ```
   Subject: New Contact Form Message from {{name}}
   
   Name: {{name}}
   Email: {{email}}
   Message: {{message}}
   ```

   **Template 2 - For Sender (Auto-reply):**
   ```
   Subject: Thank you for your message!
   
   Hi {{name}},
   
   Thank you for reaching out! I've received your message and will get back to you soon.
   
   Best regards,
   David Uyi Val-Izevbigie
   ```

3. Note down both **Template IDs**

### Step 4: Get Your Public Key
1. Go to "Account" tab
2. Copy your **Public Key**

### Step 5: Update Environment Variables
Create a `.env` file in the root directory:
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_TO_YOU=your_template_id_for_you
VITE_EMAILJS_TEMPLATE_TO_SENDER=your_template_id_for_sender
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

### Contact Form
- **EmailJS Integration**: Sends emails directly from the browser
- **Dual Email System**: Sends message to you + auto-reply to sender
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Visual feedback during form submission

### Responsive Design
- Grid layouts that adapt to screen size
- Mobile-friendly navigation
- Optimized 3D scenes for different devices

## 🚀 Deployment

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

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
- EmailJS for lightweight email handling

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
