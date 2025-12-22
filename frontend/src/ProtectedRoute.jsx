import React from 'react'
import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'



const ProtectedRoute = ({ children, role }) => {

    const { isAuthenticated, role:userRole } = useSelector(
        (state)=>state.auth

    )

    
  // Not logged in
    if(!isAuthenticated){

        if(role==="admin") return <Navigate to="/admin/login"/>
        if(role==="teacher") return <Navigate to="/teacher/login" />
        return <Navigate to="/student/login"/>
    }

    // Logged in but wrong role

    if (role && userRole !== role ){
        return <Navigate to ="/" />
    }

    return children
    
}

export default ProtectedRoute