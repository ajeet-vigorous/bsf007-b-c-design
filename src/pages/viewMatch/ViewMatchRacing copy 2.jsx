import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import BlinkingComponent from "./BlinkingComponent";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import PlaceBetMobile from "../../component/betplaceMobile/PlaceBetMobile";



// import BetListComponent from "../component/BetListComponent/BetListComponent.jsx";
import moment from "moment-timezone";
import { FaEdit, FaList, FaMinus, FaPlus, FaRegListAlt, FaTv } from "react-icons/fa";
import { message, Tooltip } from "antd";
// import { getUserBalance } from "../redux/reducers/user_reducer.js";
// import BetListComponentMobile from "../component/BetListComponent/BetListComponentMobile.jsx";
import { apiCall } from "../../config/HTTP.js";
import Loader from "../../component/loader/Loader";

const ViewMatchRacing = () => {
  const [inplayMatch, setInplayMatch] = useState({});
  const [scoreShow, setScoreShow] = useState(true);
  const [tvShow, setTvShow] = useState(false);
  const [betShow, setBetShow] = useState(true);
  const [betShowM, setBetShowM] = useState(true);
  const [betShowMobile, setBetShowMobile] = useState(false);
  const [matchDetailsForSocketNew, setMatchDetailsForSocketNew] = useState({});
  const [finalSocket, setFinalSocketDetails] = useState({});
  const [hiddenRows, setHiddenRows] = useState([]);
   const [fullscreen, setFullScreen] = useState(false);
  const [stakeModal, setStakeModal] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [betSlipData, setBetSlipData] = useState({
    stake: '0',
    count: 0,
    teamname: '',
    teamData: null,
  });
  const [fancyBetData, setFancyBetData] = useState([]);
  const [oddsBetData, setOddsBetData] = useState([]);
  const [returnDataObject, setReturnDataObject] = useState({});
  const [returnDataFancyObject, setReturnDataFancyObject] = useState({});
  const [fancypositionModal, setFancypositionModal] = useState(false);
  const [positionData, setPositionData] = useState({});
  const [betLoading, setBetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketState, setSocketState] = useState(null);
  const [positionObj, setPositionObj] = useState({});
  const [positioBetData, setPositionBetData] = useState({});
  const [isMatchCoin, setIsMatchCoin] = useState({ max: null, min: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState("tv");
  const [betListModal, setBetListModal] = useState(false);

  let { marketId, eventId, sportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  document.title = `${inplayMatch?.matchName || "Racing Details"}`;


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const openRulesModal = () => setIsRulesOpen(true);
  const closeRulesModal = () => setIsRulesOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 100;
      setIsFixed(scrollPosition > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setMatchDataFromLocalstorage = async () => {
    let data = localStorage.getItem(`${marketId}_MatchOddsData`);
    if (data) {
      setFinalSocketDetails(JSON.parse(data));
    }
  };

  useEffect(() => {
    setMatchDataFromLocalstorage();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isConnected && inplayMatch?.data?.socketUrl) {
        callSocket(inplayMatch?.data?.socketUrl);
      } else if (document.visibilityState === 'hidden') {
        cleanupWebSocket();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setupAsyncActions(marketId);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupWebSocket();
    };
  }, [eventId, marketId, isConnected]);

  useEffect(() => {
    getMatchDataByMarketID(marketId);
  }, [marketId]);

  useEffect(() => {
    if (positioBetData) {
      const sortedOddsBetData = positioBetData?.oddsBetData
        ? positioBetData.oddsBetData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      const finalPositionInfo = {};
      sortedOddsBetData.forEach(item => {
        const positionInfo = item.positionInfo;
        for (const key in positionInfo) {
          if (positionInfo.hasOwnProperty(key)) {
            finalPositionInfo[key] = (finalPositionInfo[key] || 0) + positionInfo[key];
          }
        }
      });
      setPositionObj(finalPositionInfo);
      setOddsBetData(sortedOddsBetData);
    }
  }, [positioBetData]);

  useEffect(() => {
    if (fancypositionModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [fancypositionModal]);

  const setupAsyncActions = async (marketId) => {
    fetchBetLists();
  };

  const cleanupWebSocket = () => {
    if (socketState) {
      socketState.disconnect();
      setSocketState(null);
    }
  };

  const getMatchDataByMarketID = async (marketId) => {
    try {
      setLoading(true);
      const resData = { marketId };
      const inplayMatchResponse = await apiCall("POST", "sports/sportByMarketId", resData);
      if (inplayMatchResponse?.data) {
        setInplayMatch(inplayMatchResponse.data);
        if (inplayMatchResponse.data.socketPerm) {
          callSocket(inplayMatchResponse.data.socketUrl, inplayMatchResponse.data.sportId);
        }
      }
    } catch (error) {
      console.error("Error fetching inplay data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const maxCoinData = inplayMatch?.maxMinCoins
      ? JSON.parse(inplayMatch?.maxMinCoins)
      : {
        maximum_match_bet: null,
        minimum_match_bet: null,
        maximum_session_bet: null,
        minimum_session_bet: null,
      };
    setIsMatchCoin({
      max: maxCoinData?.maximum_matchOdds_coins || maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
  }, [inplayMatch]);

  const callSocket = async (socketUrl) => {
    if (socketState?.connected) return;
    try {
      const socket = io.connect(socketUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99,
      });
      socket.emit(`marketByEvent`, marketId);
      socket.on(marketId, (data) => {
        localStorage.setItem(`${marketId}_MatchOddsData`, data);
        setMatchDetailsForSocketNew(JSON.parse(data));
        setIsConnected(true);
        filterData(JSON.parse(data));
      });
      socket.on('disconnect', () => setIsConnected(false));
      setSocketState(socket);
    } catch (error) {
      console.error("Error in socket connection:", error);
    }
  };

  const filterData = (matchDetailsForSocketNew) => {
    try {
      if (!matchDetailsForSocketNew || matchDetailsForSocketNew.length === 0) return;
      const criteria = ["Tied Match", "Match Odds", "To Win the Toss"];
      const filteredData = Array.isArray(matchDetailsForSocketNew)
        ? matchDetailsForSocketNew.filter((item) => criteria.includes(item.marketType))
        : [];
      if (filteredData.length > 0) {
        const filteredDataObject = {};
        filteredData.forEach((item) => {
          filteredDataObject[item.marketType] = item;
        });
        setFinalSocketDetails(filteredDataObject);
      } else {
        console.error("No data matched the criteria.");
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

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

  const handelAllClossModal = () => {
    setTvShow(false);
    setScoreShow(!scoreShow);
  };

  const openBets = () => {
    setBetShow(true);
    setBetShowM(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const openBetsClose = () => {
    setBetShow(false);
  };

  const handleBackOpen = (data) => {
    if (inplayMatch?.countryCode != 'GB' && inplayMatch?.sportId == 7 && data?.inplayCheck === true && data?.statusCheck === 'OPEN') {
      message.error("Inplay Bets are Not Allowed");
      return;
    }
    const matchDateStr = inplayMatch?.matchDate;
    if (moment(matchDateStr, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      const matchTime = moment.tz(matchDateStr, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').clone().tz('Asia/Karachi');
      const currentTime = moment().tz('Asia/Karachi');
      const diffInMinutes = matchTime.diff(currentTime, 'minutes');
      if (diffInMinutes <= 6) {
        setBetShow(false);
        setBetShowM(false);
        setBetSlipData({
          ...data,
          stake: '0',
          count: data.odds,
          teamname: data.name,
          teamData: data.teamData,
        });
      } else {
        message.error("Bets Not Accepted At This Time");
      }
    } else {
      console.log("Invalid match date");
    }
  };

  const toggleRowVisibility = (id) => {
    setHiddenRows((prev) => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const placeBet = async () => {
    try {
      const betObject = {
        odds: betSlipData.count + "",
        amount: betSlipData.stake,
        selectionId: betSlipData.selectionId + "",
        marketId: marketId + "",
        eventId: eventId,
        betFor: betSlipData.betFor + "",
        run: betSlipData.run ? betSlipData.run + "" : "0",
        oddsType: betSlipData.oddsType === "Match Odds" ? "matchOdds" : betSlipData.oddsType === "Tied Match" ? "tiedMatch" : betSlipData.oddsType + "",
        type: betSlipData.betType + "",
      };
      if (betSlipData.oddsType !== "bookmaker" && betSlipData.oddsType !== "fancy") {
        betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
      }
      setBetLoading(true);
      let saveBetOdds;
      if (betSlipData.oddsType === "fancy") {
        saveBetOdds = await apiCall("POST", "sports/sessionBetPlaced", betObject);
      } else {
        saveBetOdds = await apiCall("POST", "sports/oddBetPlaced", betObject);
      }
      setBetShow(false);
      setBetShowM(false);
      if (!saveBetOdds.error) {
        message.success(saveBetOdds?.message);
        openBets();
        // dispatch(getUserBalance());
        await fetchBetLists();
        await matchOddsPos();
      } else {
        message.error(saveBetOdds?.message);
      }
    } catch (error) {
      message.error(error.data?.message || "Error placing bet");
      setErrorMessage(error.data?.message || "Error placing bet");
    } finally {
      setBetLoading(false);
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
      const userBetHistory = await apiCall("POST", 'sports/betsList', BetListData);
      if (userBetHistory?.data) {
        const { fancyBetData, oddsBetData } = userBetHistory.data;
        const filteredFancyBetData = fancyBetData
          ? fancyBetData.filter(element => element.isDeclare === 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        const sortedOddsBetData = oddsBetData
          ? oddsBetData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setFancyBetData(filteredFancyBetData);
        setOddsBetData(sortedOddsBetData);
        setPositionBetData(userBetHistory.data);
      }
    } catch (error) {
      console.error('Error fetching bet lists:', error);
    }
  };

  const matchOddsPos = async () => {
    try {
      const matchOddsPos = await apiCall("POST", 'reports/matchOddsRunningPos');
      if (matchOddsPos?.data) {
        localStorage.setItem('matchOddsRunningPos', JSON.stringify(matchOddsPos.data));
      }
    } catch (error) {
      console.error('Error fetching match odds position:', error);
    }
  };

  const closeRow = (id) => {
    setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
  };


  const openBetInMobile = () => {
    setBetShowMobile(!betShowMobile);
    setTvShow(false);
    setScoreShow(false);
  };

const increaseCount = () => {
  try {
    if (betSlipData.oddsType !== 'Match Odds') {
      setBetSlipData(prevData => {
        const newCount = parseFloat(prevData.count) + 0.01;
        return {
          ...prevData,
          count: newCount.toFixed(2)
        };
      });
    } else {
      console.log('Not Match Odds, count not increased');
    }
  } catch (error) {
    console.error('Error increasing count:', error);
  }
};


  const decreaseCount = () => {
    try {
      if (betSlipData.oddsType !== 'Match Odds') {
      setBetSlipData(prevData => {
        const newCount = parseFloat(prevData.count) - 0.01;
        return {
          ...prevData,
          count: newCount.toFixed(2)
        };
      })}else {
      console.log('Not Match Odds, count not decreased');
    }
    } catch (error) {
      console.error('Error decreasing count:', error);
    }
  };
  let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

  const colorClasses = [
    "bg-red-500",
    "bg-red-600",
    "bg-green-500",
    "bg-green-600",
    "bg-blue-500",
    "bg-blue-600",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-purple-500",
    "bg-purple-600",
    "bg-pink-500",
    "bg-pink-600",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-orange-500",
    "bg-orange-600",
    "bg-teal-500",
    "bg-teal-600",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-lime-500",
    "bg-lime-600",
    "bg-amber-500",
    "bg-amber-600",
    "bg-rose-500",
    "bg-rose-600",
    "bg-fuchsia-500",
    "bg-fuchsia-600",
  ];

  if (loading) return <Loader />;

  // Check if finalSocket or inplayMatch.isMatchOdds is empty or undefined
  if (!finalSocket || Object.values(finalSocket).length === 0 || !inplayMatch?.isMatchOdds) {
    return (
      <div className="text-black text-center font-bold py-4">
        <div className="md:flex justify-center w-100 gap-x-1">
          <div className="md:w-2/3 h-100">
            <div className="w-full py-1 bg-secondary">
              <div className="flex py-2 sm:px-2 px-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 py-2 px-2 bg-secondary sm:flex items-center justify-center hidden">
                    {sportId == 7 && <img src="/assests/horse.svg" alt="matchInplaY" />}
                    {sportId == 4339 && <img src="/assests/greyhound.svg" alt="matchInplaY" />}
                  </div>
                </div>
                <div className="px-2 text-white">
                  <div className="w-10 h-10 py-2 px-2 websiteThemeSoundColor sm:hidden items-center justify-center mb-1">
                    {sportId == 7 && <img src="/assests/horse.svg" alt="matchInplaY" />}
                    {sportId == 4339 && <img src="/assests/greyhound.svg" alt="matchInplaY" />}
                  </div>
                  <div className="sm:text-xs text-[11px] text-white/90 font-medium flex justify-start items-center">
                    <span>
                      {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                        ? moment
                          .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                          .clone()
                          .tz('Asia/Karachi')
                          .format('MMM DD hh:mm A')
                        : '-'}
                    </span>&nbsp; | Winners: 1
                  </div>
                  <div className="text-lg font-bold">
                    <span>
                      {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                        ? moment
                          .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                          .clone()
                          .tz('Asia/Karachi')
                          .format('hh:mm A')
                        : '-'}
                    </span> {inplayMatch?.sportName || ""}
                  </div>
                </div>
                <div className="text-[#00B181] ml-auto px-2 md:text-[26px] text-lg uppercase font-bold">
                  {finalSocket && typeof finalSocket === "object" && Object.values(finalSocket).length > 0 ? (
                    Object.values(finalSocket).map((element, index) =>
                      element?.marketType === "Match Odds" ? (
                        <div key={index}>{element?.inplay && element?.status === 'OPEN' ? "InPlay" : element?.status}</div>
                      ) : null
                    )
                  ) : null}
                </div>
              </div>
            </div>
            <div className="market-button sm:hidden flex justify-end text-xs md:text-sm divide-secondary gap-1 my-1">
              <button
                onClick={() => setIsScorecardOpen("tv")}
                className={`btn-tv-score text-center flex items-center space-x-2 px-5 py-2 font-semibold ${isScorecardOpen === "tv" ? "text-black bg-button" : "text-gray-200 bg-secondary"
                  }`}
              >
                <FaTv size={17} />
                <span>Live Tv</span>
              </button>
              {/* <button
                className={`btn-tv-score text-center flex items-center space-x-2 px-5 py-2 font-semibold ${isScorecardOpen === "score" ? "text-black bg-button" : "text-gray-200 bg-secondary"
                  }`}
                onClick={() => setIsScorecardOpen("score")}
              >
                <FaRegListAlt size={16} />
                <span>Scorecard</span>
              </button> */}
              <button
                onClick={() => setBetListModal(true)}
                className="btn-tv-score text-center bg-secondary flex items-center space-x-2 px-5 py-2 font-semibold text-white"
              >
                <FaList size={17} />
                <span>Bet List</span>
              </button>

              
            </div>
            <div>
                  {/* {isScorecardOpen === "score" && inplayMatch.isScore ? (
                    <div className="border-2 border-secondary rounded-lg  my-1">
                      <div className="flex justify-between bg-secondary items-center px-2">
                        <div
                          onClick={() => setFullScreen((state) => !state)}
                          className="text-white bg-button rounded-sm px-2 py-0.5 text-xs font-semibold"
                        >
                          {fullscreen ? "HS" : "FS"}
                        </div>
                        <div
                          className="px-2 py-1 text-white bg-red-500 rounded-full text-xs"
                          onClick={() => setIsScorecardOpen(false)}
                        >
                          X
                        </div>
                      </div>
                      <div
                        className={`bg-white w-full ${fullscreen ? "h-[220px]" : "h-[110px]"
                          }`}
                      >
                        <div className="details">
                          <div
                            className={`w-full relative md:text-sm text-[10px]`}
                          >
                            <iframe
                              src={
                                inplayMatch && inplayMatch.scoreIframe
                                  ? inplayMatch.scoreIframe
                                  : ""
                              }
                              title=" "
                              loading="lazy"
                              className={`w-[100%] ${fullscreen ? "h-[220px]" : "h-[110px]"
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null} */}
                  {inplayMatch.isTv ? (
                    <>
                      {isScorecardOpen === "tv" && inplayMatch.tvUrl && (
                        <div className="bg-secondary w-full rounded-lg border-2 border-secondary">
                          <div className="flex justify-end items-center px-2">
                            <div
                              className="px-2 py-1 text-white bg-red-500 rounded-full text-xs"
                              onClick={() => setIsScorecardOpen(false)}
                            >
                              X
                            </div>
                          </div>
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
                                className="w-[100%] h-[300px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
            <div className="bg-[#E6F2FC]">

              {inplayMatch?.isMatchOdds ? (
                <>
                  {inplayMatch?.marketList?.map((element, index) =>
                    element.marketType === "Match Odds" ? (<div key={index}>
                      <div className="rounded-md mt-1">
                        <header className="bg-secondary rounded-t-md z-[1] relative">
                          <div className="items-center flex relative z-0">
                            <div className="flex flex-1">
                              <span className="uppercase items-center px-2 rounded-tl-md bg-button py-1 inline-flex text-sm font-medium text-black">
                                {inplayMatch?.marketName || ""}
                              </span>
                            </div>
                          </div>
                          <div className="items-center flex relative bg-white z-[-1]">
                            <div className="xl:w-2/3 w-1/2 flex">
                              <div className="uppercase px-2 items-center inline-flex text-xs font-bold text-black">
                                {element.selectionIdData?.length || 0} Selection
                              </div>
                            </div>
                            <div className="xl:w-1/3 w-1/2 divide-y divide-black rounded-tr-2xl flex flex-wrap justify-center items-center">
                              <div className="grid grid-cols-6 text-[10px] text-black space-x-0.5 py-0.5 w-full rounded-tr-2xl flex-wrap justify-center lg:px-2 px-1 items-center">
                                <span className="md:block hidden"></span>
                                <span className="md:block hidden"></span>
                                <span className="lg:col-span-1 text-nowrap md:col-span-2 col-span-3 lg:col-start-1 font-bold lg:text-right text-center px-1">
                                  Back {"{L}"}
                                </span>
                                <span className="col-span-2 text-nowrap font-bold text-center px-4">
                                  Lay {"{N}"}
                                </span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          </div>

                        </header>
                        <>
                          {element?.selectionIdData?.length > 0 ? (
                            element?.selectionIdData?.map((elementtemp, index) => (
                              <React.Fragment key={index}>
                                <div
                                  className={`relative flex whitespace-normal max-w-full `}
                                >

                                  <div className="w-1/2 lg:w-1/2 flex px-4">
                                    <div className="w-11/12 leading-3 flex items-center text-slate-700">

                                      <div className="text-black py-4 text-xs font-bold">
                                        {elementtemp.runnerName}
                                        <br />


                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-1/2 lg:w-1/2 grid grid-cols-6 px-2 space-x-0.5 relative">
                                    {elementtemp?.ex?.availableToBack?.length > 0 ? (
                                      <>
                                        {elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                                          <span key={index} className="lg:col-span-1 col-span-2 py-1 lg:block hidden">
                                            <BlinkingComponent
                                              price={tempData.price}
                                              size={tempData.size}
                                              color="bg-[#b7e0f0ff]"
                                              blinkColor="bg-[#CDEBEB]"
                                              textColors="text-black"
                                              boderColors="border-black"
                                            />
                                          </span>
                                        ))}
                                        {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                                          <React.Fragment key={index}>
                                            <span
                                              className="md:col-span-2 sm:col-span-2 col-span-3 md:col-start-3 py-1 lg:hidden block"

                                            >
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#9ECDDF]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-[#489bbd]"
                                              />
                                            </span>
                                            <span
                                              className="lg:col-span-1 col-span-3 py-1 lg:block hidden"

                                            >
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#9ECDDF]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-[#489bbd]"
                                              />
                                            </span>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    ) : null}
                                    {elementtemp?.ex?.availableToLay?.length > 0 ? (
                                      elementtemp.ex.availableToLay.map((tempData, index) => (
                                        <React.Fragment key={index}>
                                          {index === 0 ? (
                                            <>
                                              <span
                                                className="md:col-span-2 sm:col-span-2 md:col-start-5 col-span-3 py-1 lg:hidden block"

                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={tempData.size}
                                                  color="bg-[#FBD7E5]"
                                                  blinkColor="bg-[#CDEBEB]"
                                                  textColors="text-black"
                                                  boderColors="border-[#f996ab]"
                                                />
                                              </span>
                                              <span
                                                className="lg:col-span-1 col-span-3 py-1 lg:block hidden"

                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={tempData.size}
                                                  color="bg-[#FBD7E5]"
                                                  blinkColor="bg-[#CDEBEB]"
                                                  textColors="text-black"
                                                  boderColors="border-[#f996ab]"
                                                />
                                              </span>
                                            </>
                                          ) : (
                                            <span className="lg:col-span-1 col-span-2 py-1 lg:block hidden">
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#fdc2d6d8]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-black"
                                              />
                                            </span>
                                          )}
                                        </React.Fragment>
                                      ))
                                    ) : null}

                                    <div className="w-full right-0 h-12 absolute bg-[#ECECED] border rounded px-1 flex justify-center items-center">
                                      <div className="2xl:px-8 lg:px-8 px-2 text-nowrap text-xs font-medium opacity-100 text-red-500">
                                        SUSPENDED
                                      </div>
                                    </div>


                                  </div>
                                </div>
                                {!betShowM && hiddenRows.includes(elementtemp.selectionId) && (
                                  <PlaceBetMobile
                                    setStakeModal={setStakeModal}
                                    closeRow={closeRow}
                                    closeSec={elementtemp.selectionId}
                                    matchName={inplayMatch?.matchName}
                                    openBets={openBets}
                                    betSlipData={betSlipData}
                                    placeBet={placeBet}
                                    count={betSlipData.count}
                                    betLoading={betLoading}
                                    increaseCount={increaseCount}
                                    decreaseCount={decreaseCount}
                                  />
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <div className="text-black text-center font-bold py-4">
                              No Runners Available
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                    ) : null
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="md:w-2/6 py-0 h-100">
            {/* <div className="w-full lg:block hidden">
              <BetListComponent
                oddsBetData={oddsBetData}
                fancyBetData={fancyBetData}
                matchName={inplayMatch?.matchName}
              />
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {inplayMatch?.notification && (
        <span className="w-full flex-1 text-xs bg-secondary text-white flex items-center">
          <marquee>{inplayMatch.notification}</marquee>
        </span>
      )}

      {betListModal && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 p-4" />
          <div className="fixed inset-0 flex items-center justify-center px-2 z-50">
            <div className="bg-secondary rounded-lg shadow-lg w-96 border-2 border-button py-2">
              {/* <div className="max-h-96 overflow-y-auto">
                <BetListComponentMobile
                  oddsBetData={oddsBetData}
                  fancyBetData={fancyBetData}
                  matchName={inplayMatch?.matchName}
                  setBetListModal={setBetListModal}
                />
              </div> */}
            </div>
          </div>
        </>
      )}

      {!betShow && !stakeModal && (
        <div className="fixed sm:hidden inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            <BetPlaceDesktop
              setStakeModal={setStakeModal}
              closeRow={closeRow}
              betShow={betShow}
              setBetShow={setBetShow}
              matchName={inplayMatch?.matchName}
              openBets={openBets}
              betSlipData={betSlipData}
              placeBet={placeBet}
              count={betSlipData.count}
              betLoading={betLoading}
              increaseCount={increaseCount}
              decreaseCount={decreaseCount}
            />
          </div>
        </div>
      )}

      <div className="md:flex justify-center w-100 gap-x-1">
        <div className="md:w-2/3 h-100">
          <div className="w-full py-1 bg-secondary">
            <div className="flex py-2 sm:px-2 px-1">
              <div className="flex items-center">
                <div className="w-12 h-12 py-2 px-2 bg-secondary sm:flex items-center justify-center hidden">
                  {sportId == 7 && <img src="/assests/horse.svg" alt="matchInplaY" />}
                  {sportId == 4339 && <img src="/assests/greyhound.svg" alt="matchInplaY" />}
                </div>
              </div>
              <div className="px-2 text-white">
                <div className="w-10 h-10 py-2 px-2 websiteThemeSoundColor sm:hidden items-center justify-center mb-1">
                  {sportId == 7 && <img src="/assests/horse.svg" alt="matchInplaY" />}
                  {sportId == 4339 && <img src="/assests/greyhound.svg" alt="matchInplaY" />}
                </div>
                <div className="sm:text-xs text-[11px] text-white/90 font-medium flex justify-start items-center">
                  <span>
                    {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                      ? moment
                        .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                        .clone()
                        .tz('Asia/Karachi')
                        .format('MMM DD hh:mm A')
                      : '-'}
                  </span>&nbsp; | Winners: 1
                </div>
                <div className="text-lg font-bold">
                  <span>
                    {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                      ? moment
                        .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                        .clone()
                        .tz('Asia/Karachi')
                        .format('hh:mm A')
                      : '-'}
                  </span> {inplayMatch?.sportName || ""}
                </div>
              </div>
              <div className="text-[#00B181] ml-auto px-2 md:text-[26px] text-lg uppercase font-bold">
                {finalSocket && typeof finalSocket === "object" && Object.values(finalSocket).length > 0 ? (
                  Object.values(finalSocket).map((element, index) =>
                    element?.marketType === "Match Odds" ? (
                      <div key={index}>{element?.inplay && element?.status === 'OPEN' ? "InPlay" : element?.status}</div>
                    ) : null
                  )
                ) : null}
              </div>
            </div>
          </div>
          
              <div className="sm:hidden block">
                              {/* <div className="match-container flex text-center bg-secondary py-1 rounded-lg my-2 relative">
                                <div className="w-full">
              
                                  <div className="match-date font-semibold text-gray-200">
                                    {
                                      (() => {
                                        const inputMoment = moment(inplayMatch?.matchDate, "DD-MM-YYYY HH:mm:ss A");
                                        const currentMoment = moment();
                                        return currentMoment.isSameOrAfter(inputMoment) ?
                                          <div className="absolute top-[5px] left-[10px] flex items-center">
                                            <img alt="" src="/assests/in-play-events-icon.png" className="w-5 h-5" />
                                            <span className="text-[#008000] text-[13px] font-signika uppercase">Live</span>
                                          </div>
                                          : '';
                                      })()
                                    }
                                    <span className="md:text-sm text-[13px]">
              
                                      {" "}
                                      {matchMomentPKT.format("DD-MM-YYYY HH:mm:ss")}
                                      
                                    </span>
                                  </div>
                                  <div className="match-teams w-full flex justify-center items-center m-0 mt-1 text-[13px] font-semibold">
                                    <span className="col p-0 text-right">
                                      <span className="inline font-signika text-gray-200">
                                        {team1 ? team1 : "Team 1"}
                                      </span>
                                    </span>
                                    <div className="vs-circle mx-2 bg-yellow-400 px-1.5 py-1 text-[11px] font-signika font-semibold rounded-full">
                                      <div>VS</div>
                                    </div>
                                    <span className="col p-0 text-left">
                                      <span className="inline font-signika text-gray-200">
                                        {team2 ? team2 : "Team 2"}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="match-type mt-1 text-[13px] font-bold ">
                                    <span className="inline font-signika text-gray-200">
                                      {inplayMatch && inplayMatch?.seriesName
                                        ? inplayMatch?.seriesName
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              </div> */}
                              <div
                                className={`market-button flex justify-end text-xs md:text-sm divide-secondary gap-1 my-1 
                                                 `}
                              >
                                <button
                                  onClick={() => setIsScorecardOpen("tv")}
                                  className={`btn-tv-score text-center flex items-center space-x-2 px-5 py-2 font-semibold ${isScorecardOpen === "tv" ? "text-black bg-button" : "text-gray-200 bg-secondary"
                                    }`}
                                >
                                  <FaTv size={17} />
                                  <span>Live Tv</span>
                                </button>
                                
                                <button
                                  onClick={() => setBetListModal(true)}
                                  className={`btn-tv-score text-center bg-secondary flex items-center space-x-2 px-5 py-2 font-semibold text-white`}
                                >
                                  <FaList size={17} />
                                  <span> Bet List</span>
                                </button>
                              </div>
                              <div
                                className={`market-button grid grid-cols-2 gap-2  rounded-md border-2 border-secondary my-1 `}
                              ></div>
                              <div>
                               
                                {inplayMatch.isTv ? (
                                  <>
                                    {isScorecardOpen === "tv" && inplayMatch.tvUrl && (
                                      <div className="bg-secondary w-full rounded-lg border-2 border-secondary">
                                        <div className="flex justify-end items-center px-2">
                                          <div
                                            className="px-2 py-1 text-white bg-red-500 rounded-full text-xs"
                                            onClick={() => setIsScorecardOpen(false)}
                                          >
                                            X
                                          </div>
                                        </div>
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
                                              className="w-[100%] h-[300px]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            </div>
          <div className="bg-[#E6F2FC]">

           
            {inplayMatch?.isMatchOdds ? (
              <>
                {Object.values(finalSocket).map((element, index) => {
                    if (element.marketType !== "Match Odds") {
                        return null;
                      }
                        return (
                    <div key={index}>
                      <div className="rounded-md mt-1">
                        <header className="bg-secondary rounded-t-md z-[1] relative">
                          <div className="items-center flex relative z-0">
                            <div className="flex flex-1">
                              <span className="uppercase items-center px-2 rounded-tl-md bg-button py-1 inline-flex text-sm font-medium text-black">
                                {inplayMatch?.marketName || ""}
                              </span>
                            </div>
                          </div>
                          <div className="items-center flex relative bg-white z-[-1]">
                            <div className="xl:w-2/3 w-1/2 flex">
                              <div className="uppercase px-2 items-center inline-flex text-xs font-bold text-black">
                                {element.runners?.length || 0} Selection
                              </div>
                            </div>
                            <div className="xl:w-1/3 w-1/2 divide-y divide-black rounded-tr-2xl flex flex-wrap justify-center items-center">
                              <div className="grid grid-cols-6 text-[10px] text-black space-x-0.5 py-0.5 w-full rounded-tr-2xl flex-wrap justify-center lg:px-2 px-1 items-center">
                                <span className="md:block hidden"></span>
                                <span className="md:block hidden"></span>
                                <span className="lg:col-span-1 text-nowrap md:col-span-2 col-span-3 lg:col-start-1 font-bold lg:text-right text-center px-1">
                                  Back {"{L}"}
                                </span>
                                <span className="col-span-2 text-nowrap font-bold text-center px-4">
                                  Lay {"{N}"}
                                </span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          </div>

                        </header>
                        <>
                          {element?.runners?.length > 0 ? (
                            element.runners.map((elementtemp, index) => {
                                const matchingMarket = inplayMatch?.marketList?.find(
                    (mkt) => mkt?.marketId === element?.marketId
                  );

                  const selectionInfo = matchingMarket?.selectionIdData?.find(
                    (sel) => sel?.selectionId === elementtemp?.selectionId
                  );

                  const parsedMetaData = selectionInfo?.metaData
      ? JSON.parse(selectionInfo?.metaData)
      : {};
                              return (
                              <React.Fragment key={index}>
                                <div
                                  className={`relative flex whitespace-normal max-w-full ${element?.status === 'CLOSED' && elementtemp?.status === 'WINNER' ? 'bg-[#b7f776]' : ''
                                    }`}
                                >
                                  <div className="w-1/2 lg:w-1/2 flex px-4">
                                    <div className="w-11/12 leading-3 flex items-center text-slate-700">
                                      <span className="text-sm font-bold">
                                        <span className="text-black text-xs font-bold">
                                        
                                                                    <span className="inline-flex items-center gap-1">
                                                                    {parsedMetaData?.CLOTH_NUMBER && <span className="text-base w-5 font-bold">
                                                                      {parsedMetaData?.CLOTH_NUMBER
                                                                        ? `${parsedMetaData.CLOTH_NUMBER}.`
                                                                        : ""}
                                                                    </span>}
                                      
                                                                    <span className="text-base font-bold">
                                                                      {inplayMatch?.countryCode === 'GB' ? <img src={`https://bp-silks.lhre.net/saddle/uk/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt=""/>
                                                                      : inplayMatch?.countryCode === 'US' ? inplayMatch?.countryCode === 'US' && <img src={`https://bp-silks.lhre.net/saddle/us/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt=""/>
                                                                      : <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt=""/>
                                                                    }
                                                  
                                                                      
                                                                    </span>
                                                                    </span>
                                                                    {selectionInfo?.runnerName}
                                                                    &nbsp;
                                          <br />
                                          <span
                                            className={
                                              positionObj[elementtemp.selectionId] > 0
                                                ? "text-green-500"
                                                : positionObj[elementtemp.selectionId] < 0
                                                  ? "text-red-500"
                                                  : "text-green-500"
                                            }
                                          >
                                            {positionObj[elementtemp.selectionId]
                                              ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(2)
                                              : 0}
                                          </span>
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-1/2 lg:w-1/2 grid grid-cols-6 px-2 space-x-0.5 relative">
                                    {elementtemp?.ex?.availableToBack?.length > 0 ? (
                                      <>
                                        {elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                                          <span key={index} className="lg:col-span-1 col-span-2 py-1 lg:block hidden">
                                            <BlinkingComponent
                                              price={tempData.price}
                                              size={tempData.size}
                                              color="bg-[#b7e0f0ff]"
                                              blinkColor="bg-[#CDEBEB]"
                                              textColors="text-black"
                                              boderColors="border-black"
                                            />
                                          </span>
                                        ))}
                                        {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                                          <React.Fragment key={index}>
                                            <span
                                              className="md:col-span-2 sm:col-span-2 col-span-3 md:col-start-3 py-1 lg:hidden block"
                                              onClick={() =>
                                                handleBackOpen({
                                                  data: tempData,
                                                  type: "Yes",
                                                  odds: tempData.price,
                                                  name: elementtemp.selectionName,
                                                  inplayCheck: element.inplay,
                                                  statusCheck: element.status,
                                                  nameOther: element.runners,
                                                  betFor: "matchOdds",
                                                  oddsType: element.marketType,
                                                  betType: "L",
                                                  selectionId: elementtemp.selectionId,
                                                  teamData: tempData.price,
                                                  betfairMarketId: element.marketId,
                                                  price: elementtemp.ex.availableToLay[0]?.price,
                                                  size: elementtemp.ex.availableToLay[0]?.size,
                                                  position: returnDataObject,
                                                  newPosition: returnDataObject,
                                                })
                                              }
                                            >
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#9ECDDF]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-[#489bbd]"
                                              />
                                            </span>
                                            <span
                                              className="lg:col-span-1 col-span-3 py-1 lg:block hidden"
                                              onClick={() => {
                                                toggleRowVisibility(elementtemp.selectionId);
                                                handleBackOpen({
                                                  data: tempData,
                                                  inplayCheck: element.inplay,
                                                  statusCheck: element.status,
                                                  type: "Yes",
                                                  odds: tempData.price,
                                                  name: elementtemp.selectionName,
                                                  nameOther: element.runners,
                                                  betFor: "matchOdds",
                                                  oddsType: element.marketType,
                                                  betType: "L",
                                                  selectionId: elementtemp.selectionId,
                                                  teamData: tempData.price,
                                                  betfairMarketId: element.marketId,
                                                  price: elementtemp.ex.availableToLay[0]?.price,
                                                  size: elementtemp.ex.availableToLay[0]?.size,
                                                  position: returnDataObject,
                                                  newPosition: returnDataObject,
                                                });
                                              }}
                                            >
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#9ECDDF]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-[#489bbd]"
                                              />
                                            </span>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    ) : null}
                                    {elementtemp?.ex?.availableToLay?.length > 0 ? (
                                      elementtemp.ex.availableToLay.map((tempData, index) => (
                                        <React.Fragment key={index}>
                                          {index === 0 ? (
                                            <>
                                              <span
                                                className="md:col-span-2 sm:col-span-2 md:col-start-5 col-span-3 py-1 lg:hidden block"
                                                onClick={() => {
                                                  toggleRowVisibility(elementtemp.selectionId);
                                                  handleBackOpen({
                                                    data: tempData,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    type: "No",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "K",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToBack[0]?.price,
                                                    size: elementtemp.ex.availableToBack[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={tempData.size}
                                                  color="bg-[#FBD7E5]"
                                                  blinkColor="bg-[#CDEBEB]"
                                                  textColors="text-black"
                                                  boderColors="border-[#f996ab]"
                                                />
                                              </span>
                                              <span
                                                className="lg:col-span-1 col-span-3 py-1 lg:block hidden"
                                                onClick={() => {
                                                  toggleRowVisibility(elementtemp.selectionId);
                                                  handleBackOpen({
                                                    data: tempData,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    type: "No",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "K",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToBack[0]?.price,
                                                    size: elementtemp.ex.availableToBack[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={tempData.size}
                                                  color="bg-[#FBD7E5]"
                                                  blinkColor="bg-[#CDEBEB]"
                                                  textColors="text-black"
                                                  boderColors="border-[#f996ab]"
                                                />
                                              </span>
                                            </>
                                          ) : (
                                            <span className="lg:col-span-1 col-span-2 py-1 lg:block hidden">
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={tempData.size}
                                                color="bg-[#fdc2d6d8]"
                                                blinkColor="bg-[#CDEBEB]"
                                                textColors="text-black"
                                                boderColors="border-black"
                                              />
                                            </span>
                                          )}
                                        </React.Fragment>
                                      ))
                                    ) : null}
                                    {elementtemp.status === "REMOVED" && (
                                      <div className="w-full right-0 h-12 absolute bg-[#ECECED] border rounded px-1 flex justify-center items-center">
                                        <div className="2xl:px-8 lg:px-8 px-2 text-nowrap text-xs font-medium opacity-100 text-red-500">
                                          {elementtemp.status}
                                        </div>
                                      </div>
                                    )}
                                    {(element.status === "SUSPENDED" || element.status === "CLOSED") && (
                                      <div className="w-full right-0 h-12 absolute bg-[#ECECED] border rounded px-1 flex justify-center items-center">
                                        <div className="2xl:px-8 lg:px-8 px-2 text-nowrap text-xs font-medium opacity-100 text-red-500">
                                          {element.status}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {!betShowM && hiddenRows.includes(elementtemp.selectionId) && (
                                  <PlaceBetMobile
                                    setStakeModal={setStakeModal}
                                    closeRow={closeRow}
                                    closeSec={elementtemp.selectionId}
                                    matchName={inplayMatch?.matchName}
                                    openBets={openBets}
                                    betSlipData={betSlipData}
                                    placeBet={placeBet}
                                    count={betSlipData.count}
                                    betLoading={betLoading}
                                    increaseCount={increaseCount}
                                    decreaseCount={decreaseCount}
                                  />
                                )}
                              </React.Fragment>
                            )})
                          ) : (
                            <div className="text-black text-center font-bold py-4">
                              No Runners Available
                            </div>
                          )}
                        </>
                      </div>
                    </div>)}
                  
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="md:w-2/6 py-0 h-100">
          <div className="w-full lg:block hidden">
              {inplayMatch.isTv ? (
              <>
                  <div className="bg-white w-full h-72">
                    <div className="details">
                      <div className={`w-full relative md:text-sm text-[10px]`}>
                        <iframe
                          src={
                            inplayMatch && inplayMatch.tvUrl
                              ? inplayMatch.tvUrl
                              : ""
                          }
                          title=" "
                          loading="lazy"
                          className="w-[100%] h-[300px]"
                        />
                      </div>
                    </div>
                  </div>
               
              </>
            ) : null}
            {/* <BetListComponent
              oddsBetData={oddsBetData}
              fancyBetData={fancyBetData}
              matchName={inplayMatch?.matchName}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMatchRacing;