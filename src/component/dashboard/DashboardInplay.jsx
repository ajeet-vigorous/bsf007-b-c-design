/* eslint-disable react/prop-types */
import { LiaDesktopSolid } from "react-icons/lia";
import moment from "moment";
import { useEffect, useState } from "react";
import { TbDeviceTvOld } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { FaTv } from "react-icons/fa";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import Login from "../login/Login";

function InplayMatches({ activeTab, matchlistItems, sportName }) {

  const [subTab, setSubTab] = useState('AU')
  const [isLive, setIsLive] = useState(false);
  const [logniModal, setLogniModal] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const { gameId } = useParams();



  const filteredMatches = matchlistItems?.filter(
    (element) => element.sportId == activeTab
  ).sort((a, b) => moment(a.matchDate, "DD-MM-YYYY HH:mm:ss").isBefore(moment(b.matchDate, "DD-MM-YYYY HH:mm:ss")) ? -1 : 1);


  const isInplayMatch = (match) => {
    const matchMoment = moment(match?.matchDate, "DD-MM-YYYY HH:mm:ss A");
    const currentMoment = moment().add(60, 'minutes');
    return currentMoment.isSameOrAfter(matchMoment);
  };

  const groupedBySeries = {};
  if (filteredMatches?.length > 0) {
    filteredMatches.forEach((match) => {
      const series = match.countryCode || "Other Series";
      if (!groupedBySeries[series]) {
        groupedBySeries[series] = [];
      }
      groupedBySeries[series].push(match);
    });
  }
const token = localStorage.getItem("token");

  const handleLoginModal = () => {
    if (!localStorage.getItem("token")) {
      setLogniModal(true);
    }
  };

  const functiongroupbyRacingmatch = (matchArray) => {
    const groupedByRacingMatch = {};
    if (matchArray?.length > 0) {
      matchArray.forEach((match) => {
        const matches = match.matchName || "Other Match";
        if (!groupedByRacingMatch[matches]) {
          groupedByRacingMatch[matches] = [];
        }
        groupedByRacingMatch[matches].push(match);

      });
    }
    return Object.entries(groupedByRacingMatch)?.map(([key, value]) => ({ key, value }))
  }

  let content;

  useEffect(() => {
    const seriesKeys = Object.keys(groupedBySeries);
    if (seriesKeys.length > 0 && !subTab) {
      setSubTab(seriesKeys[0]);
    }
  }, [groupedBySeries, subTab]);

  useEffect(() => {
    setSubTab()
  }, [activeTab]);


  if (activeTab == 4339 || activeTab == 7) {
    content = (
      <div className=" text-gray-700 text-[16px]">
        {gameId === "7" && (
          <>
            <div>
              <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                <div className="flex space-x-2 items-center">
                  <img src="/subHeader/menu-99998.png" className="w-[20px] h-[20px]" alt="menu" />
                  <p>Horse Racing</p>
                </div>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
            </div>
          </>

        )}
        {gameId === "4339" && (
          <>
            <div>
              <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                <div className="flex space-x-2 items-center">
                  <img src="/subHeader/menu-99998.png" className="w-[20px] h-[20px]" alt="menu" />
                  <p>Greyhound Racing</p>
                </div>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center">
          {Object.keys(groupedBySeries)?.map((el, index) => {
            return (
              <>
                <div onClick={() => setSubTab(el)} className={`border border-r-[var(--secondary)]  ${subTab === el ? "bg-[var(--secondary)] px-4 py-1 text-white" : "bg-[#cccc] px-4 py-1 text-black"}`} key={index}>
                  {el}
                </div>
              </>
            )
          })}
        </div>
        <div className="bg-[#F2F2F2] ">
          {groupedBySeries[subTab] && functiongroupbyRacingmatch(groupedBySeries[subTab])?.length > 0 ? (
            functiongroupbyRacingmatch(groupedBySeries[subTab])?.map((match, index) => (
              <div key={index} className="flex xl:items-center p-1.5 xl:justify-start md:grid md:grid-cols-[0.5fr_1.5fr]  xl:flex-row flex-col items-start justify-between gap-1 my-0.5 border-b border-gray-300">
                <div className="flex flex-row justify-start items-center gap-2">
                  <FaTv className="text-black" />
                  <div className="xl:min-w-[400px] text-[15px] min-w-full">{match?.key}</div>
                </div>
                {<div className="xl:min-w-[400px]  min-w-full flex  flex-wrap justify-start items-center gap-1">

                  {match?.value?.map((allMatchTime, newindex) => (
                    <div onClick={() => {
                      if (token) {
      window.location.href = `/sport-view-racing/${allMatchTime?.marketId}/${allMatchTime?.eventId}/${allMatchTime?.sportId}`;
    } else {
      handleLoginModal();
    }
  }} key={newindex} className="bg-[#cccc] rounded-[4px] text-black px-3 py-1 text-center cursor-pointer">
                      {moment(allMatchTime?.matchDate, 'YYYY-MM-DD HH:mm:ss', true).isValid() ? (
                        moment(allMatchTime.matchDate, 'YYYY-MM-DD HH:mm:ss').format("HH:mm")
                      ) : null}

                    </div>
                  ))}
                </div>}
              </div>
            ))
          ) : (
            <>
              <div className="lg:flex hidden justify-between px-1.5 py-1 w-full border-b border-t border-[#f8f8f8]">
                <h2 className="text-sm font-bold text-black w-[60%] px-2">Game</h2>
                <p className="w-[40%] grid grid-cols-3 text-center text-sm font-bold">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </p>
              </div>
              <div className="border-b px-2 py-1 text-[13px]">
                No Records found
              </div>
            </>)}
        </div>
      </div>
    );
  } else {
    if (!filteredMatches || filteredMatches.length === 0) {
      content = (
        <>
          <div className="lg:flex bg-[var(--primary)] hidden justify-between px-1.5 py-1 w-full border-b border-t border-[#f8f8f8]">
            <div className="relative text-sm bg-[var(--primary)] w-[180px] font-bold text-white py-1.5 px-2">
              {sportName}
              <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
            </div>
            <p className="w-[40%] grid text-white grid-cols-3 text-center text-sm font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </p>
          </div>
          <div className="border-b text-center w-full  px-3 py-1 text-[13px]">
            No Records found!
          </div>
        </>
      );
    } else {
      content = (
        <div className="overflow-yauto">
          <div className="flex justify-between rounded-t-[8px] bg-[var(--primary)] mt-2 items-center w-full border-b border-t border-[#f8f8f8]">
            <div className="lg:w-[50%] w-full sm:flex h-[36px] items-center lg:space-x-24 lg:justify-start justify-between">
              <div className="relative text-[13px] w-[180px] font-bold text-[--secondary] py-1.5 px-2 flex justify-start items-center space-x-1">
                {sportName === "CRICKET" && <img src='/subHeader/menu-4.png' className="w-4 h-4" />}
                {sportName === "SOCCER" && <img src='/subHeader/menu-1.png' className="w-4 h-4" />}
                {sportName === "TENNIS" && <img src='/subHeader/menu-2.png' className="w-4 h-4" />}
                <p>{sportName}</p>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
            
            </div>
            <div className="w-[50%] lg:grid hidden text-gray-100 grid-cols-3 text-center text-sm font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
          </div>

          {filteredMatches?.map((element, index) => {
            const isInplay = isInplayMatch(element);
            return (
              <div
                className="divide-y divide-[#f8f8f8] border border-gray-400 md:pb-0  px-1 bg-white "
                key={index}
              >
                <div className="flex  py-0.5 w-full ">
                  <div className="lg:w-[50%]  w-full flex justify-between items-center bg-white">
                    <div className="flex items-center justify-start w-full ">
                      {token ? <a
                        href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
                        className="flex items-center justify-start py-1 space-x-1 w-full"
                      >
                        <div className="hidden lg:flex">
                            {isInplay ? (
                              <div className="bg-[--primary] text-[9px] ms-4 text-white !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                            ) :
                            (
                              <div className="border-2 border-[--primary] text-[9px] ms-4 text-[--primary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                            )
                          }
                        </div>
                        <div className="flex flex-col uppercase w-full   px-2">
                          {element?.seriesName && <span className="text-[10px] md:block hidden text-[--white] capitalize font-bold lg:bg-[--primary] w-fit px-1 rounded-[5px]">
                            ({element?.seriesName ? element?.seriesName : "No Series"})
                          </span>}
                          <span className="text-[13px] font-medium capitalize text-gray-900 hover:underline">
                            <span className="">{element?.matchName}</span>  <br/> <span className="md:hidden block text-gray-500 text-xs">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("DD-MM-YYYY HH:mm")}</span>
                          </span>
                        </div>
                      </a> : <span
                        onClick={()=>handleLoginModal()}
                        className="flex items-center justify-start py-1 space-x-1 w-full"
                      >
                        <div className="hidden lg:flex">
                            {isInplay ? (
                              <div className="bg-[--primary] text-[9px] ms-4 text-white !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                            ) :
                            (
                              <div className="border-[--primary] border-2 text-[9px] ms-4 text-[--primary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                            )
                          }
                        </div>
                        <div className="flex flex-col uppercase   px-2">
                          {element?.seriesName && <span className="text-[10px] md:block hidden text-[--white] capitalize font-bold lg:bg-[--primary] w-fit px-1 rounded-[5px]">
                            ({element?.seriesName ? element?.seriesName : "No Series"})
                          </span>}
                          <span className="text-[11px] font-bold capitalize text-gray-900 hover:underline">
                            {element?.matchName} <br/> <span className="md:hidden block text-xs">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("DD-MM-YYYY HH:mm")}</span>
                          </span>
                        </div>
                      </span>}
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                      <div className="flex items-center justify-end space-x-1.5 cursor-pointer lg:pr-3">
                        <span className="w-[14px] h-[16px]">{element?.isTv && <LiaDesktopSolid size={16} />}</span>
                        <span className="w-[15px] h-[15px] bg-[--primary] rounded-[3px] text-white flex items-center justify-center">
                        {element?.isFancy && 
                        <span className="text-[9px]">F</span>
                        // <img src='/dashbaord/f-icon.png' className="w-[12px] h-[12px]" />
                        }
                        </span>
                        <span className="w-[15px] h-[15px] bg-[--primary] rounded-[3px] text-white flex items-center justify-center">
                        {element?.isBookmaker && 
                        <span className="text-[9px]">B</span>
                        // <img src='/dashbaord/f-icon.png' className="w-[12px] h-[12px]" />
                        }
                        </span>
                        {/* {element?.isBookmaker && (<span className="font-bold bg-[var(--primary)] flex justify-center items-center text-white rounded-full text-center w-[19px] h-[19px] text-[9px] pt-[3px]">BM</span>)} */}
                      </div>
                      <div className="
                      ">
                        {isInplay ? (
                            <div className="bg-[--primary] flex lg:hidden text-[9px] ms-4 text-white !w-[60px] items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                          ) :
                          (
                            <div className="border-2 border-[--primary] text-[9px] flex lg:hidden ms-4 text-[--primary] !w-[60px] items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                          )
                        }
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-[50%] hidden lg:flex w-full justify-center items-center gap-1 grid grid-cols-6 bg-white">
                    {/* {Array?.from({ length: 6 }).map((_, i) => {
                      const isLagai = i % 2 === 0;
                      return (
                        <div
                          key={i}
                          className={`relative w-full h-[33px] flex justify-center items-center`}
                        >
                          <div className={`${isLagai ? "bg-[var(--matchLagai)] !rounded-[4px]" : "!rounded-[4px] bg-[var(--matchKhai)]"} flex border-[1px] gap-3 h-[33px] border-white/40 flex-col justify-center items-center w-full text-sm font-semibold text-gray-900`}>
                            <div className="text-[12px] font-bold leading-[1px]"> {(Math.random() * 100).toFixed()}</div>
                            <div className="text-[9px] lg:block hidden leading-[1px] text-black">
                              {(Math.random() * 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                      
                    })} */}
                    {Array.from({ length: 6 }).map((_, i) => {
                        const isLagai = i % 2 === 0;
                        const isMiddleBox = i === 2 || i === 3; 

                        return (
                          <div
                            key={i}
                            className="relative w-full h-[33px] flex justify-center items-center"
                          >
                            <div
                              className={`${
                                isMiddleBox
                                  ? "bg-[#a3a3a3]" // 👈 custom color for middle boxes
                                  : isLagai
                                  ? "bg-[var(--matchLagai)]"
                                  : "bg-[var(--matchKhai)]"
                              } flex border-[1px] gap-3 h-[33px] border-white/40 flex-col justify-center items-center w-full text-sm font-semibold text-gray-900 rounded-[4px]`}
                            >
                              <div className="text-[12px] font-bold leading-[1px]">
                                {(Math.random() * 100).toFixed()}
                              </div>
                              <div className="text-[9px] lg:block hidden leading-[1px] text-black">
                                {(Math.random() * 100).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                  </div>
                  <div className="w-[50%] flex lg:hidden justify-end items-center gap-1 grid grid-cols-3 bg-white">
                    {Array.from({ length: 3 }).map((_, i) => {
                        const isLagai = i % 2 === 0;
                        const isMiddleBox = i === 2 || i === 3; 

                        return (
                          <div
                            key={i}
                            className="relative w-full h-[33px] flex justify-center items-center"
                          >
                            <div
                              className={`${
                                isMiddleBox
                                  ? "bg-[var(--matchLagai)]" 
                                  : isLagai
                                  ? "bg-[var(--matchLagai)]"
                                  : " bg-[#a3a3a3]"
                              } flex border-[1px] gap-3 h-[33px] border-white/40 flex-col justify-center items-center w-full text-sm font-semibold text-gray-900 rounded-[4px]`}
                            >
                              <div className="text-[12px] font-bold leading-[1px]">
                                {(Math.random() * 100).toFixed()}
                              </div>
                              <div className="text-[9px] lg:block hidden leading-[1px] text-black">
                                {(Math.random() * 100).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <div className="h-full overflow-yauto md:px-0 m-auto md:max-h-none md:overflow-auto">
      {content}
      {logniModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]" onClose={() => setLogniModal(false)}>
          <Login onClose={() => setLogniModal(false)} />
        </div>
      )}
    </div>
  );
}

export default InplayMatches;
