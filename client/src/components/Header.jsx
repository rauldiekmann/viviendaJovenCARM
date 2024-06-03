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
    <header className='shadow-md bg-rose-800'>
        <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
          <Link to="/">
            <h1 className='flex flex-wrap text-sm font-bold sm:text-xl'>
                <span className='text-neutral-50'>ViviendaJoven</span>
                <span className='text-yellow-400'>CARM</span>
            </h1>
          </Link>
          <form onSubmit = {handleSubmit}
          className='flex items-center hidden p-3 rounded-lg bg-slate-100 sm:inline'>
            <input type="text" placeholder='Buscar propiedad...' 
            className='w-24 bg-transparent focus:outline-none sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <img className='object-cover rounded-full h-7 w-7' 
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