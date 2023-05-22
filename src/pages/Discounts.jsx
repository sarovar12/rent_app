import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import db from '../firebase';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';



export default function Discounts() {
  const [listings,setListings] = useState(null);
const [loading,setLoading] =useState(true)

useEffect(()=>{
  async function fetchListings(){
    try {
        const listingRef = collection(db,"listings");
        const q = query(listingRef,where("offers","==",true),
        orderBy("timestamp","desc"),limit(8));
        const querySnap = await getDocs(q);
        const listings=[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data()
          })
        })
        
        setListings(listings);
        setLoading(false);
    } catch (error) {
        toast.error("Could not fetch Listings")
    }
  }
  fetchListings()
},[])

  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 mb-6 font-bold'>Special Discounts</h1>
      {loading ?(
        <Spinner/>
      ) : listings && listings.length >0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {listings.map((listing)=>(
                <ListingItem key={listing.id}  id={listing.id}  listing={listing.data} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p> There are no current offers! </p>
      )
}
      </div>
  )
}
