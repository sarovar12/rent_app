import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import {ImLocation} from 'react-icons/im'
import {FcEditImage} from 'react-icons/fc'
import {MdOutlineDelete} from 'react-icons/md'

export default function ListingItem({listing,id, onDelete, onEdit}) {
  return (
    <li className=' m-[10px] relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-lg rounded-md
    overflow-hidden transition-shadow duration-150'>
      <Link className='contents' to ={`/category/${listing.type}/${id}`}>
        <img className='h-[170px] w-full object-cover hover:scale-105 
        transtion-scale duration-200 ease-in ' src={listing.imgUrls[0]} alt='first property' loading='lazy'/>
        <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold
        rounded-md px-2 py-1 shadow-lg' fromNow>
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-[10px] '>
          <div className='flex items-center space-x-1'>
          <ImLocation className='h-4 w-4 text-green-600'/>
          <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
          </div>
        </div>
        <p className='font-semibold m-0 text-xl truncate '>{listing.name}</p>
        <p className='text-[#457b9d] mt-2 font-semibold '>Rs. {listing.offer? listing.discountedPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",")
        :
         listing.regularPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g,",")}
        {listing.type === "rent" && " / month"}
        </p>
        <div className='flex  items-center mt-[10px]  mb-3 space-x-3'>
          <div className='flex justify-start items-start space-x-1'>
            <p className='font-bold text-xs'>{listing.bedrooms >1 ? `${listing.bedrooms} Beds`:"1 Bed"}</p>
          </div>
          <div className='flex items-start space-x-1'>
            <p className='font-bold text-xs'>{listing.bathrooms >1 ? `${listing.bathrooms} Baths`:"1 Bath"}</p>
          </div>
         
          
        </div>
    
      </Link>
      {onEdit && (
          <FcEditImage className='absolute bottom-2 right-2 h-[24px] cursor-pointer'
          onClick={()=>onEdit(listing.id)} />
         )}
          
         
         {onDelete &&(
          <MdOutlineDelete className='cursor-pointer absolute bottom-2 right-8 h-[24px]  text-red-500'
          onClick={()=>onDelete(listing.id)}/>
         )}
    </li>

  )
}
