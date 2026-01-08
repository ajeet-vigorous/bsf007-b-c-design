/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react'
import { FaCircle, FaMinus, FaPlus } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import StakeSettings from '../profile/StakeSettings';
import { FiMinus } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import BetPlaceCounter from '../BetPlaceCounter/BetPlaceCounter';

export const betChipsData = {
    "1000": 1000,
    "2000": 2000,
    "5000": 5000,
    "10000": 10000,
    "20000": 20000,
    "50000": 50000,
    "100000": 100000,
    "250000": 250000,
};

export default function PlaceBetMobile(props) {
    const { decreaseCount, count, setBetSlipData, handleButtonValues, increaseCount, betShowM, placeBet, handleClose, betSlipData, betLoading, inputChange, isFetch, isMatchCoin, openBets } = props;
    const updateStackOnclic = (input) => {
        const numericInput = parseFloat(input);
        if (!isNaN(numericInput)) {
            setBetSlipData((state) => ({
                ...state,
                stake: Number(state.stake) + numericInput
            }));
        }
    };


    const betchipdata = localStorage.getItem("clientbetChipsData") ? Object.values(JSON.parse(localStorage.getItem("clientbetChipsData"))) : "";

    const myArray = Object.values(betChipsData);
    const modalRef = useRef();
    const [positions, setPositionData] = useState(0);
    const [editStake, setEditStake] = useState(false);


  
    const [stake, setStack] = useState(0);
    let [placeButton, setPlaceButton] = useState(false)

     useEffect(() => {
    if (betSlipData?.position?.length > 0) {
      betSlipData.position.forEach((eles) => {
        if (betSlipData.selectionId == eles._id) {
          setPositionData(eles.position);
        }
      });
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [betSlipData]);

  // Effect to handle mobile screen overflow
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (!betShowM) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }
    return () => {
      if (isMobile) {
        document.body.classList.remove("overflow-hidden");
      }
    };
  }, [betShowM]);

  // Effect to update positions when count changes
  useEffect(() => {
    if (betSlipData) {
      // Update betSlipData.odds with the new count
      betSlipData.odds = count;
      updateOddsPostModal();
    }
  }, [count, betSlipData]);

  const updateInputValue = (event) => {
    const newValue = parseFloat(event.target.value);
    setStack(() => {
      const newStack = !isNaN(newValue) ? (newValue >= 0 ? newValue : 0) : 0;
      betSlipData.stake = newStack;
      if (betSlipData.stake > 0) {
        setPlaceButton(true);
        updateOddsPostModal();
      }
      if (betSlipData.stake <= 0) {
        setPlaceButton(false);
        betSlipData.oldPos = [];
        betSlipData.position = [];
      }
      return newStack;
    });
  };

  const updateFinalBalance = (amount, isPlus = false) => {
    setStack((prevStack) => {
      const newStack = isPlus ? prevStack + Number(amount) : Number(amount);
      betSlipData.stake = newStack;
      if (betSlipData.stake > 0) {
        setPlaceButton(true);
        updateOddsPostModal();
      }
      if (betSlipData.stake <= 0) {
        setPlaceButton(false);
        betSlipData.oldPos = [];
        betSlipData.position = [];
      }
      return newStack;
    });
  };

  const arrayData = (element, isPlus = false) => {
    if (element > 0) {
      updateFinalBalance(element, isPlus);
    }
  };


    if (betSlipData.oddsType == "fancy") {
        // filterdata = runCount.session.filter(session => session.Selection_id == betSlipData.data.Selection_id);
    }

    if (betSlipData.oddsType == "bookmaker") {
        // filterdata = runCount.team_data.filter(session => session.selectionid == betSlipData.data.selectionid);

    }




  const updateOddsPostModal = () => {
    let oddsType = betSlipData?.oddsType;
    let positionArray = {};
    let positionArrayNew = {};

    if (oddsType === "Match Odds" || oddsType === "Tied Match") {
      betSlipData?.nameOther?.forEach((oddsData) => {
        if (oddsData.selectionId === betSlipData.selectionId && betSlipData.betType === "L") {
          positionArray[oddsData.selectionId] = betSlipData.stake * (betSlipData.odds - 1);
        } else if (oddsData.selectionId === betSlipData.selectionId && betSlipData.betType === "K") {
          positionArray[oddsData.selectionId] = -1 * betSlipData.stake * (betSlipData.odds - 1);
        } else if (oddsData.selectionId !== betSlipData.selectionId && betSlipData.betType === "L") {
          positionArray[oddsData.selectionId] = -1 * betSlipData.stake;
        } else if (oddsData.selectionId !== betSlipData.selectionId && betSlipData.betType === "K") {
          positionArray[oddsData.selectionId] = betSlipData.stake;
        }

        let currentPos = betSlipData.position[oddsData.selectionId] || 0;
        let calculatePos = positionArray[oddsData.selectionId] || 0;
        positionArray[oddsData.selectionId] = Number(calculatePos) + Number(currentPos);
        positionArrayNew[oddsData.selectionId] = Number(calculatePos);
      });
    }

    if (oddsType === "toss" || oddsType === "bookmaker") {
      betSlipData?.nameOther?.forEach((oddsData) => {
        if (oddsData.selectionid === betSlipData.selectionId && betSlipData.betType === "L") {
          positionArray[oddsData.selectionid] = betSlipData.stake * betSlipData.odds;
        } else if (oddsData.selectionid === betSlipData.selectionId && betSlipData.betType === "K") {
          positionArray[oddsData.selectionid] = -1 * betSlipData.stake * betSlipData.odds;
        } else if (oddsData.selectionid !== betSlipData.selectionId && betSlipData.betType === "L") {
          positionArray[oddsData.selectionid] = -1 * betSlipData.stake;
        } else if (oddsData.selectionid !== betSlipData.selectionId && betSlipData.betType === "K") {
          positionArray[oddsData.selectionid] = betSlipData.stake;
        }

        let currentPos = betSlipData.position[oddsData.selectionid] || 0;
        let calculatePos = positionArray[oddsData.selectionid] || 0;
        positionArray[oddsData.selectionid] = Number(calculatePos) + Number(currentPos);
        positionArrayNew[oddsData.selectionid] = Number(calculatePos);
      });
    }

    betSlipData.oldPos = betSlipData.position;
    betSlipData.position = positionArrayNew;
    setPositionData(positionArrayNew); // Update local state to trigger re-render
  };

    const handleClear = () => {
        setStack(0);
        betSlipData.stake = 0;
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K'; // Convert to '1K', '2.5K' etc.
        }
        return num; // Return the number as is if it's less than 1000
    };

    return (
        <div className='xl:hidden flex justify-center items-start fixed bottom-24 z-30'>
            <div className={`xl:w-[50%] w-full relative   mx-auto ${betSlipData.type === "No"
                ? "bg-[var(--matchKhai)] "
                : "bg-[var(--matchLagai)]"
                } `}>
                {betLoading && <div className='absolute top-0 left-0 h-full w-full flex justify-center items-center bg-[#ffffffc5] border-2 border-[--primary] '>
                    <BetPlaceCounter />
                </div>
                }
                
                <div class="bg-neutral-700 relative h-7 rounded-[4px] flex justify-between items-center">
                    
                    <div class=" text-white text-[9px] font-bold mt-px px-1">{betSlipData?.teamname}</div>
                    <div class="text-white text-[9px] mr-3 font-bold ml-auto flex flex-wrap px-1">
                        <div class="px-1">Min: {isMatchCoin?.min}/</div> <div class="px-1">Max: {isMatchCoin?.max}</div>
                    </div>
                </div>
                {/* <div className=" w-full  h-full flex justify-between bg-[var(--primary)] pt-1.5 pb-3 px-2 items-center">
                    <h2 className="text-white text-[16px] font-[700]" >
                        Placebet
                    </h2>
                    <div className='text-center pl-2' onClick={() => handleClose()}>
                        <IoCloseSharp className='text-white cursor-pointer ' size={24} />
                    </div>
                </div> */}
                <div className=" space-x-1 text-black px-2 pt-2.5">
      {Array.isArray(betSlipData?.nameOther) && betSlipData.nameOther.length > 0 && (() => {
  const shownValues = new Set();

  // Filter unique positions
  const filteredData = betSlipData.nameOther.filter(other => {
    const id = other.selectionId || other.selectionid;
    const pos = betSlipData.position?.[id];

    if (!isNaN(pos)) {
      const value = parseFloat(pos).toFixed(0);
      if (shownValues.has(value)) return false;
      shownValues.add(value);
      return true;
    } else if (!shownValues.has("NaN")) {
      shownValues.add("NaN");
      return true;
    }
    return false;
  });

  return filteredData.map((other, index) => {
    const id = other.selectionId || other.selectionid;
    const position = betSlipData.position?.[id];
    const isValid = !isNaN(position);
    const value = isValid ? parseFloat(position).toFixed(0) : "";

    const colorClass = !isValid || parseFloat(value) === 0
      ? "text-black"
      : parseFloat(value) < 0
      ? "text-red-700"
      : "text-green-700";

    return (
      <div key={index} className="text-sm border-none font-bold ">
        {betSlipData.oddsType === "Match Odds" || betSlipData.oddsType === "Tied Match" ? (
          <span className={`${colorClass} px-1 font-bold`}>
            {other?.team_name} {value}
          </span>
        ) : betSlipData.oddsType === "fancy" ? null : (
            <div className='flex justify-between'>
                 <div className='text-xs'>{other?.team_name} </div>
<div className={`${colorClass} font-bold text-xs`}>
          {value}
          </div>
            </div>
          
        )}
      </div>
    );
  });
})()}

                </div>


                <div className="px-0  grid grid-cols-2 justify-between items-center gap-2 mx-2 ">
                    <div className="flex flex-col">
                        <div className="flex items-center w-full overflow-hidden h-9">
                            <button className="text-black font-bold cursor-pointer bg-[var(--secondary)] w-[30px] h-[28px] pl-[7px] pr-1.5 pt-1.5 pb-[5.45px] rounded-[5px] border justify-center items-center inline-flex" onClick={decreaseCount}>
                                <FaMinus size={13} />
                            </button>
                            <div className="p-1 mx-1 bg-white text-[10px] !rounded text-black border border-white flex justify-center items-center text-left text-sm w-full">{count && count ? count : 0}</div>
                            <button className="text-black font-bold cursor-pointer bg-[var(--secondary)] w-[30px] h-[28px] pl-[7px] pr-1.5 pt-1.5 pb-[5.45px] rounded-[5px] border justify-center items-center inline-flex" onClick={increaseCount}>
                                <FaPlus size={13} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        {/* <span className="text-center text-[12px]">Amount</span> */}
                        <input
                            type="text"
                            className="w-full py-[7px]  text-center bg-white text-black border border-black rounded"
                            id="exampleFormControlInput1"
                            value={betSlipData.stake ? betSlipData.stake : ""}
                            onChange={updateInputValue}
                        />
                    </div>

                </div>

                {/* <div className="grid grid-cols-2 gap-4 px-3 py-2">
                        <div className="bg-white my-1 rounded flex divide-x divide-gray-300">
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={decreaseCount}>-</span>
                            <span className="py-1 px-6 text-sm">{count && count ? count : 0}</span>
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={increaseCount}>+</span>
                        </div>
                        <div className="bg-white flex divide-x divide-gray-300">
                            <input className="focus:outline-none text-sm w-20 text-start px-2 py-1" type="number" placeholder="0" value={betSlipData.stake} onChange={inputChange} />
                        </div>
                    </div> */}
                {/* {isFetch ?
                            <button className="bg-[var(--primary)]  px-2 py-1 text-sm text-white font-semibold relative" >Submit
                                <div className=" flex items-center justify-center absolute top-0 right-2 bg-transparent">
                                    <div className="w-5 h-5 rounded-full animate-spin border-[5px] border-solid border-[#ffffff] border-t-transparent"></div>
                                </div>
                            </button> :
                            <button className="bg-[var(--primary)] px-2 py-1 text-sm text-white font-semibold" onClick={() => { placeBet() }}>Submit</button>} */}
                {/* <div className='font-medium text-base text-center'>
                            0
                        </div> */}
                <div className="grid grid-cols-4 gap-[3px] px-2 py-2">
                    {/* {betchipdata && betchipdata.length > 0 && betchipdata.map((chip) => (
                            <button key={chip} className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic(chip)}>{chip}</button>
                        ))} */}

                    {betchipdata && betchipdata.length > 0 && betchipdata.map((item, chip) => (
                        <button key={chip} className="flex py-1.5 justify-center items-center bg-gray-200 border border-black rounded "
                            onClick={() => updateStackOnclic(item)}>
                            <span className='text-black text-[12px] font-[500]'> {(item)}</span>
                        </button>
                    ))}
                    {/* <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("500")}>500</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("1000")}>1000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("2000")}>2000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("3000")}>3000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("4000")}>4000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("5000")}>5000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("10000")}>10000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("20000")}>20000</button> */}
                </div>

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
                <div className="grid grid-cols-2 gap-1 pt-4 p-1">
                    <div>
                        <div
                            className={`p-1 py-2 mx-1 bg-red-600 text-[10px] rounded border border-black text-black flex justify-center items-center text-left text-sm cursor-pointer `}
                            onClick={() => handleClose()}
                        >
                            Cancel
                            <div className="ld ld-ball ld-flip"></div>
                        </div>
                    </div>
                    <div>
                        <div
                            className={` p-1 py-2 mx-1 bg-green-700 text-md font-bold rounded border border-black text-white flex justify-center items-center text-left text-sm cursor-pointer  `}
                            onClick={() => {
                                placeBet();
                            }}
                        >
                            Place Bet
                            <div className="ld ld-ball ld-flip"></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

    );
}

