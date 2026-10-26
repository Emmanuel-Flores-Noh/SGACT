import { useEffect, useState } from 'react';
import { Usuario, getUserData, logout } from '../api/usuario';
// @ts-ignore
import { useNavigate, Outlet } from 'react-router-dom'
import { Button, LoadingScreen } from '../components';

interface userNavOptions {
  url: string;
  name: string;
};

const navOptions: {Alumno: Array<userNavOptions>, Revisor: Array<userNavOptions>} = {
  "Alumno": [
    {
      url: "/dashboard/alumno/catalogo",
      name: "Catalogo"
    },
    {
      url: "/dashboard/alumno/historial",
      name: "Historial"
    }
  ],
  "Revisor": [
    {
      url: "/dashboard/revisor/pendientes",
      name: "Pendientes"
    },
    {
      url: "/dashboard/revisor/historial",
      name: "Historial"
    }
  ]
}

export default function Dashboard(): React.JSX.Element {
  const [userData, setUserData] = useState<Usuario>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    if( await logout() ) {
      navigate("/");
    }
  }

  useEffect(()=> {
    getUserData().then((res) => {
      if( ! res.ok ) {
        navigate('/');
        return;
      }

      res.json().then( (value:Usuario) => {setUserData(value);} );
      
      setLoading(false);

      if(userData?.rol === 'Revisor') {
        navigate('/dashboard/revisor/')
      }
      else {
        navigate('/dashboard/alumno/catalogo')
      }
    })
  }, [])
  
  if( loading ) {
    return <LoadingScreen></LoadingScreen>
  }

  return <div className="min-h-screen bg-gris-050 font-sgact">
      <header className="bg-azul-institucional selection:bg-blanco selection:text-azul-institucional">
        <div className='grid-rows-2'>
          <div className="mx-auto flex max-w-4xl items-center gap-5 px-4 py-6 escritorio:gap-6 escritorio:py-8">
            <img
              src="/escudo-uady-blanco.png"
              alt="Escudo de la Universidad Autónoma de Yucatán"
              width={178}
              height={290}
              className="h-20 w-auto shrink-0 escritorio:h-24"
            />
            <div>
              <p className="text-sm font-semibold tracking-wide text-blanco">
                <span>FACULTAD DE MATEMÁTICAS</span>
                <span className="hidden escritorio:inline"> - </span>
                <br className="escritorio:hidden" />
                <span>UNIVERSIDAD AUTÓNOMA DE YUCATÁN</span>
              </p>
              <h1 className="mt-1 text-banner font-extrabold leading-tight tracking-tight text-blanco">
                Dashboard de {userData?.nombres}
              </h1>
            </div>
          </div>
          <div className='flex gap-4 justify-center object-center'>
            <select onChange={(e)=>navigate(e.target.value)} className='rounded-none bg-azul-institucional px-8 py-2.5 text-base text-blanco font-semibold hover:bg-azul-institucional-enfoque active:bg-azul-institucional-enfoque focus-visible:outline-none focus-visible:ring-azul-institucional transition duration-150'>
              {
                userData?.rol === "Revisor" ? navOptions.Revisor.map(v => <option value={v.url}>{v.name}</option>)
                : navOptions.Alumno.map(v => <option value={v.url}>{v.name}</option>)
              }
            </select>

            <Button className='rounded-none row-end-4' onClick={handleLogout}>
              Cerrar sesion
            </Button>
          </div>
        </div>
      </header>
      
      <div>
        <Outlet></Outlet>
      </div>
  </div>
}