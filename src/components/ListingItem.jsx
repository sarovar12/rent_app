import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import {ImLocation} from 'react-icons/im'

export default function ListingItem({listing,id}) {
  return (
    <li className='bg-white flex flex-col justify-between items-center shadow-md hover:shadow-lg rounded-md
    overflow-hidden transition-shadow duration-150'>
      <Link to ={`/category/${listing.type}/${id}`}>
        <img className='h-[170px] w-full object-cover hover:scale-105 
        transtion-scale duration-200 ease-in ' src={listing.imgUrls[0]} alt='first property' loading='lazy'/>
        <Moment fromNow>
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='mb-2 flex justify-start'>
          <ImLocation className='mt-1'/>
          <p className='mx-1'>{listing.address}</p>
        </div>
        <p>{listing.name}</p>
        <p>Rs. {listing.offer? listing.discountedPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",")
        :
         listing.regularPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",")}
        {listing.type === "rent" && " / month"}
        </p>
        <div>
          <div>
            <p>{listing.bedrooms >1 ? `${listing.bedrooms} Beds`:"1 Bed"}</p>
          </div>
          <div>
            <p>{listing.bathrooms >1 ? `${listing.bathrooms} Baths`:"1 Bath"}</p>
          </div>
        </div>
      </Link>
    </li>

  )
}
