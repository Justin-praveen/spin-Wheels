import React, { useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './Component/Main/Home'
import SpinWheel from './Component/Main/SpinWheel'
import Wheel from './Component/Wheel'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/spinwheel/:id' element={<Home />} />
      </Routes>
    </>
  )
}

export default App