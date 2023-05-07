import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import db from '../firebase';
import Spinner from '../components/Spinner'
import {Swiper , SwiperSlide} from 'swiper/react'
import { EffectFade, Autoplay, Navigation,Pagination } from 'swiper';
import {FaShare , FaMapMarkerAlt, FaBed, FaBath, FaParking ,FaChair} from 'react-icons/fa';
import { getAuth } from 'firebase/auth'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';



export default function Listing() {
  const auth = getAuth()
  const [listing,setListing] = useState();
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setSharedLinkCopied] = useState(false) 
  const [contactLandlord, setContactLandlord] = useState(false)
    const params = useParams()
    useEffect(()=>{
        async function fetchListing(){
            const docRef = doc(db,"listings",params.listingID);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
              setListing(docSnap.data())
              setLoading(false)
            }
        }
        fetchListing();
    },[params.listingID,])
  
    if(loading){
      return <Spinner/>
    }

  return (
    <main>
      <Swiper slidesPerView={1} navigation pagination={{type:"progressbar"}} 
      effect='fake' modules={[ Autoplay, Pagination, Navigation, EffectFade]}
      autoplay={{delay: 3000}}>
        {listing.imgUrls.map((url,index)=>(
          <SwiperSlide key={index}>
            <div className='relative w-[full] overflow-hidden h-[300px]' 
            style={{background:`url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize:"cover"}
            } > </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-10 bg-white border-2 border-gray-400 
      rounded-full w-12 h-10 flex  justify-center items-center cursor-pointer'
      onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setSharedLinkCopied(true)
        setTimeout(()=>{
          setSharedLinkCopied(false)
        },2000)}}>
            <FaShare className='text-lg text-slate-500 '/>
      </div>
      {shareLinkCopied && (
        <p className='fixed top-[23%] right-[5%] font-semibold
        border-2 border-gray-400 rounded-md bg-white z-10 p-2'> Link Copied !!!</p>
      )}

      {/* Description Part */}
      <div className='m-4 p-4 rounded-lg shadow-lg bg-white flex flex-col md:flex-row max-w-6xl lg:mx-auto
      lg:space-x-5 sm:w-full'>

        {/* Name of the propery and Price  */}
        <div className='w-full '>
          <p className='text-2xl font-bold mb-3 text-blue-900'> {listing.name} - Rs.  {listing.offer ? listing.discountedPrice.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",") : listing.regularPrice.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",")}
          {listing.type === 'rent' ? " /month" : ""}
          </p>
          {/* Address of the Property */}
          <p className='flex items-center mt-6 mb-3 font-semibold'>
          <FaMapMarkerAlt className='text-green-700 mr-1'/> {listing.address}
          </p>

          {/* Category and Discount  */}
          <div className=' flex justify-start items-center space-x-4 w-[75%]  '>
            <p 
            className='w-full font-semibold text-center max-w-[200px] rounded-md p-1 shadow-md h-[30px] bg-red-800 text-white'>{listing.type === 'rent'? "Rent" : "Sale"}</p>
            {listing.offers &&(
              <p className='bg-green-800  shadow-md w-full rounded p-1 text-center text-white font-semibold'>
                Rs.{+listing.regularPrice - +listing.discountedPrice}  Discount
              </p>
            )}
          </div>
          {/* Description Section  */}
          <p className='mt-3 mb-3'>
           <span className='font-semibold'>Description-</span> {listing.description}</p>
        
          {/* Icons with Other information section */}
          <ul className=' flex justify-start align-middle break-all space-x-4 m-1 mb-6 max-sm:flex-col max-sm:my-auto  '>
          <li className='flex items-center whitespace-nowrap justify-center' >
             <FaBed className='text-lg sm:text-sm  mr-1'/>{listing.bedrooms>1 ?  `${listing.bedrooms} Beds`:` 1 Bed`}</li>
          <li className='flex items-center whitespace-nowrap justify-center'>
             <FaBath className='text-lg mr-1'/> {listing.bathrooms>1 ?  `${listing.bathrooms} Baths`:` 1 Bed`}</li>

          <li className='flex items-center whitespace-nowrap justify-center' >
             <FaParking className='text-lg mr-1'/> {listing.parking>1 ?  `No Parking`:`Parking Spot` }   </li>

          <li className='flex break-normal md:break-all items-center whitespace-nowrap justify-center'>
          <FaChair className='text-lg mr-1'/> {listing.furnished? 'Furnished' : ' Not Furnished'}</li>   
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
             <div className="mt-6 ">
             <button onClick={()=>setContactLandlord(true)} className='w-full rounded bg-blue-600 text-white m-2 px-7 py-3 font-medium text-sm uppercase
           shadow-md hover:bg-blue-700 hover:shadow-lg transtion duration-150 ease-in-out '>
             Contact Landlord
           </button>
             </div>   
          )}
          {
            contactLandlord && (
              <Contact userRef={listing.userRef}
              listing={listing}/>
            )
          }
         
        
       
        </div>
        

          
        {/* Map Part */}
        <div className= 'w-full h-[200px] md:h-[400px] md:mt-0 md:ml-2 mt-6 z-20 overflow-x-hidden'>

    <MapContainer center={[listing.displayLatitude, listing.displayLongitude]} zoom={13} scrollWheelZoom={false}
    style={{height:"100%",width:"100%"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      
    />
    <Marker position={[listing.displayLatitude, listing.displayLongitude]}>
      <Popup>
        A pretty CSS3 popup. <br/> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>

        </div>



        </div>

    </main>
  )
}
