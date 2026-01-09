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
import StudentProfile from './Pages/Student/StudentProfile'
import TeacherDashBoard from './Pages/Teacher/TeacherDashBoard'
import TeacherProfile from './Pages/Teacher/TeacherProfile'
import TeacherCourses from './Pages/Teacher/TeacherCourses'
import TeacherResetPassword from './Pages/Auth/TeacherResetPassword'
import StudentResetPassword from './Pages/Auth/StudentResetPassword'
import AdminUsers from './Pages/Admin/AdminUsers'
import TeacherManageCourses from './Pages/Teacher/TeacherManageCourses'
import TeacherCourseCategory from './Pages/Teacher/TeacherCourseCategory'
import StudentWishlist from './Pages/Student/StudentWishlist'
import StudentCart from './Pages/Student/StudentCart'



function App() {


  return (
    <>
      <Routes>

        {/* Public */}

        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />


        {/* Auth */}

        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/otp-verify" element={<OtpVerify />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/forgotpass" element={<ForgotPassword />} />
        <Route path="/student/reset-password" element={<StudentResetPassword />} />

        <Route path="/teacher/login" element={<TeacherLogin />} />

        <Route path="/teacher/register" element={<TeacherRegister />} />
        <Route path="/teacher/verify" element={<TeacherVerify />} />
        <Route path="/teacher/forgotpass" element={<TeacherForgotPass />} />
        <Route path="/teacher/reset-password" element={<TeacherResetPassword />} />


        <Route path="/admin/login" element={<AdminLogin />} />










        {/* Student */}

        <Route path="/student/dashboard" element={

          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
        />

        <Route path="/student/profile" element={
          <ProtectedRoute role="student">
            <StudentProfile />
          </ProtectedRoute>
        } />

        


        {/* Teacher */}


        <Route

          path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashBoard /></ProtectedRoute>} />

        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          } />

        <Route path="/teacher/courses"
          element={
            <ProtectedRoute role="teacher">
              <TeacherCourses />
            </ProtectedRoute>
          } />

          <Route path='/teacher/manageCourses' element={<TeacherManageCourses/>}/>
          <Route path='/teacher/coursecategory' element={<TeacherCourseCategory/>}/>



        {/* Admin */}


        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

        <Route path="/admin/teachers" element={<ProtectedRoute role="admin"> <AdminTeachers /> </ProtectedRoute>} />


        <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />


        
        <Route path='/student/wishlist' element={<StudentWishlist/>}/>
        <Route path='/student/cart' element={<StudentCart/>}/>


      </Routes>



    </>
  )
}

export default App
