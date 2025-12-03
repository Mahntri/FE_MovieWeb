import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'; // 👈 Import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider> {/* 👈 Bọc App lại */}
      <App />
    </ToastProvider>
  </StrictMode>,
)