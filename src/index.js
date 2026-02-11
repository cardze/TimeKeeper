// Import React library - this is the core library for building UI components
import React from 'react';

// Import ReactDOM - this package provides DOM-specific methods for rendering React components
import ReactDOM from 'react-dom/client';

// Import our main App component
import App from './App';

// Import global CSS styles for the application
import './index.css';

// Get the root DOM element where we will mount our React application
// This corresponds to <div id="root"></div> in public/index.html
const rootElement = document.getElementById('root');

// Create a root using React 18's new createRoot API
// This is the modern way to render React applications with concurrent features
const root = ReactDOM.createRoot(rootElement);

// Render the App component inside React.StrictMode
// StrictMode is a tool for highlighting potential problems in the application
// It activates additional checks and warnings for its descendants
root.render(
  <React.StrictMode>
    {/* Main App component - the entry point of our application logic */}
    <App />
  </React.StrictMode>
);
