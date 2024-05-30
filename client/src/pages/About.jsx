import React from 'react';

const About = () => {
  return (
    <div>
      <div className='flex flex-col gap-10 p-4'>
        <h1 className='text-slate-700 font-bold text-xl md:text-3xl lg:text-6xl w-100'>
          ¿Estás pensando en adquirir
          <span className='text-slate-500'> tu primera vivienda </span>
          y necesitas ayuda?
        </h1>
        <div className='flex flex-col lg:flex-row p-2 gap-4'>
          <div className='w-full lg:w-1/2'>
            <img
              className='rounded-lg'
              src="https://images.pexels.com/photos/7937716/pexels-photo-7937716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
          </div>
          <div className='flex flex-col lg:w-1/2 gap-2'>
            <h2 className='text-slate-700 font-bold text-l md:text-xl lg:text-3xl'>¿Eres menor de 35 años?</h2>
            <h2 className='text-slate-700 font-bold text-m md:text-l lg:text-2xl'>
              ¿Estás pensando en adquirir tu primera vivienda para formar tu hogar?
            </h2>
            <p className='mt-5'>
              La Comunidad Autónoma pone a disposición de los jóvenes menores de 35 años la línea de avales para financiar tu primera vivienda.
              Se trata de una medida innovadora y pionera en España. La vivienda a adquirir podrá ser nueva, de segunda mano o de autopromoción, y no podrá superar los 175.000€. 
            </p>
            <p className='text-slate-700 mt-8'>
              El Gobierno de la Región de Murcia ha puesto en marcha una solución para ayudarte a afrontar el pago de la entrada de tu primera vivienda.
              La Comunidad proporciona el aval de <strong>hasta el 20% del valor</strong> de tasación de la vivienda para que la entidad bancaria pueda financiar el 100% del importe de la misma.
            </p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-10 p-4'>
        <div className='flex flex-row md:justify-end'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl w-100'>
            ¿Prefieres 
            <span className='text-slate-500'> alquilar? </span>
          </h1>
        </div>
        <div className='flex flex-col lg:flex-row p-2 gap-4'>
          <div className='flex flex-col gap-2 w-full lg:w-1/2'>
            <h2 className='text-slate-700 font-bold text-3xl'>¿Eres menor de 35 años?</h2>
            <h2 className='text-slate-700 font-bold text-xl'>
              ¿Estás pensando en alquilar para disfrutar de mayor flexibilidad?
            </h2>
            <p>
              La Comunidad Autónoma pone a disposición de los jóvenes menores de 35 años la ayuda mensual para el alquiler.
              La vivienda <strong>no podrá superar los 600€ mensuales</strong> de alquiler.
            </p>
          </div>
          <div className='w-full lg:w-1/2'>
            <img
              className='rounded-lg'
              src="https://images.pexels.com/photos/4245903/pexels-photo-4245903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-10 p-4'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl w-100'>
          ¿Ya eres propietario y quieres
          <span className='text-slate-500'> rentabilizar </span>
          tu inmueble?
        </h1>
        <div className='flex flex-col lg:flex-row p-2 gap-4'>
          <div className='w-full lg:w-1/2'>
            <img
              className='rounded-lg'
              src="https://media.istockphoto.com/id/1391413216/es/foto/steigende-preise-f%C3%BCr-immobilien.jpg?s=612x612&w=0&k=20&c=de8FXX0djUC3uXeVGl6EQvTyLPf-tApVMv_bVZOL99E="
              alt=""
            />
          </div>
          <div className='flex flex-col gap-2 w-full lg:w-1/2'>
            <h2 className='text-slate-700 font-bold text-3xl'>¿Quieres vender o alquilar tu propiedad?</h2>
            <h2 className='text-slate-700 font-bold text-xl'>
              ¿El mercado no puede pagar el precio que mereces?
            </h2>
            <p className='mt-5'>
              Listar tu propiedad en nuestra plataforma te permitirá ofrecer un precio mucho más atractivo a compradores potenciales, mientras tú obtienes el mismo beneficio.
            </p>
            <p className='text-slate-700 mt-8'>
              El Gobierno de la Región se hará cargo de <strong>hasta el 20% del valor</strong> de tasación de la vivienda para compradores,
              y hasta 250€ mensuales para alquiler. Si vendes, tendrás mucha más facilidad para encontrar compradores, gracias a las ayudas de la CARM.
              Si alquilas, podrás listar tu propiedad con un descuento directo de 250€, mientras tú recibes la mensualidad completa cada mes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
