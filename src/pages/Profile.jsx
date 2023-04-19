import React from 'react'
import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore'
import db from '../firebase';

export default function Profile() {
  const auth = getAuth();
  const [changedDetail, setChangedDetail] = useState(false);
  const navigate = useNavigate();

  function onNameChange(event){
    setFormData((prevState)=>({
      ...prevState,
      [event.target.id] : event.target.value,
    }))
  }
  const [formData,setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  function onLogout(){
    auth.signOut();
    navigate("/")
  }
  const {name,email} = formData
  async function onSubmit(){
      try {
        if(auth.currentUser.displayName !== name){
          //update the display name in firebase authentication 

          await updateProfile(auth.currentUser,{
            displayName:name,
          })
          //update the name in firestore

          const docRef = doc(db,"users", auth.currentUser.uid);
          await updateDoc(docRef,{
            name,
          }) 
        }
        toast.success('Profile details updated ')
      } catch (error) {
        toast.error("Could not update the profile details")
      }
  }
  return (
    <>

      <section className='max-w-6xl mx-auto flex 
      justify-center items-center flex-col'>
        <h1 className='text-2xl text-center mt-6 font-bold'> My Profile </h1>
        <div className= 'w-full md:w-[50%] mt-6 px-3'> 
          <form>

            {/* Input Name */}
            <input type='text' id="name" value={name} disabled={!changedDetail} 
            onChange={onNameChange}
            className={`w-full my-1 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
            rounded transition ease-in-out  ${changedDetail && "bg-red-200 focus:bg-red-200"}`}/>

            {/* Input Email */}
            <input type='email' id="email"
            value={email} disabled 
            className='w-full my-1 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
            rounded transition ease-in-out'/>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='flex items-center mb-6 '> Do you want to change your name?
              <span 
              onClick={()=>
                {
                  changedDetail && onSubmit();
                  setChangedDetail((prevState)=>!prevState);
                }

                } 
              className=' hover:text-red-700 cursor-pointer
               text-red-600 m-1 transition ease-in-out duration-200' > {changedDetail? "Apply Changes": "Edit"} </span>
              </p>
              <p 
              onClick={onLogout}
              className=' hover:text-blue-800 cursor-pointer
               text-blue-600 m-1 transition ease-in-out duration-200'>Sign Out</p>
            </div>
            
          </form>
        </div>

      </section>
    </>
  )
}
