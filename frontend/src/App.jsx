import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {

  const{data:currentUser, isLoadind, isError} = useQuery({
    queryKey: ['authUser'],
    queryFn: async()=>{
      try{
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if(data.error){
          return null;
        }
        

        if(!res.ok){
          throw new Error(data.error);
        }
        return data;
      }
      catch(error){
        console.log(error.message);
      }
    }
  })

  if(isLoadind){
    return <LoadingSpinner/>
  }


  return (
    <>
      <div className='flex max-w-6xl mx-auto'>
        {currentUser && <Sidebar/>}
        <Routes>
          <Route path='/' element={currentUser?<HomePage/>:<Navigate to='/login'/>}></Route>
          <Route path='/login' element={!currentUser?<LoginPage/>:<Navigate to='/'/>}></Route>
          <Route path='/signup' element={!currentUser?<SignUpPage/>:<Navigate to='/'/>}></Route>
          <Route path='/notifications' element={currentUser?<NotificationPage/>:<Navigate to='/login'/>}></Route>
          <Route path='/profile/:userName' element={currentUser?<ProfilePage/>:<Navigate to='/login'/>}></Route>
        </Routes>
        {currentUser && <RightPanel/>}
        <Toaster/>
      </div>
    </>
  )
}

export default App
