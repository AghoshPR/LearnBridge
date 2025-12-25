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
import Home from './Pages/Public/Home'
import Courses from './Pages/Public/Courses'
import CourseDetail from './Pages/Public/CourseDetail'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import StudentDashboard from './Pages/Student/StudentDashboard'
import TeacherDashBoard from './Pages/Teacher/TeacherDashBoard'



function App() {


  return (
    <>
      <Routes>

        {/* Public */}

        <Route path="/" element={<Home/>}/>
        <Route path="/courses" element={<Courses/>}/>

        {/* Auth */}

        <Route path="/student/register" element={<StudentRegister/>}/>
        <Route path="/otp-verify" element={<OtpVerify/>}/>

        <Route path="/student/login" element={<StudentLogin/>}/>
        <Route path="/teacher/login" element={<TeacherLogin/>}/>
        <Route path="/teacher/verify" element={<TeacherVerify/>}/>

        <Route path="/admin/login" element={<AdminLogin/>}/>

        {/* Student */}

        <Route path="/student/dashboard" element={

            <ProtectedRoute role="student">
              <StudentDashboard/>
            </ProtectedRoute>
          }
        />


        {/* Teacher */}


        <Route

          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashBoard/>
            </ProtectedRoute>

          }/>

          {/* Admin */}

          <Route

          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard/>
            </ProtectedRoute>
          }/>


      </Routes>



    </>
  )
}

export default App
