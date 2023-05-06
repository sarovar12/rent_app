import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import db from '../firebase'
import { toast } from 'react-toastify';

export default function Contact({userRef, listing}) {
  const [landlord,setLandlord] = useState({});
  const [message,setMessage] = useState('')
  useEffect(()=>{
    async function getLandlord(){
        const docRef = doc(db,"users", userRef);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setLandlord(docSnap.data())
        }
        else{
            toast.error("Could not get landlord data")
        }

    }
    getLandlord()
  },[userRef])
// console.log(landlord.email)
  
    return  <>{landlord !== null && (
        <div className='flex flex-col w-full'>
            <p className='mt-6 '> Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
            <div className='mt-3 mb-6 '>
                <textarea className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 
                rounded transition duration-150 ease-in focus:text-gray-700 focus:bg-white
                focus:border-slate-600 ' name='message' id='message' cols='20' value={message} 
                onChange={(event)=>setMessage(event.target.value)}></textarea>
            </div>
            <div>
                <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                    <button type='button' className='mb-6 px-7 py-3 bg-blue-600 text-white 
                    rounded text-sm uppercase shadow-md hover:shadow-lg hover:bg-blue-700
                    focus:shadow-lg focus:bg-blue-700
                    active:shadow-lg active:bg-blue-800
                    transition duration-150 ease-in-out w-full text-center'>
                        Send Message
                    </button>
                </a>
            </div>
        </div>
    )}</>
  
}
