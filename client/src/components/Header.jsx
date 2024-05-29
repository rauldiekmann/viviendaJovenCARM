import React from 'react';
import {FaSearch} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const Header = () => {

  const {currentUser} = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    //mantener los parametros definidos por los filtros en la query string 
    //al ejecutar nueva busqueda
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }}, [location.search]);

  return (
    <header className='bg-rose-800 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-neutral-50'>ViviendaJoven</span>
                <span className='text-yellow-400'>CARM</span>
            </h1>
          </Link>
          <form onSubmit = {handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Buscar propiedad...' 
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className='text-slate-600' />
          </form>
          <ul className='flex gap-4'>

            <Link to="/">
              <li className='hidden sm:inline text-neutral-50 hover:underline'>Inicio</li>
            </Link>

            <Link to="/about">
              <li className='hidden sm:inline text-neutral-50 hover:underline'>Información</li>
            </Link>

            <Link to="/profile">
                {currentUser ? (
                  <img className='rounded-full h-7 w-7 object-cover' 
                  src={currentUser.avatar} alt="Foto de perfil"  />
                ) : (
                  <li className='sm:inline text-neutral-50 hover:underline'>Acceder</li>
                )}
              </Link>
          </ul>
        </div>
        
    </header>
  )
}

export default Header