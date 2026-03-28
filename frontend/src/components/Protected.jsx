import { Navigate } from "react-router-dom"
// import { Children } from "react"

export default function Protected({children}){
  if(!localStorage.getItem('login')){
    return <Navigate to="/login" replace/>
  }
  return children
}