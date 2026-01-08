/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp, FaCircle, FaMinus, FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import StakeSettings from "../profile/StakeSettings";
import BetPlaceCounter from "../BetPlaceCounter/BetPlaceCounter";

export const betChipsData = {
  1000: 1000,
  2000: 2000,
  5000: 5000,
  10000: 10000,
  20000: 20000,
  50000: 50000,
  100000: 100000,
  250000: 250000,
};

export function BetPlaceDesktop(props) {
  let {
    openBets,
    matchData,
    betSlipData,
    placeBet,
    count,
    betLoading,
    increaseCount,
    decreaseCount,
    errorMessage,
    successMessage,
    handleButtonValues,
    isMatchCoin,
  } = props;

  const betchipdata = localStorage.getItem("clientbetChipsData")
    ? Object.values(JSON.parse(localStorage.getItem("clientbetChipsData")))
    : "";
  const [editStake, setEditStake] = useState(false);

  const myArray = Object.values(betChipsData);
  const modalRef = useRef();
  const [positions, setPositionData] = useState(0);
  console.log(editStake, 'editStake');
  

  useEffect(() => {
    if (
      betSlipData &&
      betSlipData.position &&
      betSlipData.position.length > 0
    ) {
      betSlipData &&
        betSlipData.position.forEach((eles) => {
          if (betSlipData.selectionId == eles._id) {
            setPositionData(eles.position);
          }
        });
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // handleClose(); // Close modal when clicking outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [betSlipData]);

  const [stake, setStack] = useState(0);
  let [placeButton, setPlaceButton] = useState(false);

  const updateInputValue = (event) => {
    const newValue = parseFloat(event.target.value);
    setStack(() => {
      const newStack = !isNaN(newValue) ? (newValue >= 0 ? newValue : 0) : 0;
      betSlipData.stake = newStack;
      if (betSlipData.stake > 0) {
        setPlaceButton(true);
      }
      if (betSlipData.stake <= 0) {
        setPlaceButton(false);
      }
      updateOddsPostModal();
      return newStack;
    });
  };

  // prevStack +
  const updateFinalBalance = (amount) =>
    setStack((prevStack) => {
      const newStack = Number(amount);
      betSlipData.stake = newStack;
      if (betSlipData.stake > 0) {
        setPlaceButton(true);
      }
      if (betSlipData.stake <= 0) {
        setPlaceButton(false);
      }
      return newStack;
    });

  if (betSlipData.oddsType == "fancy") {
    // filterdata = runCount.session.filter(session => session.Selection_id == betSlipData.data.Selection_id);
  }

  if (betSlipData.oddsType == "bookmaker") {
    // filterdata = runCount.team_data.filter(session => session.selectionid == betSlipData.data.selectionid);
  }

  const arrayData = (element, isPlus = false) => {
    if (element > 0) {
      if (isPlus) {
        updateFinalBalance(betSlipData.stake + element);
      } else {
        updateFinalBalance(element);
      }
      updateOddsPostModal();
    }
  };

  // const arrayData = (element) => {
  //   if (element > 0) {
  //     updateFinalBalance(element);
  //     updateOddsPostModal()
  //   }
  // };

  const updateOddsPostModal = async () => {
    let oddsType = betSlipData?.oddsType;
    let positionArray = {};
    let positionArrayNew = {};

    if (oddsType == "Match Odds" || oddsType == "Tied Match") {
      betSlipData?.nameOther?.map((oddsData) => {
        if (
          oddsData.selectionId == betSlipData.selectionId &&
          betSlipData.betType == "L"
        ) {
          positionArray[oddsData.selectionId] =
            betSlipData.stake * (betSlipData.odds - 1);
        }
        if (
          oddsData.selectionId == betSlipData.selectionId &&
          betSlipData.betType == "K"
        ) {
          positionArray[oddsData.selectionId] =
            -1 * betSlipData.stake * (betSlipData.odds - 1);
        }
        if (
          oddsData.selectionId != betSlipData.selectionId &&
          betSlipData.betType == "L"
        ) {
          positionArray[oddsData.selectionId] = -1 * betSlipData.stake;
        }
        if (
          oddsData.selectionId != betSlipData.selectionId &&
          betSlipData.betType == "K"
        ) {
          positionArray[oddsData.selectionId] = betSlipData.stake;
        }

        let currentPos = betSlipData.position[oddsData.selectionId]
          ? betSlipData.position[oddsData.selectionId]
          : 0;
        let calculatePos = positionArray[oddsData.selectionId];

        positionArray[oddsData.selectionId] =
          Number(calculatePos) + Number(currentPos);
        positionArrayNew[oddsData.selectionId] = Number(calculatePos);
      });
    }

    if (oddsType == "toss" || oddsType == "bookmaker") {
      betSlipData?.nameOther.map((oddsData) => {
        if (
          oddsData.selectionid == betSlipData.selectionId &&
          betSlipData.betType == "L"
        ) {
          positionArray[oddsData.selectionid] =
            betSlipData.stake * betSlipData.odds;
        }
        if (
          oddsData.selectionid == betSlipData.selectionId &&
          betSlipData.betType == "K"
        ) {
          positionArray[oddsData.selectionid] =
            -1 * betSlipData.stake * betSlipData.odds;
        }
        if (
          oddsData.selectionid != betSlipData.selectionId &&
          betSlipData.betType == "L"
        ) {
          positionArray[oddsData.selectionid] = -1 * betSlipData.stake;
        }
        if (
          oddsData.selectionid != betSlipData.selectionId &&
          betSlipData.betType == "K"
        ) {
          positionArray[oddsData.selectionid] = betSlipData.stake;
        }

        let currentPos = betSlipData.position[oddsData.selectionid]
          ? betSlipData.position[oddsData.selectionid]
          : 0;
        let calculatePos = positionArray[oddsData.selectionid];

        positionArray[oddsData.selectionid] =
          Number(calculatePos) + Number(currentPos);
        positionArrayNew[oddsData.selectionid] = Number(calculatePos);
      });
    }

    betSlipData.oldPos = betSlipData.position;
    betSlipData.position = positionArray;
  };

  const handleClear = () => {
    setStack(0);
    betSlipData.stake = 0;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"; // Convert to '1K', '2.5K' etc.
    }
    return num; // Return the number as is if it's less than 1000
  };

  return (
    <div
      ref={modalRef}
      className={`xl:block hidden relative w-100 overflow-x-auto overflow-y-auto  ${betSlipData.betType === "Y" || betSlipData.betType === "L"
        ? "!bg-[var(--matchLagai)]"
        : "bg-[var(--matchKhai)]"
        }`}
    >
      <div class="bg-neutral-700 relative mx-2 my-px rounded-[4px]">
        <div class="flex px-1">
          <div class=" text-white text-[10px] font-bold mt-1.5 px-1">{matchData?.sportType} : {matchData?.matchType}</div>
        </div>
        <div class="text-white text-[10px] font-bold ml-1 px-1">{matchData?.matchName}</div>
        <div class="flex my-1 px-1 pb-2">
          <button class={`${betSlipData.betType === "Y" || betSlipData.betType === "L"
            ? "!bg-[var(--matchLagai)]" : "bg-[var(--matchKhai)]"} w-[66px] h-[17px] rounded-sm justify-center items-center gap-[5.11px] inline-flex ml-6 mx-1 px-1`} >
            <div class="text-center text-neutral-800 text-[10px] font-bold px-1">
              {betSlipData?.data?.price}</div>
          </button>
          <div class=" text-white text-[9px] font-bold mt-px px-1">{betSlipData?.teamname}</div>
          <div class="text-white text-[9px] mr-3 font-bold ml-auto flex flex-wrap px-1">
            <div class="px-1">Min: {isMatchCoin?.min}/</div> <div class="px-1">Max: {isMatchCoin?.max}</div>
          </div>
        </div>
      </div>
      {/* <strong className="flex justify-between  px-1 text-white py-1"> <span>Bet Slip</span> <a target="_blank" href="/admin/profile" class="button hover:text-white hover:underline" >Edit Bet Sizes</a></strong> */}
      <table className="table-auto bg-gray-300  text-sm w-full table">
        {/* <thead>
          <tr className='text-sm font-[800] py-1'>
            <th className='text-left px-1 py-1'>(Bet for)</th>
            <th width='10%'>Odds</th>
            <th>Stake</th>
            <th>Profit</th>
          </tr>
        </thead> */}
        <tbody
          className={`${betSlipData.betType === "Y" || betSlipData.betType === "L"
            ? "!bg-[var(--matchLagai)]"
            : "bg-[var(--matchKhai)]"
            } my-2`}
        >
          <tr className={`border-b border-[#c7c8ca]`}>
            <div width="100% h-full ">
              <div><span className="text-xs pl-3">Stack</span></div>
              <div className="relative h-full grid pt-1 grid-cols-2 px-1 gap-1 items-center">
                {/* <div className="flex h-full items-center">
                  <div
                    onClick={decreaseCount}
                    className="cursor-pointer  h-full  flex justify-center items-center w-[40px] bg-[#024F99] leading-none"
                  >
                    <FiMinus size={14} color="white" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    className="w-full pr-6 py-[18px] text-center bg-white border border-gray-300 rounded-sm h-[25px] focus:outline-none"
                    id="exampleFormControlInput1"
                    value={
                      betSlipData.oddsType === "fancy" ||
                        betSlipData.oddsType === "bookmaker" ||
                        betSlipData.oddsType === "toss"
                        ? (count * 100).toFixed(2).replace(/\.00$/, "")
                        : count
                    }
                  />
                  <div
                    onClick={increaseCount}
                    className="cursor-pointer  h-full  flex justify-center items-center    w-[40px] bg-[#024F99] leading-none"
                  >
                    <GoPlus size={14} color="white" />
                  </div>
                </div> */}
                <div className="flex flex-col">
                  <div className="flex items-center w-full overflow-hidden h-9">
                    <button className="text-black font-bold cursor-pointer bg-[var(--secondary)] w-[30px] h-[28px] pl-[7px] pr-1.5 pt-1.5 pb-[5.45px] rounded-[5px] border justify-center items-center inline-flex" onClick={decreaseCount}>
                      <FiMinus size={13} />
                    </button>
                    <div className="p-1 mx-1 bg-white text-[10px] !rounded text-black border border-white flex justify-center items-center text-left text-sm w-full">{count && count ? count : 0}</div>
                    <button className="text-black font-bold cursor-pointer bg-[var(--secondary)] w-[30px] h-[28px] pl-[7px] pr-1.5 pt-1.5 pb-[5.45px] rounded-[5px] border justify-center items-center inline-flex" onClick={increaseCount}>
                      <GoPlus size={13} />
                    </button>
                  </div>
                </div>
                <div width="100%">
                  <div className="stake">
                    <input
                      type="text"
                      className="w-full py-[7px]  text-center bg-white text-black border border-black rounded"
                      id="exampleFormControlInput1"
                      value={betSlipData.stake ? betSlipData.stake : ""}
                      onChange={updateInputValue}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* <td className="text-right ">
              {Array?.isArray(betSlipData?.nameOther) &&
                betSlipData.nameOther.length <= 3
                ? betSlipData.nameOther.map((other, index) => (
                  <React.Fragment key={index}>
                    <div className="text-sm font-bold pr-2">
                      {betSlipData.oddsType == "Match Odds" ||
                        betSlipData.oddsType == "Tied Match" ? (
                        <span
                          className={`${!isNaN(betSlipData.position[other.selectionId]) &&
                              parseFloat(
                                betSlipData.position[other.selectionId]
                              )
                                .toFixed(2)
                                .replace(/\.?0+$/, "") < 0
                              ? "text-red-500"
                              : "text-green-700"
                            } font-bold col-12 text-center`}
                        >
                          {!isNaN(betSlipData.position[other.selectionId])
                            ? parseFloat(
                              betSlipData.position[other.selectionId]
                            )
                              .toFixed(2)
                              .replace(/\.?0+$/, "")
                            : ""}
                        </span>
                      ) : betSlipData.oddsType == "fancy" ? null : (
                        <span
                          className={`${!isNaN(betSlipData.position[other.selectionid]) &&
                              parseFloat(
                                betSlipData.position[other.selectionid]
                              )
                                .toFixed(2)
                                .replace(/\.?0+$/, "") < 0
                              ? "text-red-500"
                              : "text-green-700"
                            } font-bold col-12 text-center`}
                        >
                          {!isNaN(betSlipData.position[other.selectionid])
                            ? parseFloat(
                              betSlipData.position[other.selectionid]
                            )
                              .toFixed(2)
                              .replace(/\.?0+$/, "")
                            : ""}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                ))
                : null}
            </td> */}
          </tr>
          <tr className="">
            <td colSpan={4}>
              <table className="table-auto text-sm w-full !border-0">
                <tbody>
                  {/* <tr className='grid grid-cols-4 gap-1 py-1 items-center !border-0'>
                    {betChipsLocalStorage?.stakeList?.map((item, index) => {
                      const key = Object.keys(item)[0];
                      const value = item[key];
                      return (
                        <td key={index} className="flex py-2 justify-center items-center bg-[#CCCCCC] !border-0 " onClick={() => arrayData(value)}>
                          <span className='text-gray-700 text-md font-light'>{value}</span>
                        </td>
                      )
                    })}
                    {myArray && myArray.map((element, index) => (
                      <td key={index} className="flex justify-center items-center bg-[#CCCCCC] border rounded" onClick={() => arrayData(element)}>
                        <span className='text-gray-700 text-md font-light'>{formatNumber(element)}</span>
                      </td>
                    ))}
                  </tr> */}

                  <tr className="grid grid-cols-4 gap-[3px] py-1 items-center !border-0 px-1">
                    {betchipdata?.map((item, index) => {
                      return (
                        <td
                          key={index}
                          className="flex py-1.5 justify-center items-center bg-white border border-black rounded "
                          onClick={() => arrayData(item, true)}
                        >
                          <span className="text-black text-xs font-[500]">
                            {(item)}
                            {/* {formatNumber(item)} */}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {/* <tr className='!border-0 px-1'>
                    <td className='!border-0'>
                      <div className="py-1 text-red-600 text-xs font-semibold text-right px-8">
                        {errorMessage ? errorMessage : ""}
                      </div>
                      <div className="py-1 text-green-600 text-xs font-semibold text-right px-8">
                        {successMessage ? successMessage : ""}
                      </div>
                    </td>
                  </tr> */}
                  <tr className="">
                    {/* <div className='flex justify-end items-center pb-1 px-2'>
                      <button type="reset" className="align-left text-black/70 underline" onClick={handleClear}><b>Clear</b></button>
                    </div> */}
                    <div className="grid grid-cols-4 gap-0.5 p-0.5">
                      <div className="p-1 mx-1 bg-[var(--secondary)] text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer" onClick={() => { arrayData(1) }}>All In</div>
                      <div
                        className={`p-1 mx-1 bg-white text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer `}
                        onClick={() => { arrayData(isMatchCoin?.min) }}
                      >
                        Min
                      </div>
                      <div
                        className={`p-1 mx-1 bg-white text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer`}
                        onClick={() => { arrayData(isMatchCoin?.max) }}
                      >
                        Max
                      </div>

                      <div
                        className={`p-1 mx-1 bg-white text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer`}
                        onClick={() => {
                          handleClear();
                        }}
                      >
                        <b className="flex justify-center items-center">
                          Clear
                        </b>
                        <div className="ld ld-ball ld-flip"></div>
                      </div>
                    </div>
                  </tr>
                  <tr>
                    {/* <div className='flex items-center justify-between p-1'>
                      <button className="bg-[#097c93] hover:bg-[#097c93]/90 flex justify-center items-center text-white text-[14px] px-3 py-2 h-[35px] w-[16%] cursor-pointer"
                        onClick={() => {
                          handleButtonValues();
                        }}
                      >
                        Edit
                      </button>


                      <div className='flex gap-1'>
                        <div className={` px-4 py-2 font-[500] btn bg-[#bd1828] hover:bg-[#FC4242]/90 border-[1px] border-[#bd1828]  text-white ld-over cursor-pointer `}
                          onClick={() => openBets()}>Reset
                          <div className="ld ld-ball ld-flip">
                          </div>
                        </div>
                        <div className={` px-4 py-2 font-[500] btn bg-[#0b7d36] hover:bg-[#0b7d36]/90 border-[1px] border-[#0b7d36] hover:border-[#0b7d36]/90 text-white ld-over cursor-pointer ${betLoading ? "opacity-50 border-2 border-green-900" : ""}`}
                          onClick={() => { placeBet() }}>
                          <b className='flex justify-center items-center'>
                            Submit

                          </b>
                          <div className="ld ld-ball ld-flip">
                          </div>
                        </div>

                      </div>
                    </div> */}

                    <div className="grid grid-cols-2 gap-1 pt-4 p-1">
                      <div>
                        <div
                          className={`p-1 mx-1 py-2 bg-white text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer `}
                          onClick={() => {
                            openBets();
                          }}
                        >
                          Cancel
                          <div className="ld ld-ball ld-flip"></div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={` p-1 py-2 mx-1 bg-[#70889E] text-[10px] rounded border border-black text-[#00FFE6] flex justify-center items-center text-left text-sm cursor-pointer  `}
                          onClick={() => {
                            placeBet();
                          }}
                        >
                          Placer Bet
                          <div className="ld ld-ball ld-flip"></div>
                        </div>
                      </div>
                    </div>
                  </tr>
                  <tr className=" ">
                    {/* <td className='!border-0'>
                      <button type="reset" className="align-left btn btn-warning" onClick={handleClear}><b>Clear</b></button>
                    </td> */}
                    <td className="!border-0">
                      {/* <div onClick={() => openBets()} className=' relative flex justify-center items-center'>
                                <FaCircle size={12} className='text-white absolute left-5 top-1 bottom-0 animate-ping' />
                                <span className='text-white/40'>Reset</span>
                              </div> */}
                    </td>

                    <td className="!border-0"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {betLoading && (
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-[#ffffffc5] border-2 border-[--primary] ">
          <BetPlaceCounter />
        </div>
      )}
      {editStake && (
        <div
          onClick={(e) => {
            setEditStake(false);
            e.stopPropagation();
          }}
          className="fixed inset-0 z-50 top-0 left-0 h-full w-full flex justify-center items-start bg-black/50 "
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-[450px] mt-6 bg-white h-[300px]"
          >
            <div className="bg-black flex justify-between items-center text-white p-2 w-full">
              Stake{" "}
              <span
                onClick={(e) => {
                  setEditStake(false);
                  e.stopPropagation();
                }}
                className="cursor-pointer "
              >
                X
              </span>
            </div>

            <StakeSettings />
          </div>
        </div>
      )}
    </div>
  );
}
