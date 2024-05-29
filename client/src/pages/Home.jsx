import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleCount, setSaleCount] = useState(0);
  const [rentCount, setRentCount] = useState(0);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  
  useEffect(() => {
    
    const fetchListingCount = async () => {
      try {
        const res = await fetch('/server/listing/count');
        const data = await res.json();
        setSaleCount(data.saleCount);
        setRentCount(data.rentCount);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/server/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/server/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
        fetchListingCount();
      } catch (error) {
        log(error);
      }
    };
    fetchRentListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 pt-16 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Si eres joven, aquí encontrarás tu hogar <span className='text-slate-500'>perfecto,</span>
          <br />
          alquiles o compres
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Descubre tus mejores oportunidades de alquiler y compra de viviendas en la Región de Murcia,
          <br />
          con la ayuda de la Comunidad Autónoma.
        </div>
        <Link
          to={'/search'}
          className=' sm:text-sm md:text-3xl text-rose-800 font-bold hover:text-4xl transition-all duration-1200 '
        >
          Llévame a ver inmuebles
        </Link>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h1 className='text-3xl font-semibold text-slate-600'>Nuevas ofertas de alquiler</h1>
              <Link className='text-sm text-rose-800 hover:underline' 
              to={'/search?type=rent'}>Llévame a ver alquileres</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h1 className='text-3xl font-semibold text-slate-600'>Nuevas ofertas de compra</h1>
              <Link className='text-sm text-rose-800 hover:underline' 
              to={'/search?type=sale'}>Quiero ver inmuebles para compra</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-row justify-center'>
      <h1 className='text-slate-500 font-bold text-xl lg:text-6xl pb-4'>
        Parque de viviendas <span className='text-slate-700'>actualizado</span>
        </h1>
      </div>
      <div className='flex flex-row justify-center gap-6 pb-8 px-3 max-w-6xl mx-auto'>
        <div className='flex flex-col items-center '>
          <h1 className='text-slate-700 font-bold text-xl lg:text-4xl'>Inmuebles en alquiler</h1>
          <h2 className='text-rose-800 text-4xl lg:text-6xl font-bold'>{rentCount}</h2>
        </div>
        <div className='flex flex-col items-center '>
          <h1 className='text-slate-700 font-bold text-xl lg:text-4xl'>Inmuebles en venta</h1>
          <h2 className='text-rose-800 text-4xl lg:text-6xl font-bold'>{saleCount}</h2>
        </div>
      </div>
    </div>
  );
}