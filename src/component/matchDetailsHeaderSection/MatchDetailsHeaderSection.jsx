import { useState, useEffect } from 'react';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

const MatchDetailsHeaderSection = ({ children, marketType, minMax, cashOut }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    // Check if market is bookmarked on component mount
    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(marketType));
    }, [marketType]);

    // Handle bookmark toggle
    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        let updatedBookmarks;

        if (isBookmarked) {
            updatedBookmarks = bookmarks.filter(item => item !== marketType);
        } else {
            updatedBookmarks = [...bookmarks, marketType];
        }

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(!isBookmarked);
        showTempNotification();
    };

    // Show temporary notification
    const showTempNotification = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    // Toggle expand/collapse with animation
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleIButton = () => {
        setIsModalOpen(prev => !prev);
    }

    return (
        <section className="border-b border-gray-200 pb-0 my-1 ">
            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
                    {isBookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks!'}
                </div>
            )}

            {/* Header */}
            <div className="cursor-pointer bg-[--primary] h-[33px]">
                <p className="flex items-center justify-between flex-wrap h-full px-3">
                    <div className="flex items-center w-full justify-between">
                        <div className="text-[--secondary] uppercase text-[12px] font-bold flex justify-start items-center
                            ">
                            {marketType}
                        </div>
                    <div className=''> {cashOut} </div>
                    </div>

                    {/* <span className="h-10 flex items-center space-x-1 text-black text-[10px] font-semibold sm:text-[9px]">
                        <span className='flex items-center'>Min: {minMax.min} | Max: {minMax.max}</span>
                        <button onClick={() => { handleIButton() }} className="flex items-center bg-[#6D081D] p-0.5 w-3 h-3 ml-0.5 justify-center  text-white  text-[8px] font-semibold md:text-[10px]">
                            i
                        </button>
                        {isExpanded ? (
                            <MdOutlineKeyboardArrowUp onClick={toggleExpand} size={20} className='text-[var(--primary)] ml-2' />
                        ) : (
                            <MdOutlineKeyboardArrowDown onClick={toggleExpand} size={20} className='text-[var(--primary)] ml-2' />
                        )}
                    </span> */}

                </p>
            </div>

            {
                isModalOpen && (
                    <div onClick={() => { setIsModalOpen(false) }} className="fixed overflow-auto inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
                        <div className="bg-white w-[500px]  rounded-lg shadow-lg mt-7 mb-4">
                            <div className='flex justify-between rounded-t-lg bg-[var(--primary)] items-center'>
                                <div className=' p-4  text-[18px] font-[400] tracking-wide text-white'>{marketType == "Bookmaker" ? "Bookmaker" : marketType == "toss_data" ? "Toss " : marketType == "Match Odds" ? "Match Odds" : marketType == " Tied_Match" ? " Tied" : "Match"} Rules</div>
                                <button onClick={() => { setIsModalOpen(false) }} className="flex items-center bg-white text-black  justify-center    text-[16px] font-semibold px-2 py-0.5 mr-3">
                                    x
                                </button>
                            </div>


                            {
                                (marketType === "Bookmaker" || marketType === "toss_data") && (
                                    <div className="p-4">
                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">      Due to any reason any team will be getting advantage or disadvantage we are not concerned.  </div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at the same time (Punching) and others. Note : only winning bets will be voided.</div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">We will simply compare both teams 25 overs score higher score team will be declared winner in ODI (25 over comparison)</div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">We will simply compare both teams 10 overs higher score team will be declared winner in T20 matches (10 over comparison)</div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.  </div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">If two team ends up with equal points, then result will be given based on the official point table</div>

                                        <div className="border-b text-rose-600 py-[8px] border-b-gray-100">Tennis:- Advance fancy market</div>

                                        <div className="border-b py-[8px] text-slate-600 border-b-gray-100">If the second set is not completed all bets regarding this market will be voided</div>

                                        <div className="border-b py-[8px] text-slate-600 border-b-gray-100">If a player retires after completion of second set, then the market will be settled as three sets</div>

                                        <div className="border-b py-[8px] text-rose-600 border-b-gray-100">Virtual Cricket</div>

                                        <div className="border-b py-[8px] text-slate-600 border-b-gray-100">At any situation if the video gets interrupted/stopped then the same cannot be continued due to any technical issues bookmaker market will be voided</div>
                                    </div>
                                )
                            }

                            {
                                (marketType === "Match Odds" || marketType === "Tied_Match") && (
                                    <div className="p-4">
                                        <div className=" text-[21px] font-semibold text-[#6D081D] py-[8px] ">CRICKET</div>
                                        <div className="border-b text-[15px] text-slate-800  py-[8px] border-b-gray-100"> <span className="text-[16px] font-semibold text-black">Match Odds</span> :- In the event of match not being completed or tied all bets will be void.</div>
                                        <div className="text-[21px] font-semibold text-[#6D081D]  py-[8px] ">TENNIS</div>
                                        <div className="border-b  text-[15px] text-slate-800  py-[8px] border-b-gray-100"> <span className="text-[16px] font-semibold text-black">Match Odds</span> :- If 1st set has been not completed at the time of the retirement or disqualification, then all bets relating to that individual match will be void.</div>
                                        <div className="text-[21px] font-semibold text-[#6D081D]  py-[8px] ">FOOTBALL</div>

                                        <div className="border-b  text-[15px] text-slate-800 py-[8px] border-b-gray-100"> <span className="text-[16px] font-semibold text-black">Match Odds</span> :- All bets apply to the relevant full 'regular time' period including stoppage time. Any extra-time and/or penalty shoot-out is not included. For the cancellation of a goal, due to VAR, bets matched between the time of the goal being scored and the time at which the video assistant referee finishes the review will be voided. For the cancellation of a red card, due to VAR, bets matched after the time at which the video assistant referee commences the review will be voided.</div>
                                        <div className="border-b text-[15px] text-slate-800 py-[8px] border-b-gray-100">
                                            <div className="text-[21px] font-semibold text-[#6D081D]  py-[8px] ">FOOTBALL</div>
                                            <span className="text-[16px] font-semibold text-black">Under_Over Goals  </span>:- In the event of a match starting but not being completed, all bets will be void, unless the specific market outcome is already determined
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                )
            }

            {/* Content with animation */}
            <div className={`
        overflow-hidden transition-all duration-300 ease-in-out bg-white
        ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
                <div className="py-0">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default MatchDetailsHeaderSection;