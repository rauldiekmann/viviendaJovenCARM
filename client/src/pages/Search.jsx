import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    sort: 'created_at',
    order: 'desc',
    minprice:"",
    maxprice:"",
    municipality:"all"
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const minpriceFromUrl = urlParams.get('minprice');
    const maxpriceFromUrl = urlParams.get('maxprice');
    const municipalityFromUrl = urlParams.get('municipality');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl  ||
      minpriceFromUrl ||
      maxpriceFromUrl ||
      municipalityFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
        minprice: minpriceFromUrl || '',
        maxprice: maxpriceFromUrl || '',
        municipality: municipalityFromUrl || 'all'
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/server/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if(e.target.id === 'municipality'){
      setSidebardata({
        ...sidebardata,
        municipality: e.target.value,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.id === 'minprice' || e.target.id === 'maxprice') {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    urlParams.set('minprice', sidebardata.minprice);
    urlParams.set('maxprice', sidebardata.maxprice);
    urlParams.set('municipality', sidebardata.municipality);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Término de búsqueda:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Ej: piso, céntrica...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Tipo:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Venta y alquiler</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Alquiler</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Venta</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Instalaciones:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Amueblada</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
    <label className='font-semibold'>Precio mínimo:</label>
    <input
      type='number'
      id='minprice'
      placeholder='Mínimo'
      className='border rounded-lg p-3 w-full'
      value={sidebardata.minprice}
      onChange={handleChange}
    />
  </div>
  
  <div className='flex items-center gap-2'>
    <label className='font-semibold'>Precio máximo:</label>
    <input
      type='number'
      id='maxprice'
      placeholder='Máximo'
      className='border rounded-lg p-3 w-full'
      value={sidebardata.maxprice}
      onChange={handleChange}
    />
  </div>
  <div className='flex items-center gap-2'>
  <label for="municipality">Selecciona un municipio:</label>
    <select id="municipality"       
    className='border rounded-lg p-3 w-full'
    value={sidebardata.municipality}
    onChange={handleChange}
>
        <option value="all">Todos</option>
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

  </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Ordenar:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='price_desc'>Precio: más caro a más barato</option>
              <option value='price_asc'>Precio: más barato a más caro</option>
              <option value='createdAt_desc'>Más recientes</option>
              <option value='createdAt_asc'>Más antiguos</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Buscar
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Resultados de búsqueda:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-black font-bold'>No se encontraron propiedades con tus criterios de búsqueda</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Mostrar más
            </button>
          )}
        </div>
      </div>
    </div>
  );
}