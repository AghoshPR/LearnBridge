import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react'




const loadAuthSlice = ()=>{
    try{
        const data = localStorage.getItem("auth")
        return data?JSON.parse(data):null
    }catch(error){
        return null
    }
}

const saveAuthState = (state)=>{

    localStorage.setItem(
        "auth",
        JSON.stringify({
            isAuthenticated:state.isAuthenticated,
            role:state.role,
            username:state.username
        })
    )
}

const persistedAuth=loadAuthSlice()


const initialState = {

  isAuthenticated: persistedAuth?.isAuthenticated || false,
  role: persistedAuth?.role || null,
  username: persistedAuth?.username || null,
  loading: false,
  error: null,
  
};



const authSlice = createSlice({

    name:"auth",
    initialState,
    reducers:{
        loginStart(state){
            state.loading=true
            state.error=null
        },

        loginSuccess(state,action){
            state.loading=false
            state.isAuthenticated=true
            state.role=action.payload.role
            state.username = action.payload.username

            saveAuthState(state)

        },

        loginFailure(state,action){
            state.loading=false
            state.error=action.payload
        },

        logout(state){
            state.isAuthenticated=false
            state.role=null
            state.username=null

            localStorage.removeItem("auth")

        }
    }

})

export const { loginStart,loginSuccess,loginFailure,logout }=authSlice.actions

export default authSlice.reducer