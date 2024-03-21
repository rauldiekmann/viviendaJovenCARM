import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useRef, useState, useEffect} from 'react';
import { getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';


const about = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  console.log(formData);
  //almacenamiento con firebase
  /*
      allow read; 
      allow write: if 
      request.resource.size <2 * 1024 &&
      request.resource.contentType.matches("image/.*") */

  //Lógica para subir imagen
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  

  //Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } 
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center
       my-7'>Perfil</h1>
       <form onSubmit= {handleSubmit} className="flex flex-col gap-4">
        {/*input oculto para subir imagen, incrustado en la misma imagen */}
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick= {()=>fileRef.current.click()} 
        src={formData.avatar || currentUser.avatar} 
        alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
         <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              La imagen no debe exceder los 2 MB
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Imagen subida con éxito</span>
          ) : (
            ''
          )}
        </p>
       <input type="text" id = "username" placeholder='usuario' defaultValue={currentUser.username}
       className='border p-3 rounded-lg'
       onChange={handleChange}
       />
       <input type="text" id = "email" placeholder='correo'  defaultValue={currentUser.email}
       className='border p-3 rounded-lg'
       onChange={handleChange}
       />
       <input type="password" id = "password" placeholder='contraseña' 
       className='border p-3 rounded-lg'
       onChange={handleChange}
       />
       <button className='bg-slate-700 text-white rounded-lg p-3 uppercase
        hover:opacity-95 disabled:opacity-80'>{loading ? "CARGANDO" : "ACTUALIZAR" }</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Borrar mi cuenta</span>
        <span onClick= {handleSignOut} className="text-red-700 cursor-pointer">Cerrar sesión</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error :""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "Usuario actualizado con éxito" : ""}</p>
    </div>
  )
}

export default about