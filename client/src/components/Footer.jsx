import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-rose-800 shadow-md'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex justify-start items-center max-w-2xl mx-auto p-3 gap-10'>
            <a href="https://www.carm.es">
                <img src="https://www.carm.es/web/CARM/carm2018/images/escudoCARM.svg" alt="" />
            </a>
            <a href="https://www.turismoregiondemurcia.es/camino-caravaca-de-la-cruz/que_es_el_ano_jubilar/">
                <img src="https://www.carm.es/web/imagen?ALIAS=IMG&IDIMAGEN=112877" alt="" />
            </a>
            <img src="https://www.carm.es/web/CARM/carm2018/images/logoUE.svg" alt="" />
            </div>
            <div className='flex flex-col sm:flex-row justify-start items-center max-w-xl mx-auto p-3 gap-10 mt-4 md:mt-0'>
                <p className='text-white font-bold'>Con la colaboración de:</p>
                <img className='h-[50px] w-[100px]' src="https://www.cajamar.es/frontend/img/logo-grupo-mini.png" alt="" />
                <img className='h-[50px] w-[120px] -mr-12' src="https://www.ruralcentral.es/sites/default/files/logotipo-caja-rural-central.png" alt="" />
                <img className='h-[50px] w-[140px] min-w-0' src="https://ruralregionalmurcia.ruralvia.com/sites/default/files/logotipo_crregional.png" alt="" />
            </div>
        </div>
</footer>

  )
}

export default Footer