import React, { useState } from 'react'

export default function CreateListing() {
const [formData, setFormData] = useState({
    type:'rent',
})
const {type} = formData;
function onChange(){

}
    return (
    <main className='max-w-md px-2  mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'> Create a Listing</h1>
        <form>
            <p className='text-lg mt-6 font-semibold'>Sell/Rent</p>
            <div className="flex">
                <button
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${type === 'rent'? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="type" value="sale" onClick={onChange} type='button'>
                    Sell 
                </button>
                <button
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${type === 'sale'? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="type" value="sale" onClick={onChange} type='button'>
                    rent
                </button>
            </div>
            <div className=""></div>
        </form>
    </main>
  )
}
