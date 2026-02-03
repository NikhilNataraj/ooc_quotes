import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Footer from './footer.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
)
