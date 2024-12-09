import React, { useEffect } from 'react'
import { Routes,Route, useNavigate, Navigate } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import {Toaster} from 'react-hot-toast'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url'
import LoadingSpinner from './components/common/LoadingSpinner'
import Downbar from './components/common/Downbar'
const App = () => {
  const {data : authUser ,isLoading} = useQuery({
    queryKey : ["authUser"],
    queryFn : async()=>{
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`,{
          method : "GET",
          credentials : "include",
          headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
          }
        })
        const data = await res.json()
        if(data.error){
          return null
        }
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        
      return data
      } catch (error) {
        throw error
      }
    }
  })
  useEffect(()=>{
  },[])

  if(isLoading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  
  return (
    <>
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
     <Routes >
      <Route path="/" element={authUser ? <HomePage/> : <Navigate to={"/login"}/> } />
      <Route path='/login' element={!authUser?<LoginPage/>: <Navigate to={"/"}/>}/>
      <Route path="*" element={!authUser?<LoginPage/>: <Navigate to={"/"}/> } />
      <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to={"/login"}/>}/>
      <Route path='/profile/:username' element={authUser?<ProfilePage/> : <Navigate to={"/login"}/>}/>
      <Route path='/signup' element={!authUser ? <SignUpPage/> :<Navigate to={"/"}/>}/>
     </Routes>
     {authUser && <RightPanel/>}
    </div>
    {authUser && <Downbar/>}
    <Toaster/>
    </>
  )
}

export default App