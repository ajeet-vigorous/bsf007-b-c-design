import { useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const useSocketCacheManager = (matchDetailsByMarketId,setMatchScoreData, eventId, marketId) => {
  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const connectSocket = (socketUrl) => {
    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      reconnection: false,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("marketByEvent", eventId);
    });

    socketRef.current.on(eventId, (data) => {
      localStorage.setItem(`${marketId}_MatchOddsData`, data);
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByEventId: JSON.parse(data),
      }));
    });

    socketRef.current.emit("JoinRoom", marketId);
    socketRef.current.on(marketId, (data) => {
      localStorage.setItem(`${marketId}_BookmakerData`, data);
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByMarketId: JSON.parse(data).result,
      }));
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const callCache = (cacheUrl, eventUrl) => {
    getMarketCacheUrl(cacheUrl);
    getMarketEventUrl(eventUrl);
    pollingIntervalRef.current = setInterval(() => {
      getMarketCacheUrl(cacheUrl);
    }, 1000);
  };

  const getMarketCacheUrl = async (cacheUrl) => {
    try {
      const response = await axios.get(cacheUrl);
      localStorage.setItem(
        `${marketId}_BookmakerData`,
        JSON.stringify(response.data)
      );
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByMarketId: response?.data?.result,
      }));
    } catch (error) {
      console.error("Error fetching market cache URL:", error);
    }
  };

  const getMarketEventUrl = async (eventUrl) => {
    try {
      const response = await axios.get(eventUrl);

      if (response?.data?.data) {
        localStorage.setItem(
          `${eventId}_MatchOddsData`,
          JSON.stringify(response?.data?.data)
        );
        setMatchScoreData((prevData) => ({
          ...prevData,
          dataByEventId: response?.data?.data,
        }));
      }
    } catch (error) {
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByEventId: [],
      }));
      console.error("Error fetching market event URL:", error);
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      disconnectSocket();
      clearInterval(pollingIntervalRef.current);
    } else if (document.visibilityState === "visible") {
      if (matchDetailsByMarketId) {
        if (matchDetailsByMarketId.socketPerm) {
          connectSocket(matchDetailsByMarketId.socketUrl);
        } else {
          callCache(
            matchDetailsByMarketId.cacheUrl,
            matchDetailsByMarketId.otherMarketCacheUrl
          );
        }
      }
    }
  };

  return {
    connectSocket,
    disconnectSocket,
    callCache,
    handleVisibilityChange,
  };
};

export default useSocketCacheManager;
