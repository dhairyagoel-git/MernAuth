import React from 'react'
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import VerfiyEmail from './pages/verfiyEmail';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<VerfiyEmail/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
 
      </Routes>
    </div>
  )
}

export default App
