import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate(); // navigate routes and doesn't  refresh
    function pathMatchRoute(route){
        if(route === location.pathname){
            return true;
        }
    }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div className='flex-none'>
                <img
                onClick={()=>navigate("/")} 
                src="https://img.freepik.com/free-vector/christmas-background-design_1156-748.jpg?w=740&t=st=1679399343~exp=1679399943~hmac=b51d9287b03c1c84d65ac2ec54e25103e901a75c705bd7406835d2dbc6be1e1e"
                 alt='logo' className='h-20 py-4 cursor-pointer rounded-full' />
            </div>
            <div className=' px-1  flex-1 w-20'>
            <span className='cursor-pointer' onClick={()=>navigate("/")}>Rent Nepal</span>
            </div>
            <div className='flex-1'>
                <ul className='flex space-x-10'>

                    <li onClick={()=>navigate("/")} className={`cursor-pointer py-3 text-sm font-semibold border-b-red-500 ${pathMatchRoute("/")?"text-black border-b-[3px] border-b-red-500 ":"text-gray-400 border-b-[3px] border-b-transparent"}`}> Home </li>
                    <li onClick={()=>navigate("/discounts")} className={`cursor-pointer py-3 text-sm font-semibold border-b-red-500 ${pathMatchRoute("/discounts")?"text-black border-b-[3px] border-b-red-500 ":"text-gray-400 border-b-[3px] border-b-transparent"}`}> Special Discount </li>
                    <li onClick={()=>navigate("/sign-in")} className={`cursor-pointer py-3 text-sm font-semibold border-b-red-500 ${pathMatchRoute("/sign-in")?"text-black border-b-[3px] border-b-red-500 ":"text-gray-400 border-b-[3px] border-b-transparent"}`}> Sign In </li>
                    
                    
                </ul>
            </div>
        </header>
    </div>
  )
}
