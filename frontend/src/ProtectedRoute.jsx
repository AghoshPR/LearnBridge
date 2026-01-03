import React from 'react'
import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'



const ProtectedRoute = ({ children, role }) => {

    const { isAuthenticated, role:userRole } = useSelector(
        (state)=>state.auth

    )

    
  // Not logged in
    if (!isAuthenticated) {
        if (role === "admin") return <Navigate to="/admin/login" replace />
        if (role === "teacher") return <Navigate to="/teacher/login" replace />
        return <Navigate to="/student/login" replace />
    }

    // Logged in but wrong role

    if (role && userRole !== role ){
        return <Navigate to ="/" replace  />
    }

    return children
    
}

export default ProtectedRoute