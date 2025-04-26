// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import {Routes, Route } from "react-router-dom"; 
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import ResetPassword from "./Pages/ResetPassword"

function App() {
  
  console.log("Rendering App component")

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<Login />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
      </Routes>
  
    </>
  )
}

export default App
