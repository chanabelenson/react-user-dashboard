import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import React from 'react'
import { BrowserRouter} from 'react-router-dom'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)
