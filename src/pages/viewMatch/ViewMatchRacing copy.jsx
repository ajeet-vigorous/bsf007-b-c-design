
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import BlinkingComponent from "./BlinkingComponent";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import PlaceBetMobile from "../../component/betplaceMobile/PlaceBetMobile";
import { message } from "antd";
import { FaTimes, FaTv } from "react-icons/fa";
import MatchDetailsHeaderSection from "../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection";
import CashOutSystem from "./CashoutTesting";






const ViewMatchRacing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [inplayMatch, setInplayMatch] = useState({});
    const [scoreShow, setScoreShow] = useState(true);
    const [tvShow, setTvShow] = useState(false);
    const [betShow, setBetShow] = useState(true);
    const [betShowM, setBetShowM] = useState(true);
    const [betShowMobile, setBetShowMobile] = useState(false);
    const [matchScoreDetails, setMatchScoreDetails] = useState({});
    const [matchDetailsForSocketNew, setMatchDetailsForSocketNew] = useState({});
    const [finalSocket, setFinalSocketDetails] = useState({});
    const [otherFinalSocket, setOtherFinalSocketDetails] = useState({});
    const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(false);
    const [hiddenRows, setHiddenRows] = useState([]);
    const [active, setActive] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [betSlipData, setBetSlipData] = useState({ stake: '0', count: 0, teamname: '', teamData: null });
    const [timeLeft, setTimeLeft] = useState('');
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
    const [matchOddsSelected, setMatchOddsSelected] = useState([])

    const { marketId, eventId, sportId } = useParams();
    const [activeBets, setActiveBets] = useState("oddsBetData");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const gameDetailOtherPart = pathname.includes('viewMatchDetail');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    document.title = `${inplayMatch?.matchName} | ReddyBook`;


    const [open, setOpen] = useState(false);

    const handleBets = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };


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

            socket.emit(`marketByEvent`, marketId);
            socket.on(marketId, (data) => {
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

            if (betSlipData.oddsType === "bookmaker" || betSlipData.oddsType === "fancy") {
                // Do something if needed
            } else {
                betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
            }
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

    const [buttonValue, setbuttonValue] = useState(false);

    const handleButtonValues = (e) => {
        setbuttonValue((prev) => !prev);
        // e.stopPropagation();
    };

    const [matchTab, setMatchTab] = useState(1);

    const handleMatchClick = (tabNumber) => {
        setMatchTab(tabNumber);
    };


    useEffect(() => {
        const targetTime = moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss');

        const interval = setInterval(() => {
            const now = moment();
            const duration = moment.duration(targetTime.diff(now));
            if (duration.asSeconds() <= 0) {
                clearInterval(interval);
                setTimeLeft('');
            } else {
                const hours = String(duration.hours()).padStart(2, '0');
                const minutes = String(duration.minutes()).padStart(2, '0');
                const seconds = String(duration.seconds()).padStart(2, '0');
                if (hours == '00') {
                    setTimeLeft(<> <span className="text-yellow-400 !text-[20px] !sm-text-[12px]"> {minutes} </span> <span className="text-white !text-[12px]">minutes</span> <span className="text-yellow-400 !text-[20px] !sm-text-[12px]">{seconds}</span>  <span className="text-white !text-[12px]">Seconds Remaining</span> </>);
                    return
                } if (hours) {
                    setTimeLeft(`${hours} hours ${minutes} minutes Remaining`);
                    return
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [inplayMatch]);
    const handleCheckboxClick = (itemId) => {
        setMatchOddsSelected((prev) => {
            if (prev.includes(itemId)) {
                return prev.filter((id) => id !== itemId);
            } else {
                if (matchOddsSelected?.length >= 5) return [...prev]
                return [...prev, itemId];
            }
        });
    };


    return (isLoading ? <span className="animate-spin h-5 w-5"></span> :
        <div>
            {isRulesOpen && <div>Rule</div>}
            {inplayMatch && inplayMatch?.notification && (
                <span className="w-full flex-1 text-xs websiteThemeSoundColor  text-black flex items-center">
                    <marquee className="">{inplayMatch?.notification}</marquee>
                </span>
            )}
           

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

            {/* <div className="xl:hidden block">
                {inplayMatch &&
                    inplayMatch?.matchName ? (
                    <div className="bg-[var(--secondary)] item-center px-2 py-1 flex justify-between">
                        <span className="text-white text-[12px] font-semibold">{inplayMatch?.matchName}</span>
                        <span className="text-white text-[12px] font-semibold"> {inplayMatch?.matchDate}</span>
                    </div>
                ) : null}
            </div> */}

            <div className="xl:hidden block">
                {inplayMatch &&
                    inplayMatch?.matchName ? (
                    <div className="bg-[var(--secondary)] item-center px-2 py-1 flex w-full  items-center">
                                        <div className="w-1/2 truncate" onClick={closeModal}>{inplayMatch?.matchName}</div> |
                                        <div className="flex justify-between w-1/2">
                                            <div className="text-start px-1"  onClick={() => handleBets()}>
                                            my Bet
                                             </div>
                                            <div className="text-end px-1" onClick={() => handleScore()}>
                                                tv
                                            </div>
                                            </div>
                                        </div>
                ) : null}

                          <div className="flex ">

                                        <div
                                            onClick={() => setFullScreen((state) => !state)}
                                            className="text-black w-1/2 bg-button rounded-sm py-1 text-xs font-bold cursor-pointer"
                                        >
                                            {fullscreen ? "HS" : "FS"}
                                        </div>

                                                                            <div onClick={() => {
                                            handelTvModal();
                                        }} className='text-black w-1/2'><img src={"/dashbaord/score-tv-icon.svg"} className="w-[18px] h-[18px] invertimage" /></div>
                                        
                                    </div>
                <div className="xl:hidden block">
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
            </div>
            <div className="md:flex justify-center text-black h-screen w-100 gap-x-2">
                {/* {(matchTab === 1) && ( */}
                <div className="xl:w-[calc(100%-402px)] 2xl:w-[calc(100%-452px)] w-full">
                    {!open  ? <> <div className="">

                        {/* <div className="horse-banner"><img src="https://versionobj.ecoassetsservice.com/v38/static/front/img/10.png" className="img-fluid" /><div className="horse-banner-detail"><div className="text-success">{finalSocket['Match Odds']?.status ?? ""}</div><div className="horse-timer"><span>{timeLeft}&nbsp;</span></div><div className="time-detail"><p>{inplayMatch?.countryCode}  &gt;  {inplayMatch?.matchName}</p><h5><span>{inplayMatch?.matchDate}</span><span> </span></h5></div></div></div> */}

                        {/* ---------------------------------------------------------match odds counts starts------------------------------------------------------------- */}
                        {matchOddsSelected?.length > 1 &&
                            <>
                                <header className="mt-1">
                                    <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                        <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                            Combined
                                        </div>
                                        <button disabled className="bg-[var(--success-color)] opacity-35  text-sm text-white px-3 py-1">Cashout</button>

                                    </div>
                                </header>
                                <div className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}>
                                    <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                                        <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
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
                                <div className={`  flex whitespace-normal max-w-full border-b border-gray-300`}>
                                    <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                                        <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                                            <span class="text-[13px] font-bold flex items-center gap-2">
                                                <span> {matchOddsSelected?.join('+')}<br />
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6 ">
                                        <span className="lg:col-span-1 col-span-3 rounded-md  lg:block hidden">
                                            <BlinkingComponent
                                                color={"bg-[#E6F2FC]"}
                                                blinkColor={"bg-[#00B2FF]"}
                                                hoverColor={"bg-sky-600"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-3 rounded-md  lg:block hidden">
                                            <BlinkingComponent
                                                color={"bg-[#E6F2FC]"}
                                                blinkColor={"bg-[#00B2FF]"}
                                                hoverColor={"bg-sky-600"}
                                            />
                                        </span>
                                        <span className="md:col-span-3 sm:col-span-3 rounded-md col-span-3 lg:hidden block cursor-pointer">
                                            <BlinkingComponent
                                                color={"bg-[#8DD2F0]"}
                                                blinkColor={"bg-[#00B2FF]"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer">
                                            <BlinkingComponent
                                                color={"bg-[#8DD2F0]"}
                                                blinkColor={"bg-[#00B2FF]"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-3 rounded-md lg:hidden  cursor-pointer">
                                            <BlinkingComponent
                                                color={"bg-[#FEAFB2]"}
                                                blinkColor={"bg-[#FE7A7F]"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer">
                                            <BlinkingComponent
                                                color={"bg-[#FEAFB2]"}
                                                blinkColor={"bg-[#FE7A7F]"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                            <BlinkingComponent
                                                color={"bg-[#FCE3E4]"}
                                                blinkColor={"bg-[#CDEBEB]"}
                                            />
                                        </span>
                                        <span className="lg:col-span-1 col-span-2 rounded-md  lg:block hidden">
                                            <BlinkingComponent
                                                color={"bg-[#FCE3E4]"}
                                                blinkColor={"bg-[#CDEBEB]"}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </>
                        }
                        {/* ---------------------------------------------------------match odds counts end ------------------------------------------------------------- */}
                        <div className="xl:block hidden">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--darkcolor)] item-center px-2 py-1.5 flex justify-between">
                                    <span className="text-white text-[14px] font-semibold">{inplayMatch?.matchName}</span>
                                    <span onClick={() => handelTvModal()}>Tv</span>
                                    
                                </div>
                            ) : null}

                            <div>
                                <div className="flex space-x-1 justify-end items-center">
                                        <div
                                            onClick={() => setFullScreen((state) => !state)}
                                            className="text-black bg-button rounded-sm px-2 py-1 text-xs font-semibold cursor-pointer"
                                        >
                                            {fullscreen ? "HS" : "FS"}
                                        </div>
                                        <span
                                            onClick={() => handleScore()}
                                            className="text-black font-semibold cursor-pointer">
                                            <img src={"/scorecard-icon.webp"} className="w-[25px] h-[25px] bg-red-600 invertimage" />
                                        </span>
                                    </div>
                            </div>
                        </div>

                        {inplayMatch?.isMatchOdds && (activeTab === "all") ? (
                            <>

                                <MatchDetailsHeaderSection
                                    marketType={inplayMatch?.marketName}
                                    minMax={{ min: 100, max: (isMatchCoin?.max) }}
                                
                                >


                                    {Object.values(finalSocket).map((element, index) => element.marketType === "Match Odds" && (
                                        <>

                                            <div className="" key={index}>
                                                {/* <header className="mt-1">
                                                <div className=" bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                                                    <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold ">
                                                        Match_Odds
                                                    </div>

                                                </div>
                                            </header> */}
                                                <div className={`  flex whitespace-normal max-w-full border-b border-gray-300 `}>
                                                    <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex ">

                                                        <div className="w-full py-1 bg-white leading-3 flex items-center text-xs text-[#097c93]">
                                                            <span className="text-[12px] font-bold">
                                                                {/* Max: {isMatchCoin?.max} */}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                                                        <span className="lg:col-span-1 bg-white col-span-2   lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 bg-white col-span-2   lg:block hidden">
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-white`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[12px] text-xs text-gray-800 ">Back</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-3 rounded-md  ">
                                                            <div className={`py-1 flex justify-center items-center ${`bg-white`}`}>
                                                                <div className='text-center leading-3'>
                                                                    <span className="2xl:text-[16px] lg:text-[12px] text-xs text-gray-800 ">Lay</span><br />

                                                                </div>
                                                            </div>
                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 bg-white lg:block hidden">

                                                        </span>
                                                        <span className="lg:col-span-1 col-span-2 bg-white lg:block hidden">

                                                        </span>


                                                    </div>
                                                </div>


                                                {element && element.runners && element.runners.length > 0 ? element.runners.map((elementtemp, index) => (
                                                    <>


                                                        <div
                                                            className={`relative  flex whitespace-normal bg-white max-w-full border-b border-gray-300 relative`}
                                                            key={index}
                                                        >
                                                            <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                                                                {/* w-11/12  */}
                                                                <div className="w-full py-1 flex flex-col leading-3 justify-center items-start text-[#333333]">
                                                                    <div className="text-[13px] font-bold flex  items-center gap-2">
                                                                        {sportId == 7 &&
                                                                            <>
                                                                                <div><input checked={matchOddsSelected.includes(index + 1)} onClick={() => { handleCheckboxClick(index + 1) }} type="checkbox" className="!bg-white h-4 w-4" /></div>
                                                                                <span>({index + 1}) </span>
                                                                            </>
                                                                        }
                                                                        <span> {elementtemp.selectionName} <br />

                                                                            <div key={index} className={positionObj[elementtemp.selectionId] > 0 ? 'text-green-500 !mt-2' : positionObj[elementtemp.selectionId] < 0 ? 'text-red-500 !mt-2' : 'black'} >
                                                                                {/* {returnDataObject[elementtemp.selectionId] !== 0 ? returnDataObject[elementtemp.selectionId] : "-"} */}

                                                                                {positionObj[elementtemp.selectionId] ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(2) : ''}

                                                                            </div>
                                                                        </span>



                                                                    </div>
                                                                    <div className="text-[13px]  flex  items-center gap-1  ">   <div className="text-[13px]  flex  items-center gap-2 bg-gray-100 px-2 py-1.5 rounded-md"> <span className="text-[13px] font-bold flex  items-center gap-2">Jockey:</span> {elementtemp?.jockeyName}</div> <div className="text-[13px]  flex  items-center gap-2 bg-gray-100 px-2 py-1.5 rounded-md"><span className="text-[13px] font-bold flex  items-center gap-2">Age:</span> {elementtemp?.age}</div></div>
                                                                </div>


                                                            </div>

                                                            <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6 relative">

                                                                {(elementtemp?.status === "REMOVED" || finalSocket["Match Odds"]?.status === "SUSPENDED" || finalSocket["Match Odds"]?.status === "CLOSED") && <div
                                                                    className={`w-full h-full  absolute bg-white/50 border-l-red-500 border-[0.5px] border-r-red-500 lg:flex     hidden justify-center items-center `}
                                                                >
                                                                    <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                        <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                            {elementtemp?.status === "REMOVED" ? "REMOVED" : "SUSPENDED"}
                                                                        </span>
                                                                    </div>
                                                                </div>}
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

                                                            {(elementtemp?.status === "REMOVED" || finalSocket["Match Odds"]?.status === "SUSPENDED" || finalSocket["Match Odds"]?.status === "CLOSED") && <div
                                                                className={`w-full h-full  absolute  flex  bg-[var(--suspended-color)]    lg:hidden justify-center items-center `}
                                                            >
                                                                <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap  rounded font-bold bg-transparent  opacity-90 ">
                                                                    <span className="text-red-500 xl:text-lg  text-sm font-bold  uppercase ">
                                                                        {elementtemp?.status === "REMOVED" ? "REMOVED" : "SUSPENDED"}
                                                                    </span>
                                                                </div>
                                                            </div>}
                                                        </div>


                                                        {elementtemp?.selectionId == betSlipData?.selectionId && <PlaceBetMobile
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
                                                    </>
                                                )) : null}


                                                 

                                                

                                            </div>
                                        </>))}
                                </MatchDetailsHeaderSection>
                            </>
                        ) : null}
                    </div></> : <div className="bg-black/70 flex justify-center items-start z-50">
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
                        </div>
                    </div>}
                </div>
                {/* )} */}
                <div className=" xl:w-[402px]  2xl:w-[452px] sticky top-0  lg:h-[calc(100vh-400px)] xl:block hidden">
                    <div>
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
                    <div className="">

                        <div className="flex w-full">
  <div
    className={`rounded-t-md py-1.5 px-4 w-1/2 font-bold text-sm cursor-pointer ${
      !betShow
        ? 'bg-gray-200 text-black'
        : 'bg-[var(--darkcolor)] text-white'
    }`}
     onClick={() => setBetShow(true)}
  >
    Bet Slip
  </div>

  <div
    className={`rounded-t-md py-1.5 w-1/2 px-4 font-bold text-sm cursor-pointer ${
      betShow
        ? 'bg-gray-200 text-black'
        : 'bg-[var(--darkcolor)] text-white'
    }`}
   
  >
    My Bet
  </div>
</div>

                        {!betShow ? (
                            <>                               
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
                                    isMatchCoin={minMaxCoins}
                                />
                            </>
                        ) : <div className="">
                       
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
                    </div>}
                        <div className="py-1">
                                                <Link to={'/why-choose-us'}>
                                                     <img className="rounded-[4px] w-full h-auto" src="/images/zetto/why.png" alt=""/>
                                                </Link>
                                            </div>
                    </div>

                    
                </div>
               


            </div>

            <>
                {/* */}
            </>

        </div >
    );
};

export default ViewMatchRacing;