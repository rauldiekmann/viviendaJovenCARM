import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    price:0,
    municipality: '',
    parking: false,
    furnished: false,
  });


  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  
  //Obtener información del inmueble para poblar el formulario
  useEffect(() => {
    const fetchListing = async () => {
        const listingId = params.listingId;
        const res = await fetch(`/server/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFormData(data);
    };
    fetchListing();
  }, []);


  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      //Guardamos una promesa por cada imagen que subimos
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subida completada al ${progress}% `);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if(e.target.id === 'municipality'){
      setFormData({
        ...formData,
        municipality: e.target.value,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('Debes subir al menos una imagen');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('El precio con descuento debe ser menor que el precio normal');
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Actualizar anuncio
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Nombre'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Descripción'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <select 
          id="municipality" 
          onChange={handleChange}
          value={formData.municipality}       
          className='border rounded-lg p-3 w-full'
>
        <option value="abanilla">Abanilla</option>
        <option value="abaran">Abarán</option>
        <option value="aguilas">Aguilas</option>
        <option value="albudeite">Albudeite</option>
        <option value="alcantarilla">Alcantarilla</option>
        <option value="aledo">Aledo</option>
        <option value="alguazas">Alguazas</option>
        <option value="alhama_de_murcia">Alhama de Murcia</option>
        <option value="archena">Archena</option>
        <option value="beniel">Beniel</option>
        <option value="blanca">Blanca</option>
        <option value="bullas">Bullas</option>
        <option value="calasparra">Calasparra</option>
        <option value="campos_del_rio">Campos del Río</option>
        <option value="caravaca_de_la_cruz">Caravaca de la Cruz</option>
        <option value="cartagena">Cartagena</option>
        <option value="cehegin">Cehegín</option>
        <option value="ceuti">Ceutí</option>
        <option value="cieza">Cieza</option>
        <option value="fortuna">Fortuna</option>
        <option value="fuente_alamo">Fuente Álamo</option>
        <option value="jumilla">Jumilla</option>
        <option value="la_union">La Unión</option>
        <option value="las_torres_de_cotillas">Las Torres de Cotillas</option>
        <option value="librilla">Librilla</option>
        <option value="lorca">Lorca</option>
        <option value="lorqui">Lorquí</option>
        <option value="los_alcazares">Los Alcázares</option>
        <option value="mazarron">Mazarrón</option>
        <option value="molina_de_segura">Molina de Segura</option>
        <option value="moratalla">Moratalla</option>
        <option value="mula">Mula</option>
        <option value="murcia">Murcia</option>
        <option value="ojos">Ojós</option>
        <option value="pliego">Pliego</option>
        <option value="puerto_lumbreras">Puerto Lumbreras</option>
        <option value="ricote">Ricote</option>
        <option value="san_javier">San Javier</option>
        <option value="san_pedro_del_pinatar">San Pedro del Pinatar</option>
        <option value="santomera">Santomera</option>
        <option value="torre_pacheco">Torre Pacheco</option>
        <option value="totana">Totana</option>
        <option value="ulea">Ulea</option>
        <option value="villanueva_del_rio_segura">Villanueva del Río Segura</option>
        <option value="yecla">Yecla</option>
    </select>
          <input
            type='text'
            placeholder='Direción'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-2 flex-wrap space-evenly '>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Venta</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Alquiler</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Aparcamiento</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Amueblado</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>En oferta</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Dormitorios</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baños</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='150000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Precio normal</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(€ / mes)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Precio con descuento</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>(€ / mes)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Imagenes: 
            <span className='font-normal text-gray-600 ml-4'>
              La primera imagen será la portada (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Eliminar
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Actualizando...' : 'Actualizar anuncio'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
