import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Donor track:  /browse, /projects/:id, /donate/success
            Idea Owner track: /ideas, /ideas/:id, /ideas/new
            — added as screens are implemented. */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
