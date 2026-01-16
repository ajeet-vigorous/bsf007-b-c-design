import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../config/HTTP";
import Loader from "../../component/loader/Loader";
import { domainName } from "../../config/Auth";
import { message } from "antd";

const IframeCasino = () => {
  const [casinoData, setCasinoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorType, setErrorType] = useState(0);
  const [resMessage, setResMessage] = useState("");

  const { gameId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  useEffect(() => {
     if (user?.data?.isDemoClient) {
    message.error("Demo User not allowed to play Casino. Play only with Real ID.");
     navigate("/dashboard");
    return;
  }
    getCasinoData();

    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const getCasinoData = async () => {
    try {
      setLoading(true); 

      const casinoLogin = {
        gameId: gameId,
        platformId: "mobile",
        redirectUrl: `${window.location.origin}/dashboard`,
        theme: "bmx",
      };

      const casinoLoginResponse = await apiCall(
        "POST",
        "user/casinoLoginUrl",
        casinoLogin
      );


      if (casinoLoginResponse && casinoLoginResponse.data) {
        setCasinoData(casinoLoginResponse.data);
      } else {
        setShowAlert(true);
        setErrorType(1);
        setResMessage(casinoLoginResponse.status || "Something went wrong");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setShowAlert(true);
      setErrorType(1);
      setResMessage(error.data.message || "Something went wrong");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="iframeCasinoMain">
            <div className="w-full px-2 uppercase py-1 flex justify-between bg-[--primary]">
<div className="bg-black text-white text-xs px-2 py-1 flex items-center" onClick={() =>   navigate("/dashboard")}> Back </div>
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

    
      {loading && <Loader active={loading} />}

      {casinoData && !loading ? (
        <div className="afterFooter h-[100dvh] mb-20">
          <iframe
            src={casinoData.url}
            title="Casino Game"
            loading="lazy"
            className="mx-auto w-[100%] h-full"
            onLoad={handleIframeLoad}
            allowFullScreen={true}
          />
        </div>
      ) : null}
    </div>
  );
};

export default IframeCasino;
