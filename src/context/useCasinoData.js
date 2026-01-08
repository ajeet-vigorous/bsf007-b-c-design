/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';
import { apiCall } from '../config/HTTP';

const useCasinoData = (eventId) => {
  const [casinoDetails, setCasinoDetails] = useState({});
  const [casinoData, setCasinoData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [socketURL, setSocketURL] = useState("");
  const [tvUrl, setTvUrl] = useState("");
  const [cacheURL, setCacheURL] = useState("");
  const [betStatus, setBetStatus] = useState("");
  const [cashinoStatus, setCashinoStatus] = useState("");
  const [minStake, setMinStake] = useState("");
  const [maxStake, setMaxStake] = useState("");
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("Teen");
  const [setting, setSetting] = useState({});
  const [oddsDifference, setOddsDifference] = useState(0);
  const [betList, setBetList] = useState([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [posArray, setPosArray] = useState({});
  const [currentRoundId, setCurrentRoundId] = useState(0);
  const socketRef = useRef(null);
  const cacheIntervalRef = useRef(null);

  useEffect(() => {
    const fetchCasinoDetails = async () => {
      setShowLoader(true);
      let requestData = { eventId };
      let getCasinoDetails = await apiCall("POST" ,`casino/getDiamondCasinoByEventId`, requestData);
      if (!getCasinoDetails.error && getCasinoDetails?.data && getCasinoDetails?.data !== null) {
        let casinoDetails = getCasinoDetails?.data;
        if (casinoDetails?.eventId) { betListHandler(casinoDetails?.eventId)}
        setCasinoData(getCasinoDetails);
        setCasinoDetails(casinoDetails);
        setSocketURL(casinoDetails.socketURL || "");
        setTvUrl(casinoDetails.videoUrl1 || "");
        setCacheURL(casinoDetails.cacheURL || "");
        setBetStatus(casinoDetails.betStatus || "");
        setCashinoStatus(casinoDetails.cashinoStatus || "");
        setMinStake(casinoDetails.minStake || "");
        setMaxStake(casinoDetails.maxStake || "");
        setName(casinoDetails.name || "");
        setShortName(casinoDetails.shortName || "Teen");
        setSetting(casinoDetails.setting || {});
        setOddsDifference(casinoDetails.setting?.oddsDifference || 0);
        if (casinoDetails?.socketURL) {
          await callSocket(casinoDetails?.socketURL, casinoDetails?.shortName);
        } else if (casinoDetails?.cacheURL) {
          await callCache(casinoDetails?.cacheURL);
        }
      }
      setShowLoader(false);
    };

    fetchCasinoDetails();
  }, [eventId]);

  const callSocket = async (socketURL, shortName) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io.connect(socketURL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.emit('JoinRoom', shortName);

    socket.on(shortName, data => {
      setCasinoData(data);
      updatePos(data);
      setCurrentRoundId(data?.data?.t1?.[0]?.mid || 0);
    });
  };

  const callCache = async (cacheUrl) => {
    if (cacheIntervalRef.current) {
      clearInterval(cacheIntervalRef.current);
    }

    await getMarketCacheUrl(cacheUrl);
    cacheIntervalRef.current = setInterval(async () => {
      await getMarketCacheUrl(cacheUrl);
    }, 1000);
  };

  const getMarketCacheUrl = async (cacheURL) => {
    try {
      let config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: cacheURL,
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await axios.request(config);
      setCasinoData(response.data.data);
    } catch (error) {
      console.error('Cache data URL error:', error);
    }
  };

  const updatePos = (data) => {
    if (betList && betList.length > 0) {
      const filteredBets = betList.filter((element) => element.roundId === currentRoundId);

      let pushPos = {};
      filteredBets.forEach((bet) => {
        const posArray = bet.posArray;
        Object.entries(posArray).forEach(([key, value]) => {
          pushPos[key] = (pushPos[key] || 0) + Number(value);
        });
      });
      setPosArray(pushPos);
    }
  };

  const betListHandler = async (eventId) => {
    let betReq = {
      eventId: eventId,
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
    };

    let getCasinoDetails = await apiCall("POST" ,'casino/diamondBetsList', betReq);
    let totalProfitLoss = 0;
    let betList = getCasinoDetails?.data?.casinoBetData;

    if (betList && betList.length > 0) {
      betList.map((bet, key) => {
        let profitLoss = 'Not Declare';
        let profitLossCount = 0;
        if (bet.isDeclare) {
          profitLossCount = bet.profitLoss ? bet.profitLoss : 0;
          profitLoss = bet.profitLoss;
        }
        totalProfitLoss += Number(profitLossCount);
        betList[key].profitLoss = profitLoss;
      });
    }
    setBetList(betList);
    setTotalProfitLoss(totalProfitLoss);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.disconnect();
        }
        if (cacheIntervalRef.current) {
          clearInterval(cacheIntervalRef.current);
        }
      } else if (document.visibilityState === 'visible') {
        if (casinoDetails?.socketURL) {
          callSocket(casinoDetails.socketURL, casinoDetails.shortName);
        } else if (casinoDetails?.cacheURL) {
          callCache(casinoDetails.cacheURL);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      if (cacheIntervalRef.current) {
        clearInterval(cacheIntervalRef.current);
      }
    };
  }, [casinoDetails]);

  return {
    casinoDetails,
    casinoData,
    showLoader,
    socketURL,
    tvUrl,
    cacheURL,
    betStatus,
    cashinoStatus,
    minStake,
    maxStake,
    name,
    shortName,
    setting,
    oddsDifference,
    betList,
    totalProfitLoss,
    posArray,
    currentRoundId,
    betListHandler
  };
};

export default useCasinoData;