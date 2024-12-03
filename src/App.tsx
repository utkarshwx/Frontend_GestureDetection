'use client'

import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import VideoInteraction from './components/VideoInteraction/VideoInteraction'

export default function Component() {
  

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videoupload" element={<VideoInteraction />} />
        </Routes>
    </>
  )

  
}
