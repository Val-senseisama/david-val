import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Add global styles
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    height: 100%;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    position: relative;
  }

  #root {
    height: 100%;
    position: relative;
  }

  /* Fix scroll positioning for sections with fixed navigation */
  section {
    scroll-margin-top: 80px;
    overflow: visible;
    position: relative;
    min-height: 100vh;
  }

  /* Ensure sections don't create individual scrollbars */
  section > div {
    overflow: visible;
  }

  /* Prevent any interference with scroll behavior */
  canvas {
    display: block;
  }

  /* Optimize scrollbar for better performance */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #0c0c0c;
  }

  ::-webkit-scrollbar-thumb {
    background: #4a9eff;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #357abd;
  }

  input, textarea {
    font-family: inherit;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #4a9eff !important;
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2) !important;
  }

  /* Ensure smooth scrolling without interference */
  .smooth-scroll {
    scroll-behavior: smooth;
  }

  /* Prevent any layout shifts during lazy loading */
  .lazy-load-container {
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
