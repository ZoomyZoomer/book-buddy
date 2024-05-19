import React from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route index element={<HomePage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
    </>
  )
}

export default App