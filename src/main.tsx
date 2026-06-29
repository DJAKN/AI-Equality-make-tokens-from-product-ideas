import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Browse from '@/pages/Browse'
import ProjectDetail from '@/pages/ProjectDetail'
import DonationSuccess from '@/pages/DonationSuccess'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/donate/success" element={<DonationSuccess />} />
        {/* Idea Owner track: /ideas, /ideas/:id, /ideas/new
            — added as screens are implemented. */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
