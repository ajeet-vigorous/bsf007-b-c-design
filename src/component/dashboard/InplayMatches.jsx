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
  const token = localStorage.getItem("token");

  const handleLoginModal = () => {
    if (!localStorage.getItem("token")) {
      setLogniModal(true);
    }
  };

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
              <div className="relative text-sm bg-[var(--secondary)] w-full rounded-t-[5px] font-bold text-[--primary] py-1.5 px-3">
                <div className="flex space-x-3 items-center">
                  
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[12px] !h-[12px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
                  {/* <img src="/subHeader/menu-7.png" className="w-[20px] h-[20px]" alt="menu" /> */}
                  <p className="text-[15px] font-semibold">Horse Racing</p>
                </div>
                {/* <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span> */}
              </div>
            </div>
          </>

        )}
        {gameId === "4339" && (
          <>
            <div>
              <div className="relative text-sm bg-[var(--secondary)] w-full rounded-t-[5px] font-bold text-[--primary] py-1.5 px-3">
                <div className="flex space-x-3 items-center">
                  {/* <img src="/subHeader/menu-4339.png" className="w-[20px] h-[20px]" alt="menu" /> */}
                  
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[12px] !h-[12px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
                  <p className="text-[15px] font-semibold">Greyhound Racing</p>
                </div>
                {/* <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span> */}
              </div>
            </div>
          </>
        )}

        <div className="justify-center my-3 flex gap-2 items-center p-0">
          {Object.keys(groupedBySeries)?.map((el, index) => {
            return (
              <>
                <div onClick={() => setSubTab(el)} className={`cursor-pointer w-[70px] h-[50px] rounded-md flex items-center justify-center text-black text-[14px] hover:bg-[var(--secondary)] ${subTab === el ? "bg-[var(--secondary)] px-5 py-[4px]" : "px-5 py-[4px] bg-[#d1d5db]"}`} key={index}>
                  {el}
                </div>
              </>
            )
          })}
        </div>
        <div className="bg-[#F2F2F2] ">
          {groupedBySeries[subTab] && functiongroupbyRacingmatch(groupedBySeries[subTab])?.length > 0 ? (
            functiongroupbyRacingmatch(groupedBySeries[subTab])?.map((match, index) => (
              <div key={index} className="flex xl:items-center p-1.5 xl:justify-start md:grid md:grid-cols-[0.5fr_1.5fr]  xl:flex-row flex-col items-start justify-between gap-2 border py-3 border-gray-300">
                <div className="flex flex-row justify-start items-center gap-2">
                  <FaTv className="text-black" />
                  <div className="text-[12px] min-w-full font-[600] capitalize">{match?.key}</div>
                </div>
                {console.log(match, "matchtttt")
                }
                {<div className=" min-w-full items-end grid grid-cols-5 gap-1">

                  {match?.value?.map((allMatchTime, newindex) => (
                    <div onClick={() => {
                     if (token) {
      window.location.href = `/sport-view-racing/${allMatchTime?.marketId}/${allMatchTime?.eventId}/${allMatchTime?.sportId}`;
    } else {
      handleLoginModal();
    }
  }}
                    key={newindex} className="bg-[#d1d5db] rounded-[4px] text-black px-2.5 py-[4px] font-semibold text-[12px] text-center cursor-pointer">
                      {moment(allMatchTime?.matchDate, 'YYYY-MM-DD HH:mm:ss', true).isValid() ? (
                        moment.utc(allMatchTime.matchDate, "YYYY-MM-DD HH:mm:ss").local().format("HH:mm")

                      ) : null}

                    </div>
                  ))}
                </div>}
              </div>
            ))
          ) : (
            <>
              <div className="lg:flex hidden justify-between px-1.5 py-1 w-full border-b border-t border-[#C6D2D8]">
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
          <div className="flex items-center justify-between w-full bg-[--secondary] border-b rounded-t-[8px]">
            <div className="relative text-sm flex items-center gap-3  w-[180px] font-bold text-[--primary] py-1.5 px-2">
              
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              {sportName}
              {/* <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span> */}
            </div>
            <p className="w-[40%] grid grid-cols-3 text-center text-sm font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </p>
          </div>
          <div className="border-b px-3 py-1.5 font-[500] text-[#444444] text-[13px] bg-white text-center">
            No real-time records found!
          </div>
        </>
      );
    } else {
      content = (
        <div className="overflow-y-auto">
          <div className="flex justify-between items-center w-full bg-[--secondary] rounded-t-[8px]">
            <div className="lg:w-[50%] w-full sm:flex items-center lg:space-x-24 lg:justify-start justify-between">
              <div className="relative text-sm font-bold text-[--primary] py-1.5 px-2 flex justify-start items-center space-x-1">
                {sportName === "Cricket" && 
                // <img src='/subHeader/menu-4.png' className="w-4 h-4" />
                  <div className="flex items-center gap-3">
                    <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt=""/>
                    <img className='!w-[12px] !h-[12px] rotate-90 ' src="/images/zetto/arrowblack.png" alt=""/>
                  </div>
                }
                {sportName === "Soccer" && 
                  // <img src='/subHeader/menu-1.png' className="w-4 h-4" />
                  <div className="flex items-center gap-3">
                    <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt=""/>
                    <img className='!w-[12px] !h-[12px] rotate-90 ' src="/images/zetto/arrowblack.png" alt=""/>
                  </div>
                }
                {sportName === "Tennis" && 
                  // <img src='/subHeader/menu-2.png' className="w-4 h-4" />
                    <div className="flex items-center gap-3">
                    <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt=""/>
                    <img className='!w-[12px] !h-[12px] rotate-90 ' src="/images/zetto/arrowblack.png" alt=""/>
                  </div>
                }
                <p>{sportName}</p>
              </div>
              <div className="flex justify-end items-center gap-2 pr-1">
                {/* <div
                  onClick={() => setIsLive(!isLive)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isLive ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isLive ? "- LIVE" : "+ LIVE"}
                </div> */}

                {/* <div
                  onClick={() => setIsVirtual(!isVirtual)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isVirtual ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isVirtual ? "- VIRTUAL" : "+ VIRTUAL"}
                </div>

                <div
                  onClick={() => setIsPremium(!isPremium)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isPremium ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isPremium ? "- Premium" : "+ Premium"}
                </div> */}

              </div>
            </div>
            <div className="w-[50%] lg:grid hidden grid-cols-3 text-center text-[--primary] text-xs font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
          </div>

          {filteredMatches?.map((element, index) => {
            const isInplay = isInplayMatch(element);
            return (
              // <div
              //   className="divide-y divide-[#C6D2D8] border-b border-[#C6D2D8] md:pb-0 pb-1.5"
              //   key={index}
              // >
              //   <div className="lg:flex w-full">
              //     <div className="lg:w-[50%] w-full flex justify-between items-center bg-white">
              //       <div className="flex items-center justify-start w-full bg-white">
              //         <a
              //           href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
              //           className="flex items-center justify-start py-1 space-x-1 w-full"
              //         >
              //           <div className="flex flex-col uppercase w-full sm:w-[32%] px-2">
              //             <span className="text-[11px] font-semibold text-gray-900 hover:underline truncate">
              //               {element?.matchName}
              //             </span>
              //             <span className="text-[9px] font-[500] text-[#838383] truncate">
              //               ({element?.seriesName ? element?.seriesName : "No Series"})
              //             </span>
              //           </div>

              //           {isInplay && (
              //             <span className="w-full sm:w-[15%] flex flex-col items-center justify-center text-[#03B37F] font-bold text-[13px] tracking-wide">
              //               <p className="pt-2">LIVE</p>
              //               <span className="block w-8 h-[2px] bg-[#03B37F] mt-[4px] animate-marquee-left-to-right"></span>
              //             </span>
              //           )}
              //           <div className="bg-[#E9EFF8] w-full sm:w-[10%] text-[#FF0000] text-xs font-normal px-2 py-1 rounded-sm text-center leading-tight">
              //             {element?.matchDate && (
              //               <>
              //                 <div>{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('DD MMM')}</div>
              //                 <div className="text-[10px]">
              //                   {moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('hh:mm A')}
              //                 </div>
              //               </>
              //             )}
              //           </div>
              //         </a>
              //       </div>

              //       <div className="flex items-center space-x-1.5 cursor-pointer pr-3">
              //         {element?.isTv && <LiaDesktopSolid size={16} />}
              //         {element?.isFancy && <img src='/dashbaord/f-icon.png' className="w-[12px] h-[12px]" />}
              //         {element?.isBookmaker && (<span className="font-bold bg-[var(--primary)] flex justify-center items-center text-white rounded-full text-center w-[19px] h-[19px] text-[9px] pt-[3px]">BM</span>)}
              //       </div>
              //     </div>

              //     <div className="lg:w-[50%] w-full grid grid-cols-6 ">
              //       {Array?.from({ length: 6 }).map((_, i) => {
              //         const isLagai = i % 2 === 0;
              //         return (
              //           <div
              //             key={i}
              //             className={`relative w-full h-full `}
              //           >
              //             <div className={`${isLagai ? "bg-[var(--matchLagai)]" : "bg-[var(--matchKhai)]"} p-1 flex border-[1px] border-white/40 flex-col justify-center items-center text-center w-full h-full text-sm font-semibold text-gray-900`}>
              //               <p> {(Math.random() * 100).toFixed()}</p>
              //               <p className="text-[10px] lg:block hidden text-gray-600">
              //                 {(Math.random() * 100).toFixed(2)}
              //               </p>
              //             </div>
              //           </div>
              //         );
              //       })}
              //     </div>
              //   </div>
              // </div>
               <div
                              className="divide-y divide-[#f8f8f8] border border-gray-200 md:pb-0 h-[58px] lg:h-[44px]"
                              key={index}
                            >
                              <div className="flex  w-full h-full">
                                <div className="lg:w-[50%] w-full flex justify-between items-center bg-white">
                                  <div className="flex items-center justify-start w-full bg-white">
                                    {/* <a
                                      href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
                                      className="flex items-center justify-start py-1 space-x-1 w-full"
                                    >
                                      <div className="hidden lg:flex">
                                          {isInplay ? (
                                            <div className="bg-[--primary] text-[9px] ms-4 text-[--secondary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                                          ) :
                                          (
                                            <div className="bg-[--secondary] text-[9px] ms-4 text-[--primary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                                          )
                                        }
                                      </div>
                                      
                                      <div className="flex flex-col uppercase w-full px-2">
                                        {element?.seriesName && <span className="text-[7px] text-[--primary] capitalize font-bold lg:bg-[--secondary] w-fit px-1 rounded-[5px]">
                                          ({element?.seriesName ? element?.seriesName : "No Series"})
                                        </span>}
                                        <span className="text-[11px] font-bold capitalize text-gray-900 hover:underline">
                                          {element?.matchName}
                                        </span>
                                      </div>
                                    </a> */}
                                    {token ? <a
                                                            href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
                                                            className="flex items-center justify-start py-1 space-x-1 w-full"
                                                          >
                                                            <div className="hidden lg:flex">
                                                                {isInplay ? (
                                                                  <div className="bg-[--primary] text-[9px] ms-4 text-[--white] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                                                                ) :
                                                                (
                                                                  <div className="border-[--primary] border-2 text-[9px] ms-4 text-[--primary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                                                                )
                                                              }
                                                            </div>
                                                            <div className="flex flex-col uppercase w-full px-2">
                                                              {element?.seriesName && <span className="text-[10px] text-[--white] capitalize font-bold lg:bg-[--primary] w-fit px-1 rounded-[5px]">
                                                                ({element?.seriesName ? element?.seriesName : "No Series"})
                                                              </span>}
                                                              <span className="text-[11px] font-bold capitalize text-gray-900 hover:underline">
                                                                {element?.matchName}
                                                              </span>
                                                            </div>
                                                          </a> : <span
                                                            onClick={()=>handleLoginModal()}
                                                            className="flex items-center justify-start py-1 space-x-1 w-full"
                                                          >
                                                            <div className="hidden lg:flex">
                                                                {isInplay ? (
                                                                  <div className="bg-[--primary] text-[9px] ms-4 text-[--white] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                                                                ) :
                                                                (
                                                                  <div className="border-[--primary] border-2 text-[9px] ms-4 text-[--primary] !w-[60px] flex items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                                                                )
                                                              }
                                                            </div>
                                                            <div className="flex flex-col uppercase w-full px-2">
                                                              {element?.seriesName && <span className="text-[10px] md:block hidden text-[--white] capitalize font-bold lg:bg-[--primary] w-fit px-1 rounded-[5px]">
                                                                ({element?.seriesName ? element?.seriesName : "No Series"})
                                                              </span>}
                                                              <span className="text-[11px] font-bold capitalize text-gray-900 hover:underline">
                                                                {element?.matchName}
                                                              </span>
                                                            </div>
                                                          </span>}
                                  </div>
                                  <div className="flex flex-col gap-1 me-2">
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
                                          <div className="bg-[--primary] flex lg:hidden text-[9px] ms-4 text-[--secondary] !w-[60px] items-center justify-center h-[22px] rounded-[3px] font-semibold">Inplay</div>
                                        ) :
                                        (
                                          <div className="bg-[--secondary] text-[9px] flex lg:hidden ms-4 text-[--primary] !w-[60px] items-center justify-center h-[22px] rounded-[3px] font-semibold">{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format("HH:mm")}</div>
                                        )
                                      }
                                    </div>
                                  </div>
                                </div>
              
                                <div className="lg:w-[50%] hidden lg:flex w-full justify-center items-center gap-1 grid grid-cols-6 bg-white pe-2">
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
                                <div className="w-[50%] flex lg:hidden justify-end items-center gap-1 grid grid-cols-3 bg-white pe-2">
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
    <div className="h-full overflowy-auto md:px-0 m-auto md:max-h-none md:overflow-auto">
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