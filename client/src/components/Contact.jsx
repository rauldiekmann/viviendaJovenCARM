import { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/server/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <div>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p className='text-3xl'>
                        Contacta a <span className='font-semibold'>{landlord.username}</span> sobre{' '}
                        <span className='font-semibold'>{listing.name.toLowerCase()}</span>:
                    </p>
                    <div className='flex flex-row gap-2'>
                        <MdEmail className='mt-1 text-4xl text-rose-800' />
                        <p className='text-4xl font-bold text-rose-800'>
                            {landlord.email}
                        </p>
                    </div>
                    {landlord.phone && (
                        <div className='flex flex-row gap-2'>
                            <FaPhoneAlt className='mt-1 text-4xl text-rose-800' />
                            <p className='text-4xl font-bold text-rose-800'>
                                {landlord.phone}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
