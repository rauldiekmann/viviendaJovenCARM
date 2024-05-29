import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

  export default function SignUp() {

    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      phone: '',
      //mejor workaround que he encontrado para el default value del select
      type: 'seller'
    });  

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  //Manejar cambios en el formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      setError('Porfavor elige un rol de usuario');
      return;
    }
    if (!formData.email) {
      setError('Porfavor especifica un email válido');
      return;
    }
    if (!formData.username) {
      setError('Porfavor especifica un nombre de usuario');
      return;
    }
    if (!formData.phone) {
      setError('Porfavor especifica un número de teléfono');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('server/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  };
    
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center
       font-semibold my-7'>Registro</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type="text" placeholder='Usuario'
          className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
          <input type="email" placeholder='Correo'
          className='border p-3 rounded-lg' id='email' onChange={handleChange}
          />
          <input type="password" placeholder='Contraseña'
          className='border p-3 rounded-lg' id='password' onChange={handleChange} />
           <input type="text" placeholder='Teléfono'maxLength={9} minLength={9}
          className='border p-3 rounded-lg' id='phone' onChange={handleChange}/>
          <div>
            <label for="type">Selecciona rol:</label>
              <select id="type" class=" mt-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={handleChange}>
                <option value="seller">Vendedor (quiero rentabilizar mis inmuebles)</option>
                <option value="buyer">Comprador (quiero comprar o alquilar vivienda)</option>
              </select>
          </div>

          <button  disabled = {loading} className='bg-slate-700 text-white p-3 
          rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Cargando...' : 'Registrarse'}
            </button>
            <OAuth />
       </form>
       <div className='flex gap-2 mt-5'>
          <p>¿Ya eres usuario?</p>
          <Link to={'/sign-in'} className='text-blue-700'>Iniciar sesión</Link>
       </div>
       {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}

