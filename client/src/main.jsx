import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Jost', sans-serif",
            fontSize: '14px',
            background: '#FAF6F1',
            color: '#2C1810',
            border: '1px solid #E8DDD4',
            boxShadow: '0 4px 16px rgba(44,24,16,0.12)'
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#C0392B', secondary: '#fff' } }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
