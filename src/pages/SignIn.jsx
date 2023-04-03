import React from 'react'
import { useState } from 'react'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { signInWithEmailAndPassword , getAuth  } from 'firebase/auth'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'





export default function SignIn() {
  const navigate = useNavigate();
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }
  function toggleEyes(){
    setShowPassword((prevState)=>!prevState)

  }
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })
  const [showPassword, setShowPassword]= useState(false);
  const {email, password} =formData;


 async function onSubmit(event){
  console.log(
    "on Submit"
  )
  event.preventDefault();
  try {
    const auth= getAuth();
    //https://firebase.google.com/docs/auth/web/password-auth
    const userCredentials = await signInWithEmailAndPassword(auth,email, password)
    if(userCredentials.user){
      navigate("/");
      
    }
  } catch (error) {
      toast.error("Incorrect User Credentials")
  }
  }


  return (
    <section>
      <h1 className=' text-3xl text-center mt-6 font-bold'>Sign In</h1>
    <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='h-[50%] md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img className='h-96 w-full rounded-2xl' alt='House Keys' src='https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit} >
            <input className='w-full mb-6 px-4 py-2 text-xl
             text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
              type="email" id="email"
               value={email} onChange={onChange} placeholder="Email Address"/>
            <div className='relative mb-6'>
            <input className='w-full px-4 py-2 text-xl
             text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
               type={ showPassword ? "text":"password"} id="password" value={password} onChange={onChange} placeholder="Password"/>
               {showPassword? 

               (<AiFillEyeInvisible onClick={(event)=>toggleEyes(event)} className='absolute right-3 top-3 text-size-xl cursor-pointer'/>):

               (<AiFillEye onClick={toggleEyes} className='absolute right-3 top-3 text-size-xl cursor-pointer'/>)
               }

            </div>
            <div className='flex justify-between whitespace-nowrap text-sm  sm:text-lg'>
             <p className='mb-6 '> Don't Have Account?
              <Link className="text-red-600
             hover:text-red-700 transition duration-200
             ease-in-out ml-1" to ="/sign-up"> Register</Link>
             </p>
             <Link className="text-blue-600 
             hover:text-blue-700 transition duration-200
             ease-in-out " to= "/forgot-password"> Forgot Password </Link>
          </div>
          <button className='w-full rounded bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase shadow-md
           hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg
            active:bg-blue-800'
            type='submit'>Sign In</button>
            <div className='flex items-center my-4
            before:border-t before:flex-1
            before:border-gray-300
            after:border-t after:flex-1
            after:border-gray-300'>
              <p className='text-center font-semibold mx-4'> OR </p>
            </div>
               <OAuth/>
          </form>
          

        </div>
    </div>
    </section>
  
  )
}
