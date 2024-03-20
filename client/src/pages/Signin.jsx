import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

  export default function Signin() {

  const [formData, setFormData] = useState({});
  /*Usamos los de Redux
   const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);*/
 const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();

  //Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('server/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
    
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center
       font-semibold my-7'>Acceso</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type="text" placeholder='Correo'
          className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          <input type="password" placeholder='Contraseña'
          className='border p-3 rounded-lg' id='password' onChange={handleChange} />
          <button  disabled = {loading} className='bg-slate-700 text-white p-3 
          rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Cargando...' : 'Acceder'}
            </button>
            <OAuth />
       </form>
       <div className='flex gap-2 mt-5'>
          <p>¿No eres usuario?</p>
          <Link to={'/sign-up'} className='text-blue-700'>Crear una cuenta</Link>
       </div>
       {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}

