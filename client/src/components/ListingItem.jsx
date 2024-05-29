import React from 'react'
import { Link } from 'react-router-dom'
import { FaCity } from 'react-icons/fa'
export default function ListingItem({listing}) {

  const formatMunicipality = (municipality) => {
    return municipality.replace(/(?:^|_)([a-z])/g, (_, c) => ' ' + c.toUpperCase()).trim();
  };

  return (
    <div className='bg-white shadow-md hover:shadow:lg transition-shadow
     overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="Portada del anuncio" 
            className='h-[320px] sm:h-[220px] w-full object-cover
             hover:scale-105 transition-scale duration-300 '/>
        
        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='truncate text-lg font-semibold 
            text-slate-700'>{listing.name}</p>
            {listing.municipality && <div className='flex items-center gap-1'>
              <FaCity className='h-4 w-4 text-green-700'/>
              <p className='text-sm text-gray-600 truncate w-full'>{formatMunicipality(listing.municipality)}</p>
            </div>}
            
            <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
            <p className='text-slate-500 mt-2 font-bold'>
            {listing.price ? listing.price.toLocaleString('en-US') :
            listing.regularPrice.toLocaleString('en-US')}€      
            {listing.type === 'rent' && ' /mes'}       
            </p>
            <div className='text-slate-700 flex flex-row gap-4'>
              <div className='font-bold text-xs'> 
               {listing.bedrooms} {listing.bedrooms > 1 ? "dormitorios" : "dormitorio"}
              </div>
            <div className='text-slate-700'>
              <div className='font-bold text-xs'> 
               {listing.bathrooms} {listing.bathrooms > 1 ? "baños" : "baño"}
              </div>
            </div>
            </div>

        </div>
        </Link>
    </div>
  )
}
