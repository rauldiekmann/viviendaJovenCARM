import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='shadow-md bg-rose-800'>
            <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='flex items-center justify-start max-w-2xl gap-10 p-3 mx-auto'>
                    <a href="https://www.carm.es">
                        <img src="https://www.carm.es/web/CARM/carm2018/images/escudoCARM.svg" alt="" />
                    </a>
                    <a href="https://www.turismoregiondemurcia.es/camino-caravaca-de-la-cruz/que_es_el_ano_jubilar/">
                        <img src="https://www.carm.es/web/imagen?ALIAS=IMG&IDIMAGEN=112877" alt="" />
                    </a>
                    <img src="https://www.carm.es/web/CARM/carm2018/images/logoUE.svg" alt="" />
                </div>
                <div className='flex flex-col items-center justify-start max-w-xl gap-10 p-3 mx-auto mt-4 sm:flex-row md:mt-0'>
                    <p className='font-bold text-white'>Con la colaboración de:</p>
                    <img className='h-[50px] w-[100px]' src="https://www.cajamar.es/frontend/img/logo-grupo-mini.png" alt="" />
                    <img className='h-[50px] w-[120px] -mr-12' src="https://www.ruralcentral.es/sites/default/files/logotipo-caja-rural-central.png" alt="" />
                    <img className='h-[50px] w-[140px] min-w-0' src="https://ruralregionalmurcia.ruralvia.com/sites/default/files/logotipo_crregional.png" alt="" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
