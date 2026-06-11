import './image-slot.js';
import './dashboard.js';
import './dashboard.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
