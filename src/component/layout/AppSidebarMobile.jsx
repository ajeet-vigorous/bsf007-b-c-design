import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import CasinoSlider from "../casinoSlider/CasinoSlider";
import { SPORTSCONSTANT } from "../../config/global";
import settings from "../../domainConfig";
import { FaTimes } from "react-icons/fa";
import Login from "../login/Login";

const organizeData = (data) => {
  if (!data) return [];
  const organizedData = [];
  data?.forEach((item) => {
    const { sportId, seriesId, seriesName } = item;
    let sportIndex = organizedData.findIndex(
      (sport) => sport.sportId === sportId
    );
    if (sportIndex === -1) {
      sportIndex = organizedData.length;
      organizedData.push({ sportId, series: [] });
    }
    let seriesIndex = organizedData[sportIndex].series.findIndex(
      (series) => series.seriesId === seriesId
    );
    if (seriesIndex === -1) {
      seriesIndex = organizedData[sportIndex].series.length;
      organizedData[sportIndex].series.push({
        seriesId,
        seriesName,
        data: [item],
      });
    } else {
      organizedData[sportIndex].series[seriesIndex].data.push(item);
    }
  });
  return organizedData;
};

const AppSidebarMobile = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [sidebar, sidebartoggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleResponseGameotherDetails = (data) => {
    window.location.href = `/sport-view/${data.marketId}/${data.eventId}`;
  };
  const { sportMatchList } = useSelector((state) => state.sport);
  const modalRef = useRef();
  const [clickedOutside, setClickedOutside] = useState(true);
  const [clickedOutside1, setClickedOutside1] = useState(true);
  const [clickedOutside2, setClickedOutside2] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [openKeys1, setOpenKeys1] = useState({});
  const [matchData, setMatchData] = useState([]);
  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;
  const [raceId, setRaceId] = useState(null);

  const [openRaceId, setOpenRaceId] = useState(null);
  const [racingData, setRacingData] = useState([]);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = () => {
    setIsLoginOpen(true);
  }

  const closeModal = () => {
    setIsLoginOpen(false);
  };


  useEffect(() => {
    let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
    setMatchData(matchListData);
  }, [sportMatchList]);

  useEffect(() => {
    const organizedData = organizeData(matchData);
    if (matchData) {
      setFilteredData(organizedData);
    } else {
      let localStorageData =
        JSON.parse(localStorage.getItem("matchList")) || [];
      const organizedData = organizeData(localStorageData?.data);
      setFilteredData(organizedData);
    }
  }, [matchData]);

  useEffect(() => {
    if (matchData && raceId != null) {
      setRacingData(matchData.filter((race) => race.sportId == Number(raceId)));
    }
  }, [matchData, raceId]);

  const handleClick = (index, e) => {

    e.stopPropagation();
    if (openKeys.includes(index)) {
      setOpenKeys(openKeys.filter((key) => key !== index));
    } else {
      setOpenKeys([...openKeys, index]);
    }
    const clickedItem = SPORTSCONSTANT[index];


    if (clickedItem?.text === "Casino") {
      navigate("/all-casino");
      return;
    }
    if (clickedItem?.text === "Sports Book") {
      navigate("/sports-book");
      return;
    }
    if (clickedItem?.text === "Horse Racing") {
      setOpenRaceId(7);
      return;
    }
    if (clickedItem?.text === "Greyhound Racing") {
      setOpenRaceId(Number(4339));
      return;
    }
    if (clickedItem?.id) {
      setOpenRaceId(clickedItem.id);
    } else {
      setOpenRaceId(null); // fallback
    }
  };

  const handleClick1 = (sportIndex, seriesIndex, e) => {
    e.stopPropagation();
    const key = `${sportIndex}-${seriesIndex}`;
    setOpenKeys1((prevOpenKeys1) => ({
      ...prevOpenKeys1,
      [key]: !prevOpenKeys1[key],
    }));
  };

  const handleRacing = (id) => {
    setOpenRaceId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (openRaceId) {
      setRacingData(matchData.filter((race) => race.sportId === openRaceId));
    } else {
      setRacingData([]);
    }
  }, [openRaceId, matchData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
      {/* <Login isOpen={isLoginOpen} closeModal={closeModal} setIsLoginOpen={setIsLoginOpen} /> */}
      <div className="block lg:hidden bg-[--primary] shadow-[0_0_20px_rgba(1,41,112,0.1)]">
        <div className="flex justify-between items-center py-3 px-2">
          <div></div>
          <div>
            <img src={settings.logo} className="h-[3rem] md:h-[65px]" />
          </div>
          <div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="block lg:hidden bg-[var(--secondary)] p-1"
            >
              <FaTimes className="text-black/70" size={16} />
            </button>
          </div>
        </div>
        <div className="relative flex flex-col w-full h-dvh p-4 ">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto h-full">
            <div className="text-white md:relative ">
              <div className="">
                

                  {SPORTSCONSTANT?.map((menuItem, index) => {
               
                    return (
                      <div
                        key={index}
                        className={`text-[#343435]  py-0 my-0 transition-[max-height] duration-300 ease-in ${clickedOutside1 === true
                          ? "max-h-auto bg-[--primary]"
                          : "max-h-0 bg-[--primary]"
                          }`}
                      >
                        <div className="cursor-pointer flex gap-3 items-center border-b border-[#e5e7eb] justify-start h-[54px] text-sm font-[300] bg-[--primary] text-white text-[15px] group">
                          <div
                            className="font-semibold tracking-normal text-[15px] px-5 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between items-center"
                         
                             onClick={() => {
              if (menuItem?.url) {
                navigate(menuItem?.url);
              } else {
                navigate(`/in-play/${menuItem.count}`);
              }
              setIsSidebarOpen(false);
            }}
                          >
                            <div className="flex justify-start items-center space-x-4">
                              <span>
                                {/* <img
                                  src={menuItem.icon}
                                  alt={menuItem.text}
                                  className="!w-[20px] !h-[20px]"
                                /> */}
                                <img
                                    src={menuItem.mobileicon}
                                    alt=""
                                    className="hidden sm:block w-4 h-4"
                                  />

                                  {/* Mobile icon (<576px) */}
                                  <img
                                    src={menuItem.mobileicon}
                                    alt=""
                                    className="block sm:hidden w-4 h-4"
                                  />
                              </span>
                              <span className="text-[15px] -tracking-wide font-[400] scale-105 group-hover:scale-110">{menuItem.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {/* <div className="flex justify-between gap-1 py-2">
               <div
          onClick={() => {
            navigate("/wallet");
             setIsSidebarOpen(false);
      
          }}
            className="w-[50%] text-[12px] font-semibold rounded-[3px] h-[35px] border border-[--secondary] flex items-center justify-center text-[--secondary] hover:bg-[--secondary] hover:text-white"
          >
            WITHDRAW
          </div>
          <div
          onClick={() => {
            navigate("/deposit");
             setIsSidebarOpen(false);

          }}
            className="flex justify-center items-center w-[50%] text-[12px] font-semibold text-black rounded-[3px] h-[35px] border border-[--secondary] hover:opacity-[0.8] bg-[--secondary]"
          >
            DEPOSIT
          </div>
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebarMobile;

