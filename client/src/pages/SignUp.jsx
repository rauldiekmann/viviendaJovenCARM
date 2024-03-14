import React from 'react'
import { Link } from 'react-router-dom'
const about = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center
       font-semibold my-7'>Registro</h1>
       <form className='flex flex-col gap-4'>
          <input type="text" placeholder='Usuario'
          className='border p-3 rounded-lg' id='username' />
          <input type="text" placeholder='Correo'
          className='border p-3 rounded-lg' id='email' />
          <input type="text" placeholder='Contraseña'
          className='border p-3 rounded-lg' id='password' />
          <button className='bg-slate-700 text-white p-3 
          rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Registrarme</button>
       </form>
       <div className='flex gap-2 mt-5'>
          <p>¿Ya eres usuario?</p>
          <Link to={'/sign-in'} className='text-blue-700'>Iniciar sesión</Link>
       </div>
    </div>
  )
}

export default about