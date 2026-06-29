import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Browse from '@/pages/Browse'
import ProjectDetail from '@/pages/ProjectDetail'
import DonationSuccess from '@/pages/DonationSuccess'
import MyIdeas from '@/pages/MyIdeas'
import IdeaDashboard from '@/pages/IdeaDashboard'
import PostNewIdea from '@/pages/PostNewIdea'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/donate/success" element={<DonationSuccess />} />
        <Route path="/ideas" element={<MyIdeas />} />
        <Route path="/ideas/new" element={<PostNewIdea />} />
        <Route path="/ideas/:id" element={<IdeaDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
