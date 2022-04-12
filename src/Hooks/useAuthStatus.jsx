import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { auth } from '../firebase.config'

const useAuthStatus = () => {
    
    const [loggedIn , setLoggedIn ]=useState(false)
    const [checkingStatus , setCheckingStatus ]=useState(true)
     const isMounted =useRef(true)


    useEffect(()=>{
      setTimeout(() => {
        if(isMounted){
          onAuthStateChanged(auth, (user) =>{
            if(user){
                console.log('user Logged in ');
                 setLoggedIn(true)}
            setCheckingStatus(false)
        })  
        }return ()=>{
            isMounted.current =(false)
        }
      }, 2000);
        
        

    },[isMounted])
  return {loggedIn , checkingStatus}
}

export default useAuthStatus
