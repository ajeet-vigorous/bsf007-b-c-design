
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../config/HTTP";
import Loader from "../../component/loader/Loader";
import { domainName } from "../../config/Auth";
import { message } from "antd";

const IframeCasinonew = () => {
  const [casinoData, setCasinoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorType, setErrorType] = useState(0);
  const [resMessage, setResMessage] = useState("");
  const history = useNavigate();
  const { gameId, provider } = useParams();

  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  useEffect(() => {
         if (user?.data?.isDemoClient) {
    message.error("Demo User not allowed to play Casino. Play only with Real ID.");
    history("/dashboard");
    return;
  }
    getCasinoData();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
        history("/dashboard");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showAlert, history]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const getCasinoData = async () => {
    try {
      setLoading(true);

      const casinoLogin = {
        gameId: gameId + "",
        platformId: "mobile",
        redirectUrl: `${window.location.origin}/dashboard`,
        providerName: provider,
      };

      const response = await apiCall("POST", "user/casinoLoginUrl", casinoLogin);

if (response?.code !== 0 && response?.error !== false) {
  setShowAlert(true);
  setErrorType(1);
  setResMessage(response.message || "OP_GENERAL_ERROR");
  setLoading(false);

  setTimeout(() => {
    window.location.href = `${window.location.origin}/dashboard`
  }, 1000);

}


      if (!response.error) {
        setCasinoData(response.data || {});
        setLoading(false);
        // Loader will hide when iframe finishes loading
      } else {
        setShowAlert(true);
        setErrorType(1);
        setResMessage(response.message || "Something went wrong");
        
        return;
      }
    } catch (error) {
      console.error("Error fetching casino data:", error);
      setShowAlert(true);
      setErrorType(1);
      setResMessage(error?.data.message || "Something went wrong");
      setLoading(false);
      
    }
  };

  
  return (
    <div className="iframeCasinoMain relative">
                     <div className="w-full px-2 uppercase py-1 flex justify-between bg-[--primary]">
<div className="bg-black text-white text-xs px-2 py-1 flex items-center" onClick={() => history("/dashboard")}> Back </div>
<div className="text-sm font-bold text-white">{user?.data?.username}</div>
      </div>
      {showAlert && (
        <div
          className={`absolute top-[2%] right-[2%] px-5 py-3 z-30 ${
            errorType === 1 ? "bg-red-600" : "bg-green-600"
          } rounded`}
        >
          <span className="white-text font-bold">{resMessage}</span>
        </div>
      )}

      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <Loader  active={loading}/>
        </div>
      )}

      {casinoData && (
        <div className="h-[100dvh] mb-20">
          <iframe
            src={casinoData.url}
            title="Casino iframe"
            loading="lazy"
            className="mx-auto w-[100%] h-full"
           
          />
        </div>
      )}
    </div>
  );
};

export default IframeCasinonew;
