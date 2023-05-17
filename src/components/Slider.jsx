import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import db from '../firebase'
// Swiper JS Imports
import Spinner from '../components/Spinner'
import {Swiper , SwiperSlide} from 'swiper/react'
import { EffectFade, Autoplay, Navigation,Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useNavigate } from 'react-router'
// End of Swiper JS imports

export default function Slider() {
    const [loading,setLoading] = useState(true)
    const [listings,setListings] = useState(null)
    const navigate= useNavigate()
    useEffect(()=>{
      async function fetchListings(){
        const listingsRef = collection(db,"listings")
        const q = query(listingsRef, orderBy("timestamp","desc"),limit(5))
        const querySnap = await getDocs(q);
        let listings=[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data(),
          })
        })
        setListings(listings);
        setLoading(false);
        // console.log(listings[0].data.imgUrls[0]);
    } 
      fetchListings();
    },[])
    if(loading){
      return <Spinner/>
    }
    if(listings.length === 0 ){
      return <>
        <p>Need to enter listings first</p>
      </>
    }
    return listings && <>
    <Swiper slidesPerView={1} navigation pagination={{type:"progressbar"}} 
      effect='fake' modules={[ Autoplay, Pagination, Navigation, EffectFade]}
      autoplay={{delay: 3000}}>

        {listings.map(({data,id})=>(
          <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
            <div style={{
                backgroundImage:`url(${data.imgUrls[0]})`,
                backgroundRepeat:'no-repeat',
                backgroundPosition:'center',
                backgroundSize:"cover",

            }}
            className='relative w-full h-[300px] overflow-hidden'
            >
                <p className='text-[#f1faee] absolute left-1 top-3 font-medium
                max-w-[90%] bg-[#457b9d]
                shadow-lg opacity-90 p-2 rounded-br-3xl
                '>{data.name}</p>
                <p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold
                max-w-[90%] bg-[#e63946]
                shadow-lg opacity-90 p-2 rounded-tr-3xl
                '>
                    Rs.
                    {data.discountedPrice ?? data.regularPrice} 
                    {data.type==='rent' && " / month"}
                    {/* If data.discountedPrice is not null show data.regularPrice else show discountedPrice */}
                </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
}
