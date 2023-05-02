import ListingItem from '../components/ListingItem';

import React, { useEffect } from 'react'
import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { collection, doc, getDocs, orderBy, query, updateDoc, where, } from 'firebase/firestore'
import db from '../firebase';
import {FcHome} from 'react-icons/fc'
import { Link } from 'react-router-dom';


export default function Profile() {
  const auth = getAuth();
  const [changedDetail, setChangedDetail] = useState(false);
  const [listings, setListings] = useState([])
  const [loading,setLoading] = useState(true);
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


useEffect(()=>{
  async function fetchUserListings(){
    // console.log(auth.currentUser.uid)

    const listingRef = collection(db,'listings');

    // const q = query
    //   (listingRef
    //     ,where("userRef","==",auth.currentUser.uid),
    // orderBy("timeStamp","desc")
    // );

    const q = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")  // Messed up the database by not using camelcase and wasted nearly 3 hours debugging
    );


    const querySnap = await getDocs(q);
    let listings=[];
    querySnap.forEach((doc) => {
       listings.push({
        id: doc.id,
        data:doc.data(),
        
      })
      // console.log(querySnap);
      // console.log(doc.id, "=>",  doc.data())
    });
    setListings(listings);
    setLoading(false);
  }
  fetchUserListings();
},[auth.currentUser.uid])

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
          <button className='w-full bg-blue-600 text-white
           uppercase px-7 py-3 text-small font-medium rounded shadow-md hover:bg-blue-700
           transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-900' 
           type='submit'>
            <Link className='flex justify-center items-center' to ="/create-listing">
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>
              Sell or Rent Your Property 
            </Link>
          </button>
        </div>

      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length> 0 && (
          <>
            <h2 className='mb-6 mt-6 text-2xl text-center font-semibold'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6
            mb-6'>
              {listings.map((listing)=>(
                <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
