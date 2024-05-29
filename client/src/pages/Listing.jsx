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
      {loading && <p className='text-center my-7 text-2xl'>Cargando...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Algo fue mal</p>
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
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - {' '}
              {listing.price.toLocaleString('en-US')}
                € 
              {listing.type === 'rent' && ' /mes'}
            </p>
            {seller && 
                    <Link to={`/seller/${seller._id}`}>
                      <div className='flex flex-col mt-2'>
                        <h1 className='text-l  w-fit'>Vendido por:</h1>
                        <div className='flex flex-row mt-2'>
                          <img src={seller.avatar} className='max-h-[50px]' />
                          <div className='flex flex-col ml-5 justify-evenly items-center'>
                              <h1 className='text-xl font-bold w-fit'>{seller.username}</h1>
                          </div>
                          </div>
                            </div>
                        </Link>
            }
            
            <p className='flex items-center mt-6 gap-2 text-black text-xl font-bold'>
              <FaCity className='text-green-700' />
              {formatMunicipality(listing.municipality)}
            </p>
            <p className='flex items-center mt-2 gap-2 text-slate-600  text-sm'>
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
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
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
            <p className='text-rose-800 font-bold text-xl mt-2'>
              Calcula si calificas para la ayuda de la CARM
            </p>
            <a href="https://www.irpf.eu/excel/finanzas.zip" className='text-blue-500'>Descarga aquí el Excel para 
            calcular tus ingresos anuales.</a>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 pt-2'>
    <div className='flex flex-col gap-4 flex-1'>
  
        <input
          type="text"
          placeholder='Edad'  
          className='border p-3 rounded-lg max-w-xs'
          maxLength='2'
          minLength='2'
          required
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder='Suma rentas anuales'
          className='border p-3 rounded-lg max-w-xs'
          onChange={(e) => setSalary(e.target.value)}
        />
        
        <ul className='list-disc ml-5'>
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
        {isEligible &&  <p className='text-green-900 font-bold text-xl mt-2'>
      Enhorabuena, cumples los requisitos para recibir la ayuda de la CARM
      </p>}
      {isEligible === false && <p className='text-red-900 font-bold text-xl mt-2'>
        Lo sentimos, no cumples los requisitos para recibir la ayuda de la CARM:
        </p>}
        {isEligible === false && meetsConditions===false && <p className='text-red-900 font-bold text-l mt-2'>
        No cumples alguno de los requisitos de residencia, parentesco o situación de vivienda
        </p>}
        {isEligible === false && listing.type==="rent" && salary > 25200 && <p className='text-red-900 font-bold text-l mt-2'>
        Tus ingresos anuales superan el limite de 3 veces el IPREM
        </p>}
        {isEligible === false && listing.type==="sale" && salary > 45360 && <p className='text-red-900 font-bold text-l mt-2'>
        Tus ingresos anuales superan el limite de 5,4 veces el IPREM
        </p>}
        {isEligible === false && age >35 && <p className='text-red-900 font-bold text-l mt-2'>
        Tu edad supera los 35 años
        </p>}

      
        
      <button type="submit" className='max-w-xs bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 '>ENVIAR</button>
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
            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
              Contactar propietario</button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}