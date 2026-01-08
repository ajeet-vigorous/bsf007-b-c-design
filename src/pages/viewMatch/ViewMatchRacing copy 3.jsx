
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import 'react-toastify/dist/ReactToastify.css';
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
import RacingMatchOddsMarket from "./marketMatch/RacingMatchOddsMarket";




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
    const [selectedType, setSelectedType] = useState("score");
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
    const [activeBets, setActiveBets] = useState("oddsBetData");
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const openRulesModal = () => setIsRulesOpen(true);
    const closeRulesModal = () => setIsRulesOpen(false);
    const [isScorecardOpen, setIsScorecardOpen] = useState(true);
    const [fullscreen, setFullScreen] = useState(false);

    const [open, setOpen] = useState(false);

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
    const gameDetailOtherPart = pathname.includes('viewMatchDetail');
    const handleTabClick = (tab) => {
        console.log(tab, "lllllllllllll");
        
        setActiveTab(tab);
    };
    document.title = `${inplayMatch?.matchName} | ReddyBook`;


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

    const handleWatchButtonClick = (type) => {
        setSelectedType(type);
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

    const handelScoreModalComplete = () => {
        setScoreModal(!scoreModal);
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
        console.log(data, "cashout system design");
        if (data?.odds === 0) return;
        // setBetPlaceModalMobile(true)
        if (data) {
            setBetShow(false);
            setBetShowM(false);
            setBetSlipData({
                ...data,
                stake: data.stake != null ? data.stake : '0',
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



    const [mainTab, setMainTab] = useState("fancy");
    const [subTab, setSubTab] = useState(fancyTabs[0].key);


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
        handleButtonValues
    }


    return (isLoading ? <span className="animate-spin h-5 w-5"></span> :
        <div>
            {isRulesOpen && <div>Rule</div>}
            {inplayMatch && inplayMatch?.notification && (
                <span className="w-full flex-1 text-xs websiteThemeSoundColor  text-black flex items-center">
                    <marquee className="">{inplayMatch?.notification}</marquee>
                </span>
            )}


            <div className="flex flex-col xl:flex-row text-black h-full w-100 gap-x-2">
                <div className="w-full overflow-y-auto xl:pb-[60px]">
                    <div className="">
                        <div className="xl:block hidden">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--secondary)] tem-center px-2 py-1.5 flex justify-between">
                                    <span className="text-black text-[14px] font-semibold flex justify-start items-center"><IoHome /> {" "} <FaAngleRight /> {" "}{inplayMatch?.sportType} {" "} <FaAngleRight /> {" "} {inplayMatch?.matchName}</span>
                                    <div onClick={() => handelScoreModalComplete()} className="cursor-pointer px-1"><IoMdTv size={25} /></div>

                                </div>
                            ) : null}

                            <div className="bg-[var(--primary)] flex justify-between px-2">
                                <div className="text-xs font-light text-white flex items-center py-1">{inplayMatch?.matchName}</div>
                            </div>
                        </div>

                        <div className="xl:hidden block">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--secondary)] item-center px-2 py-1.5 flex justify-start">
                                    <div className="text-black text-[14px] font-semibold flex justify-start items-center truncate w-1/2" onClick={closeModal}>{inplayMatch?.matchName}</div> |
                                    <div className="flex justify-between w-full">
                                        <div className="text-start px-1 text-black text-[14px] font-semibold flex justify-start items-center" onClick={() => handleBets() || handelScoreModalComplete()}>
                                            MY BETS
                                        </div>
                                        <div onClick={() => handelScoreModalComplete()} className="cursor-pointer px-1"><IoMdTv size={25} /></div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="bg-[var(--primary)] flex justify-between px-2">
                                <div className="text-xs font-light text-white flex items-center py-1">{inplayMatch?.matchName}</div>
                            </div>

                        </div>
                        {scoreModal && (
                            <div className=" pt-1">
                                <ul class="flex-wrap space-x-2 rtl:space-x-reverse flex rounded-t-[5px] w-full bg-[var(--secondary)] text-center">
                                    <li role="presentation" class="group">
                                        <button type="button" role="tab" class={`inline-block text-center text-[10px] font-bold uppercase w-[130px]  h-[30px]  rounded ${selectedType === "score" ? "bg-[var(--primary)] text-white border-b-2" : ""}`} onClick={() => handleWatchButtonClick("score")}>
                                            <span slot="title">Score</span>
                                        </button>
                                    </li>
                                    <li role="presentation" class="group">
                                        <button type="button" role="tab" class={`inline-block text-center text-[10px] font-bold uppercase w-[130px]  h-[30px]  rounded ${selectedType === "tv" ? "bg-[var(--primary)] text-white border-b-2" : ""}`}>
                                            <span slot="title" class="flex gap-2"><span class="m-auto flex gap-1 items-center" onClick={() => handleWatchButtonClick("tv")} >Live TV <div class="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                            </span></span>
                                        </button>
                                    </li>
                                </ul>


                                {inplayMatch.isScore && (
                                    <div className="border-2 border-secondary rounded-lg">
                                        {selectedType === "score" && (
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
                                            </div>)}
                                    </div>
                                )}
                                <div>
                                    {inplayMatch.isTv ? <>
                                        {selectedType === "tv" && <div className="bg-white w-full h-48">
                                            <div className="details">
                                                <div className={`w-full relative md:text-sm text-[10px]`}>
                                                    <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                                </div>
                                            </div>
                                        </div>}
                                    </>
                                        : null}
                                </div>
                            </div>
                        )}

                        <div class="flex w-full md:w-full overflow-hidden py-2 md:py-1 md:px-0 my-1">
                            <div class="w-full inline-flex overflow-auto ">
                                <div class="flex-none  relative space-x-2">
                                    
                                    <button class=" bg-[var(--secondary)] text-black h-[21px] px-2 rounded-[2.83px] gap-2.5  font-bold uppercase text-[12px]  " onClick={() => handleTabClick("all")}>All</button>
                                </div>
                            </div>
                        </div>
                        {!open ? <>

                            {(activeTab == "all" || activeTab == "MatchOdds") && (<RacingMatchOddsMarket
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

                            />)}

                        </> : <div className="bg-black/70 flex justify-center items-start z-50">
                            <div className="bg-white w-full max-w-3xl rounded-md shadow-lg md:m-4 m-3 p-0">
                                <div className="rounded-t-md py-4 px-4 font-normal text-black/90 text-sm border-b border-[#dee2e6] flex justify-between items-center">
                                    <span className="text-[20px]">Open Bets</span>
                                    <button onClick={closeModal} className="text-black/90 text-md">
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center border-x border-t border-[#C6D2D8] bg-white w-full">
                                    {["oddsBetData", "UnsettleBets", "fancyBetData"]?.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveBets(tab)}
                                            className={`px-4 py-2 uppercase text-[12px] font-[600] w-full ${activeBets === tab
                                                ? " text-[var(--secondary)] border-b-2 border-b-[var(--secondary)] bg-gray-50"
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
                                            <div className="overflow-hidden w-full ">
                                                <table className="min-w-full capitalize border border-[#f8f8f8]">
                                                    <thead>
                                                        <tr className="w-full text-black/80 text-[14px] font-[400] bg-[#ffffff] text-left border border-[#f8f8f8]">
                                                            <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Selname</th>
                                                            <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Odds</th>
                                                            <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Stake</th>
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
                                                                        className={`w-full text-[#333333] text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                            ? "bg-[var(--matchKhai)]"
                                                                            : "bg-[var(--matchLagai)]"
                                                                            }`}
                                                                    >
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            <div>
                                                                                {element?.teamName} <br />
                                                                                <span className="font-bold">
                                                                                    {element?.marketName}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.odds}
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.amount}
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.date}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center py-2 text-sm">
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
                                                                        className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${element?.type === "N"
                                                                            ? "bg-[var(--matchKhai)]"
                                                                            : "bg-[var(--matchLagai)]"
                                                                            }`}
                                                                    >
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            <span className="font-medium text-xs">
                                                                                {element?.sessionName}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.odds}
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.amount}
                                                                        </td>
                                                                        <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                            {element?.date}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center py-2 text-sm">
                                                                        No Fancy Bets found!
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                        {/* Unsettle Bets */}
                                                        <div className="bg-[var(--primary)] flex justify-between px-2">
                                                            <div className="text-xs font-light text-white flex items-center py-1">{inplayMatch?.matchName}</div>
                                                        </div> {activeBets === "UnsettleBets" &&
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
                                                                            {element?.date}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center py-2 text-sm">
                                                                        No Unsettle Bets found!
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                {/* // )} */}
                <div className="w-full xl:w-[65%] xl:block hidden ">

                    <div className="">
                        <div className="flex w-full">
                            <div
                                className={`rounded-t-md py-1.5 px-4 w-1/2 font-bold text-sm cursor-pointer ${!betShow
                                    ? 'bg-[var(--secondary)] text-black'
                                    : 'bg-[var(--primary)] text-white'
                                    }`}>
                                Bet Slip
                            </div>

                            <div
                                className={`rounded-t-md py-1.5 w-1/2 px-4 font-bold text-sm cursor-pointer ${betShow
                                    ? 'bg-[var(--secondary)] text-black'
                                    : 'bg-[var(--primary)] text-white'
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
                        ) : (<div className="">

                            <div className="flex justify-between items-center border-x border-t border-[#C6D2D8] bg-white w-full">
                                {["oddsBetData", "UnsettleBets", "fancyBetData"]?.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveBets(tab)}
                                        className={`px-4 py-2 uppercase text-[12px] font-[600] w-full ${activeBets === tab
                                            ? " text-[var(--secondary)] border-b-2 border-b-[var(--secondary)] bg-gray-50"
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
                            <div className="overflow-hidden w-full border border-[#C6D2D8] border-t-0">
                                <div className="max-w-full overflow-auto">
                                    <div className="min-w-full">
                                        <div className="overflow-hidden w-full">
                                            <table className="min-w-full capitalize border border-[#f8f8f8]">
                                                <thead>
                                                    <tr className="w-full text-black/80 text-[14px] font-[400] bg-[#ffffff] text-left border border-[#f8f8f8]">
                                                        <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Selname</th>
                                                        <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Odds</th>
                                                        <th className="px-[6px] py-1 border border-[#f8f8f8] whitespace-nowrap">Stake</th>
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
                                                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                        ? "bg-[var(--matchKhai)]"
                                                                        : "bg-[var(--matchLagai)]"
                                                                        }`}
                                                                >
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        <div>
                                                                            {element?.teamName} <br />
                                                                            <span className="font-bold">
                                                                                {element?.marketName}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.odds}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.amount}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.date}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-2 text-sm">
                                                                    No Odds Bet found!
                                                                </td>
                                                            </tr>
                                                        ))}

                                                    {activeBets === "fancyBetData" &&
                                                        (fancyBetData?.length > 0 ? (
                                                            fancyBetData.map((element, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${element?.type === "N"
                                                                        ? "bg-[var(--matchKhai)]"
                                                                        : "bg-[var(--matchLagai)]"
                                                                        }`}
                                                                >
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        <span className="font-medium text-xs">
                                                                            {element?.sessionName}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.odds}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.amount}
                                                                    </td>
                                                                    <td className="px-[6px] border border-[#f8f8f8] py-1 whitespace-nowrap">
                                                                        {element?.date}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-2 text-sm">
                                                                    No Fancy Bets found!
                                                                </td>
                                                            </tr>
                                                        ))}

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
                                                                        {element?.date}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-2 text-sm">
                                                                    No Unsettle Bets found!
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    <div className="py-1">
                        <Link to={'/why-choose-us'}>
                            <img className="rounded-[4px] w-full h-auto" src="/images/zetto/why.png" alt="" />
                        </Link>
                    </div>
                </div>
            </div>
            
        </div >
    );
};

export default ViewMatches;