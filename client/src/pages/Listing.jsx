import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import Contact from '../components/Contact';
import { Link } from 'react-router-dom'

import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaCity
} from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);

  //variables para el listing
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [seller, setSeller] = useState(null);


  //variables para el formulario de calculo de ayuda
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [meetsConditions, setMeetsConditions] = useState(false);
  const [isEligible, setIsEligible] = useState(null);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
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
        console.log(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchSeller = async () => {
        try {
            const res = await fetch(`/server/user/${listing.userRef}`);
            const data = await res.json();
            if (data.success === false) {
                setError(true);
                setLoading(false);
                return;
            }
            setSeller(data);
            setLoading(false);
            setError(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    fetchSeller();
}, [listing]);

  const formatMunicipality = (municipality) => {
    return municipality.replace(/(?:^|_)([a-z])/g, (_, c) => ' ' + c.toUpperCase()).trim();
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const meetsAgeCondition = age <= 35;
    const meetsSalaryCondition = salary <= 45360;
    const isEligible = meetsAgeCondition && meetsSalaryCondition && meetsConditions;
    setIsEligible(isEligible);
    console.log("isEligible:", isEligible);
    console.log("listing.type:", listing.type);
  };

  return (
    <main>
      {loading && <p className='text-2xl text-center my-7'>Cargando...</p>}
      {error && (
        <p className='text-2xl text-center my-7'>Algo fue mal</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='flex flex-col max-w-4xl gap-4 p-3 mx-auto my-7'>
            <p className='text-2xl font-semibold'>
              {listing.name} - {' '}
              <span className='font-bold text-green-900'>
              {listing.price.toLocaleString('en-US')}
                € 
              {listing.type === 'rent' && ' /mes'}
              </span>
            </p>
            {seller && 
                    <Link to={`/seller/${seller._id}`}>
                      <div className='flex flex-col mt-2'>
                        <h1 className='text-l w-fit'>Vendido por:</h1>
                        <div className='flex flex-row mt-2'>
                        <img src={seller.avatar} className='object-cover w-16 h-16 rounded-full' />
                          <div className='flex flex-col items-center ml-5 justify-evenly'>
                              <h1 className='text-xl font-bold w-fit'>{seller.username}</h1>
                          </div>
                          </div>
                            </div>
                        </Link>
            }
            
            <p className='flex items-center gap-2 mt-6 text-xl font-bold text-black'>
              <FaCity className='text-green-700' />
              {formatMunicipality(listing.municipality)}
            </p>
            <p className='flex items-center gap-2 mt-2 text-sm text-slate-600'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'En alquiler' : 'En venta'}
              </p>
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Descripción - </span>
              {listing.description}
            </p>
            <ul className='flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} dormitorios `
                  : `${listing.bedrooms} dormitorio `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baños `
                  : `${listing.bathrooms} baño `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Con parking' : 'Sin parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Amueblado' : 'Sin amueblar'}
              </li>
            </ul>
            <p className='mt-2 text-xl font-bold text-rose-800'>
              Calcula si calificas para la ayuda de la CARM
            </p>
            <a href="https://download1526.mediafire.com/dpkhxecnb0zgygd8AiB_IDoJck5IS2kRLSx_CmXmVYJUKaSx1v0sDzOLuL6rBVDh65pyI66SOVBqQAkKrB_cVLU5lxg-Hb7QQPo4EXUZzJtOI1h-2VF-NabNo5AqIVEoYhU_5zWpKe0z1Akrqyc7NWQuKA_KIPxeh9urWRFrnsT96cg/p9glostm3krenfe/IPREM.xls" className='text-blue-500'>Descarga aquí el Excel para 
            calcular tus ingresos anuales.</a>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-2 sm:flex-row'>
    <div className='flex flex-col flex-1 gap-4'>
  
        <input
          type="text"
          placeholder='Edad'  
          className='max-w-xs p-3 border rounded-lg'
          maxLength='2'
          minLength='2'
          required
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder='Suma rentas anuales'
          className='max-w-xs p-3 border rounded-lg'
          onChange={(e) => setSalary(e.target.value)}
        />
        
        <ul className='ml-5 list-disc'>
          <li>Tengo residencia legal en España</li>
          <li>No tengo parentesco con el arrendador / vendedor</li>
          <li>No tengo otra vivienda en propiedad</li>
          <li>La vivienda será mi domicilio habitual o permanente</li>
          <li>Acepto que puedan llevarse a cabo inspecciones y control financiero </li>
        </ul>
        <div className='flex flex-row'>
        <input
          type="checkbox"
          checked={meetsConditions}
          className='w-5'
          onChange={(e) => setMeetsConditions(e.target.checked)}
        />
        <p className='ml-2 font-bold'>Confirmo que cumplo todos los requisitos mencionados arriba</p>
        </div>
        {isEligible &&  <p className='mt-2 text-xl font-bold text-green-900'>
      Enhorabuena, cumples los requisitos para recibir la ayuda de la CARM
      </p>}
      {isEligible === false && <p className='mt-2 text-xl font-bold text-red-900'>
        Lo sentimos, no cumples los requisitos para recibir la ayuda de la CARM:
        </p>}
        {isEligible === false && meetsConditions===false && <p className='mt-2 font-bold text-red-900 text-l'>
        No cumples alguno de los requisitos de residencia, parentesco o situación de vivienda
        </p>}
        {isEligible === false && listing.type==="rent" && salary > 25200 && <p className='mt-2 font-bold text-red-900 text-l'>
        Tus ingresos anuales superan el limite de 3 veces el IPREM
        </p>}
        {isEligible === false && listing.type==="sale" && salary > 45360 && <p className='mt-2 font-bold text-red-900 text-l'>
        Tus ingresos anuales superan el limite de 5,4 veces el IPREM
        </p>}
        {isEligible === false && age >35 && <p className='mt-2 font-bold text-red-900 text-l'>
        Tu edad supera los 35 años
        </p>}

      
        
      <button type="submit" className='max-w-xs p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 '>ENVIAR</button>
    </div>
    
      
    </form>
            <div className='flex gap-4'>
               {!isEligible && <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Precio final sin descuento: {' '}
                  { +listing.price} €
                </p> } 
                {isEligible && listing.type === "rent" && <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Precio final con descuento: {' '}
                  { +listing.price -250} €
                </p> } 
                {isEligible && listing.type === "sale" && <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Puedes obtener un aval de: {' '}
                  { +listing.price * 0.2} €
                </p> } 
            </div>
            {currentUser &&currentUser.type ==="buyer" && listing.userRef !== currentUser._id && !contact && (
            <button onClick={()=>setContact(true)} 
            className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95'>
              Contactar propietario</button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}