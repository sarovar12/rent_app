import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import db from '../firebase';
import Spinner from '../components/Spinner'
import {Swiper , SwiperSlide} from 'swiper/react'
import { EffectFade, Autoplay, Navigation,Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';



export default function Listing() {
  const [listing,setListing] = useState();
  const [loading, setLoading] = useState(true);
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
            <div className='relative w-full overflow-hidden h-[300px]' 
            style={{background:`url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize:"cover"}
            } > </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  )
}
