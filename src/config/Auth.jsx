import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export let domainName = window.location.origin

function AuthRoute({ element }) {
    const navigate = useNavigate();
    useEffect(() => {
      let login = localStorage.getItem('token');
      if (!login) {
        localStorage.clear()
        navigate('/login');
      }
    }, []);
  
    return <>{element}</>
  }
export default AuthRoute;


