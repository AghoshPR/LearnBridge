import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react'


const initialState = {

    isAuthenticated:false,
    role:null,
    username:null,
    loading:false,
    error:null,
}

const authSlice = createSlice({

    name:"auth",
    initialState,
    reducers:{
        loginstart(state){
            state.loading=true
            state.error=null
        },
        loginSuccess(state,action){
            state.loading=false
            state.isAuthenticated=true
            state.role=action.payload.role
            state.username = action.payload.username
        },
        loginFailure(state,action){
            state.loading=false
            state.error=action.payload
        },
        logout(state){
            state.isAuthenticated=false
            state.role=null
            state.username=null
        }
    }

})

export const { loginStart,loginSuccess,loginFailure,logout }=authSlice.actions

export default authSlice.reducer