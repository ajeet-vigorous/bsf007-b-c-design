/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import BlinkingComponent from "./BlinkingComponent";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import { AiOutlineDesktop } from "react-icons/ai";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import BackLayDesktop from "../../component/BackLayDesktopDesign/backlaydesktop";
import PlaceBetMobile from "../../component/betplaceMobile/PlaceBetMobile";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonValues from "../buttonvalues/ButtonValues";
import { FaTimes, FaTv } from "react-icons/fa";
import { message } from "antd";
import settings from "../../domainConfig";





const ViewMatches = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [inplayMatch, setInplayMatch] = useState({});
    const [scoreShow, setScoreShow] = useState(true);
    const [tvShow, setTvShow] = useState(false);
    const [betShow, setBetShow] = useState(true);
    const [betShowM, setBetShowM] = useState(true);
    const [isBetListShow, setIsBetListShow] = useState(false);
    const [betShowMobile, setBetShowMobile] = useState(false);
    const [matchScoreDetails, setMatchScoreDetails] = useState({});
    const [matchDetailsForSocketNew, setMatchDetailsForSocketNew] = useState({});
    const [finalSocket, setFinalSocketDetails] = useState({});
    const [otherFinalSocket, setOtherFinalSocketDetails] = useState({});
    const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(false);
    const [hiddenRows, setHiddenRows] = useState([]);
    const [active, setActive] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [betSlipData, setBetSlipData] = useState({
        stake: '0',
        count: 0,
        teamname: '',
        teamData: null
    });


    const [fancyBetData, setFancyBetData] = useState([])
    const [oddsBetData, setOddsBetData] = useState([])
   

    const [returnDataObject, setReturnDataObject] = useState({})
    const [returnDataFancyObject, setReturnDataFancyObject] = useState({})
    const [fancypositionModal, setFancypositionModal] = useState(false);
    const [positionData, setPositionData] = useState({});
    const [betLoading, setBetLoading] = useState(false)
    const scrollRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socketState, setSocketState] = useState(null);

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

    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const openRulesModal = () => setIsRulesOpen(true);
    const closeRulesModal = () => setIsRulesOpen(false);
    const [isScorecardOpen, setIsScorecardOpen] = useState(true);
    const [fullscreen, setFullScreen] = useState(false);


    // const [betPlaceModalMobile, setBetPlaceModalMobile] = useState(false);


    // let { marketId, eventId } = useParams();
    const { marketId, eventId, sportId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const gameDetailOtherPart = pathname.includes('viewMatchDetail');
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

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])


    let data = localStorage.getItem(`${marketId}_BookmakerData`)
    const setDataFromLocalstorage = async (marketId) => {
        if (data) {
            setMatchScoreDetails(JSON.parse(data).result);
        } else {
            setMatchScoreDetails("");
        }
    }

    const setMatchDataFromLocalstorage = async () => {
        let data = localStorage.getItem(`${eventId}_MatchOddsData`)


        if (!data) {
            return null
        }
        else {
            setFinalSocketDetails(JSON.parse(data));
        }
    }

 


    useEffect(() => {
        setDataFromLocalstorage()
        setMatchDataFromLocalstorage()
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
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
                completeFancy[key].pos = pos

                showCompletedFancy.push(data);
            });


            const finalPositionInfo = {};
            sortedOddsBetData && sortedOddsBetData.forEach(item => {
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

            filteredFancyBetData.forEach(item => {
                const selectionId = item.selectionId;
                const loss = item.loss;

                if (finalPositionInfoFancy[selectionId]) {
                    finalPositionInfoFancy[selectionId] += loss;
                } else {

                    finalPositionInfoFancy[selectionId] = loss;
                }
            });




            setFancyPositionObj(finalPositionInfoFancy)
            setFancybetData(filteredFancyBetData);


            setPositionObj(finalPositionInfo)
            setOddsbetData(sortedOddsBetData);
            setCompletedFancy(showCompletedFancy);
            setIncompletedFancy(
                filteredFancyBetData && filteredFancyBetData.length > 0
                    ? filteredFancyBetData.filter((element) => element.isDeclare === 0)
                    : []
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

    }, [fancypositionModal])






    const setupAsyncActions = async (marketId) => {
        await getMatchDataByMarketID(marketId);
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
            const resData = {
                marketId: marketId,
            };
            const inplayMatchResponse = await apiCall("POST", "sports/sportByMarketId", resData);
            if (inplayMatchResponse && inplayMatchResponse.data) {
                setInplayMatch(inplayMatchResponse.data);
                const data = inplayMatchResponse?.data;

                if (inplayMatchResponse?.data?.socketPerm) {
                    callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse.data?.sportId);
                } else {
                    callCache(inplayMatchResponse?.data?.cacheUrl);
                }

                // callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse?.data?.socketPerm, inplayMatchResponse?.data?.cacheUrl);

            }
        } catch (error) {
            console.error("Error fetching inplay data:", error);
        }
        finally {
            setIsLoading(false);

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


        setminMaxCoins({
            max: maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });
        setSessionCoin({
            max: maxCoinData?.maximum_session_bet,
            min: maxCoinData?.minimum_session_bet,
        });


        setIsTieCoin({
            max: maxCoinData?.maximum_tie_coins > 0 ? maxCoinData?.maximum_tie_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });

        setIsTossCoin({
            max: maxCoinData?.maximum_toss_coins > 0 ? maxCoinData?.maximum_toss_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });

        setIsMatchCoin({
            max: maxCoinData?.maximum_matchOdds_coins > 0 ? maxCoinData?.maximum_matchOdds_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });



    }, [inplayMatch]);


    const callSocket = async (socketUrl, matchId) => {


        if (socketState && socketState.connected) {
            return;
        }
        try {
            const socket = io.connect(socketUrl, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 99,
            });

            socket.emit(`marketByEvent`, eventId);
            socket.on(eventId, (data) => {
                localStorage.setItem(`${eventId}_MatchOddsData`, data)
                setMatchDetailsForSocketNew(JSON.parse(data));
                setIsConnected(true);
                filterData(JSON.parse(data));
            });

            if (matchId === 4 || matchId === 999) {
                socket.emit("JoinRoom", marketId);
                socket.on(marketId, (data) => {
                    localStorage.setItem(`${marketId}_BookmakerData`, data);
                    setMatchScoreDetails(JSON.parse(data).result);
                });
            }



            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            setSocketState(socket);

        }

        catch (error) {
            console.error("Error in socket connection:", error);
        }
    };


    const callCache = async (cacheUrl) => {
        try {
            const interval = setInterval(async () => {
                await getMarketCacheUrl(cacheUrl);
            }, 1000);
            return () => clearInterval(interval);
        } catch (error) {
            console.error("Error calling cache:", error);
        }
    };

    const getMarketCacheUrl = async (cacheUrl) => {
        try {
            // if (!cacheUrl) {
            //   console.error("Cache URL is undefined or null");
            //   return; // Exit early if cacheUrl is undefin
            // }

            const response = await axios.get(cacheUrl);
            localStorage.setItem(`${marketId}_BookmakerData`, JSON.stringify(response.data))
            setMatchScoreDetails(response.data.result);


        } catch (error) {
            console.error("Error fetching cache data:", error);
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
                    criteria.includes(item.marketType)
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
                ? matchDetailsForSocketNew.filter((item) =>
                    !criteria.includes(item.marketType)
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
    }

    const handleOnClick = () => {
        navigate("/");
    };

    // const handelScoreModal = () => {
    //   setScoreShow(!scoreShow);
    // };

    const handelScoreModal = () => {
        setScoreShow(true);
        setTvShow(false);
        setBetShowMobile(false)
    };
    const handelTvModal = () => {
        setTvShow(!tvShow);
        setScoreShow(false);
        setBetShowMobile(false)

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
        // setBetPlaceModalMobile(true)
        if (data) {
            setBetShow(false);
            setBetShowM(false);
            setBetSlipData({
                ...data,
                stake: '0',
                count: data.odds,
                teamname: data.name,
                teamData: data.teamData
            });
        }
    };
    const handleBackclose = () => {



        setBetSlipData({
            stake: '0',
            count: 0,
            teamname: '',
            teamData: null,
            name: ""
        });

    };

    const toggleRowVisibility = (id) => {
        if (hiddenRows.includes(id)) {
            setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
        } else {
            setHiddenRows([...hiddenRows, id]);
        }
    };



    const userPositionByMarketId = async () => {

        const positionByMarketId = {
            marketId: marketId,
        };
        try {
            const userPositionData = await apiCall("POST", 'sports/userPositionByMarketId', positionByMarketId);
            if (userPositionData) {
                const getUserPositionItem = userPositionData.data;
                let oddsPos = [];
                let sessPos = [];
                let returnDataObject = {};
                let returnDataFancyObject = {};

                if (getUserPositionItem?.oddsPosition) {
                    oddsPos = getUserPositionItem.oddsPosition;
                    oddsPos.forEach(data => {
                        const hasKey = returnDataObject.hasOwnProperty(data._id);
                        if (!hasKey) {
                            returnDataObject[data._id] = data.totalPosition.toFixed(2);
                            setReturnDataObject(returnDataObject);

                        }
                    });
                }

                if (getUserPositionItem?.sessionPosition) {
                    sessPos = getUserPositionItem.sessionPosition;
                    sessPos.forEach(data => {
                        const hasKey = returnDataFancyObject.hasOwnProperty(data._id);
                        if (!hasKey) {
                            returnDataFancyObject[data._id] = data.position;
                            setReturnDataFancyObject(returnDataFancyObject);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user position:', error);
            throw error;
        }
    };

    const placeBet = async () => {
        if (betSlipData.stake <= 0) {
            return;
        }



        try {
            const betObject = {
                "odds": betSlipData.count + "",
                "amount": betSlipData.stake,
                "selectionId": betSlipData.selectionId + "",
                "marketId": marketId + "",
                "eventId": eventId,
                "betFor": betSlipData.betFor + "",
                "run": betSlipData.run ? betSlipData.run + "" : "0",
                "oddsType": betSlipData.oddsType === "Match Odds" ? "matchOdds" : betSlipData.oddsType === "Tied Match" ? "tiedMatch" : betSlipData.oddsType + "",
                "type": betSlipData.betType + "",
            };
            if (betSlipData.oddsType === "fancy") {
                const allowedFancyTypes = ['khado', 'fancy1', 'oddeven', 'meter', 'Over By Over'];
                betObject["fancyType"] = allowedFancyTypes.includes(betSlipData.fancyType)
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
            setBetLoading(true)

            if (betSlipData.oddsType === "fancy") {
                let saveBetOdds = await apiCall("POST", "sports/sessionBetPlaced", betObject);
                setBetLoading(true)
                setBetShow(false)
                setBetShowM(false)
                if (!saveBetOdds.error) {

                    setSuccessMessage(saveBetOdds?.message)
                    message.success(saveBetOdds?.message, 2);

                    await fetchBetLists()
                    await matchOddsPos()
                    setBetLoading(false)

                } else {
                    setBetLoading(false)

                    message.error("Sorry, your bet couldn't be placed. " + saveBetOdds?.message, 2);
                }
            } else {
                let saveBetOdds = await apiCall("POST", "sports/oddBetPlaced", betObject);

                setBetLoading(true)
                setBetShow(false);
                setBetShowM(false);
                setSuccessMessage(saveBetOdds?.message);


                if (!saveBetOdds.error) {
                    setBetLoading(false)
                    message.success(saveBetOdds?.message, 2);

                    await fetchBetLists()
                    await matchOddsPos()

                } else {

                    setBetLoading(false)
                    message.error("Sorry, your bet couldn't be placed.", 2);
                }
            }

        } catch (error) {
            setBetLoading(false)
            console.error('Error placing bet:', error.data.message);
            setErrorMessage(error.data.message);
            message.error('Error placing bet: ' + error.data.message, 2);
        } finally {
            setBetLoading(false)
            handleBackclose()
            closeRow()
            openBets()
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
            if (userBetHistory && userBetHistory.data) {
                const { fancyBetData, oddsBetData } = userBetHistory.data;
                const filteredFancyBetData = fancyBetData ? fancyBetData.filter(element => element.isDeclare === 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                const sortedOddsBetData = oddsBetData ? oddsBetData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                setFancyBetData(filteredFancyBetData)
                setOddsBetData(sortedOddsBetData)
                setPositionBetData(userBetHistory.data)
                // return { fancyBetData: filteredFancyBetData, oddsBetData: sortedOddsBetData };
            }
        } catch (error) {
            console.error('Error fetching bet lists:', error);
            throw error;
        }
    };


    const matchOddsPos = async () => {
        let matchOddsPos = await apiCall("POST", 'reports/matchOddsRunningPos');
        if (matchOddsPos) {
            localStorage.setItem('matchOddsRunningPos', JSON.stringify(matchOddsPos.data));
        }
    }



    const handleFancyPositionModal = (data) => {

        try {
            setFancypositionModal(!fancypositionModal);
            setPositionData(data);
        } catch (error) {
            console.error('Error handling fancy position modal:', error);
        }
    };

    const handleClose = () => {
        setFancypositionModal(false)
    };


    const closeRow = (id) => {
        setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
    }



    const increaseCount = () => {
        try {
            setBetSlipData(prevData => {
                const newCount = parseFloat(prevData.count) + 0.01;
                return {
                    ...prevData,
                    count: newCount.toFixed(2)
                };
            });
        } catch (error) {
            console.error('Error increasing count:', error);
        }
    };
    const openBetInMobile = () => {
        setBetShowMobile(!betShowMobile)
        setTvShow(false);
        setScoreShow(false);
    }
    const decreaseCount = () => {
        try {
            setBetSlipData(prevData => {
                const newCount = parseFloat(prevData.count) - 0.01;
                return {
                    ...prevData,
                    count: newCount.toFixed(2)
                };
            });
        } catch (error) {
            console.error('Error decreasing count:', error);
        }
    };


    let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

    function getMatchStatus(matchDate) {
        if (!matchDate) return '';
        const currentTime = moment();
        const matchTime = moment(matchDate, 'DD-MM-YYYY HH:mm:ss');

        if (!matchTime.isValid()) {
            console.error("Invalid match date format.");
            return 'Invalid Date';
        }

        if (currentTime.isBefore(matchTime)) {
            return 'OPEN';
        } else {
            return 'INPLAY';
        }
    }

    const [buttonValue, setbuttonValue] = useState(false);

    const handleButtonValues = (e) => {
        setbuttonValue((prev) => !prev);
        document.body.classList.toggle("StakeModalOpen");
        e.stopPropagation();
    };

    const [matchTab, setMatchTab] = useState(1);


    const handleMatchClick = (tabNumber) => {
        setMatchTab(tabNumber);
    };

    // const formatNumberinK = (number) => {
    //     if (!number) return
    //     const digit = Number(number)
    //     if (digit >= 1000) {
    //         return (digit / 1000).toFixed(digit % 1000 === 0 ? 0 : 1) + 'K';
    //     }
    //     return digit?.toString();
    // };

    const formatNumber = (number) => {
        if (!number) return;
        const digit = Number(number);

        if (digit >= 1000000) {
            return (digit / 1000000).toFixed(digit % 1000000 === 0 ? 0 : 1) + 'M';
        } else if (digit >= 100000) {
            return (digit / 100000).toFixed(digit % 100000 === 0 ? 0 : 1) + 'L';
        } else if (digit >= 1000) {
            return (digit / 1000).toFixed(digit % 1000 === 0 ? 0 : 1) + 'K';
        } else {
            return digit.toString();
        }
    };

    const NormalFancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'Normal')
    const KhadoFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'khado')
    const Fancy1Fancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'fancy1')
    const OddEvenFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'oddeven')
    const bookmaker2Fancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'Bookmaker 2')
    const MeterFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'meter')
    const OverByOverFancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'Over By Over')
    const cCFilterData = matchScoreDetails?.meterKhadoSession?.filter(item => item.gtype === "cricketcasino");
    const groupedData = cCFilterData?.reduce((acc, item) => {
        const key = item.fancyType;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});


    // console.log(groupedData, "hhhhhhhhhhhhhhh");
    // console.log(bookmaker2Fancy, "Fancy1FancyFancy1FancyFancy1Fancy");





    return (isLoading ? <span className="animate-spin h-5 w-5"></span> :
        <div>
            {isRulesOpen && <div>Rule</div>}
            {inplayMatch && inplayMatch?.notification && (
                <span className="w-full flex-1 text-xs websiteThemeSoundColor  text-black flex items-center">
                    <marquee className="">{inplayMatch?.notification}</marquee>
                </span>
            )}
            {betSlipData?.name && <PlaceBetMobile
                openBets={openBets}
                closeRow={closeRow}
                matchName={inplayMatch?.matchName}
                betSlipData={betSlipData}
                placeBet={placeBet}
                errorMessage={errorMessage}
                successMessage={successMessage}
                count={betSlipData.count}
                betLoading={betLoading}
                increaseCount={increaseCount}
                decreaseCount={decreaseCount}
                handleClose={handleBackclose}
                setBetSlipData={setBetSlipData}
                handleButtonValues={handleButtonValues}
                isMatchCoin={isMatchCoin}
            />}

            {/* {buttonValue && (
                <div
                    onClick={(e) => {
                        handleButtonValues();
                        e.stopPropagation();
                    }}
                    className="fixed top-0  bg-black bg-opacity-55 left-0 w-full h-full flex items-start justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="lg:w-[28%] md:w-[50%] w-full lg:p-2   "
                    >
                        <ButtonValues />
                    </div>
                </div>
            )} */}

            <div className="xl:hidden block">
                {inplayMatch &&
                    inplayMatch?.matchName ? (
                    <div className="bg-[var(--secondary)] item-center px-2 py-1 flex justify-between">
                        <span className="text-white text-[12px] font-semibold">{inplayMatch?.matchName}</span>
                        <span className="text-white text-[12px] font-semibold"> {inplayMatch?.matchDate}</span>
                    </div>
                ) : null}
            </div>

            <div className="flex justify-between items-center xl:hidden whitespace-nowrap w-full border-t-[1px] border-black/30 bg-[var(--primary)] text-white">

                <button
                    onClick={() => handleMatchClick(1)}
                    className={` ${matchTab === 1 ? "border-t-[1px]" : ""} border-white px-3 py-2 text-center uppercase shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span>odds</span>
                </button>
                <button
                    onClick={() => handleMatchClick(2)}
                    className={`${matchTab === 2 ? "border-t-[1px]" : ""} border-white  border-l-[1px] pr-3 py-2 text-center uppercase shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span className=''>Matched Bets</span>
                </button>
                <button
                    // onClick={() => handleMatchClick(3)}
                    onClick={() => {
                        handleMatchClick(3);
                        handelTvModal();
                    }}
                    className={`${matchTab === 3 ? "border-t-[1px]" : ""} border-white  border-l-[1px] pr-3 py-2 text-center uppercase flex justify-center items-center shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span className=''><FaTv size={18} /></span>
                </button>

            </div>

            <div className="md:flex justify-center text-black  h-full  w-100 gap-x-1">
                {(matchTab === 1 || matchTab === 3) && (
                    <div className="xl:w-[calc(100%-402px)] 2xl:w-[calc(100%-452px)] w-full overflow-y-auto p-0">
                        <div className="">
                            {matchTab === 3 && (
                                <div className="xl:hidden block">
                                    {/* <div className="bg-[var(--secondary)] cursor-pointer flex justify-between items-center py-1.5 px-4 text-white text-sm font-semibold" onClick={() => handelTvModal()}>
                                        <span>Live Match</span>
                                        <button className="flex justify-end space-x-2 font-semibold" > </button>
                                    </div> */}
                                    {inplayMatch?.isTv ? <>
                                        {tvShow && <div className="bg-white w-full h-48">
                                            <div className="details">
                                                <div className={`w-full relative md:text-sm text-[10px]`}>
                                                    <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                                </div>
                                            </div>
                                        </div>}
                                    </>
                                        : null}
                                </div>
                            )}

                            <div className="xl:block hidden">
                                {inplayMatch &&
                                    inplayMatch?.matchName ? (
                                    <div className="bg-[var(--secondary)] item-center px-2 py-1.5 flex justify-between">
                                        <span className="text-white text-[14px] font-semibold">{inplayMatch?.matchName}</span>
                                        <span className="text-white text-[14px] font-semibold"> {inplayMatch?.matchDate}</span>
                                    </div>
                                ) : null}
                            </div>
                            <div className="xl:hidden block"
                            // style={{ background: 'linear-gradient(#060a2a, #521d31 160%)' }}
                            >
                                {isScorecardOpen && inplayMatch.isScore && (
                                    <div className="border-2 border-secondary rounded-lg ">
                                        <div className="flex justify-between items-center py-0 px-2 bg-[var(--primary)] ">
                                            <div
                                                onClick={() => setFullScreen((state) => !state)}
                                                className="text-white bg-button rounded-sm px-2 py-1 text-xs font-semibold"
                                            >
                                                {fullscreen ? "HS" : "FS"}
                                            </div>
                                            <div
                                                className="px-2 py-1 text-white text-xs"
                                                onClick={() => handleScore()}
                                            >
                                                <FaTimes size={13} />
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
                                                        src={inplayMatch && inplayMatch.scoreIframe ? inplayMatch.scoreIframe : ""}
                                                        title=" "
                                                        loading="lazy"
                                                        className={`w-[100%] ${fullscreen ? "h-[220px]" : "h-[110px]"
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {inplayMatch?.isMatchOdds && (activeTab === "all") ? (
                                <>
                                    {Object.values(finalSocket).map((element, index) => element.marketType == "Match Odds" && (

                                        <div className="" key={index}>
                                            <header className="mt-1">
                                                <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                    <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                        Match_Odds
                                                    </div>
                                                    <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                                </div>
                                            </header>
                                            <div
                                                className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}

                                            >
                                                <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">

                                                    <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                                                        <span class="text-[12px] font-bold">
                                                            Max: {formatNumber(isMatchCoin?.max)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                    </span>
                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                    </span>
                                                    <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                        <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                            <div className='text-center leading-3'>
                                                                <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                            </div>
                                                        </div>
                                                    </span>
                                                    <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                        <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                            <div className='text-center leading-3'>
                                                                <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span><br />

                                                            </div>
                                                        </div>
                                                    </span>
                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                    </span>
                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                    </span>


                                                </div>
                                            </div>

                                            {element && element.runners && element.runners.length > 0 ? element.runners.map((elementtemp, index) => (
                                                <>
                                                    <div
                                                        className={`  flex whitespace-normal max-w-full border-b border-gray-300`}
                                                        key={index}
                                                    >
                                                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                                                            {/* w-11/12  */}
                                                            <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                                                                <span class="text-[13px] font-bold">
                                                                    <span>{elementtemp.selectionName} <br />
                                                                        <div key={index} className={positionObj[elementtemp.selectionId] > 0 ? 'text-[var(--success-color)] !mt-2' : positionObj[elementtemp.selectionId] < 0 ? 'text-red-500 !mt-2' : 'black'} >
                                                                            {/* {returnDataObject[elementtemp.selectionId] !== 0 ? returnDataObject[elementtemp.selectionId] : "-"} */}

                                                                            {positionObj[elementtemp.selectionId] ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(2) : ''}

                                                                        </div>
                                                                    </span>


                                                                </span>
                                                            </div>


                                                        </div>

                                                        <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6 ">

                                                            {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                                                <>
                                                                    {elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                                                                        <span className="lg:col-span-1 col-span-3 rounded-md  lg:block hidden">
                                                                            <BlinkingComponent
                                                                                price={tempData.price}
                                                                                size={tempData.size}
                                                                                color={"bg-[#E6F2FC]"}
                                                                                blinkColor={"bg-[#00B2FF]"}
                                                                                hoverColor={"bg-sky-600"}
                                                                            />
                                                                        </span>

                                                                    ))}
                                                                </>
                                                            ) : null}

                                                            {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                                                <>
                                                                    {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                                                                        <>

                                                                            <span className="md:col-span-3 sm:col-span-3 rounded-md col-span-3 lg:hidden block cursor-pointer"
                                                                                onClick={() => {
                                                                                    handleBackOpen({
                                                                                        data: tempData,
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
                                                                                        price: elementtemp.ex.availableToLay[0].price,
                                                                                        size: elementtemp.ex.availableToLay[0].size,
                                                                                        position: returnDataObject,
                                                                                        newPosition: returnDataObject
                                                                                    });

                                                                                }}
                                                                            >
                                                                                <BlinkingComponent
                                                                                    price={tempData.price}
                                                                                    size={tempData.size}
                                                                                    color={"bg-[#8DD2F0]"}
                                                                                    blinkColor={"bg-[#00B2FF]"}
                                                                                />
                                                                            </span>
                                                                            <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                                                                onClick={() => {

                                                                                    handleBackOpen({
                                                                                        data: tempData,
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
                                                                                        price: elementtemp.ex.availableToLay[0].price,
                                                                                        size: elementtemp.ex.availableToLay[0].size,
                                                                                        position: returnDataObject,
                                                                                        newPosition: returnDataObject
                                                                                    })
                                                                                }}
                                                                            >
                                                                                <BlinkingComponent
                                                                                    price={tempData.price}
                                                                                    size={tempData.size}
                                                                                    color={"bg-[#8DD2F0]"}
                                                                                    blinkColor={"bg-[#00B2FF]"}
                                                                                />
                                                                            </span>
                                                                        </>

                                                                    ))}
                                                                </>
                                                            ) : null}

                                                            {elementtemp &&
                                                                elementtemp.ex &&
                                                                elementtemp.ex.availableToLay &&
                                                                elementtemp.ex.availableToLay.length >
                                                                0 ? (
                                                                elementtemp.ex.availableToLay.map(
                                                                    (tempData, index) => (
                                                                        <>
                                                                            {index === 0 ? (
                                                                                <>
                                                                                    <span className="lg:col-span-1 col-span-3 rounded-md lg:hidden  cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(elementtemp.selectionId);
                                                                                            handleBackOpen({
                                                                                                data: tempData,
                                                                                                type: "No",
                                                                                                odds: tempData.price,
                                                                                                name: elementtemp.selectionName,
                                                                                                nameOther: element.runners,
                                                                                                betFor: "matchOdds", oddsType: element.marketType,
                                                                                                betType: "K",
                                                                                                selectionId: elementtemp.selectionId,
                                                                                                teamData: tempData.price,
                                                                                                betfairMarketId: element.marketId,
                                                                                                price: elementtemp.ex.availableToBack[0].price,
                                                                                                size: elementtemp.ex.availableToBack[0].size,
                                                                                                position: returnDataObject,
                                                                                                newPosition: returnDataObject
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        <BlinkingComponent
                                                                                            price={tempData.price}
                                                                                            size={tempData.size}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                        />
                                                                                    </span>

                                                                                    <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                                                                        onClick={() => {

                                                                                            handleBackOpen({

                                                                                                data: tempData,
                                                                                                type: "No",
                                                                                                odds: tempData.price,
                                                                                                name: elementtemp.selectionName,
                                                                                                nameOther: element.runners,
                                                                                                betFor: "matchOdds", oddsType: element.marketType,
                                                                                                betType: "K",
                                                                                                selectionId: elementtemp.selectionId,
                                                                                                teamData: tempData.price,
                                                                                                betfairMarketId: element.marketId,
                                                                                                price: elementtemp.ex.availableToBack[0].price,
                                                                                                size: elementtemp.ex.availableToBack[0].size,
                                                                                                position: returnDataObject,
                                                                                                newPosition: returnDataObject
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        <BlinkingComponent
                                                                                            price={tempData.price}
                                                                                            size={tempData.size}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                        />
                                                                                    </span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden"

                                                                                    >
                                                                                        <BlinkingComponent
                                                                                            price={tempData.price}
                                                                                            size={tempData.size}
                                                                                            color={"bg-[#FCE3E4]"}
                                                                                            blinkColor={"bg-[#CDEBEB]"}
                                                                                        />
                                                                                    </span>
                                                                                </>

                                                                            )}
                                                                        </>
                                                                    )
                                                                )) : null}
                                                        </div>
                                                    </div>
                                                </>
                                            )) : null}
                                        </div>
                                    ))}
                                </>
                            ) : null}
                            <>
                                {(activeTab === "all" || activeTab === "other") ? (
                                    <>
                                        {Object.values(otherFinalSocket).map(
                                            (element, index) =>
                                                element.marketType !== "Tied Match" && element.marketType !== "Match Odds" && element.marketType !== "To Win the Toss" && element.marketType !== "Completed Match" && (
                                                    <div>
                                                        <header className="mt-1 ">
                                                            <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-2 px-2">
                                                                <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                                    {element && element.marketType
                                                                        ? element.marketType
                                                                        : "NA"}
                                                                </div>
                                                                <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                                            </div>
                                                        </header>
                                                        <div
                                                            className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}

                                                        >
                                                            <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">

                                                                <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                                                                    <span class="text-[12px] font-bold">
                                                                        Max: {formatNumber(isTieCoin?.max)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">

                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                                </span>
                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                                </span>
                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                                </span>
                                                                <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                                </span>


                                                            </div>
                                                        </div>
                                                        <>
                                                            {element && element.runners && element.runners.length > 0 ? element.runners.map((elementtemp, index) => (
                                                                <>
                                                                    <div
                                                                        className={`  flex whitespace-normal max-w-full`}
                                                                    >
                                                                        <div className="lg:w-1/2 xl:w-[65%] w-[65%] flex px-2">
                                                                            {/* w-11/12  */}
                                                                            <div className="w-full py-1 leading-3 flex items-center text-[#2B2f35]">
                                                                                <span class="text-[14px] font-bold">
                                                                                    <span className="">{elementtemp.selectionName
                                                                                    }{" "}
                                                                                        <div
                                                                                            key={index}
                                                                                            className={
                                                                                                positionObj[
                                                                                                    elementtemp
                                                                                                        .selectionId
                                                                                                ] > 0
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : positionObj[
                                                                                                        elementtemp
                                                                                                            .selectionId
                                                                                                    ] < 0
                                                                                                        ? "text-red-500 mt-2"
                                                                                                        : "text-[var(--success-color)] mt-2"
                                                                                            }
                                                                                        >
                                                                                            {/* {returnDataObject[elementtemp.selectionId] !== 0 ? returnDataObject[elementtemp.selectionId] : "-"} */}

                                                                                            {positionObj[
                                                                                                elementtemp
                                                                                                    .selectionId
                                                                                            ]
                                                                                                ? (
                                                                                                    Math.floor(
                                                                                                        Number(
                                                                                                            positionObj[
                                                                                                            elementtemp
                                                                                                                .selectionId
                                                                                                            ]
                                                                                                        ) * 100
                                                                                                    ) / 100
                                                                                                ).toFixed(2)
                                                                                                : ''}
                                                                                        </div>
                                                                                    </span>


                                                                                </span>
                                                                            </div>


                                                                        </div>

                                                                        <div className="lg:w-1/2 xl:w-[35%] w-[35%] grid grid-cols-6 gap-x-1 ">

                                                                            {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                                                                <>
                                                                                    {elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                                                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                                                            <BlinkingComponent
                                                                                                price={tempData.price}
                                                                                                size={tempData.size}
                                                                                                color={"bg-[#E6F2FC]"}
                                                                                                blinkColor={"bg-[#00B2FF]"}
                                                                                                hoverColor={"bg-sky-600"}
                                                                                            />
                                                                                        </span>

                                                                                    ))}
                                                                                </>
                                                                            ) : null}

                                                                            {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                                                                <>
                                                                                    {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                                                                                        <>
                                                                                            <span className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block cursor-pointer"
                                                                                                onClick={() => {
                                                                                                    handleBackOpen(
                                                                                                        {
                                                                                                            data: tempData,
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
                                                                                                            price: elementtemp.ex
                                                                                                                .availableToLay[0]
                                                                                                                .price,
                                                                                                            size: elementtemp
                                                                                                                .ex
                                                                                                                .availableToLay[0]
                                                                                                                .size,
                                                                                                            position:
                                                                                                                returnDataObject,
                                                                                                            newPosition:
                                                                                                                returnDataObject,
                                                                                                        }
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <BlinkingComponent
                                                                                                    price={tempData.price}
                                                                                                    size={tempData.size}
                                                                                                    color={"bg-[#8DD2F0]"}
                                                                                                    blinkColor={"bg-[#00B2FF]"}
                                                                                                />
                                                                                            </span>
                                                                                            <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                                                                                onClick={() => {

                                                                                                    handleBackOpen(
                                                                                                        {
                                                                                                            data: tempData,
                                                                                                            type: "Yes",
                                                                                                            odds: tempData.price,
                                                                                                            name: elementtemp.selectionName,
                                                                                                            nameOther:
                                                                                                                element.runners,
                                                                                                            betFor:
                                                                                                                "matchOdds",
                                                                                                            oddsType:
                                                                                                                element.marketType,
                                                                                                            betType:
                                                                                                                "L",
                                                                                                            selectionId:
                                                                                                                elementtemp.selectionId,
                                                                                                            teamData:
                                                                                                                tempData.price,
                                                                                                            betfairMarketId:
                                                                                                                element.marketId,
                                                                                                            price:
                                                                                                                elementtemp
                                                                                                                    .ex
                                                                                                                    .availableToLay[0]
                                                                                                                    .price,
                                                                                                            size: elementtemp
                                                                                                                .ex
                                                                                                                .availableToLay[0]
                                                                                                                .size,
                                                                                                            position:
                                                                                                                returnDataObject,
                                                                                                            newPosition:
                                                                                                                returnDataObject,
                                                                                                        }
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <BlinkingComponent
                                                                                                    price={tempData.price}
                                                                                                    size={tempData.size}
                                                                                                    color={"bg-[#8DD2F0]"}
                                                                                                    blinkColor={"bg-[#00B2FF]"}
                                                                                                />
                                                                                            </span>
                                                                                        </>

                                                                                    ))}
                                                                                </>
                                                                            ) : null}

                                                                            {elementtemp &&
                                                                                elementtemp.ex &&
                                                                                elementtemp.ex.availableToLay &&
                                                                                elementtemp.ex.availableToLay.length >
                                                                                0 ? (
                                                                                elementtemp.ex.availableToLay.map(
                                                                                    (tempData, index) => (
                                                                                        <>
                                                                                            {index === 0 ? (
                                                                                                <>
                                                                                                    <span className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3  lg:hidden block cursor-pointer"
                                                                                                        onClick={() => {

                                                                                                            handleBackOpen(
                                                                                                                {
                                                                                                                    data: tempData,
                                                                                                                    type: "No",
                                                                                                                    odds: tempData.price,
                                                                                                                    name: elementtemp.selectionName,
                                                                                                                    nameOther:
                                                                                                                        element.runners,
                                                                                                                    betFor:
                                                                                                                        "matchOdds",
                                                                                                                    oddsType:
                                                                                                                        element.marketType,
                                                                                                                    betType:
                                                                                                                        "K",
                                                                                                                    selectionId:
                                                                                                                        elementtemp.selectionId,
                                                                                                                    teamData:
                                                                                                                        tempData.price,
                                                                                                                    betfairMarketId:
                                                                                                                        element.marketId,
                                                                                                                    price:
                                                                                                                        elementtemp
                                                                                                                            .ex
                                                                                                                            .availableToBack[0]
                                                                                                                            .price,
                                                                                                                    size: elementtemp
                                                                                                                        .ex
                                                                                                                        .availableToBack[0]
                                                                                                                        .size,
                                                                                                                    position:
                                                                                                                        returnDataObject,
                                                                                                                    newPosition:
                                                                                                                        returnDataObject,
                                                                                                                }
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        <BlinkingComponent
                                                                                                            price={tempData.price}
                                                                                                            size={tempData.size}
                                                                                                            color={"bg-[#FEAFB2]"}
                                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                                        />
                                                                                                    </span>

                                                                                                    <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                                                                                        onClick={() => {
                                                                                                            handleBackOpen(
                                                                                                                {
                                                                                                                    data: tempData,
                                                                                                                    type: "No",
                                                                                                                    odds: tempData.price,
                                                                                                                    name: elementtemp.selectionName,
                                                                                                                    nameOther:
                                                                                                                        element.runners,
                                                                                                                    betFor:
                                                                                                                        "matchOdds",
                                                                                                                    oddsType:
                                                                                                                        element.marketType,
                                                                                                                    betType:
                                                                                                                        "K",
                                                                                                                    selectionId:
                                                                                                                        elementtemp.selectionId,
                                                                                                                    teamData:
                                                                                                                        tempData.price,
                                                                                                                    betfairMarketId:
                                                                                                                        element.marketId,
                                                                                                                    price:
                                                                                                                        elementtemp
                                                                                                                            .ex
                                                                                                                            .availableToBack[0]
                                                                                                                            .price,
                                                                                                                    size: elementtemp
                                                                                                                        .ex
                                                                                                                        .availableToBack[0]
                                                                                                                        .size,
                                                                                                                    position:
                                                                                                                        returnDataObject,
                                                                                                                    newPosition:
                                                                                                                        returnDataObject,
                                                                                                                }
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        <BlinkingComponent
                                                                                                            price={tempData.price}
                                                                                                            size={tempData.size}
                                                                                                            color={"bg-[#FEAFB2]"}
                                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                                        />
                                                                                                    </span>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden"

                                                                                                    >
                                                                                                        <BlinkingComponent
                                                                                                            price={tempData.price}
                                                                                                            size={tempData.size}
                                                                                                            color={"bg-[#FCE3E4]"}
                                                                                                            blinkColor={"bg-[#CDEBEB]"}
                                                                                                        />
                                                                                                    </span>
                                                                                                </>

                                                                                            )}
                                                                                        </>
                                                                                    )
                                                                                )) : null}
                                                                        </div>
                                                                    </div>



                                                                </>
                                                            )) : null}
                                                        </>

                                                    </div>
                                                )
                                        )}
                                    </>
                                ) : null}
                            </>


                            {inplayMatch?.isBookmaker &&
                                (activeTab === "bookmaker" || activeTab === "all") ? (

                                <div className="w-full flex justify-start gap-2 items-center">
                                    <div className={`${bookmaker2Fancy?.length > 0 ? "w-[75%]" : 'w-[100%]'}`}>
                                        {matchScoreDetails &&
                                            matchScoreDetails.team_data &&
                                            matchScoreDetails.team_data.length > 0 ? (
                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            Bookmaker
                                                        </div>
                                                        <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                                    </div>
                                                </header>
                                                <div
                                                    className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}

                                                >
                                                    <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">

                                                        <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                                                            <span class="text-[12px] font-bold">
                                                                Max: {formatNumber(isMatchCoin?.max)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>


                                                    </div>
                                                </div>
                                                <>
                                                    {matchScoreDetails &&
                                                        matchScoreDetails.team_data &&
                                                        matchScoreDetails.team_data.length > 0
                                                        ? matchScoreDetails.team_data.map(
                                                            (commList, index) => (
                                                                <>
                                                                    <div
                                                                        key={index}
                                                                        className={`relative border-b border-gray-300  flex decoration-none whitespace-normal max-w-full `}
                                                                    >
                                                                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex ">
                                                                            <div className="w-full   leading-3 flex items-center capitalize text-[#333333]">
                                                                                <span class="text-[13px] px-2 font-bold">
                                                                                    <span className="">
                                                                                        {commList.team_name}
                                                                                    </span>
                                                                                    <br />
                                                                                    <span
                                                                                        key={index}
                                                                                        className={
                                                                                            positionObj[
                                                                                                commList
                                                                                                    ?.selectionid
                                                                                            ] > 0
                                                                                                ? "text-[var(--success-color)]"
                                                                                                : positionObj[
                                                                                                    commList
                                                                                                        ?.selectionid
                                                                                                ] < 0
                                                                                                    ? "text-red-600"
                                                                                                    : "text-[var(--success-color)]"
                                                                                        }
                                                                                    >
                                                                                        {/* {returnDataObject[commList.selectionid] !== 0 ? returnDataObject[commList.selectionid] : "-"} */}
                                                                                        {positionObj[
                                                                                            commList
                                                                                                ?.selectionid
                                                                                        ]
                                                                                            ? (
                                                                                                Math.floor(
                                                                                                    Number(
                                                                                                        positionObj[
                                                                                                        commList
                                                                                                            ?.selectionid
                                                                                                        ]
                                                                                                    ) * 100
                                                                                                ) / 100
                                                                                            ).toFixed(2)
                                                                                            : ''}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <>
                                                                            <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6 ">
                                                                                <span className="lg:block hidden ">
                                                                                    <BlinkingComponent
                                                                                        price={0}
                                                                                        size={0}
                                                                                        // color={"bg-[#98C8EA]"}
                                                                                        // blinkColor={"bg-[#CDEBEB]"}
                                                                                        color={"bg-[#E9F6FC]"}
                                                                                        blinkColor={
                                                                                            "bg-[#CDEBEB]"
                                                                                        }
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-black"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className="lg:block hidden ">
                                                                                    <BlinkingComponent
                                                                                        price={0}
                                                                                        size={0}
                                                                                        color={"bg-[#E9F6FC]"}
                                                                                        blinkColor={
                                                                                            "bg-[#CDEBEB]"
                                                                                        }
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-black"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span
                                                                                    className=" md:col-span-1 col-span-3 md:col-start-3 lg:block hidden cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            nameOther:
                                                                                                matchScoreDetails.team_data,
                                                                                            type: "Yes",
                                                                                            odds: commList.lgaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "odds",
                                                                                            oddsType:
                                                                                                "bookmaker",
                                                                                            betType: "L",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            teamData:
                                                                                                commList.lgaai,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.khaai *
                                                                                                100,
                                                                                            size: "0",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={(commList.lgaai * 100).toFixed(2)}
                                                                                        size={(commList.khaai * 100).toFixed(2)}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" col-span-3 lg:hidden block cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            nameOther:
                                                                                                matchScoreDetails.team_data,
                                                                                            type: "Yes",
                                                                                            odds: commList.lgaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "odds",
                                                                                            oddsType:
                                                                                                "bookmaker",
                                                                                            betType: "L",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            teamData:
                                                                                                commList.lgaai,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.khaai *
                                                                                                100,
                                                                                            size: "0",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={(commList.lgaai * 100).toFixed(2)}
                                                                                        size={(commList.khaai * 100).toFixed(2)}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" md:col-span-1 col-span-3 md:col-start-4  lg:block hidden cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            nameOther:
                                                                                                matchScoreDetails.team_data,
                                                                                            type: "No",
                                                                                            odds: commList.khaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "odds",
                                                                                            oddsType:
                                                                                                "bookmaker",
                                                                                            betType: "K",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            teamData:
                                                                                                commList.khaai,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.lgaai *
                                                                                                100,
                                                                                            size: "0",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={(commList.khaai * 100).toFixed(2)}
                                                                                        size={(commList.lgaai * 100).toFixed(2)}
                                                                                        color={"bg-[#FEAFB2]"}
                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className="lg:block hidden ">
                                                                                    <BlinkingComponent
                                                                                        price={0}
                                                                                        size={0}
                                                                                        color={"bg-[#E9F6FC]"}
                                                                                        blinkColor={
                                                                                            "bg-[#CDEBEB]"
                                                                                        }
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-black"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className="lg:block hidden ">
                                                                                    <BlinkingComponent
                                                                                        price={0}
                                                                                        size={0}
                                                                                        color={"bg-[#E9F6FC]"}
                                                                                        blinkColor={
                                                                                            "bg-[#CDEBEB]"
                                                                                        }
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-black"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className="col-span-3  lg:hidden block cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            nameOther:
                                                                                                matchScoreDetails.team_data,
                                                                                            type: "No",
                                                                                            odds: commList.khaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "odds",
                                                                                            oddsType:
                                                                                                "bookmaker",
                                                                                            betType: "K",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            teamData:
                                                                                                commList.khaai,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.lgaai *
                                                                                                100,
                                                                                            size: "0",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={(commList.khaai * 100).toFixed(2)}
                                                                                        size={(commList.lgaai * 100).toFixed(2)}
                                                                                        color={"bg-[#FEAFB2]"}
                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className=" lg:block hidden"></span>
                                                                            </div>
                                                                            {commList.lgaai == "0.00" || commList.lgaai == "0.000" ? (
                                                                                <div
                                                                                    className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                >
                                                                                    <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                        <span className="text-[#FF071B] xl:text-lg  text-sm font-bold  uppercase ">
                                                                                            SUSPENDED
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                            ) : null}
                                                                        </>
                                                                    </div>

                                                                </>
                                                            )
                                                        )
                                                        : null}
                                                </>
                                            </>
                                        ) : null}
                                    </div>{" "}

                                    {bookmaker2Fancy &&
                                        bookmaker2Fancy?.length > 0 ? (
                                        <div className="w-[25%]">
                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            Bookmaker 2
                                                        </div>
                                                        <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                                    </div>
                                                </header>
                                                <div
                                                    className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}

                                                >
                                                    <div className="w-1/2 flex px-2">

                                                        <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                                                            <span class="text-[12px] font-bold">
                                                                Max: {formatNumber(isMatchCoin?.max)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="w-1/2 grid grid-cols-2">
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>


                                                    </div>
                                                </div>
                                                <>
                                                    {bookmaker2Fancy?.length > 0
                                                        ? bookmaker2Fancy?.map(
                                                            (commList, index) => (
                                                                <>
                                                                    <div
                                                                        key={index}
                                                                        className={`relative border-b border-gray-300  flex decoration-none whitespace-normal max-w-full `}
                                                                    >
                                                                        <div className="w-1/2 flex ">
                                                                            <div className="w-full   leading-3 flex items-center capitalize text-[#333333]">
                                                                                <span class="text-[13px] px-2 font-bold">
                                                                                    <span className="">
                                                                                        {commList.session_name}
                                                                                    </span>
                                                                                    <br />
                                                                                    <span
                                                                                        key={index}
                                                                                        className={
                                                                                            positionObj[
                                                                                                commList
                                                                                                    ?.selectionid
                                                                                            ] > 0
                                                                                                ? "text-[var(--success-color)]"
                                                                                                : positionObj[
                                                                                                    commList
                                                                                                        ?.selectionid
                                                                                                ] < 0
                                                                                                    ? "text-red-600"
                                                                                                    : "text-[var(--success-color)]"
                                                                                        }
                                                                                    >
                                                                                        {/* {returnDataObject[commList.selectionid] !== 0 ? returnDataObject[commList.selectionid] : "-"} */}
                                                                                        {positionObj[
                                                                                            commList
                                                                                                ?.selectionid
                                                                                        ]
                                                                                            ? (
                                                                                                Math.floor(
                                                                                                    Number(
                                                                                                        positionObj[
                                                                                                        commList
                                                                                                            ?.selectionid
                                                                                                        ]
                                                                                                    ) * 100
                                                                                                ) / 100
                                                                                            ).toFixed(2)
                                                                                            : ''}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <>
                                                                            <div className="w-1/2 grid grid-cols-2 ">

                                                                                <span
                                                                                    className="  lg:block hidden cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );

                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.oddsYes,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "Y",
                                                                                            run: commList.runsYes,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price: commList.runsYes,
                                                                                            size: commList.oddsYes,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={commList.runsYes}
                                                                                        size={(
                                                                                            commList.oddsYes * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" lg:hidden block cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.oddsYes,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "Y",
                                                                                            run: commList.runsYes,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price: commList.runsYes,
                                                                                            size: commList.oddsYes,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={commList.runsYes}
                                                                                        size={(
                                                                                            commList.oddsYes * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" lg:block hidden cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "No",
                                                                                            odds: commList.oddsNo,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "N",
                                                                                            run: commList.runsNo,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            price: commList.runsNo,
                                                                                            size: commList.oddsNo,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={commList.runsNo}
                                                                                        size={(
                                                                                            commList.oddsNo * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#FEAFB2]"}
                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />

                                                                                </span>


                                                                                <span
                                                                                    className="lg:hidden block cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "No",
                                                                                            odds: commList.oddsNo,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "N",
                                                                                            run: commList.runsNo,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            price: commList.runsNo,
                                                                                            size: commList.oddsNo,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={commList.runsNo}
                                                                                        size={(
                                                                                            commList.oddsNo * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#FEAFB2]"}
                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className=" lg:block hidden"></span>
                                                                            </div>
                                                                            {commList.lgaai == "0.00" || commList.lgaai == "0.000" ? (
                                                                                <div
                                                                                    className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                >
                                                                                    <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                        <span className="text-[#FF071B] xl:text-lg  text-sm font-bold  uppercase ">
                                                                                            SUSPENDED
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                            ) : null}
                                                                        </>
                                                                    </div>

                                                                </>
                                                            )
                                                        )
                                                        : null}
                                                </>
                                            </>
                                        </div>
                                    ) : null}

                                </div>
                            ) : null}
                            {inplayMatch?.isToss &&
                                (activeTab === "other" || activeTab === "all") ? (
                                <>
                                    <div>
                                        {matchScoreDetails &&
                                            matchScoreDetails.toss_data &&
                                            matchScoreDetails.toss_data.length > 0 ? (
                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            toss_data
                                                        </div>
                                                        <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                                    </div>
                                                </header>
                                                <div
                                                    className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}

                                                >
                                                    <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">

                                                        <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                                                            <span class="text-[12px] font-bold">
                                                                Max: {formatNumber(isTossCoin?.max)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">

                                                        </span>


                                                    </div>


                                                </div>

                                                <>
                                                    {matchScoreDetails &&
                                                        matchScoreDetails.toss_data &&
                                                        matchScoreDetails.toss_data.length > 0
                                                        ? matchScoreDetails.toss_data.map(
                                                            (commList, index) => (
                                                                <>
                                                                    <div
                                                                        key={index}
                                                                        className={`relative border-b border-gray-300 flex decoration-none whitespace-normal max-w-full`}
                                                                    >
                                                                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                                                                            <div className="w-full leading-3 flex items-center">
                                                                                <span class="text-[13px] font-bold text-[#333333]">
                                                                                    <span>
                                                                                        {commList.team_name}
                                                                                    </span>
                                                                                    <br />
                                                                                    <span
                                                                                        key={index}
                                                                                        className={
                                                                                            positionObj[
                                                                                                commList
                                                                                                    ?.selectionId
                                                                                            ] > 0
                                                                                                ? "text-[var(--success-color)]"
                                                                                                : positionObj[
                                                                                                    commList
                                                                                                        ?.selectionId
                                                                                                ] < 0
                                                                                                    ? "text-red-500"
                                                                                                    : "text-[var(--success-color)]"
                                                                                        }
                                                                                    >
                                                                                        {/* {returnDataObject[commList.selectionid] !== 0 ? returnDataObject[commList.selectionid] : "-"} */}
                                                                                        {positionObj[
                                                                                            commList
                                                                                                ?.selectionId
                                                                                        ]
                                                                                            ? (
                                                                                                Math.floor(
                                                                                                    Number(
                                                                                                        positionObj[
                                                                                                        commList
                                                                                                            ?.selectionId
                                                                                                        ]
                                                                                                    ) * 100
                                                                                                ) / 100
                                                                                            ).toFixed(2)
                                                                                            : ''}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <>
                                                                            <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6  ">
                                                                                <span className=" lg:block hidden "><BlinkingComponent
                                                                                    price={0}
                                                                                    size={0}
                                                                                    // color={"bg-[#98C8EA]"}
                                                                                    // blinkColor={"bg-[#CDEBEB]"}
                                                                                    color={"bg-[#E9F6FC]"}
                                                                                    blinkColor={
                                                                                        "bg-[#CDEBEB]"
                                                                                    }
                                                                                    textColors={
                                                                                        "text-black"
                                                                                    }
                                                                                    boderColors={
                                                                                        "border-black"
                                                                                    }
                                                                                /></span>
                                                                                <span className=" lg:block hidden "><BlinkingComponent
                                                                                    price={0}
                                                                                    size={0}
                                                                                    // color={"bg-[#98C8EA]"}
                                                                                    // blinkColor={"bg-[#CDEBEB]"}
                                                                                    color={"bg-[#E9F6FC]"}
                                                                                    blinkColor={
                                                                                        "bg-[#CDEBEB]"
                                                                                    }
                                                                                    textColors={
                                                                                        "text-black"
                                                                                    }
                                                                                    boderColors={
                                                                                        "border-black"
                                                                                    }
                                                                                /></span>
                                                                                <span
                                                                                    className=" md:col-span-1 sm:col-span-2 col-span-3 md:col-start-3 lg:block hidden cursor-pointer"
                                                                                    onClick={() =>
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.lgaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "toss",
                                                                                            oddsType: "toss",
                                                                                            betType: "L",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.khaai *
                                                                                                100,
                                                                                            size: "100",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                            nameOther:
                                                                                                matchScoreDetails.toss_data,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={parseFloat(
                                                                                            commList.lgaai * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(
                                                                                                /\.?0+$/,
                                                                                                ""
                                                                                            )}
                                                                                        size={100}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" col-span-3  lg:hidden block cursor-pointer "
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.lgaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "toss",
                                                                                            oddsType: "toss",
                                                                                            betType: "L",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.khaai *
                                                                                                100,
                                                                                            size: "100",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                            nameOther:
                                                                                                matchScoreDetails.toss_data,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={parseFloat(
                                                                                            commList.lgaai * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(
                                                                                                /\.?0+$/,
                                                                                                ""
                                                                                            )}
                                                                                        size={100}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span
                                                                                    className=" md:col-span-1 sm:col-span-2 col-span-3 md:col-start-4  lg:block hidden cursor-pointer"
                                                                                    onClick={() =>
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "No",
                                                                                            odds: commList.khaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "toss",
                                                                                            oddsType: "toss",
                                                                                            betType: "K",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.lgaai *
                                                                                                100,
                                                                                            size: "100",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                            nameOther:
                                                                                                matchScoreDetails.toss_data,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={parseFloat(
                                                                                            commList.khaai * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(
                                                                                                /\.?0+$/,
                                                                                                ""
                                                                                            )}
                                                                                        size={100}

                                                                                        color={"bg-[#FEAFB2]"}
                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    className=" col-span-3  lg:hidden block cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.selectionid
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "No",
                                                                                            odds: commList.khaai,
                                                                                            name: commList.team_name,
                                                                                            betFor: "toss",
                                                                                            oddsType: "toss",
                                                                                            betType: "K",
                                                                                            selectionId:
                                                                                                commList.selectionid,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price:
                                                                                                commList.lgaai *
                                                                                                100,
                                                                                            size: "100",
                                                                                            position:
                                                                                                returnDataObject,
                                                                                            newPosition:
                                                                                                returnDataObject,
                                                                                            nameOther:
                                                                                                matchScoreDetails.toss_data,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <BlinkingComponent
                                                                                        price={parseFloat(
                                                                                            commList.khaai * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(
                                                                                                /\.?0+$/,
                                                                                                ""
                                                                                            )}
                                                                                        size={100}
                                                                                        color={"bg-[#FEAFB2]"}

                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#f996ab]"
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span className=" lg:block hidden"><BlinkingComponent
                                                                                    price={0}
                                                                                    size={0}
                                                                                    // color={"bg-[#98C8EA]"}
                                                                                    // blinkColor={"bg-[#CDEBEB]"}
                                                                                    color={"bg-[#E9F6FC]"}
                                                                                    blinkColor={
                                                                                        "bg-[#CDEBEB]"
                                                                                    }
                                                                                    textColors={
                                                                                        "text-black"
                                                                                    }
                                                                                    boderColors={
                                                                                        "border-black"
                                                                                    }
                                                                                /></span>
                                                                                <span className=" lg:block hidden"><BlinkingComponent
                                                                                    price={0}
                                                                                    size={0}
                                                                                    // color={"bg-[#98C8EA]"}
                                                                                    // blinkColor={"bg-[#CDEBEB]"}
                                                                                    color={"bg-[#E9F6FC]"}
                                                                                    blinkColor={
                                                                                        "bg-[#CDEBEB]"
                                                                                    }
                                                                                    textColors={
                                                                                        "text-black"
                                                                                    }
                                                                                    boderColors={
                                                                                        "border-black"
                                                                                    }
                                                                                /></span>
                                                                            </div>





                                                                            {commList.lgaai === "0.00" || commList.lgaai === "0.000" ? (
                                                                                <div
                                                                                    className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                >
                                                                                    <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                        <span className="text-[#FF071B] xl:text-lg  text-sm font-bold  uppercase ">
                                                                                            SUSPENDED
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                        </>
                                                                    </div>

                                                                </>
                                                            )
                                                        )
                                                        : null}
                                                </>

                                            </>
                                        ) : null}
                                    </div>
                                </>


                            ) : null}

                            {/* normal Fancy */}
                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {NormalFancy &&
                                            NormalFancy?.length > 0 ? (
                                            <>
                                                {NormalFancy?.filter(
                                                    (commList) => commList.com_perm == "YES"
                                                ).length > 0 && (
                                                        <>
                                                            <header className="mt-1 ">
                                                                <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                                    <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                                        Normal
                                                                    </div>


                                                                </div>
                                                            </header>



                                                            <div className="grid xl:grid-cols-2 grid-cols-1">
                                                                <div
                                                                    className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                                >
                                                                    <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                        <div className="w-full leading-3 flex items-center ">
                                                                            <span className=" lg:hidden flex z-20 pr-1">
                                                                                <span

                                                                                    className="text-black flex items-center justify-center"
                                                                                >

                                                                                </span>

                                                                                {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                            </span>
                                                                            <span className="text-xs truncate ">
                                                                                <span className=" text-sm truncate">

                                                                                </span>
                                                                                <br />
                                                                                <p


                                                                                >
                                                                                    {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                                </p>
                                                                                {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                            </span>

                                                                        </div>





                                                                    </div>
                                                                    <>
                                                                        <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                            <span
                                                                                className=" lg:block hidden bg-[#FEAFB2]"

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className=" lg:hidden block "

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className=" lg:block hidden bg-[#8DD2F0]"

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className="   lg:hidden block "

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>


                                                                            <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                                {/* min:100
                                                                max:10K */}

                                                                            </span>


                                                                        </div>
                                                                    </>
                                                                </div>
                                                                <div
                                                                    className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                >
                                                                    <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                        <div className="w-full leading-3 flex items-center ">
                                                                            <span className=" lg:hidden flex z-20 pr-1">
                                                                                <span

                                                                                    className="text-black flex items-center justify-center"
                                                                                >

                                                                                </span>

                                                                                {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                            </span>
                                                                            <span className="text-xs truncate ">
                                                                                <span className=" text-sm truncate">

                                                                                </span>
                                                                                <br />
                                                                                <p>
                                                                                    {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                                </p>
                                                                                {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                            </span>

                                                                        </div>





                                                                    </div>
                                                                    <>
                                                                        <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                            <span
                                                                                className=" lg:block hidden bg-[#FEAFB2]"

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className=" lg:hidden block "

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className=" lg:block hidden bg-[#8DD2F0]"

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>
                                                                            <span
                                                                                className="   lg:hidden block "

                                                                            >

                                                                                <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                                    <div className='text-center leading-3'>
                                                                                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                                    </div>
                                                                                </div>

                                                                            </span>


                                                                            <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">

                                                                            </span>


                                                                        </div>
                                                                    </>
                                                                </div>

                                                            </div>
                                                            <div className="grid xl:grid-cols-2 grid-cols-1">
                                                                {NormalFancy &&
                                                                    NormalFancy?.length > 0
                                                                    ? NormalFancy?.filter(
                                                                        (commList) => commList.com_perm == "YES"
                                                                    )
                                                                        .sort((a, b) => {
                                                                            const order = {
                                                                                STRING: 100,
                                                                                ONLY: 1,
                                                                                OVER: 2,
                                                                                "FALL OF": 3,
                                                                                RUN: 4,
                                                                                PSHIP: 5,
                                                                                BOUNDARIES: 6,
                                                                                HOW: 7,
                                                                                BALLS: 8,
                                                                            };

                                                                            const getSessionType = (sessionName) => {
                                                                                if (sessionName.includes("ONLY"))
                                                                                    return "ONLY";
                                                                                if (sessionName.includes("OVER"))
                                                                                    return "OVER";
                                                                                if (sessionName.includes("FALL OF"))
                                                                                    return "FALL OF";
                                                                                if (sessionName.includes("RUN"))
                                                                                    return "RUN";
                                                                                if (sessionName.includes("BOUNDARIES"))
                                                                                    return "BOUNDARIES";
                                                                                if (sessionName.includes("HOW"))
                                                                                    return "HOW";
                                                                                if (sessionName.includes("BALLS"))
                                                                                    return "BALLS";
                                                                                return "STRING"; // Default to STRING if none match
                                                                            };

                                                                            const typeA = getSessionType(
                                                                                a.session_name
                                                                            );
                                                                            const typeB = getSessionType(
                                                                                b.session_name
                                                                            );

                                                                            // Compare based on the defined order
                                                                            let orderComparison =
                                                                                order[typeA] - order[typeB];

                                                                            // If types are the same, sort based on numeric value for "OVER"
                                                                            if (
                                                                                typeA === "OVER" &&
                                                                                typeB === "OVER"
                                                                            ) {
                                                                                const numberA =
                                                                                    parseInt(
                                                                                        a.session_name.split(" ")[0]
                                                                                    ) || 0; // Extracting number before "OVER"
                                                                                const numberB =
                                                                                    parseInt(
                                                                                        b.session_name.split(" ")[0]
                                                                                    ) || 0; // Extracting number before "OVER"
                                                                                return numberA - numberB; // Compare based on numeric values
                                                                            }

                                                                            return orderComparison;
                                                                        })
                                                                        .map(
                                                                            (commList, index) =>


                                                                                <div key={index}>

                                                                                    <div
                                                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                                    >
                                                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                                            <div className="w-full leading-3 flex items-center ">
                                                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                                                    <span
                                                                                                        onClick={() =>
                                                                                                            handleFancyPositionModal(
                                                                                                                {
                                                                                                                    positionData:
                                                                                                                        commList,
                                                                                                                }
                                                                                                            )
                                                                                                        }
                                                                                                        className="text-black flex items-center justify-center cursor-pointer"
                                                                                                    >

                                                                                                    </span>

                                                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                                </span>
                                                                                                <span className="text-xs truncate ">
                                                                                                    <span className=" text-[13px] truncate text-[#333333]">
                                                                                                        {commList.session_name}
                                                                                                    </span>
                                                                                                    <br />
                                                                                                    <p
                                                                                                        key={index}
                                                                                                        className={
                                                                                                            isNaN(
                                                                                                                parseFloat(
                                                                                                                    fancyPositionObj[
                                                                                                                    commList
                                                                                                                        ?.session_id
                                                                                                                    ]
                                                                                                                )
                                                                                                            )
                                                                                                                ? "text-[var(--success-color)]"
                                                                                                                : parseFloat(
                                                                                                                    fancyPositionObj[
                                                                                                                    commList
                                                                                                                        ?.session_id
                                                                                                                    ]
                                                                                                                ) > 0
                                                                                                                    ? "text-[var(--success-color)]"
                                                                                                                    : parseFloat(
                                                                                                                        fancyPositionObj[
                                                                                                                        commList
                                                                                                                            ?.session_id
                                                                                                                        ]
                                                                                                                    ) < 0
                                                                                                                        ? "text-red-500"
                                                                                                                        : "text-[var(--success-color)]"
                                                                                                        }
                                                                                                    >
                                                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                                        {fancyPositionObj[
                                                                                                            commList?.session_id
                                                                                                        ]
                                                                                                            ? (
                                                                                                                Math.floor(
                                                                                                                    Number(
                                                                                                                        fancyPositionObj[
                                                                                                                        commList
                                                                                                                            ?.session_id
                                                                                                                        ]
                                                                                                                    ) * 100
                                                                                                                ) / 100
                                                                                                            ).toFixed(2)
                                                                                                            : ''}
                                                                                                    </p>
                                                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                                </span>

                                                                                            </div>





                                                                                        </div>
                                                                                        <>
                                                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                                                <span
                                                                                                    className=" lg:block hidden cursor-pointer "
                                                                                                    onClick={() => {
                                                                                                        toggleRowVisibility(
                                                                                                            commList.session_id
                                                                                                        );
                                                                                                        handleBackOpen({
                                                                                                            data: commList,
                                                                                                            type: "No",
                                                                                                            odds: commList.oddsNo,
                                                                                                            name: commList.session_name,
                                                                                                            nameSession:
                                                                                                                commList.session_name,
                                                                                                            betFor: "fancy",
                                                                                                            oddsType: "fancy",
                                                                                                            betType: "N",
                                                                                                            run: commList.runsNo,
                                                                                                            selectionId:
                                                                                                                commList.session_id,
                                                                                                            price: commList.runsNo,
                                                                                                            size: commList.oddsNo,
                                                                                                            position:
                                                                                                                returnDataFancyObject,
                                                                                                        });
                                                                                                    }}
                                                                                                >

                                                                                                    <BlinkingComponent
                                                                                                        price={commList.runsNo}
                                                                                                        size={(
                                                                                                            commList.oddsNo * 100
                                                                                                        )
                                                                                                            .toFixed(2)
                                                                                                            .replace(/\.00$/, "")}
                                                                                                        color={"bg-[#FEAFB2]"}
                                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                                        textColors={
                                                                                                            "text-black"
                                                                                                        }
                                                                                                        boderColors={
                                                                                                            "border-[#f996ab]"
                                                                                                        }
                                                                                                    />

                                                                                                </span>
                                                                                                <span
                                                                                                    className=" lg:hidden block cursor-pointer"
                                                                                                    onClick={() => {
                                                                                                        toggleRowVisibility(
                                                                                                            commList.session_id
                                                                                                        );
                                                                                                        handleBackOpen({
                                                                                                            data: commList,
                                                                                                            type: "No",
                                                                                                            odds: commList.oddsNo,
                                                                                                            name: commList.session_name,
                                                                                                            nameSession:
                                                                                                                commList.session_name,
                                                                                                            betFor: "fancy",
                                                                                                            oddsType: "fancy",
                                                                                                            betType: "N",
                                                                                                            run: commList.runsNo,
                                                                                                            selectionId:
                                                                                                                commList.session_id,
                                                                                                            price: commList.runsNo,
                                                                                                            size: commList.oddsNo,
                                                                                                            position:
                                                                                                                returnDataFancyObject,
                                                                                                        });
                                                                                                    }}
                                                                                                >

                                                                                                    <BlinkingComponent
                                                                                                        price={commList.runsNo}
                                                                                                        size={(
                                                                                                            commList.oddsNo * 100
                                                                                                        )
                                                                                                            .toFixed(2)
                                                                                                            .replace(/\.00$/, "")}
                                                                                                        color={"bg-[#FEAFB2]"}
                                                                                                        blinkColor={"bg-[#FE7A7F]"}
                                                                                                        textColors={
                                                                                                            "text-black"
                                                                                                        }
                                                                                                        boderColors={
                                                                                                            "border-[#f996ab]"
                                                                                                        }
                                                                                                    />

                                                                                                </span>
                                                                                                <span
                                                                                                    className=" lg:block hidden cursor-pointer"
                                                                                                    onClick={() => {
                                                                                                        toggleRowVisibility(
                                                                                                            commList.session_id
                                                                                                        );

                                                                                                        handleBackOpen({
                                                                                                            data: commList,
                                                                                                            type: "Yes",
                                                                                                            odds: commList.oddsYes,
                                                                                                            name: commList.session_name,
                                                                                                            nameSession:
                                                                                                                commList.session_name,
                                                                                                            betFor: "fancy",
                                                                                                            oddsType: "fancy",
                                                                                                            betType: "Y",
                                                                                                            run: commList.runsYes,
                                                                                                            selectionId:
                                                                                                                commList.session_id,
                                                                                                            betfairMarketId:
                                                                                                                marketId,
                                                                                                            price: commList.runsYes,
                                                                                                            size: commList.oddsYes,
                                                                                                            position:
                                                                                                                returnDataFancyObject,
                                                                                                        });
                                                                                                    }}
                                                                                                >

                                                                                                    <BlinkingComponent
                                                                                                        price={commList.runsYes}
                                                                                                        size={(
                                                                                                            commList.oddsYes * 100
                                                                                                        )
                                                                                                            .toFixed(2)
                                                                                                            .replace(/\.00$/, "")}
                                                                                                        color={"bg-[#8DD2F0]"}
                                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                                        textColors={
                                                                                                            "text-black"
                                                                                                        }
                                                                                                        boderColors={
                                                                                                            "border-[#489bbd]"
                                                                                                        }
                                                                                                    />

                                                                                                </span>
                                                                                                <span
                                                                                                    className=" cursor-pointer lg:hidden block "
                                                                                                    onClick={() => {
                                                                                                        toggleRowVisibility(
                                                                                                            commList.session_id
                                                                                                        );
                                                                                                        handleBackOpen({
                                                                                                            data: commList,
                                                                                                            type: "Yes",
                                                                                                            odds: commList.oddsYes,
                                                                                                            name: commList.session_name,
                                                                                                            nameSession:
                                                                                                                commList.session_name,
                                                                                                            betFor: "fancy",
                                                                                                            oddsType: "fancy",
                                                                                                            betType: "Y",
                                                                                                            run: commList.runsYes,
                                                                                                            selectionId:
                                                                                                                commList.session_id,
                                                                                                            betfairMarketId:
                                                                                                                marketId,
                                                                                                            price: commList.runsYes,
                                                                                                            size: commList.oddsYes,
                                                                                                            position:
                                                                                                                returnDataFancyObject,
                                                                                                        });
                                                                                                    }}
                                                                                                >

                                                                                                    <BlinkingComponent
                                                                                                        price={commList.runsYes}
                                                                                                        size={(
                                                                                                            commList.oddsYes * 100
                                                                                                        )
                                                                                                            .toFixed(2)
                                                                                                            .replace(/\.00$/, "")}
                                                                                                        color={"bg-[#8DD2F0]"}
                                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                                        textColors={
                                                                                                            "text-black"
                                                                                                        }
                                                                                                        boderColors={
                                                                                                            "border-[#489bbd]"
                                                                                                        }
                                                                                                    />

                                                                                                </span>


                                                                                                <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                                    Min:100
                                                                                                    <br />

                                                                                                    Max:{formatNumber(commList?.max)}
                                                                                                </span>

                                                                                                {commList &&
                                                                                                    commList.running_status &&
                                                                                                    (commList.running_status ===
                                                                                                        "SUSPENDED" ||
                                                                                                        commList.running_status ===
                                                                                                        "CLOSE" ||
                                                                                                        commList.running_status ===
                                                                                                        "Ball Running") ? (
                                                                                                    <div
                                                                                                        className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                                    >
                                                                                                        <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                                            <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                                {
                                                                                                                    commList.running_status
                                                                                                                }
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : null}
                                                                                            </div>
                                                                                        </>
                                                                                    </div>
                                                                                    {commList?.remark &&
                                                                                        <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                                    }
                                                                                </div>

                                                                        )
                                                                    : null}

                                                            </div></>
                                                    )}
                                            </>
                                        ) : null}
                                    </div>
                                )}



                            {/* over by over  */}
                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {OverByOverFancy &&
                                            OverByOverFancy?.length > 0 ? (

                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            Over By Over
                                                        </div>


                                                    </div>
                                                </header>



                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    <div
                                                        className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p


                                                                    >
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                    {/* min:100
                                                                max:10K */}

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>
                                                    <div
                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p>
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>

                                                </div>
                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    {
                                                        OverByOverFancy &&
                                                            OverByOverFancy.length > 0
                                                            ? OverByOverFancy.map(
                                                                (commList, index) =>


                                                                    <div key={index}>

                                                                        <div
                                                                            className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                        >
                                                                            <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                                <div className="w-full leading-3 flex items-center ">
                                                                                    <span className=" lg:hidden flex z-20 pr-1">
                                                                                        <span
                                                                                            onClick={() =>
                                                                                                handleFancyPositionModal(
                                                                                                    {
                                                                                                        positionData:
                                                                                                            commList,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                            className="text-black flex items-center justify-center cursor-pointer"
                                                                                        >

                                                                                        </span>

                                                                                        {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                    </span>
                                                                                    <span className="text-xs truncate ">
                                                                                        <span className=" text-[13px] truncate text-[#333333]">
                                                                                            {commList.session_name}
                                                                                        </span>
                                                                                        <br />
                                                                                        <p
                                                                                            key={index}
                                                                                            className={
                                                                                                isNaN(
                                                                                                    parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    )
                                                                                                )
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) > 0
                                                                                                        ? "text-[var(--success-color)]"
                                                                                                        : parseFloat(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) < 0
                                                                                                            ? "text-red-500"
                                                                                                            : "text-[var(--success-color)]"
                                                                                            }
                                                                                        >
                                                                                            {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                            {fancyPositionObj[
                                                                                                commList?.session_id
                                                                                            ]
                                                                                                ? (
                                                                                                    Math.floor(
                                                                                                        Number(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) * 100
                                                                                                    ) / 100
                                                                                                ).toFixed(2)
                                                                                                : ''}
                                                                                        </p>
                                                                                        {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                    </span>

                                                                                </div>





                                                                            </div>
                                                                            <>
                                                                                <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:hidden block cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );

                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" cursor-pointer lg:hidden block "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>


                                                                                    <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                        Min:100
                                                                                        <br />

                                                                                        Max:{formatNumber(commList?.max)}
                                                                                    </span>

                                                                                    {commList &&
                                                                                        commList.running_status &&
                                                                                        (commList.running_status ===
                                                                                            "SUSPENDED" ||
                                                                                            commList.running_status ===
                                                                                            "CLOSE" ||
                                                                                            commList.running_status ===
                                                                                            "Ball Running") ? (
                                                                                        <div
                                                                                            className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                        >
                                                                                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                                <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                    {
                                                                                                        commList.running_status
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        {commList?.remark &&
                                                                            <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                        }
                                                                    </div>

                                                            )
                                                            : null}

                                                </div></>

                                        ) : null}
                                    </div>
                                )}

                            {/* Fancy 1 */}
                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {Fancy1Fancy &&
                                            Fancy1Fancy?.length > 0 ? (

                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            Fancy1
                                                        </div>


                                                    </div>
                                                </header>



                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    <div
                                                        className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p


                                                                    >
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                    {/* min:100
                                                                max:10K */}

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>
                                                    <div
                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p>
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>

                                                </div>
                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    {
                                                        Fancy1Fancy &&
                                                            Fancy1Fancy.length > 0
                                                            ? Fancy1Fancy.map(
                                                                (commList, index) =>


                                                                    <div key={index}>

                                                                        <div
                                                                            className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                        >
                                                                            <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                                <div className="w-full leading-3 flex items-center ">
                                                                                    <span className=" lg:hidden flex z-20 pr-1">
                                                                                        <span
                                                                                            onClick={() =>
                                                                                                handleFancyPositionModal(
                                                                                                    {
                                                                                                        positionData:
                                                                                                            commList,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                            className="text-black flex items-center justify-center cursor-pointer"
                                                                                        >

                                                                                        </span>

                                                                                        {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                    </span>
                                                                                    <span className="text-xs truncate ">
                                                                                        <span className=" text-[13px] truncate text-[#333333]">
                                                                                            {commList.session_name}
                                                                                        </span>
                                                                                        <br />
                                                                                        <p
                                                                                            key={index}
                                                                                            className={
                                                                                                isNaN(
                                                                                                    parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    )
                                                                                                )
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) > 0
                                                                                                        ? "text-[var(--success-color)]"
                                                                                                        : parseFloat(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) < 0
                                                                                                            ? "text-red-500"
                                                                                                            : "text-[var(--success-color)]"
                                                                                            }
                                                                                        >
                                                                                            {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                            {fancyPositionObj[
                                                                                                commList?.session_id
                                                                                            ]
                                                                                                ? (
                                                                                                    Math.floor(
                                                                                                        Number(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) * 100
                                                                                                    ) / 100
                                                                                                ).toFixed(2)
                                                                                                : ''}
                                                                                        </p>
                                                                                        {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                    </span>

                                                                                </div>





                                                                            </div>
                                                                            <>
                                                                                <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:hidden block cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );

                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" cursor-pointer lg:hidden block "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>


                                                                                    <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                        Min:100
                                                                                        <br />

                                                                                        Max:{formatNumber(commList?.max)}
                                                                                    </span>

                                                                                    {commList &&
                                                                                        commList.running_status &&
                                                                                        (commList.running_status ===
                                                                                            "SUSPENDED" ||
                                                                                            commList.running_status ===
                                                                                            "CLOSE" ||
                                                                                            commList.running_status ===
                                                                                            "Ball Running") ? (
                                                                                        <div
                                                                                            className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                        >
                                                                                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                                <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                    {
                                                                                                        commList.running_status
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        {commList?.remark &&
                                                                            <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                        }
                                                                    </div>

                                                            )
                                                            : null}

                                                </div></>

                                        ) : null}
                                    </div>
                                )}

                            {/* khedo Fancy  */}

                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {KhadoFancy &&
                                            KhadoFancy?.length > 0 ? (

                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            khedo
                                                        </div>


                                                    </div>
                                                </header>



                                                <div className="grid xl:grid-cols-1 grid-cols-1">
                                                    <div
                                                        className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[75%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p


                                                                    >
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[25%] w-[35%] grid grid-cols-2 xl:grid-cols-2">

                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                    {/* min:100
                                                                max:10K */}

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>


                                                </div>
                                                <div className="grid xl:grid-cols-1 grid-cols-1">
                                                    {KhadoFancy &&
                                                        KhadoFancy?.length > 0
                                                        ? KhadoFancy?.map(
                                                            (commList, index) =>


                                                                <div key={index}>

                                                                    <div
                                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                    >
                                                                        <div className=" xl:w-[75%] w-[65%] flex px-2 ">
                                                                            <div className="w-full leading-3 flex items-center ">
                                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                                    <span
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal(
                                                                                                {
                                                                                                    positionData:
                                                                                                        commList,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        className="text-black flex items-center justify-center cursor-pointer"
                                                                                    >

                                                                                    </span>

                                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                </span>
                                                                                <span className="text-xs truncate ">
                                                                                    <span className=" text-[13px] truncate text-[#333333]">
                                                                                        {commList.session_name} - {commList.runsNo}
                                                                                    </span>
                                                                                    <br />
                                                                                    <p
                                                                                        key={index}
                                                                                        className={
                                                                                            isNaN(
                                                                                                parseFloat(
                                                                                                    fancyPositionObj[
                                                                                                    commList
                                                                                                        ?.session_id
                                                                                                    ]
                                                                                                )
                                                                                            )
                                                                                                ? "text-[var(--success-color)]"
                                                                                                : parseFloat(
                                                                                                    fancyPositionObj[
                                                                                                    commList
                                                                                                        ?.session_id
                                                                                                    ]
                                                                                                ) > 0
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) < 0
                                                                                                        ? "text-red-500"
                                                                                                        : "text-[var(--success-color)]"
                                                                                        }
                                                                                    >
                                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                        {fancyPositionObj[
                                                                                            commList?.session_id
                                                                                        ]
                                                                                            ? (
                                                                                                Math.floor(
                                                                                                    Number(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) * 100
                                                                                                ) / 100
                                                                                            ).toFixed(2)
                                                                                            : ''}
                                                                                    </p>
                                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                </span>

                                                                            </div>





                                                                        </div>
                                                                        <>
                                                                            <div className=" xl:w-[25%] w-[35%] grid grid-cols-2 xl:grid-cols-2 ">

                                                                                <span
                                                                                    className=" lg:block hidden cursor-pointer"
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );

                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.oddsYes,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "Y",
                                                                                            run: commList.runsYes,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price: commList.runsYes,
                                                                                            size: commList.oddsYes,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >

                                                                                    <BlinkingComponent
                                                                                        price={commList.runsYes}
                                                                                        size={(
                                                                                            commList.oddsYes * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />

                                                                                </span>
                                                                                <span
                                                                                    className=" cursor-pointer lg:hidden block "
                                                                                    onClick={() => {
                                                                                        toggleRowVisibility(
                                                                                            commList.session_id
                                                                                        );
                                                                                        handleBackOpen({
                                                                                            data: commList,
                                                                                            type: "Yes",
                                                                                            odds: commList.oddsYes,
                                                                                            name: commList.session_name,
                                                                                            nameSession:
                                                                                                commList.session_name,
                                                                                            betFor: "fancy",
                                                                                            oddsType: "fancy",
                                                                                            betType: "Y",
                                                                                            run: commList.runsYes,
                                                                                            selectionId:
                                                                                                commList.session_id,
                                                                                            betfairMarketId:
                                                                                                marketId,
                                                                                            price: commList.runsYes,
                                                                                            size: commList.oddsYes,
                                                                                            position:
                                                                                                returnDataFancyObject,
                                                                                        });
                                                                                    }}
                                                                                >

                                                                                    <BlinkingComponent
                                                                                        price={commList.runsYes}
                                                                                        size={(
                                                                                            commList.oddsYes * 100
                                                                                        )
                                                                                            .toFixed(2)
                                                                                            .replace(/\.00$/, "")}
                                                                                        color={"bg-[#8DD2F0]"}
                                                                                        blinkColor={"bg-[#00B2FF]"}
                                                                                        textColors={
                                                                                            "text-black"
                                                                                        }
                                                                                        boderColors={
                                                                                            "border-[#489bbd]"
                                                                                        }
                                                                                    />

                                                                                </span>


                                                                                <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                    Min:100
                                                                                    <br />

                                                                                    Max:{formatNumber(commList?.max)}
                                                                                </span>

                                                                                {commList &&
                                                                                    commList.running_status &&
                                                                                    (commList.running_status ===
                                                                                        "SUSPENDED" ||
                                                                                        commList.running_status ===
                                                                                        "CLOSE" ||
                                                                                        commList.running_status ===
                                                                                        "Ball Running") ? (
                                                                                    <div
                                                                                        className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                    >
                                                                                        <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                            <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                {
                                                                                                    commList.running_status
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>
                                                                        </>
                                                                    </div>
                                                                    {commList?.remark &&
                                                                        <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                    }
                                                                </div>

                                                        )
                                                        : null}

                                                </div></>

                                        ) : null}
                                    </div>
                                )}

                            {/* meter Fancy  */}

                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {MeterFancy &&
                                            MeterFancy?.length > 0 ? (

                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            Meter
                                                        </div>


                                                    </div>
                                                </header>



                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    <div
                                                        className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p


                                                                    >
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                    {/* min:100
                                                                max:10K */}

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>
                                                    <div
                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p>
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>

                                                </div>
                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    {
                                                        MeterFancy &&
                                                            MeterFancy.length > 0
                                                            ? MeterFancy.map(
                                                                (commList, index) =>


                                                                    <div key={index}>

                                                                        <div
                                                                            className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                        >
                                                                            <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                                <div className="w-full leading-3 flex items-center ">
                                                                                    <span className=" lg:hidden flex z-20 pr-1">
                                                                                        <span
                                                                                            onClick={() =>
                                                                                                handleFancyPositionModal(
                                                                                                    {
                                                                                                        positionData:
                                                                                                            commList,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                            className="text-black flex items-center justify-center cursor-pointer"
                                                                                        >

                                                                                        </span>

                                                                                        {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                    </span>
                                                                                    <span className="text-xs truncate ">
                                                                                        <span className=" text-[13px] truncate text-[#333333]">
                                                                                            {commList.session_name}
                                                                                        </span>
                                                                                        <br />
                                                                                        <p
                                                                                            key={index}
                                                                                            className={
                                                                                                isNaN(
                                                                                                    parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    )
                                                                                                )
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) > 0
                                                                                                        ? "text-[var(--success-color)]"
                                                                                                        : parseFloat(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) < 0
                                                                                                            ? "text-red-500"
                                                                                                            : "text-[var(--success-color)]"
                                                                                            }
                                                                                        >
                                                                                            {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                            {fancyPositionObj[
                                                                                                commList?.session_id
                                                                                            ]
                                                                                                ? (
                                                                                                    Math.floor(
                                                                                                        Number(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) * 100
                                                                                                    ) / 100
                                                                                                ).toFixed(2)
                                                                                                : ''}
                                                                                        </p>
                                                                                        {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                    </span>

                                                                                </div>





                                                                            </div>
                                                                            <>
                                                                                <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:hidden block cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );

                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" cursor-pointer lg:hidden block "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>


                                                                                    <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                        Min:100
                                                                                        <br />

                                                                                        Max:{formatNumber(commList?.max)}
                                                                                    </span>

                                                                                    {commList &&
                                                                                        commList.running_status &&
                                                                                        (commList.running_status ===
                                                                                            "SUSPENDED" ||
                                                                                            commList.running_status ===
                                                                                            "CLOSE" ||
                                                                                            commList.running_status ===
                                                                                            "Ball Running") ? (
                                                                                        <div
                                                                                            className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                        >
                                                                                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                                <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                    {
                                                                                                        commList.running_status
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        {commList?.remark &&
                                                                            <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                        }
                                                                    </div>

                                                            )
                                                            : null}

                                                </div></>

                                        ) : null}
                                    </div>
                                )}

                            {/* oddeven  Fancy*/}

                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div>
                                        {OddEvenFancy &&
                                            OddEvenFancy?.length > 0 ? (

                                            <>
                                                <header className="mt-1 ">
                                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                            oddeven
                                                        </div>


                                                    </div>
                                                </header>



                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    <div
                                                        className={`xl:flex hidden relative  decoration-none border-b border-gray-300 whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p


                                                                    >
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">
                                                                    {/* min:100
                                                                max:10K */}

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>
                                                    <div
                                                        className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                    >
                                                        <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                            <div className="w-full leading-3 flex items-center ">
                                                                <span className=" lg:hidden flex z-20 pr-1">
                                                                    <span

                                                                        className="text-black flex items-center justify-center"
                                                                    >

                                                                    </span>

                                                                    {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                </span>
                                                                <span className="text-xs truncate ">
                                                                    <span className=" text-sm truncate">

                                                                    </span>
                                                                    <br />
                                                                    <p>
                                                                        {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}


                                                                    </p>
                                                                    {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                </span>

                                                            </div>





                                                        </div>
                                                        <>
                                                            <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                <span
                                                                    className=" lg:block hidden bg-[#FEAFB2]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#FEAFB2]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className=" lg:block hidden bg-[#8DD2F0]"

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>
                                                                <span
                                                                    className="   lg:hidden block "

                                                                >

                                                                    <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>

                                                                </span>


                                                                <span className=" xl:flex items-center text-end px-1 w-full justify-end  hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden ">

                                                                </span>


                                                            </div>
                                                        </>
                                                    </div>

                                                </div>
                                                <div className="grid xl:grid-cols-2 grid-cols-1">
                                                    {
                                                        OddEvenFancy &&
                                                            OddEvenFancy.length > 0
                                                            ? OddEvenFancy.map(
                                                                (commList, index) =>


                                                                    <div key={index}>

                                                                        <div
                                                                            className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}
                                                                        >
                                                                            <div className=" xl:w-[58%] w-[65%] flex px-2 ">
                                                                                <div className="w-full leading-3 flex items-center ">
                                                                                    <span className=" lg:hidden flex z-20 pr-1">
                                                                                        <span
                                                                                            onClick={() =>
                                                                                                handleFancyPositionModal(
                                                                                                    {
                                                                                                        positionData:
                                                                                                            commList,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                            className="text-black flex items-center justify-center cursor-pointer"
                                                                                        >

                                                                                        </span>

                                                                                        {/* <span onClick={() => this.hideDiv(element.Selection_id)} className='w-5 h-5 bg-black rounded-full flex justify-center items-center text-black font-bold'>&times;</span> */}
                                                                                    </span>
                                                                                    <span className="text-xs truncate ">
                                                                                        <span className=" text-[13px] truncate text-[#333333]">
                                                                                            {commList.session_name}
                                                                                        </span>
                                                                                        <br />
                                                                                        <p
                                                                                            key={index}
                                                                                            className={
                                                                                                isNaN(
                                                                                                    parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    )
                                                                                                )
                                                                                                    ? "text-[var(--success-color)]"
                                                                                                    : parseFloat(
                                                                                                        fancyPositionObj[
                                                                                                        commList
                                                                                                            ?.session_id
                                                                                                        ]
                                                                                                    ) > 0
                                                                                                        ? "text-[var(--success-color)]"
                                                                                                        : parseFloat(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) < 0
                                                                                                            ? "text-red-500"
                                                                                                            : "text-[var(--success-color)]"
                                                                                            }
                                                                                        >
                                                                                            {/* {isNaN(parseFloat(returnDataFancyObject[commList.session_id])) ? "" : parseFloat(returnDataFancyObject[commList.session_id]) !== 0 ? parseFloat(returnDataFancyObject[commList.session_id]).toFixed(2) : ""}  */}

                                                                                            {fancyPositionObj[
                                                                                                commList?.session_id
                                                                                            ]
                                                                                                ? (
                                                                                                    Math.floor(
                                                                                                        Number(
                                                                                                            fancyPositionObj[
                                                                                                            commList
                                                                                                                ?.session_id
                                                                                                            ]
                                                                                                        ) * 100
                                                                                                    ) / 100
                                                                                                ).toFixed(2)
                                                                                                : ''}
                                                                                        </p>
                                                                                        {/* <div
                                                                                        onClick={() =>
                                                                                            handleFancyPositionModal({
                                                                                                positionData: commList,
                                                                                            })
                                                                                        }
                                                                                        className="text-[#00B181] py-[2px] px-2.5 text-[14px]"
                                                                                    >
                                                                                        Book
                                                                                    </div> */}
                                                                                    </span>

                                                                                </div>





                                                                            </div>
                                                                            <>
                                                                                <div className=" xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3 ">



                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:hidden block cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "No",
                                                                                                odds: commList.oddsNo,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "N",
                                                                                                run: commList.runsNo,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                price: commList.runsNo,
                                                                                                size: commList.oddsNo,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsNo}
                                                                                            size={(
                                                                                                commList.oddsNo * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#FEAFB2]"}
                                                                                            blinkColor={"bg-[#FE7A7F]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#f996ab]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" lg:block hidden cursor-pointer"
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );

                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>
                                                                                    <span
                                                                                        className=" cursor-pointer lg:hidden block "
                                                                                        onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );
                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                                                    >

                                                                                        <BlinkingComponent
                                                                                            price={commList.runsYes}
                                                                                            size={(
                                                                                                commList.oddsYes * 100
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(/\.00$/, "")}
                                                                                            color={"bg-[#8DD2F0]"}
                                                                                            blinkColor={"bg-[#00B2FF]"}
                                                                                            textColors={
                                                                                                "text-black"
                                                                                            }
                                                                                            boderColors={
                                                                                                "border-[#489bbd]"
                                                                                            }
                                                                                        />

                                                                                    </span>


                                                                                    <span className=" xl:flex items-center text-end px-2 w-full justify-end  hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                                                                                        Min:100
                                                                                        <br />

                                                                                        Max:{formatNumber(commList?.max)}
                                                                                    </span>

                                                                                    {commList &&
                                                                                        commList.running_status &&
                                                                                        (commList.running_status ===
                                                                                            "SUSPENDED" ||
                                                                                            commList.running_status ===
                                                                                            "CLOSE" ||
                                                                                            commList.running_status ===
                                                                                            "Ball Running") ? (
                                                                                        <div
                                                                                            className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full  absolute   bg-[var(--suspended-color)]    flex justify-center items-center z-30`}
                                                                                        >
                                                                                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                                                <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                                                    {
                                                                                                        commList.running_status
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        {commList?.remark &&
                                                                            <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                                                                        }
                                                                    </div>

                                                            )
                                                            : null}

                                                </div>
                                            </>

                                        ) : null}
                                    </div>
                                )}

                            {/* groupBy Fancy  */}

                            {inplayMatch?.isFancy &&
                                (activeTab === "fancy" || activeTab === "all") && (
                                    <div className="grid xl:grid-cols-2 gap-0.5 grid-cols-1">
                                        {groupedData && Object.keys(groupedData).length > 0 &&
                                            Object.entries(groupedData).map(([sessionName, items], index) => (
                                                <div key={index} className=" mb-4  overflow-hidden">
                                                    {/* Header */}
                                                    <div className="bg-[#763e3e] text-white p-2 text-sm font-bold uppercase">
                                                        {sessionName}
                                                    </div>

                                                    {/* Min/Max */}
                                                    <div
                                                            className="grid grid-cols-[80%_20%] gap-2 border-t text-sm"
                                                        >
                                                    <div className="text-[11px] text-[teal] px-2 py-1 font-medium">
                                                        Min: 100 Max: 1L
                                                    </div>
                                                                              <div className={`py-1 flex justify-center items-center ${`bg-[#8DD2F0]`}`}>
                                                                        <div className='text-center leading-3'>
                                                                            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span><br />

                                                                        </div>
                                                                    </div>
                                                    </div>

                                                    {/* Odds Rows */}
                                                    {items.map((commList, i) => (
                                                        <div
                                                            key={i}
                                                            className="grid grid-cols-[80%_20%] gap-2 border-t text-sm"
                                                        >
                                                            <div className="px-2">{i} Number</div>
                                                            <div
                                                                className="text-center bg-red-900 text-black cursor-pointer"
                                                                 onClick={() => {
                                                                                            toggleRowVisibility(
                                                                                                commList.session_id
                                                                                            );

                                                                                            handleBackOpen({
                                                                                                data: commList,
                                                                                                type: "Yes",
                                                                                                odds: commList.oddsYes,
                                                                                                name: commList.session_name,
                                                                                                nameSession:
                                                                                                    commList.session_name,
                                                                                                betFor: "fancy",
                                                                                                oddsType: "fancy",
                                                                                                betType: "Y",
                                                                                                run: commList.runsYes,
                                                                                                selectionId:
                                                                                                    commList.session_id,
                                                                                                betfairMarketId:
                                                                                                    marketId,
                                                                                                price: commList.runsYes,
                                                                                                size: commList.oddsYes,
                                                                                                position:
                                                                                                    returnDataFancyObject,
                                                                                            });
                                                                                        }}
                                                            >
                                                                <BlinkingComponent
                                                                    price={commList.runsYes}
                                                                    size={(commList.oddsYes * 100).toFixed(2).replace(/\.00$/, "")}
                                                                    color={"bg-[#8DD2F0]"}
                                                                    blinkColor={"bg-[#00B2FF]"}
                                                                    textColors={"text-black"}
                                                                    boderColors={"border-[#489bbd]"}
                                                                />
                                                            </div>
                                                        </div>

                                                    ))}
                                                </div>
                                            ))}

                                    </div>
                                )}
                        </div>
                    </div>
                )}
                <div className="space-y-1.5 xl:w-[402px] 2xl:w-[452px] sticky top-0  lg:h-[calc(100vh-400px)] xl:block hidden ">
                    <div>
                        <div className="bg-[var(--secondary)] cursor-pointer flex justify-between items-center py-1.5 px-4 text-white text-sm font-semibold" onClick={() => handelTvModal()}>
                            <span>Live Match</span>
                            <button className="flex justify-end space-x-2 font-semibold" > </button>
                        </div>
                        {inplayMatch.isTv ? <>
                            {tvShow && <div className="bg-white w-full h-48">
                                <div className="details">
                                    <div className={`w-full relative md:text-sm text-[10px]`}>
                                        <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                    </div>
                                </div>
                            </div>}
                        </>
                            : null}
                    </div>
                    <div>
                        {!betShow && (
                            <>
                                <div className="bg-[var(--secondary)] flex justify-start items-center py-1.5 px-4 text-white text-sm font-semibold rounded-sm">
                                    <span>Place Bet </span>
                                </div>
                                <BetPlaceDesktop
                                    openBets={openBets}
                                    closeRow={closeRow}
                                    matchName={inplayMatch?.matchName}
                                    betSlipData={betSlipData}
                                    placeBet={placeBet}
                                    errorMessage={errorMessage}
                                    successMessage={successMessage}
                                    count={betSlipData.count}
                                    betLoading={betLoading}
                                    increaseCount={increaseCount}
                                    decreaseCount={decreaseCount}
                                    handleButtonValues={handleButtonValues}
                                />
                            </>
                        )}
                    </div>

                    <div className=" ">
                        <div className="bg-[var(--secondary)] rounded-t-sm py-1.5 px-4 font-bold text-white text-sm">
                            <span>My Bets</span>
                        </div>
                        <div className="overflow-hidden w-full  border border-[#C6D2D8] !p-0 !m-0">
                            <div className="max-w-full overflow-auto ">
                                <div className="inline-block min-w-full ">
                                    <div className="overflow-hidden w-full ">
                                        <table className="min-w-full capitalize">
                                            <thead>
                                                <tr className="w-full text-black text-[14px] font-semibold bg-[#CCCCCC] text-left">
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Matched Bets
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Odds
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Stake
                                                    </th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {oddsBetData && oddsBetData?.length > 0 ? (
                                                    oddsBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333]  text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    {element?.teamName} <br />
                                                                    <span className="font-bold">{element?.marketName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element && element?.oddsType === "matchOdds"
                                                                    ? parseFloat(Number(element?.odds) + 1)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : element &&
                                                                        (element?.oddsType === "bookmaker" || element?.oddsType === "toss")
                                                                        ? parseFloat(element?.odds * 100)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")
                                                                        : parseFloat(element?.odds)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : fancyBetData && fancyBetData?.length > 0 ? (
                                                    fancyBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${element?.type === "N"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <span className="font-medium text-xs">{element?.sessionName}</span>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.odds}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-2 text-sm">
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            {/* <tbody>
                                                {oddsBetData && oddsBetData.length > 0 ? (
                                                    oddsBetData.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-black text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    {element.teamName} <br />
                                                                    <span className="font-bold">
                                                                        {element.marketName}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element &&
                                                                    element.oddsType === "matchOdds"
                                                                    ? parseFloat(Number(element.odds) + 1)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : element &&
                                                                        (element.oddsType === "bookmaker" ||
                                                                            element.oddsType === "toss")
                                                                        ? parseFloat(element.odds * 100)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")
                                                                        : parseFloat(element.odds)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.amount}
                                                            </td>

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr className="flex justify-center w-full text-sm">
                                                        <td>No records Found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            {fancyBetData && fancyBetData.length > 0 ? (
                                                <tbody>
                                                    {fancyBetData.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-black text-[0.8125rem] border-b border-t text-left divide-x-2 divide-white ${element?.type === "N"
                                                                ? "match_bg_pink_index-0"
                                                                : "match_bg_blue_index-0"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    <span className="font-midume text-xs">
                                                                        {element.sessionName}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.odds}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.amount}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : null} */}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {matchTab === 2 && (
                    <div className="w-full ">
                        <div className="bg-[var(--secondary)] rounded-t-sm py-1.5 px-4 font-bold text-white text-sm">
                            <span> My Bets</span>
                        </div>
                        <div className="overflow-hidden w-full  border border-[#C6D2D8]">
                            <div className="max-w-full overflow-auto ">
                                <div className="inline-block min-w-full ">
                                    <div className="overflow-hidden w-full ">
                                        <table className="min-w-full capitalize">
                                            <thead>
                                                <tr className="w-full text-black text-[14px] font-semibold bg-[#CCCCCC] text-left">
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Matched Bets
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Odds
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Stake
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {oddsBetData && oddsBetData?.length > 0 ? (
                                                    oddsBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333]  text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    {element?.teamName} <br />
                                                                    <span className="font-bold">{element?.marketName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element && element?.oddsType === "matchOdds"
                                                                    ? parseFloat(Number(element?.odds) + 1)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : element &&
                                                                        (element?.oddsType === "bookmaker" || element?.oddsType === "toss")
                                                                        ? parseFloat(element?.odds * 100)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")
                                                                        : parseFloat(element?.odds)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : fancyBetData && fancyBetData?.length > 0 ? (
                                                    fancyBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x-2 divide-white ${element?.type === "N"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <span className="font-medium text-xs">{element?.sessionName}</span>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.odds}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-2 text-sm">
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ViewMatches;