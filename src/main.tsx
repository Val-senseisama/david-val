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
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* Fix scroll positioning for sections with fixed navigation */
  section {
    scroll-margin-top: 80px;
    overflow: visible;
  }

  /* Ensure sections don't create individual scrollbars */
  section > div {
    overflow: visible;
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
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
