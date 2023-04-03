import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {toast} from 'react-toastify'
import db from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router';


export default function OAuth() {
  const navigate =useNavigate(); 
 async function onGoogleClick(){
try {
 
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth,provider); 
  const user = result.user;



// Connecting to Database and adding the user
  //https://firebase.google.com/docs/firestore/manage-data/add-data 
  const docRef = doc(db,"users",user.uid) 
  const docSnap = await getDoc(docRef)  // Checks if ID is already there or not

   if(!docSnap.exists()){
    await setDoc(docRef,{
      name: user.displayName,
      email: user.email,
      timeStamp:serverTimestamp(), 
    })
   }
   navigate("/");

   //https://firebase.google.com/docs/auth/web/google-signin - Documentation if anything needed
  // getRedirectResult(auth)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access Google APIs.
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
       
  //     const token = credential.accessToken;
      
  
  //     // The signed-in user info.
  //     const user = result.user;
  //     // IdP data available using getAdditionalUserInfo(result)
  //     // ...
  //   }).catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });
  
  


} catch (error) {
      toast.error("Couldn't authorize with Google ")
}




  }

  return (
    <button type="button" onClick={onGoogleClick} className='flex items-center justify-center w-full bg-red-500 text-white px-7 py-3 uppercase text-sm font-medium
    hover:bg-red-800
    active:bg-red-900
    shadow-md
    hover:shadow-lg
    active:shadow-large
    transition duration-150 
    ease-in-out rounded'>
        <FcGoogle className='text-2xl bg-white rounded-full
        mr-2'/>
        Continue With Google 
    </button>
  )
}
