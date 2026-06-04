import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import "react-toastify/dist/ReactToastify.css";
import { FaAngleRight, FaTimes, FaTv } from "react-icons/fa";
import { message } from "antd";
import NormalFancyComponent from "./marketMatch/NormalFancy";
import OverByOverFancyComponent from "./marketMatch/OverByOverFancy";
import Fancy1FancyComponent from "./marketMatch/Fancy1Fancy";
import KhadoFancyComponent from "./marketMatch/KhadoFancy";
import MeterFancyComponent from "./marketMatch/MeterFancy";
import OddEvenFancyComponent from "./marketMatch/OddEvenFancy";
import GroupedFancyComponent from "./marketMatch/FancyGroupMarket";
import TossDataComponent from "./marketMatch/TossMarket";
import BookmakerComponent from "./marketMatch/BookmakerMarket";
import MatchOddsComponent from "./marketMatch/MatchOdssMarket";
import OtherMarketsComponent from "./marketMatch/OtherLineMarket";
import TiedOddsComponent from "./marketMatch/TiedOdssMarket ";
import CashOutSystemTesting from "./CashoutTesting copy";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import PlaceBetMobile from "../../component/betplaceMobile/PlaceBetMobile";
import { MdScore } from "react-icons/md";
import { fancyTabs, premiumTabs } from "./matchconstants";
import { IoHome } from "react-icons/io5";
import { IoMdTv } from "react-icons/io";
import settings from "../../domainConfig";
import { GiTv } from "react-icons/gi";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import CompletedBetsModal from "./CompletedBetsModal";

const ViewMatches = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inplayMatch, setInplayMatch] = useState({});
  const [scoreShow, setScoreShow] = useState(true);
  const [tvShow, setTvShow] = useState(false);
  const [scoreModal, setScoreModal] = useState(true);
  const [betShow, setBetShow] = useState(true);
  const [betShowM, setBetShowM] = useState(true);
  const [betShowMobile, setBetShowMobile] = useState(false);
  const [matchScoreDetails, setMatchScoreDetails] = useState({});
  const [matchDetailsForSocketNew, setMatchDetailsForSocketNew] = useState({});
  const [finalSocket, setFinalSocketDetails] = useState({});
  const [otherFinalSocket, setOtherFinalSocketDetails] = useState({});
  const [hiddenRows, setHiddenRows] = useState([]);
  const [active, setActive] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [buttonValue, setbuttonValue] = useState(false);
  const [selectedType, setSelectedType] = useState(false);
  const [completedModal, setCompltedModal] = useState(false);
  const [totalSessionPlusMinus, setTotalSessionPlusMinus] = useState();
  const [betSlipData, setBetSlipData] = useState({
    stake: "0",
    count: 0,
    teamname: "",
    teamData: null,
  });

  const [fancyBetData, setFancyBetData] = useState([]);
  const [oddsBetData, setOddsBetData] = useState([]);

  const [returnDataObject, setReturnDataObject] = useState({});
  const [returnDataFancyObject, setReturnDataFancyObject] = useState({});
  const [fancypositionModal, setFancypositionModal] = useState(false);
  const [positionData, setPositionData] = useState({});
  const [betLoading, setBetLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketState, setSocketState] = useState(null);
  const socketRef = useRef(null);
  const betfairSocketRef = useRef(null);
  const inplayDataRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const heartbeatRef = useRef(null);

  const [positionObj, setPositionObj] = useState({});
  const [positioBetData, setPositionBetData] = useState({});

  const [fancyPositionObj, setFancyPositionObj] = useState({});
  const [fancybetData, setFancybetData] = useState({});

  const [minMaxCoins, setminMaxCoins] = useState({ max: null, min: null });
  const [sessionCoin, setSessionCoin] = useState({ max: null, min: null });
  const [isTieCoin, setIsTieCoin] = useState({ max: null, min: null });
  const [isTossCoin, setIsTossCoin] = useState({ max: null, min: null });
  const [isMatchCoin, setIsMatchCoin] = useState({ max: null, min: null });
  const [activeTab, setActiveTab] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeBets, setActiveBets] = useState("oddsBetData");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const openRulesModal = () => setIsRulesOpen(true);
  const closeRulesModal = () => setIsRulesOpen(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(true);
  const [fullscreen, setFullScreen] = useState(false);

  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Agar page scroll ho gaya (thoda bhi) → true
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleBets = () => {
    setOpen(true);
    setIsScorecardOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };
  // let { marketId, eventId } = useParams();
  const { marketId, eventId, sportId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const gameDetailOtherPart = pathname.includes("viewMatchDetail");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  document.title = `${inplayMatch?.matchName} | ${settings.title}`;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      const threshold = 100;
      setIsFixed(scrollPosition > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let data = localStorage.getItem(`${marketId}_BookmakerData`);
  const setDataFromLocalstorage = async (marketId) => {
    if (data) {
      setMatchScoreDetails(JSON.parse(data).result);
    } else {
      setMatchScoreDetails("");
    }
  };
  const handleCloseCompletedModal = () => {
    setCompltedModal(false);
  };
  const setMatchDataFromLocalstorage = async () => {
    let data = localStorage.getItem(`${eventId}_MatchOddsData`);

    if (!data) {
      return null;
    } else {
      setFinalSocketDetails(JSON.parse(data));
    }
  };

  useEffect(() => {
    if (inplayMatch?.socketPerm != false) return;
    const UrlBaseMarket =
      inplayMatch?.otherMarketCacheUrl ||
      `https://cache.10xbpexch.com/v2/api/dataByEventId?eventId=${eventId}`;
    const intervalId = setInterval(() => {
      axios
        .get(UrlBaseMarket)
        .then((response) => {
          if (response?.data) {
            localStorage.setItem(
              `${eventId}_MatchOddsData`,
              JSON.stringify(response.data?.data),
            );
            filterData(response?.data?.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [eventId, inplayMatch?.socketPerm]);

  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (inplayMatch?.status === "COMPLETED" && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      window.location.href = "/dashboard";
    }
  }, [inplayMatch?.status]);

  useEffect(() => {
    setDataFromLocalstorage();
    setMatchDataFromLocalstorage();

    const reconnect = () => {
      cleanupWebSocket();
      if (inplayDataRef.current?.socketPerm) {
        callSocket(inplayDataRef.current, inplayDataRef.current?.sportId);
      } else if (inplayDataRef.current?.cacheUrl) {
        callCache(inplayDataRef.current?.cacheUrl);
      } else {
        setupAsyncActions(marketId);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        reconnect();
      } else if (document.visibilityState === "hidden") {
        cleanupWebSocket();
      }
    };

    // Phone unlock hone par focus fire hota hai
    const handleFocus = () => {
      if (
        !socketRef.current?.connected &&
        !betfairSocketRef.current?.connected
      ) {
        reconnect();
      }
    };

    // Phone sleep se wake hone par network wapas aata hai
    const handleOnline = () => {
      if (
        !socketRef.current?.connected &&
        !betfairSocketRef.current?.connected
      ) {
        reconnect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    setupAsyncActions(marketId);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      cleanupWebSocket();
      localStorage.removeItem(`${eventId}_MatchOddsData`);
      localStorage.removeItem(`${marketId}_BookmakerData`);
    };
  }, [eventId, marketId]);

  const [oddsbetdata, setOddsbetData] = useState();
  const [incomletedFancy, setIncompletedFancy] = useState();
  const [compltedFancy, setCompletedFancy] = useState();

  useEffect(() => {
    if (positioBetData) {
      const sortedOddsBetData = positioBetData?.oddsBetData
        ? positioBetData?.oddsBetData
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      const filteredFancyBetData = positioBetData?.fancyBetData
        ? positioBetData?.fancyBetData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
        : [];

      const completeFancy =
        filteredFancyBetData && filteredFancyBetData.length > 0
          ? filteredFancyBetData.filter((element) => element.isDeclare === 1)
          : [];
      let showCompletedFancy = [];

      completeFancy.map((data, key) => {
        let pos = 0;
        if (data.decisionRun >= data.run && data.type === "Y") {
          pos = Math.round(data.amount * data.odds);
        } else if (data.decisionRun >= data.run && data.type === "N") {
          pos = Math.round(-1 * data.amount * data.odds);
        } else if (data.decisionRun < data.run && data.type === "Y") {
          pos = Math.round(-1 * data.amount);
        } else if (data.decisionRun < data.run && data.type === "N") {
          pos = Math.round(data.amount);
        }
        data.pos = pos;
        completeFancy[key].pos = pos;

        showCompletedFancy.push(data);
      });

      const finalPositionInfo = {};
      sortedOddsBetData &&
        sortedOddsBetData.forEach((item) => {
          const positionInfo = item.positionInfo;

          for (const key in positionInfo) {
            if (positionInfo.hasOwnProperty(key)) {
              if (!finalPositionInfo[key]) {
                finalPositionInfo[key] = 0;
              }
              finalPositionInfo[key] += positionInfo[key];
            }
          }
        });

      let finalPositionInfoFancy = {};

      filteredFancyBetData.forEach((item) => {
        const selectionId = item.selectionId;
        const loss = item.loss;

        if (finalPositionInfoFancy[selectionId]) {
          finalPositionInfoFancy[selectionId] += loss;
        } else {
          finalPositionInfoFancy[selectionId] = loss;
        }
      });

      setFancyPositionObj(finalPositionInfoFancy);
      setFancybetData(filteredFancyBetData);

      setPositionObj(finalPositionInfo);
      setOddsbetData(sortedOddsBetData);
      setCompletedFancy(showCompletedFancy);
      setIncompletedFancy(
        filteredFancyBetData && filteredFancyBetData.length > 0
          ? filteredFancyBetData.filter((element) => element.isDeclare === 0)
          : [],
      );
    }
  }, [positioBetData]);

  useEffect(() => {
    if (fancypositionModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [fancypositionModal]);

  useEffect(() => {
    let sessionPlusMinus = 0;
    compltedFancy?.map((data, key) => {
      let pos = 0;
      if (data.decisionRun >= data.run && data.type === "Y") {
        pos = Math.round(data.amount * data.odds);
      } else if (data.decisionRun >= data.run && data.type === "N") {
        pos = Math.round(-1 * data.amount * data.odds);
      } else if (data.decisionRun < data.run && data.type === "Y") {
        pos = Math.round(-1 * data.amount);
      } else if (data.decisionRun < data.run && data.type === "N") {
        pos = Math.round(data.amount);
      }
      sessionPlusMinus += pos;
      data.pos = pos;
      compltedFancy[key].pos = pos;
    });
    setTotalSessionPlusMinus(sessionPlusMinus);
  }, [compltedFancy]);

  const setupAsyncActions = async (marketId) => {
    await getMatchDataByMarketID(marketId);
    fetchBetLists();
  };

  const startHeartbeat = (socket) => {
    clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (socket?.connected) {
        socket.emit("pingCheck");
        const timeout = setTimeout(() => {
          if (socket?.connected) {
            socket.disconnect();
            socket.connect();
          }
        }, 10000);
        socket.once("pongCheck", () => {
          clearTimeout(timeout);
        });
      }
    }, 20000);
  };

  const cleanupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (betfairSocketRef.current) {
      betfairSocketRef.current.removeAllListeners();
      betfairSocketRef.current.disconnect();
      betfairSocketRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setSocketState(null);
    setIsConnected(false);
  };

  const handleWatchButtonClick = (type) => {
    setSelectedType(type);
  };

  const getMatchDataByMarketID = async (marketId) => {
    try {
      const resData = {
        marketId: marketId,
      };
      const inplayMatchResponse = await apiCall(
        "POST",
        "sports/sportByMarketId",
        resData,
      );
      if (inplayMatchResponse && inplayMatchResponse.data) {
        setInplayMatch(inplayMatchResponse.data);
        inplayDataRef.current = inplayMatchResponse.data;
        const data = inplayMatchResponse?.data;

        if (inplayMatchResponse?.data?.socketPerm) {
          callSocket(
            inplayMatchResponse?.data,
            inplayMatchResponse.data?.sportId,
          );
        } else {
          callCache(inplayMatchResponse?.data?.cacheUrl);
        }

        // callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse?.data?.socketPerm, inplayMatchResponse?.data?.cacheUrl);
      }
    } catch (error) {
      console.error("Error fetching inplay data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!inplayMatch?.maxMinCoins) return;
    let maxCoinData = {};
    try {
      if (typeof inplayMatch.maxMinCoins === "string") {
        const fixedString = inplayMatch.maxMinCoins.replace(/(\w+):/g, '"$1":');
        maxCoinData = JSON.parse(fixedString);
      } else {
        maxCoinData = inplayMatch.maxMinCoins;
      }
    } catch (err) {
      console.error("Parse error:", inplayMatch.maxMinCoins);
      return;
    }

    setminMaxCoins({
      max: maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
    setSessionCoin({
      max: maxCoinData?.maximum_session_bet,
      min: maxCoinData?.minimum_session_bet,
    });

    setIsTieCoin({
      max:
        maxCoinData?.maximum_tie_coins > 0
          ? maxCoinData?.maximum_tie_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });

    setIsTossCoin({
      max:
        maxCoinData?.maximum_toss_coins > 0
          ? maxCoinData?.maximum_toss_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });

    setIsMatchCoin({
      max:
        maxCoinData?.maximum_matchOdds_coins > 0
          ? maxCoinData?.maximum_matchOdds_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
  }, [inplayMatch]);

  //     const callSocket = async (socketUrl, matchId) => {

  //         if (socketState && socketState.connected) {
  //             return;
  //         }
  //         try {
  // let socketBetFair = ""
  //             if(socketUrl?.betfairSocketUrl){
  //              socketBetFair = io.connect(socketUrl?.betfairSocketUrl, {
  //                 transports: ["websocket"],
  //                 reconnection: true,
  //                 reconnectionDelay: 1000,
  //                 reconnectionDelayMax: 5000,
  //                 reconnectionAttempts: 99,
  //             }); }
  //             const socket = io.connect(socketUrl?.socketUrl, {
  //                 transports: ["websocket"],
  //                 reconnection: true,
  //                 reconnectionDelay: 1000,
  //                 reconnectionDelayMax: 5000,
  //                 reconnectionAttempts: 99,
  //             });

  //             console.log(socket, "socketBetFairsocketBetFairsocketBetFair");

  //             if(socketUrl?.betfairSocketUrl){
  //             socketBetFair.emit(`marketByEvent`, eventId);
  //             }else{
  //             socket.emit(`marketByEvent`, eventId);
  //             }

  //             socket.on(eventId, (data) => {
  //                 localStorage.setItem(`${eventId}_MatchOddsData`, data)
  //                 setMatchDetailsForSocketNew(JSON.parse(data));
  //                 setIsConnected(true);
  //                 filterData(JSON.parse(data));
  //             });

  //             if (matchId === 4 || matchId === 999) {
  //                 socket.emit("JoinRoom", marketId);
  //                 socket.on(marketId, (data) => {
  //                     localStorage.setItem(`${marketId}_BookmakerData`, data);
  //                     setMatchScoreDetails(JSON.parse(data).result);
  //                 });
  //             }

  //             socket.on('disconnect', () => {
  //                 setIsConnected(false);
  //             });

  //             setSocketState(socket);

  //         }

  //         catch (error) {
  //             console.error("Error in socket connection:", error);
  //         }
  //     };

  const callSocket = async (socketUrl, matchId) => {
    try {
      // Agar already connected hai toh skip karo (dono sockets check karo)
      if (socketRef.current?.connected || betfairSocketRef.current?.connected)
        return;

      // Pehle purane sockets clean karo
      cleanupWebSocket();

      if (socketUrl?.betfairSocketUrl) {
        // --- BETFAIR SOCKET: sirf marketByEvent emit karega ---
        const socketBetFair = io.connect(socketUrl.betfairSocketUrl, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        });

        socketBetFair.on("connect", () => {
          socketBetFair.emit("marketByEvent", eventId);
        });

        socketBetFair.on(eventId, (data) => {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          localStorage.setItem(
            `${eventId}_MatchOddsData`,
            typeof data === "string" ? data : JSON.stringify(data),
          );
          setMatchDetailsForSocketNew(parsed);
          setIsConnected(true);
          filterData(parsed);
        });

        betfairSocketRef.current = socketBetFair;
        startHeartbeat(socketBetFair);

        // --- NORMAL SOCKET: sirf JoinRoom ke liye (bookmaker data) ---
        if (matchId == 4 || matchId == 999) {
          const socket = io.connect(socketUrl.socketUrl, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
          });

          socket.on("connect", () => {
            socket.emit("JoinRoom", marketId);
          });

          socket.on(marketId, (data) => {
            const parsed = typeof data === "string" ? JSON.parse(data) : data;
            localStorage.setItem(
              `${marketId}_BookmakerData`,
              typeof data === "string" ? data : JSON.stringify(data),
            );
            setMatchScoreDetails(parsed.result);
          });

          socket.on("disconnect", () => {
            setIsConnected(false);
          });

          socketRef.current = socket;
          setSocketState(socket);
        }
      } else {
        // --- NO BETFAIR: normal socket se sab handle hoga ---
        const socket = io.connect(socketUrl.socketUrl, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        });

        socket.on("connect", () => {
          socket.emit("marketByEvent", eventId);
          if (matchId == 4 || matchId == 999) {
            socket.emit("JoinRoom", marketId);
          }
        });

        socket.on(eventId, (data) => {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          localStorage.setItem(
            `${eventId}_MatchOddsData`,
            typeof data === "string" ? data : JSON.stringify(data),
          );
          setMatchDetailsForSocketNew(parsed);
          setIsConnected(true);
          filterData(parsed);
        });

        if (matchId == 4 || matchId == 999) {
          socket.on(marketId, (data) => {
            const parsed = typeof data === "string" ? JSON.parse(data) : data;
            localStorage.setItem(
              `${marketId}_BookmakerData`,
              typeof data === "string" ? data : JSON.stringify(data),
            );
            setMatchScoreDetails(parsed.result);
          });
        }

        socket.on("disconnect", () => {
          setIsConnected(false);
        });

        socketRef.current = socket;
        setSocketState(socket);
        startHeartbeat(socket);
      }
    } catch (error) {
      console.error("Error in socket connection:", error);
    }
  };

  const callCache = (cacheUrl) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    const eventUrl =
      inplayDataRef.current?.otherMarketCacheUrl ||
      `https://cache.10xbpexch.com/v2/api/dataByEventId?eventId=${eventId}`;
    pollingIntervalRef.current = setInterval(async () => {
      // Verify ki cacheUrl abhi bhi current match ka hai
      if (inplayDataRef.current?.cacheUrl !== cacheUrl) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        return;
      }
      await getMarketCacheUrl(cacheUrl);
      await getMarketEventUrl(eventUrl);
    }, 1000);
  };

  const getMarketCacheUrl = async (cacheUrl) => {
    try {
      // if (!cacheUrl) {
      //   console.error("Cache URL is undefined or null");
      //   return; // Exit early if cacheUrl is undefin
      // }

      const response = await axios.get(cacheUrl);
      localStorage.setItem(
        `${marketId}_BookmakerData`,
        JSON.stringify(response.data),
      );
      setMatchScoreDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching cache data:", error);
    }
  };

  const getMarketEventUrl = async (eventUrl) => {
    try {
      const res = await axios.get(eventUrl);
      if (res?.data?.data) {
        localStorage.setItem(
          `${eventId}_MatchOddsData`,
          JSON.stringify(res.data.data),
        );
        filterData(res.data.data);
      }
    } catch (err) {
      console.error("Cache event error:", err);
    }
  };

  const filterData = (matchDetailsForSocketNew) => {
    try {
      if (!matchDetailsForSocketNew || matchDetailsForSocketNew.length === 0) {
        return;
      }
      const criteria = ["Tied Match", "Match Odds", "To Win the Toss"];

      const filteredData = Array.isArray(matchDetailsForSocketNew)
        ? matchDetailsForSocketNew.filter((item) =>
            criteria.includes(item.marketType),
          )
        : [];

      if (filteredData.length > 0) {
        const filteredDataObject = [];
        filteredData.forEach((item) => {
          filteredDataObject[item.marketType] = item;
        });
        setFinalSocketDetails(filteredDataObject);
      } else {
        console.error("No data matched the first criteria.");
      }

      const otherData = Array.isArray(matchDetailsForSocketNew)
        ? matchDetailsForSocketNew.filter(
            (item) => !criteria.includes(item.marketType),
          )
        : [];

      if (otherData.length > 0) {
        const OtherFilteredDataObject = [];
        otherData.forEach((item) => {
          OtherFilteredDataObject[item.marketType] = item;
        });
        setOtherFinalSocketDetails(OtherFilteredDataObject);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const handleScore = () => {
    setIsScorecardOpen((prev) => !prev);
  };

  const handleOnClick = () => {
    navigate("/");
  };

  // const handelScoreModal = () => {
  //   setScoreShow(!scoreShow);
  // };

  const handelScoreModal = () => {
    setScoreShow(true);
    setTvShow(false);
    setBetShowMobile(false);
  };
  const handelTvModal = () => {
    setTvShow(!tvShow);
    setScoreShow(false);
    setBetShowMobile(false);
  };

  const handelScoreModalComplete = () => {
    setScoreModal(!scoreModal);
  };

  const handelAllClossModal = () => {
    setTvShow(false);
    setScoreShow(!scoreShow);
  };

  const openBets = () => {
    setBetShow(true);
    // setBetShowM(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // const openBetsM = () => {

  //   setErrorMessage("");
  //   setSuccessMessage("");
  // };

  const openBetsClose = () => {
    setBetShow(false);
  };

  const toggleAccordion = (index) => {
    setActive((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // bets Palce Modal write

  const handleBackOpen = (data) => {
    if (data?.odds === 0) return;
    // setBetPlaceModalMobile(true)
    if (data) {
      setBetShow(false);
      setBetShowM(true);
      setBetSlipData({
        ...data,
        stake: data.stake != null ? data.stake : "0",
        count: data.odds,
        teamname: data.name,
        teamData: data.teamData,
      });
    }
  };
  const handleBackclose = () => {
    setBetShowM(true);
    setBetSlipData({
      stake: "0",
      count: 0,
      teamname: "",
      teamData: null,
      name: "",
    });
  };

  const toggleRowVisibility = (id) => {
    if (hiddenRows.includes(id)) {
      setHiddenRows(hiddenRows.filter((rowId) => rowId !== id));
    } else {
      setHiddenRows([...hiddenRows, id]);
    }
  };

  const placeBet = async () => {
    if (betSlipData.stake <= 0) {
      return;
    }

    try {
      const betObject = {
        odds: betSlipData.count + "",
        amount: betSlipData.stake,
        selectionId: betSlipData.selectionId + "",
        marketId: marketId + "",
        eventId: eventId,
        betFor: betSlipData.betFor + "",
        run: betSlipData.run ? betSlipData.run + "" : "0",
        oddsType:
          betSlipData.oddsType === "Match Odds"
            ? "matchOdds"
            : betSlipData.oddsType === "Tied Match"
              ? "tiedMatch"
              : betSlipData.oddsType + "",
        type: betSlipData.betType + "",
      };
      if (betSlipData.oddsType === "fancy") {
        const allowedFancyTypes = [
          "khado",
          "fancy1",
          "oddeven",
          "meter",
          "Over By Over",
        ];
        betObject["fancyType"] = allowedFancyTypes.includes(
          betSlipData.fancyType,
        )
          ? betSlipData.fancyType + ""
          : "Normal";
      } else if (betSlipData.oddsType === "bookmaker") {
        console.log("::--");
      } else {
        betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
      }

      // if (betSlipData.oddsType === "bookmaker" || betSlipData.oddsType === "fancy") {
      //     // Do something if needed
      //     console.log(betSlipData?.data?.fancyType, "betSlipData");
      // } else {
      //     betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
      // }
      setBetLoading(true);

      if (betSlipData.oddsType === "fancy") {
        let saveBetOdds = await apiCall(
          "POST",
          "sports/sessionBetPlaced",
          betObject,
        );
        setBetLoading(true);
        setBetShow(false);
        // setBetShowM(true)

        if (!saveBetOdds.error) {
          setSuccessMessage(saveBetOdds?.message);
          message.success(saveBetOdds?.message, 2);

          await fetchBetLists();
          await matchOddsPos();
          setBetLoading(false);
          handleBackclose();
        } else {
          setBetLoading(false);
          handleBackclose();
          message.error(
            "Sorry, your bet couldn't be placed. " + saveBetOdds?.message,
            2,
          );
        }
      } else {
        let saveBetOdds = await apiCall(
          "POST",
          "sports/oddBetPlaced",
          betObject,
        );

        setBetLoading(true);
        setBetShow(false);

        setSuccessMessage(saveBetOdds?.message);

        if (!saveBetOdds.error) {
          setBetLoading(false);
          message.success(saveBetOdds?.message, 2);

          await fetchBetLists();
          await matchOddsPos();
          //  setBetShowM(true);
          handleBackclose();
        } else {
          setBetLoading(false);
          message.error("Sorry, your bet couldn't be placed.", 2);
        }
      }
    } catch (error) {
      setBetLoading(false);
      handleBackclose();
      console.error("Error placing bet:", error.data.message);
      setErrorMessage(error.data.message);
      message.error("Error placing bet: " + error.data.message, 2);
    } finally {
      setBetLoading(false);
      handleBackclose();
      closeRow();
      openBets();
    }
  };

  const fetchBetLists = async () => {
    try {
      const BetListData = {
        fancyBet: true,
        isDeclare: false,
        oddsBet: true,
        marketId: marketId,
      };

      const userBetHistory = await apiCall(
        "POST",
        "sports/betsList",
        BetListData,
      );
      if (userBetHistory && userBetHistory.data) {
        const { fancyBetData, oddsBetData } = userBetHistory.data;
        const filteredFancyBetData = fancyBetData
          ? fancyBetData
              .filter((element) => element.isDeclare === 0)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        const sortedOddsBetData = oddsBetData
          ? oddsBetData
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setFancyBetData(filteredFancyBetData);
        setOddsBetData(sortedOddsBetData);
        setPositionBetData(userBetHistory.data);
        // return { fancyBetData: filteredFancyBetData, oddsBetData: sortedOddsBetData };
      }
    } catch (error) {
      console.error("Error fetching bet lists:", error);
      throw error;
    }
  };

  const matchOddsPos = async () => {
    let matchOddsPos = await apiCall("POST", "reports/matchOddsRunningPos");
    if (matchOddsPos) {
      localStorage.setItem(
        "matchOddsRunningPos",
        JSON.stringify(matchOddsPos.data),
      );
    }
  };

  const handleFancyPositionModal = (data) => {
    try {
      setFancypositionModal(!fancypositionModal);
      setPositionData(data);
    } catch (error) {
      console.error("Error handling fancy position modal:", error);
    }
  };

  const handleClose = () => {
    setFancypositionModal(false);
  };

  const closeRow = (id) => {
    setHiddenRows(hiddenRows.filter((rowId) => rowId !== id));
  };

  const increaseCount = () => {
    try {
      setBetSlipData((prevData) => {
        const newCount = parseFloat(prevData.count) + 0.01;
        return {
          ...prevData,
          count: newCount.toFixed(2),
        };
      });
    } catch (error) {
      console.error("Error increasing count:", error);
    }
  };
  const openBetInMobile = () => {
    setBetShowMobile(!betShowMobile);
    setTvShow(false);
    setScoreShow(false);
  };
  const decreaseCount = () => {
    try {
      setBetSlipData((prevData) => {
        const newCount = parseFloat(prevData.count) - 0.01;
        return {
          ...prevData,
          count: newCount.toFixed(2),
        };
      });
    } catch (error) {
      console.error("Error decreasing count:", error);
    }
  };

  let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

  function getMatchStatus(matchDate) {
    if (!matchDate) return "";
    const currentTime = moment();
    const matchTime = moment(matchDate, "DD-MM-YYYY HH:mm:ss");

    if (!matchTime.isValid()) {
      console.error("Invalid match date format.");
      return "Invalid Date";
    }

    if (currentTime.isBefore(matchTime)) {
      return "OPEN";
    } else {
      return "INPLAY";
    }
  }

  const handleButtonValues = (e) => {
    setbuttonValue((prev) => !prev);

    document.body.classList.toggle("StakeModalOpen");
  };

  const [matchTab, setMatchTab] = useState(1);

  const handleMatchClick = (tabNumber) => {
    setMatchTab(tabNumber);
  };

  const formatNumber = (number) => {
    if (!number) return;
    const digit = Number(number);

    if (digit >= 1000000) {
      return (digit / 1000000).toFixed(digit % 1000000 === 0 ? 0 : 1) + "M";
    } else if (digit >= 100000) {
      return (digit / 100000).toFixed(digit % 100000 === 0 ? 0 : 1) + "L";
    } else if (digit >= 1000) {
      return (digit / 1000).toFixed(digit % 1000 === 0 ? 0 : 1) + "K";
    } else {
      return digit.toString();
    }
  };

  const NormalFancy = matchScoreDetails?.session?.filter(
    (item) => item?.fancyType === "Normal",
  );
  const KhadoFancy = matchScoreDetails?.meterKhadoSession?.filter(
    (item) => item?.fancyType === "khado",
  );
  const Fancy1Fancy = matchScoreDetails?.session?.filter(
    (item) => item?.fancyType === "fancy1",
  );
  const OddEvenFancy = matchScoreDetails?.meterKhadoSession?.filter(
    (item) => item?.fancyType === "oddeven",
  );
  const bookmaker2Fancy = matchScoreDetails?.meterKhadoSession?.filter(
    (item) => item?.fancyType === "Bookmaker 2",
  );
  const MeterFancy = matchScoreDetails?.meterKhadoSession?.filter(
    (item) => item?.fancyType === "meter",
  );
  const OverByOverFancy = matchScoreDetails?.session?.filter(
    (item) => item?.fancyType === "Over By Over",
  );
  const cCFilterData = matchScoreDetails?.meterKhadoSession?.filter(
    (item) => item.gtype === "cricketcasino",
  );

  const groupedData = cCFilterData?.reduce((acc, item) => {
    const key = item.fancyType;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const [mainTab, setMainTab] = useState("fancy");
  const [subTab, setSubTab] = useState(fancyTabs[0].key);

  // Function to render Fancy components dynamically
  const renderFancyComponent = () => {
    switch (subTab) {
      case "all":
        return (
          <NormalFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            NormalFancy={NormalFancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            isMatchCoin={isMatchCoin}
            betplaceSection={betplaceDataThroughProps}
          />
        );
      case "sessions":
        return (
          <OverByOverFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            OverByOverFancy={OverByOverFancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            handleFancyPositionModal={handleFancyPositionModal}
            betplaceSection={betplaceDataThroughProps}
            isMatchCoin={isMatchCoin}
          />
        );
      case "wpm":
        return (
          <Fancy1FancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            Fancy1Fancy={Fancy1Fancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            handleFancyPositionModal={handleFancyPositionModal}
            isMatchCoin={isMatchCoin}
          />
        );
      case "khadda":
        return (
          <KhadoFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            KhadoFancy={KhadoFancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            handleFancyPositionModal={handleFancyPositionModal}
            betplaceSection={betplaceDataThroughProps}
            isMatchCoin={isMatchCoin}
          />
        );
      case "meter":
        return (
          <MeterFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            MeterFancy={MeterFancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            handleFancyPositionModal={handleFancyPositionModal}
            betplaceSection={betplaceDataThroughProps}
            isMatchCoin={isMatchCoin}
          />
        );
      case "oddeven":
        return (
          <OddEvenFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            OddEvenFancy={OddEvenFancy}
            fancyPositionObj={fancyPositionObj}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            formatNumber={formatNumber}
            handleFancyPositionModal={handleFancyPositionModal}
            betplaceSection={betplaceDataThroughProps}
            isMatchCoin={isMatchCoin}
          />
        );
      case "xtra":
        return (
          <GroupedFancyComponent
            inplayMatch={inplayMatch}
            activeTab={activeTab}
            groupedData={groupedData}
            toggleRowVisibility={toggleRowVisibility}
            handleBackOpen={handleBackOpen}
            marketId={marketId}
            returnDataFancyObject={returnDataFancyObject}
            betplaceSection={betplaceDataThroughProps}
            isMatchCoin={isMatchCoin}
          />
        );
      default:
        return null;
    }
  };

  const betplaceDataThroughProps = {
    betSlipData,
    openBets,
    closeRow,
    placeBet,
    errorMessage,
    successMessage,
    betLoading,
    increaseCount,
    decreaseCount,
    handleBackclose,
    setBetSlipData,
    handleButtonValues,
  };

  return isLoading ? (
    <span className="animate-spin h-5 w-5"></span>
  ) : (
    <div>
      {completedModal && (
        <CompletedBetsModal
          handleClose={handleCloseCompletedModal}
          totalSessionPlusMinus={totalSessionPlusMinus}
          marketId={marketId}
        />
      )}

      {inplayMatch && inplayMatch?.notification && (
        <span className="w-full flex-1 text-xs websiteThemeSoundColor  text-black flex items-center">
          <marquee className="">{inplayMatch?.notification}</marquee>
        </span>
      )}
      {!betShowM && (
        <PlaceBetMobile
          openBets={openBets}
          closeRow={closeRow}
          matchName={inplayMatch?.matchName}
          betSlipData={betSlipData}
          placeBet={placeBet}
          errorMessage={errorMessage}
          successMessage={successMessage}
          count={betSlipData.count}
          betShowM={betShowM}
          betLoading={betLoading}
          increaseCount={increaseCount}
          decreaseCount={decreaseCount}
          handleClose={handleBackclose}
          setBetSlipData={setBetSlipData}
          handleButtonValues={handleButtonValues}
          isMatchCoin={isMatchCoin}
        />
      )}

      <div className="flex flex-col xl:flex-row text-black h-full w-100 gap-x-2">
        <div className="w-full overflow-y-auto xl:pb-[60px]">
          <div className="">
            <div className="xl:block hidden">
              {/* {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--secondary)] tem-center px-2 py-1.5 flex justify-between">
                                    <span className="text-black text-[14px] font-semibold flex justify-start items-center"><IoHome /> {" "} <FaAngleRight /> {" "}{inplayMatch?.sportType} {" "} <FaAngleRight /> {" "} {inplayMatch?.matchName}</span>
                                    <div onClick={() => handelScoreModalComplete()} className="cursor-pointer px-1"><IoMdTv size={25} /></div>

                                </div>
                            ) : null} */}

              <div className="bg-[var(--primary)] flex justify-between px-2">
                <div className="text-sm font-semibold uppercase text-white flex items-center py-2">
                  {inplayMatch?.matchName}
                </div>
              </div>
            </div>

            {/* <div className="xl:hidden block">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--secondary)] item-center px-2 py-1.5 flex justify-between">
                                    <div className="text-black text-[14px] px-1   font-semibold flex justify-start items-center uppercase  w-1/2" >
                                    <span className="bg-[var(--primary)] text-white rounded py-1 px-1.5" onClick={closeModal}>{inplayMatch?.sportType ? inplayMatch?.sportType : "Matches" }</span>
                                     <div className="flex justify-start px-1  flex-1 items-center">
                                        <div className="text-start px-1.5 py-1 text-nowrap rounded bg-[var(--primary)] text-white text-[14px] font-semibold flex justify-start items-center" onClick={() => handleBets() || handelScoreModalComplete()}>
                                          MY BETS
                                        </div>
                                        
                                    </div>
                                    
                                    </div> 
                                   <div onClick={() => handelScoreModalComplete()} className="cursor-pointer px-1"><IoMdTv size={25} /></div>
                                </div>
                            ) : null}
                            <div className="bg-[var(--primary)] flex justify-between px-2 py-1">
                                <div className="text-xs font-bold text-white flex items-center py-1 blinking-text">{inplayMatch?.matchName}</div>
                            </div>

                        </div> */}
            {scoreModal && (
              <div className=" pt-1">
                {inplayMatch.isScore && (
                  <div className="border-2 border-secondary rounded-lg relative">
                    {inplayMatch?.sportId == 4 && (
                      <div
                        className={`bg-white w-full ${
                          fullscreen ? "h-[270px]" : "h-[110px]"
                        }`}
                      >
                        <div className="details">
                          <div className="w-full relative md:text-sm text-[10px]">
                            <span
                              onClick={() => setFullScreen((state) => !state)}
                              className="absolute top-20 left-1/2 -translate-x-1/2 
             z-5 cursor-pointer 
             text-white  rounded-sm px-1 py-2"
                            >
                              {fullscreen ? (
                                <IoMdArrowDropup size={30} color="orange" />
                              ) : (
                                <IoMdArrowDropdown size={30} color="orange" />
                              )}
                            </span>
                            <iframe
                              src={inplayMatch?.scoreIframe || ""}
                              title="score"
                              loading="lazy"
                              className={`w-full ${
                                fullscreen ? "h-[270px]" : "h-[110px]"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* === "tv" */}
                <div>
                  {inplayMatch.isTv ? (
                    <>
                      {selectedType && (
                        <div className="bg-white w-full h-48">
                          <div className="details">
                            <div
                              className={`w-full relative md:text-sm text-[10px]`}
                            >
                              <iframe
                                src={
                                  inplayMatch && inplayMatch.tvUrl
                                    ? inplayMatch.tvUrl
                                    : ""
                                }
                                title=" "
                                loading="lazy"
                                className="w-[100%] h-[200px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            )}

            <>
              <div class="flex w-full md:w-full overflow-hidden py-2 md:py-1 md:px-0 my-1">
                {/* <div class="w-full inline-flex overflow-auto hide-scrollbar ">
                                <div class="flex-none  relative space-x-2">
                                   
                                    <button class=" bg-[var(--secondary)]  text-[--primary] py-2  px-2 rounded-[2.83px] gap-2.5  font-bold uppercase text-[12px]  " onClick={() => handleTabClick("all")}>All</button>
                                    {(inplayMatch?.isMatchOdds  && inplayMatch?.sportId == 4) && <button class="bg-[#feffff] border-[1px]  text-[--primary] py-2 px-2 rounded-[2.83px] place-content-center gap-2.5  font-bold uppercase text-[12px] " onClick={() => handleTabClick("MatchOdds")}>Match Odds</button>}
                                    {(inplayMatch?.isBookmaker && inplayMatch?.sportId == 4) && <button class="bg-[#feffff] border-[1px]  text-[--primary] py-2 px-2 rounded-[2.83px] place-content-center gap-2.5  font-bold uppercase text-[12px] " onClick={() => handleTabClick("bookmaker")}>Bookmaker</button>}
                                    {(inplayMatch?.isTieOdds && inplayMatch?.sportId == 4) && <button class="bg-[#feffff] border-[1px]  text-[--primary] py-2 px-2 rounded-[2.83px] place-content-center gap-2.5  font-bold uppercase text-[12px] " onClick={() => handleTabClick("tied")}>tied</button>}
                                    {(inplayMatch?.isToss && inplayMatch?.sportId == 4) && <button class="bg-[#feffff] border-[1px]  text-[--primary] py-2 px-2 rounded-[2.83px] place-content-center gap-2.5  font-bold uppercase text-[12px] " onClick={() => handleTabClick("toss")}>Toss</button>}
                                    {(inplayMatch?.isFancy && inplayMatch?.sportId == 4) && <button class="bg-[#feffff] border-[1px]  text-[--primary] py-2 px-2 rounded-[2.83px] place-content-center gap-2.5  font-bold uppercase text-[12px] " onClick={() => handleTabClick("fancy")}>Fancy</button>}
                                </div>
                            </div> */}
                {inplayMatch?.sportId == 4 && (
                  <div className="w-full inline-flex overflow-auto hide-scrollbar">
                    <div className="flex-none relative space-x-2">
                      <button
                        className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                          activeTab === "all"
                            ? "bg-[var(--primary)] text-[--white]"
                            : "bg-[#feffff] border text-[--primary]"
                        }`}
                        onClick={() => handleTabClick("all")}
                      >
                        All
                      </button>
                      {inplayMatch?.isMatchOdds &&
                        inplayMatch?.sportId === 4 && (
                          <button
                            className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                              activeTab === "MatchOdds"
                                ? "bg-[var(--primary)] text-[--white]"
                                : "bg-[#feffff] border text-[--primary]"
                            }`}
                            onClick={() => handleTabClick("MatchOdds")}
                          >
                            Match Odds
                          </button>
                        )}

                      {inplayMatch?.isBookmaker &&
                        inplayMatch?.sportId === 4 && (
                          <button
                            className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                              activeTab === "bookmaker"
                                ? "bg-[var(--primary)] text-[--white]"
                                : "bg-[#feffff] border text-[--primary]"
                            }`}
                            onClick={() => handleTabClick("bookmaker")}
                          >
                            Bookmaker
                          </button>
                        )}
                        {inplayMatch?.isFancy && inplayMatch?.sportId === 4 && (
                        <button
                          className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                            activeTab === "fancy"
                              ? "bg-[var(--primary)] text-[--white]"
                              : "bg-[#feffff] border text-[--primary]"
                          }`}
                          onClick={() => handleTabClick("fancy")}
                        >
                          Fancy
                        </button>
                      )}

                     

                      {inplayMatch?.isToss && inplayMatch?.sportId === 4 && (
                        <button
                          className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                            activeTab === "toss"
                              ? "bg-[var(--primary)] text-[--white]"
                              : "bg-[#feffff] border text-[--primary]"
                          }`}
                          onClick={() => handleTabClick("toss")}
                        >
                          Toss
                        </button>
                      )}
 {inplayMatch?.isTieOdds && inplayMatch?.sportId === 4 && (
                        <button
                          className={`py-2 px-2 rounded-[2.83px] font-bold uppercase text-[12px] ${
                            activeTab === "tied"
                              ? "bg-[var(--primary)] text-[--white]"
                              : "bg-[#feffff] border text-[--primary]"
                          }`}
                          onClick={() => handleTabClick("tied")}
                        >
                          Tied
                        </button>
                      )}
                      
                    </div>
                  </div>
                )}
              </div>

              {(activeTab == "all" || activeTab == "MatchOdds") && (
                <MatchOddsComponent
                  inplayMatch={inplayMatch}
                  activeTab={activeTab}
                  finalSocket={finalSocket}
                  isMatchCoin={isMatchCoin}
                  positionObj={positionObj}
                  returnDataObject={returnDataObject}
                  toggleRowVisibility={toggleRowVisibility}
                  handleBackOpen={handleBackOpen}
                  formatNumber={formatNumber}
                  betplaceSection={betplaceDataThroughProps}
                />
              )}

              {inplayMatch.sportId != 4 && (
                <OtherMarketsComponent
                  activeTab={activeTab}
                  otherFinalSocket={otherFinalSocket}
                  isTieCoin={isTieCoin}
                  positionObj={positionObj}
                  returnDataObject={returnDataObject}
                  handleBackOpen={handleBackOpen}
                  formatNumber={formatNumber}
                  betplaceSection={betplaceDataThroughProps}
                  isMatchCoin={isMatchCoin}
                  inplayMatch={inplayMatch}
                />
              )}

              {(activeTab == "all" || activeTab == "bookmaker") && (
                <BookmakerComponent
                  inplayMatch={inplayMatch}
                  activeTab={activeTab}
                  bookmaker2Fancy={bookmaker2Fancy}
                  matchScoreDetails={matchScoreDetails}
                  isMatchCoin={isMatchCoin}
                  positionObj={positionObj}
                  marketId={marketId}
                  returnDataObject={returnDataObject}
                  returnDataFancyObject={returnDataFancyObject}
                  toggleRowVisibility={toggleRowVisibility}
                  handleBackOpen={handleBackOpen}
                  formatNumber={formatNumber}
                  betplaceSection={betplaceDataThroughProps}
                />
              )}

              {(activeTab == "all" || activeTab == "toss") && (
                <TossDataComponent
                  inplayMatch={inplayMatch}
                  activeTab={activeTab}
                  matchScoreDetails={matchScoreDetails}
                  isTossCoin={isTossCoin}
                  positionObj={positionObj}
                  toggleRowVisibility={toggleRowVisibility}
                  handleBackOpen={handleBackOpen}
                  marketId={marketId}
                  returnDataObject={returnDataObject}
                  formatNumber={formatNumber}
                  betplaceSection={betplaceDataThroughProps}
                  isMatchCoin={isMatchCoin}
                />
              )}

              {(activeTab == "all" || activeTab == "tied") && (
                <TiedOddsComponent
                  inplayMatch={inplayMatch}
                  activeTab={activeTab}
                  matchScoreDetails={matchScoreDetails}
                  finalSocket={finalSocket}
                  positionObj={positionObj}
                  toggleRowVisibility={toggleRowVisibility}
                  handleBackOpen={handleBackOpen}
                  marketId={marketId}
                  returnDataObject={returnDataObject}
                  formatNumber={formatNumber}
                  betplaceSection={betplaceDataThroughProps}
                  isMatchCoin={isMatchCoin}
                />
              )}

              {sportId == "4" &&
                (activeTab == "all" || activeTab == "fancy") && (
                  <div className="fancy-premium-container mt-1">
                    {/* <div className="flex gap-2 w-full">
                                    <button
                                        className={`px-3 py-1.5 w-1/2 text-[12px] font-[700] hover:bg-[var(--primary)] border border-[var(--primary)] hover:text-white  ${mainTab === "fancy" ? "bg-[--secondary]" : "bg-white text-red-500"
                                            }`}
                                        onClick={() => {
                                            setMainTab("fancy");
                                            setSubTab(fancyTabs[0].key);
                                        }}
                                    >
                                        FANCYfff
                                    </button>
                                </div> */}

                    {/* Sub Tabs */}
                    {/* <div className="flex flex-nowrap gap-1 my-2 overflow-x-auto">
                                    {mainTab === "fancy" &&
                                        fancyTabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                className={`mb-1 px-3 py-1.5 rounded text-[12px] text-nowrap font-[700] hover:bg-[var(--primary)] hover:text-white ${subTab === tab.key ? "bg-[--secondary] text-[--primary]" : "bg-white text-[--primary]"
                                                    }`}
                                                onClick={() => setSubTab(tab.key)}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                </div> */}

                    {/* Content */}
                    <div className="mb-2">{renderFancyComponent()}</div>
                  </div>
                )}
            </>

            <div className="flex md:hidden justify-center items-start ">
              <div className="bg-white w-full max-w-3xl rounded-md shadow-lg md:m-4 m-1 p-0">
                <div className="flex justify-between items-center border-x border-t border-[#C6D2D8] bg-white w-full">
                  {["oddsBetData", "fancyBetData"]?.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveBets(tab)}
                      className={`px-4 py-2 uppercase text-[12px] font-[600] w-full ${
                        activeBets === tab
                          ? " text-[var(--secondary)] border-b-2 border-b-[var(--secondary)] bg-[--primary]"
                          : "hover:text-[var(--secondary)] text-black"
                      }`}
                    >
                      {tab === "oddsBetData"
                        ? "MATCHED"
                        : tab === "UnsettleBets"
                          ? "Unsettle"
                          : tab === "fancyBetData"
                            ? "Fancy"
                            : "-"}
                    </button>
                  ))}
                </div>
                <div className="overflow-hidden w-full p-0 !m-0">
                  <div className="max-w-full overflow-auto ">
                    <div className="min-w-full ">
                      <div className="overflow-auto w-full ">
                        <table className="min-w-full capitalize border border-[#f8f8f8]">
                          <thead>
                            <tr className="w-full text-black/80 text-[12px] uppercase font-[400] bg-[#ffffff] text-left border border-[#f8f8f8]">
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Market
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Odds
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Stake
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Date/Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Odds Bets */}
                            {activeBets === "oddsBetData" &&
                              (oddsBetData?.length > 0 ? (
                                oddsBetData.map((element, index) => (
                                  <tr
                                    key={index}
                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t divide-x divide-white text-left ${
                                      element?.type === "K"
                                        ? "bg-[var(--matchKhai)]"
                                        : "bg-[var(--matchLagai)]"
                                    }`}
                                  >
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      <div>
                                        {element?.teamName} [{element?.oddsType}
                                        ]<br />
                                        <span className="font-bold">
                                          {element?.marketName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element &&
                                      element?.oddsType === "matchOdds"
                                        ? parseFloat(Number(element?.odds) + 1)
                                            .toFixed(2)
                                            .replace(/\.?0+$/, "")
                                        : element &&
                                            (element?.oddsType ===
                                              "bookmaker" ||
                                              element?.oddsType === "toss")
                                          ? parseFloat(element?.odds * 100)
                                              .toFixed(2)
                                              .replace(/\.?0+$/, "")
                                          : parseFloat(element?.odds)
                                              .toFixed(2)
                                              .replace(/\.?0+$/, "")}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.amount}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {moment(element?.date).format(
                                        "YYYY-MM-DD hh:mm",
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-2 text-sm"
                                  >
                                    No Odds Bet found!
                                  </td>
                                </tr>
                              ))}
                            {/* Fancy Bets */}
                            {activeBets === "fancyBetData" &&
                              (fancyBetData?.length > 0 ? (
                                fancyBetData.map((element, index) => (
                                  <tr
                                    key={index}
                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${
                                      element?.type === "N"
                                        ? "bg-[var(--matchKhai)]"
                                        : "bg-[var(--matchLagai)]"
                                    }`}
                                  >
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      <span className="font-medium text-xs">
                                        {element?.sessionName} [fancy-
                                        {element?.fancyType}]
                                      </span>
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.run}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.amount}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {moment(element?.date).format(
                                        "YYYY-MM-DD hh:mm",
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-2 text-sm"
                                  >
                                    No Fancy Bets found!
                                  </td>
                                </tr>
                              ))}
                            {/* Unsettle Bets */}
                            <div className="bg-[var(--primary)] flex justify-between px-2">
                              <div className="text-xs md:flex hidden font-light text-white items-center py-2">
                                {inplayMatch?.matchName}
                              </div>
                            </div>{" "}
                            {activeBets === "UnsettleBets" &&
                              (fancyBetData?.length > 0 ? (
                                fancyBetData.map((element, index) => (
                                  <tr
                                    key={index}
                                    className="w-full text-[#333333] text-[0.8125rem] border-b border-t text-left"
                                  >
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.name}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.odds}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.amount}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {moment(element?.date).format(
                                        "YYYY-MM-DD hh:mm",
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-2 text-sm"
                                  >
                                    No Unsettle Bets found!
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-[var(--primary)] w-full">
                      <button
                        className="py-0.5 text-white text-center w-full text-sm font-bold uppercase"
                        onClick={() => {
                          setCompltedModal(true);
                        }}
                      >
                        Completed Bets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* // )} */}
        <div className="w-full xl:w-[65%] xl:block hidden ">
          <div className="">
            <div className="flex w-full">
              <div
                className={`rounded-t-md py-1.5 px-4 w-1/2 font-bold text-sm cursor-pointer ${
                  !betShow
                    ? "bg-[var(--secondary)] text-black"
                    : "bg-[var(--primary)] text-white"
                }`}
              >
                Bet Slip
              </div>

              <div
                className={`rounded-t-md py-1.5 w-1/2 px-4 font-bold text-sm cursor-pointer ${
                  betShow
                    ? "bg-[var(--secondary)] text-black"
                    : "bg-[var(--primary)] text-white"
                }`}
                onClick={() => setBetShow(true)}
              >
                My Bet
              </div>
            </div>
            {!betShow ? (
              <>
                <BetPlaceDesktop
                  openBets={openBets}
                  closeRow={closeRow}
                  matchData={inplayMatch}
                  betSlipData={betSlipData}
                  placeBet={placeBet}
                  errorMessage={errorMessage}
                  successMessage={successMessage}
                  count={betSlipData.count}
                  betLoading={betLoading}
                  increaseCount={increaseCount}
                  decreaseCount={decreaseCount}
                  handleButtonValues={handleButtonValues}
                  isMatchCoin={isMatchCoin}
                />
              </>
            ) : (
              <div className="">
                <div className="flex justify-between items-center border-x border-t border-[#C6D2D8] bg-white w-full">
                  {["oddsBetData", "fancyBetData"]?.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveBets(tab)}
                      className={`px-4 py-2 uppercase text-[12px] font-[600] w-full ${
                        activeBets === tab
                          ? " text-[var(--secondary)] border-b-2 border-b-[var(--secondary)] bg-[--primary]"
                          : "hover:text-[var(--primary)] text-black"
                      }`}
                    >
                      {tab === "oddsBetData"
                        ? "MATCHED"
                        : tab === "UnsettleBets"
                          ? "Unsettle"
                          : tab === "fancyBetData"
                            ? "Fancy"
                            : "-"}
                    </button>
                  ))}
                </div>
                <div className="overflow-hidden w-full border border-[#C6D2D8] border-t-0">
                  <div className="max-w-full overflow-auto">
                    <div className="min-w-full">
                      <div className="overflow-hidden w-full">
                        <table className="min-w-full capitalize border border-[#f8f8f8]">
                          <thead>
                            <tr className="w-full text-black/80 text-[11px] uppercase font-[400] bg-[#ffffff] text-left border border-[#f8f8f8]">
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Market
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Odds
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Stake
                              </th>
                              <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">
                                Date/Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeBets === "oddsBetData" &&
                              (oddsBetData?.length > 0 ? (
                                oddsBetData.map((element, index) => (
                                  <tr
                                    key={index}
                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t divide-x divide-white text-left ${
                                      element?.type === "K"
                                        ? "bg-[var(--matchKhai)]"
                                        : "bg-[var(--matchLagai)]"
                                    }`}
                                  >
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      <div>
                                        {element?.teamName} [{element?.oddsType}
                                        ]<br />
                                        <span className="font-bold">
                                          {element?.marketName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element &&
                                      element?.oddsType === "matchOdds"
                                        ? parseFloat(Number(element?.odds) + 1)
                                            .toFixed(2)
                                            .replace(/\.?0+$/, "")
                                        : element &&
                                            (element?.oddsType ===
                                              "bookmaker" ||
                                              element?.oddsType === "toss")
                                          ? parseFloat(element?.odds * 100)
                                              .toFixed(2)
                                              .replace(/\.?0+$/, "")
                                          : parseFloat(element?.odds)
                                              .toFixed(2)
                                              .replace(/\.?0+$/, "")}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.amount}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {moment(element?.date).format(
                                        "YYYY-MM-DD hh:mm",
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-2 text-sm"
                                  >
                                    No Odds Bet found!
                                  </td>
                                </tr>
                              ))}

                            {activeBets === "fancyBetData" &&
                              (fancyBetData?.length > 0 ? (
                                fancyBetData.map((element, index) => (
                                  <tr
                                    key={index}
                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${
                                      element?.type === "N"
                                        ? "bg-[var(--matchKhai)]"
                                        : "bg-[var(--matchLagai)]"
                                    }`}
                                  >
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      <span className="font-medium text-xs">
                                        {element?.sessionName} [Fancy-
                                        {element?.fancyType}]
                                      </span>
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.run}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {element?.amount}
                                    </td>
                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                      {moment(element?.date).format(
                                        "YYYY-MM-DD hh:mm",
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-2 text-sm"
                                  >
                                    No Fancy Bets found!
                                  </td>
                                </tr>
                              ))}
                            {/* 
                                                    {activeBets === "UnsettleBets" &&
                                                        (fancyBetData?.length > 0 ? (
                                                            fancyBetData.map((element, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className="w-full text-[#333333] text-[0.8125rem] border-b border-t text-left"
                                                                >
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.sessionName} [Fancy-{element?.fancyType}]
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.run}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.amount}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {moment(element?.date).format("YYYY-MM-DD hh:mm")}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-2 text-sm">
                                                                    No Unsettle Bets found!
                                                                </td>
                                                            </tr>
                                                        ))} */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--primary)] w-full">
                  <button
                    className="py-0.5 text-white text-center w-full text-sm font-bold uppercase"
                    onClick={() => {
                      setCompltedModal(true);
                    }}
                  >
                    Completed Bets
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div
onClick={() => setSelectedType(prev => !prev)}
      style={{
        bottom: scrolled ? "auto" : "80px",
        top: scrolled ? "40px" : "auto",
        transition: "all 0.3s ease",
      }}
      className="fixed right-[25px] cursor-pointer w-[40px] h-[40px]
        bg-[#02FFE9] border-2 border-[var(--primary)]
         flex items-center justify-center z-20 animate-bounce"
    >
      <GiTv size={30} className="text-[var(--primary)]" />
    </div> */}
      {/* <div  className='fixed  bottom-20 right-[25px] cursor-pointer w-[60px] h-[60px] bg-[var(--primary)] border-2 border-[var(--primary)]  rounded-full flex items-center justify-center animate-bounce z-50'> */}
      <GiTv
        size={40}
        className="text-white fixed bg-[#FF5F1F] rounded-md p-1 bottom-20 right-[25px] animate-bounce "
        onClick={() => setSelectedType((prev) => !prev)}
      />
      {/* </div> */}
    </div>
  );
};

export default ViewMatches;
