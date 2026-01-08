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

const AppSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
    if (matchData) {
      const organizedData = organizeData(matchData);
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

  // const handleClick = (index, e) => {
  //   e.stopPropagation();

  //   const clickedItem = SPORTSCONSTANT[index];

  //   if (clickedItem?.text === "Casino") {
  //     navigate("/all-casino");
  //     return;
  //   }
  //   if (clickedItem?.text === "Sports Book") {
  //     navigate("/sport-sbook");
  //     return;
  //   }

  //   if (openKeys.includes(index)) {
  //     setOpenKeys(openKeys.filter((key) => key !== index));
  //   } else {
  //     setOpenKeys([...openKeys, index]);
  //   }
  // };
  // console.log("openKeys", openKeys);

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

      <div className="hidden lg:block ">
        <div>
          <CgClose
            onClick={() => sidebartoggle(!sidebar)}
            className="absolute top-6 left-[250px] z-40 text-white text-[2rem] lg:hidden block"
          />

          <CasinoSlider data={sidebarData} />
          <div className="relative flex flex-col w-full ">
            <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto h-full">
              <div className="text-white md:relative ">
                <div className="">

                  {SPORTSCONSTANT?.map((menuItem, index) => {
               
                    return (
                      <div
                        key={index}
                        className={`text-[#343435]  py-0 my-0 transition-[max-height] duration-300 ease-in ${clickedOutside1 === true
                          ? "max-h-auto bg-[#fffff]"
                          : "max-h-0 bg-[#fffff]"
                          }`}
                      >
                        <div className="cursor-pointer flex gap-3 items-center border-b border-[#e5e7eb] justify-start h-[54px] text-sm font-[300]  text-black text-[15px] group">
                          <div
                            className="font-semibold tracking-normal text-[15px] px-5 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between items-center"
                            onClick={(e) =>
                              {
                                if(menuItem?.url){
                                  navigate(menuItem?.url)
                                }else{
                                navigate(`/in-play/${menuItem.count}`)}}
                                }
                          >
                            <div className="flex justify-start items-center space-x-4">
                              <span>
                                <img
                                  src={menuItem.icon}
                                  alt={menuItem.text}
                                  className="!w-[20px] !h-[20px]"
                                />
                              </span>
                              <span className="text-[15px] -tracking-wide font-[400] scale-105 group-hover:scale-110">{menuItem.text}
                                
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>
          
            </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;

const sidebarData = [
  { gameImg: "/login/ls_01.png" },
  { gameImg: "/login/ls_02.png" },
  { gameImg: "/login/ls_03.png" },
  { gameImg: "/login/ls_04.png" },
];
