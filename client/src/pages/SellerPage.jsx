import React from 'react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function SellerPage() {
    SwiperCore.use([Navigation]);

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [listingsCount, setListingsCount] = useState(0);
    const [contact, setContact] = useState(false);
    const [sellerListings, setSellerListings] = useState([]);
    const [showListingsError, setShowListingsError] = useState(false);
    const [listingsLoading, setListingsLoading] = useState(false);

    const params = useParams();

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const res = await fetch(`/server/user/${params.sellerId}`);
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
    }, [params.sellerId]);

    useEffect(() => {
        const fetchUserListingCount = async () => {
            if (seller) {
                try {
                    const res = await fetch(`/server/user/count/${seller._id}`);
                    const data = await res.json();
                    setListingsCount(data.count);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchUserListingCount();
    }, [seller]);

    useEffect(() => {
        const handleShowListings = async () => {
            if (seller) {
                try {
                    setShowListingsError(false);
                    setListingsLoading(true);
                    const res = await fetch(`/server/user/listings/${seller._id}`);
                    const data = await res.json();
                    if (data.success === false) {
                        setShowListingsError(true);
                        setListingsLoading(false);
                        return;
                    }
                    setSellerListings(data);
                    setListingsLoading(false);
                } catch (error) {
                    setShowListingsError(true);
                    setListingsLoading(false);
                }
            }
        };

        handleShowListings();
    }, [seller]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Cargando...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>Hubo algún error</p>
            )}
            {seller && !loading && !error && (
                <div>
                    <div className='flex flex-col responsiveSellerPage:flex-row'>
                        <img src={seller.avatar} className='responsiveSellerPage:max-h-[300px]  w-100 responsiveSellerPage:w-[33%]' />
                        <div className='flex flex-col w-100 responsiveSellerPage:w-[33%] pt-5 justify-evenly items-center'>
                            <h1 className='text-xl sm:text-md md:text-xl lg:text-3xl font-bold w-fit'>Usuario: {seller.username}</h1>
                            <h1 className='text-slate-700 font-bold text-sm sm:text-md md:text-xl lg:text-4xl'>Inmuebles listados</h1>
                            <p className='text-rose-800 text-sm sm:text-md md:text-3xl lg:text-6xl font-bold'>{listingsCount}</p>
                        </div>
                        <div className='flex flex-col items-center justify-center pt-5 w-100 responsiveSellerPage:w-[33%]'>
                            <button onClick={() => setContact(true)}
                                className='bg-slate-700 text-white rounded-lg w-min uppercase hover:opacity-95 p-3'>
                                Contactar propietario
                            </button>
                            {contact && (
                                <div>
                                    <div className='flex flex-col gap-2 mt-6'>
                                        <p className='text-sm sm:text-md md:text-xl lg:text-3xl'>
                                            Contacta a <span className='font-semibold'>{seller.username}</span>{' '}:
                                        </p>
                                        <div className='flex flex-row gap-2'>
                                            <MdEmail className='text-sm sm:text-md md:text-xl lg:text-3xl text-rose-800 mt-1' />
                                            <p className=' text-sm sm:text-md md:text-xl lg:text-4xl font-bold text-rose-800'>
                                                {seller.email}
                                            </p>
                                        </div>
                                        {seller.phone && (
                                            <div className='flex flex-row gap-2'>
                                                <FaPhoneAlt className='text-4xl text-rose-800 mt-1' />
                                                <p className='text-4xl font-bold text-rose-800'>
                                                    {seller.phone}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {seller && !loading && !error && (
                    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                    <div className=''>
                    <div className='my-3'>
                        <h1 className='text-3xl font-semibold text-slate-600'>Inmuebles de {seller.username} </h1>
                    </div>
                    {listingsLoading && <p className='text-center my-7 text-2xl'>Cargando inmuebles...</p>}
                    {showListingsError && (
                        <p className='text-center my-7 text-2xl'>Error al cargar los inmuebles</p>
                    )}
                    <div className='flex flex-wrap gap-4 pt-8'>
                        {sellerListings.map((listing) => (
                            <ListingItem listing={listing} key={listing._id} />
                        ))}
                    </div>
                </div>
                    </div>
                
            )}
        </main>
    );
}


