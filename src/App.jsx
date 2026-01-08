import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './layout/Layout'
import { ToastContainer } from 'react-toastify'
import { BalanceProvider } from './global/contextApi/BalanceContext'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import settings from './domainConfig'
import { getDomainSettingData, getInternationalGroupCasinoList, getMatchList } from './redux/reducers/user_reducer'
import Login from './component/login/Login'
import Signup from './pages/signup/Signup'
import Promotions from './pages/Promotions/Promotions'
import TrmCondtion from './pages/TrmCondtion/TrmCondtion'
import IframeCasino from './pages/IframeCasino/IframeCasino'
import IframeCasinonew from './pages/IframeCasino/IframeCasinonew'
import IframeQtech from './pages/IframeCasino/IframeQtech'
import AuthRoute from './config/Auth'
import TestCasino from './TestCasino'




function setMultipleRootCssVariables(colors) {
  for (const [variable, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(variable, value);
  }
}

function App() {
  const dispatch = useDispatch();
    const location = useLocation();

  const cosinoGroupList = JSON.parse(localStorage.getItem('cosinoGroupList'))
  const {userDomainData} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDomainSetting = () => {
      let domainSetting = {
        domainUrl: window.location.origin,
      };
  
      dispatch(getDomainSettingData(domainSetting)).then((res) => {
        if (!res?.error) {
          const domainData = res?.payload?.data;
          localStorage.setItem(
            "clientdomainSetting",
            JSON.stringify(domainData)
          );
        }
      });
    };
  
    const domainData = JSON.parse(localStorage.getItem("clientdomainSetting"));
  
    if (!domainData) {      
      fetchDomainSetting();
    } 
    if(domainData){
     setInterval(() => {
      fetchDomainSetting();
     }, 180000); 
    }
  }, []);
  

  useEffect(() => {
    dispatch(getMatchList());
    const interval = setInterval(() => {
      dispatch(getMatchList());
    }, 180000);
    casinoGroupWise()
    return () => clearInterval(interval);
  }, [dispatch]);
  

  const casinoGroupWise = () => {
    const ReqData = {
      "categoriesList": true,
      "providerList": true,
      "lobbygames": true,
      "trendingGames": true,
      "popularGames": true,
      "liveGames": true
    };
    {
      // !cosinoGroupList && (
        dispatch(getInternationalGroupCasinoList(ReqData))
      // )
    }

  }

  useEffect(() => {
    if (settings.title) {
      document.title = settings.title;
    }
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }
    if (settings.colors) {
      setMultipleRootCssVariables(settings.colors)
    }
    // return () => { clearInterval(sportInterval); }
  }, [dispatch])



  useEffect(() => {
    const path = location.pathname;

    const iframeRoutes = [
      "/iframe-casino",
      "/iframe-casino-new",
      "/iframe-qtech-casino",
      "/login"
    ];

    const shouldRemove = iframeRoutes.some(route => path.startsWith(route));
    if (shouldRemove) {
      document.body.classList.remove("pt-[94px]");
    } else {
      document.body.classList.add("h-dvh", "pt-[94px]");
    }
  }, [location.pathname]);


  return (
    <>
      <ToastContainer />
      <BalanceProvider>
          <Routes>
            
             <Route exact path="/login" name="Login" element={<Login />} />
             
               <Route path="*" element={<AuthRoute element={<Layout />} />} />
            {/* <Route path="*" element={<Layout />} /> */}
            <Route path="/iframe-casino/:gameId?" element={<IframeCasino />} />
            <Route path="/iframe-casino-new/:provider?/:gameId?"  element={<IframeCasinonew />} />
            <Route path="/iframe-qtech-casino/:gameId?"  element={<IframeQtech />} />
          </Routes>
      </BalanceProvider>
    </>

  )
}

export default App
