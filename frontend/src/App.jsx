import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StudentLogin from './Pages/Auth/StudentLogin'
import StudentRegister from './Pages/Auth/StudentRegister'
import OtpVerify from './Pages/Auth/OtpVerify'
import TeacherLogin from './Pages/Auth/TeacherLogin'
import TeacherRegister from './Pages/Auth/TeacherRegister'
import TeacherForgotPass from './Pages/Auth/TeacherForgotPass'
import ForgotPassword from './Pages/Auth/ForgotPassword'
import AdminLogin from './Pages/Auth/AdminLogin'
import AdminTeachers from './Pages/Admin/AdminTeachers'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import TeacherVerify from './Pages/Auth/TeacherVerify'


function App() {


  return (
    <>
      <AdminTeachers/>
    </>
  )
}

export default App
