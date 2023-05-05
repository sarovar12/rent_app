import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import {getAuth} from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import db  from '../firebase'
import {  useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const navigate = useNavigate();
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true); 
    const [selectLocation, setSelectLocation] = useState(true);
    const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({
    type:'rent',
    name:'',
    bedrooms:1,
    bathrooms:1,
    parking:false,
    furnished:false,
    address:'',
    description:'',
    offers:false,
    regularPrice:0,
    discountedPrice:0,
    latitude:0,
    longitude:0, 
    images:{},
    geoLatitude:1,
    geoLongitude:1,
    displayLatitude:1,
    displayLongitude:1,

})
const {
    type,
     name,
     bedrooms,
     bathrooms,
     parking,
     furnished,
     address,description,
     offers,
     regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
    geoLatitude,
    geoLongitude,
    displayLatitude,
    displayLongitude
}
      = formData;


    // API Fetching for Current Location   

useEffect(()=>{
    async function fetchData(){

        try{
            const res = await fetch('https://ip-api.io/json ');
            const data = await res.json();
            setFormData((prevState)=>({
                ...prevState,
                geoLatitude:data.latitude,
                geoLongitude:data.longitude,
                displayLatitude:data.latitude,
                displayLongitude:data.longitude,

            }))

        }
        catch(err){
                
        }
    }
    fetchData();
    
},[])


// Display Latitude and Longitude weren't updating so this function is here, find better ways to do this
useEffect(()=>{
    setFormData((prevState)=>({
        ...prevState,
        displayLatitude:latitude,
        displayLongitude:longitude,
    }))
},[latitude,longitude])







// On Change Function      
function onChange(event){
    let boolean = null; 
    if(event.target.value === "true"){
            boolean = true;
    }
    if(event.target.value === "false"){
            boolean = false;
    }

    //Files
    if(event.target.files){
         setFormData((prevState) => ({
            ...prevState,
            images: event.target.files
            }))
}
//Text, Boolean or Number
    if(!event.target.files){
        setFormData((prevState) => (
            {
            ...prevState,
            
            [event.target.id] : boolean ?? event.target.value,  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
            
        }))
    }

}

//Function to Store the image
async function storeImage(image){
    return new Promise((resolve,reject)=>{
        const storage = getStorage();
        const auth = getAuth();
        const filename= `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);

        const uploadTask = uploadBytesResumable(storageRef,image);

    uploadTask.on('state_changed', 
    (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
  }
);


    })
}

// On Submit Function

async function onSubmit(event){
    const auth = getAuth()
    event.preventDefault();
    setLoading(true);
    if(discountedPrice >= regularPrice){
        setLoading(false);
        toast.error('Discounted Price needs to be less than Regular Price');
        
        return;
    }
    if(images.length >6){
        setLoading(false);
        toast.error('Maximum of 6 images only');
    }   

   const imgUrls = await Promise.all(
    [...images].map((image)=> storeImage(image)))
    .catch((error)=>{
        setLoading(false);
        toast.error("Images not Uploaded");
        return;
    })
    const formDataCopy ={
        ...formData,
        imgUrls,
        displayLatitude,
        displayLongitude,
        userRef: auth.currentUser.uid,
        timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    delete formDataCopy.geoLatitude;
    delete formDataCopy.geoLongitude;
    !formDataCopy.offers && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success('Listing Created')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)


}



if(loading){
    return(
        <Spinner/>
    )
}



    return (
    <main className='max-w-md px-2  mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'> Create a Listing</h1>
        <form onSubmit={onSubmit}>

        {/* Sell or Rent Section */}

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
                 id="type" value="rent" onClick={onChange} type='button'>
                    rent
                </button>
            </div>

            {/* Name of the Property Section */}

            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type='text' id='name' value={name} onChange={onChange} placeholder='Name'
            maxLength='32' minLength='10' required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
            transition duration-200 ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
           
           {/* Baths and Beds Section */}
            <div className="flex space-x-6 justify-start mb-6">
               
                {/* Beds section  */}
                <div >
                    <p className='w-full text-lg font-semibold'> Beds</p>
                    <input type='number' id='bedrooms'
                    onChange={onChange} min="1" max="50" value={bedrooms}
                    required
                    className='px-4 py-2 text-xl text-gray-700 
                    bg-white border border-gray-300 rounded
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text-center'/>
                </div>
                {/* Baths section  */}
                <div >
                    <p className='w-full text-lg font-semibold'> Baths</p>
                    <input type='number' id='bathrooms'
                    onChange={onChange} min="1" max="50" value={bathrooms}
                    required
                    className='px-4 py-2 text-xl text-gray-700 
                    bg-white border border-gray-300 rounded
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text-center'/>
                </div>
            </div>

{/* Parking Spot Section */}

            <p className='text-lg mt-6 font-semibold'>Parking Spot</p>
            <div className="flex">
                <button
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${!parking? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="parking" value={true} onClick={onChange} type='button'>
                    Yes
                </button>
                <button
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${parking ? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="parking" value={false} onClick={onChange} type='button'>
                    No
                </button>
            </div>

        {/* Furnished Section */}

            <p className='text-lg mt-6 font-semibold'>Furnished</p>
            <div className="flex">
                <button
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${!furnished? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="furnished" value={true} onClick={onChange} type='button'>
                    Yes
                </button>
                <button
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${furnished? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="furnished" value={false} onClick={onChange} type='button'>
                    No
                </button>
            </div>

            {/* Address Field */}

            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type='text' id='address' value={address} onChange={onChange} placeholder='Address'
             required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
            transition duration-200 ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
            
            
        {/* Current Location Field for taking Latitude and Longitude */}

        
            <p className='text-lg font-semibold'>Use your current location</p>
            <div className="flex mb-6">
                <button
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${!selectLocation? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                  value={true} onClick={()=>{setSelectLocation(true)
                  setFormData((prevState)=>({
                    ...prevState,
                    displayLatitude: geoLatitude,
                    displayLongitude: geoLongitude,
                  }))
                  setGeoLocationEnabled(true)
                  }} type='button'>
                    Yes
                </button>
                <button
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${selectLocation? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="offers" value={false} 
                 onClick={(event)=>{
                    event.preventDefault();
                    setSelectLocation(false);
                    setFormData((prevState)=>({
                        ...prevState,
                        displayLatitude: latitude,
                        displayLongitude: longitude,
                      }))
                      setGeoLocationEnabled(false);


                }}
                 type='button'>
                    No
                </button>
            </div>
            


            
            {/* Latitude and Longitude Section */}
            {!selectLocation && (
                <div className='flex space-x-6 justify-start mb-6 '>
                    <div>
                        <p className='text-lg font-semibold'>Latitude</p>
                        <input className='
                        w-full  px-4 py-2 text-xl text-gray-700
                        bg-white border border-gray-300 rounded
                        transition duration-150 ease-in-out
                        focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text
                        '
                        min="-90" max="90" type='number' id="latitude" value={latitude} onChange={onChange}
                        required/>
                    </div>
                    <div className=''>
                        <p className='text-lg font-semibold'>Longitude</p>
                        <input className='
                        w-full  px-4 py-2 text-xl text-gray-700
                        bg-white border border-gray-300 rounded
                        transition duration-150 ease-in-out
                        focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text
                        '
                        min="-180" max="180" type='number' id="longitude" value={longitude} onChange={onChange}
                        required/>
                    </div>
                </div>
            )}

            {/* Description Field */}

            <p className='text-lg font-semibold'>Description</p>
            <textarea type='text' id='description' value={description} onChange={onChange} placeholder='Description'
             required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
            transition duration-200 ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>

        {/* Offers Section */}

        <p className='text-lg font-semibold'>Offers</p>
            <div className="flex mb-6">
                <button
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${!offers? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="offers" value={true} onClick={onChange} type='button'>
                    Yes
                </button>
                <button
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition duration -50 ease-in-out w-full
                 ${offers? "bg-white text-black" : "bg-slate-600 text-white" } `} 
                 id="offers" value={false} onClick={onChange} type='button'>
                    No
                </button>
            </div>


{/* Regular Price Section */}

        <div className="flex items-center mb-6">
            <div className="">
                <p className='text-lg font-semibold'>Regular Price</p>
                <div className="flex w-full justify-center items-center space-x-6">
                    <input type='number' id="regularPrice"
                    value={regularPrice} onChange={onChange}
                    min="5000" max="4000000000" required
                    className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text '/>
                {type ==='rent' &&(
                    <div>
                        <p className='text-md w-full whitespace-nowrap
                        '> Rupees / Month </p>
                    </div>
                )}
                {type ==='sale' &&(
                    <div>
                        <p className='text-md w-full whitespace-nowrap
                        '> Rupees  </p>
                    </div>
                )}

                </div>

            </div>
        </div>


{/* Only display this if Offers === true */}
{/* Discounted Price Section */}
        { offers &&
        (
            <div className="flex items-center mb-6">
            <div className="">
                <p className='text-lg font-semibold'>Discounted Price</p>
                <div className="flex w-full justify-center items-center space-x-6">
                    <input type='number' id="discountedPrice"
                    value={discountedPrice} onChange={onChange}
                    min="5000" max="4000000000" required
                    className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded
                    transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white
                    focus:border-slate-600 text '/>
                {type ==='rent' &&(
                    <div>
                        <p className='text-md w-full whitespace-nowrap
                        '> Rupees / Month </p>
                    </div>
                )}
                {type ==='sale' &&(
                    <div>
                        <p className='text-md w-full whitespace-nowrap
                        '> Rupees  </p>
                    </div>
                )}

                </div>

            </div>
        </div>
        )}

                    {/*Images Section  */}

                    <div className='mb-6 '>
                        <p className='text-lg font-semibold'>Images</p>
                        <p className='text-gray-600'>The First Image will be cover (max = 6)</p>
                        <input type='file' 
                        id='images'
                         onChange={onChange}
                         accept='.jpg,.png,.jpeg'
                         multiple
                         required
                         className='w-full px-3 py-1.5 
                         text-gray-700 bg-white
                         border border-color-gray-300
                         rounded
                         transition duration-150 ease-in-out
                         focus:bg-white focus:border-slate-600'/>
                    </div> 

           
                 {/*Submit Button  */}
        <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white
        font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700
        hover:shadow-lg focus:bg-blue-800 focus:shadow-lg
        active:bg-blue-900 active:shadow-lg
        transition duration-150
        ease-in-out '>
            Submit Your Listing

        </button>
        
        
        
        </form>
    </main>
  )
}
