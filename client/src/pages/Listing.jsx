import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore  from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';




export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const[loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/server/listing/get/${params.listingId}`);
            const data = await res.json();
            if (data.success === false) {
              setError(true);
              setLoading(false);
              return;
            }
            setListing(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchListing();
      }, [params.listingId]);

  return (
  <main>
 {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>)} 
        
 {listing && !loading && !error && (
    <Swiper navigation>
        {listing.imageUrls.map(url => <SwiperSlide key={url}>
            <div className='h-[550px]' style= {{background: `url(${url}) center no-repeat `, backgroundSize: 'cover' }}></div>
            </SwiperSlide>)}
    </Swiper>
 )}

<div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
  <p className='text-2xl font-semibold'>
    {listing.name} - {""}
    {listing.offer
    ? listing.discountPrice.toLocaleString("en-US")
    : listing.regularPrice.toLocaleString("en-US")}
    €
    {listing.type === "rent" && "/mes"} 
  </p>

  <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
    <FaMapMarkerAlt className='text-green-700'/>
    {listing.address}
  </p>
  <div className='flex gap-4'>
    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
    {listing.type === "rent" ? "Para alquilar" : "En venta"} 
    </p>
  </div>
  FALTA AÑADIR EL CÁLCULO DEL DESCUENTO PARA ALQUILERES CON EL 60% DEL PRECIO ORIGINAL
  <p className='text-slate-800'>
  <span className='font-semibold text-black'>Descripción -</span>
  {listing.description}
 </p>
  <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
    <li className='gap-1 whitespace-nowrap'>
      <FaBed/>
      {
        listing.bedrooms > 1 
        ?
        `${listing.bedrooms} dormitorios`
        :
        `${listing.bedrooms} dormitorio`
      }
    </li>
    <li>
      <FaBath/>
      {
        listing.bathrooms > 1 
        ?
        `${listing.bathrooms} baños`
        :
        `${listing.bathrooms} baño`
      }
    </li>
    <li>
      <FaParking/>
      {
        listing.parking ?
        `Con parking`
        :
        `Sin parking`
      }
    </li>
    <li>
      <FaChair/>
      {
        listing.furnished ?
        `Amueblado`
        :
        `Sin amueblar`
      }
    </li>
  </ul>
 </div>
 
 
         </main>
  )
}
