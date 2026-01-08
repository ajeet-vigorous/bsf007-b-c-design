import React from 'react';
import { RiCloseFill } from 'react-icons/ri'
import { useState } from 'react';

export default function RulesModal(props) {
    const [showRules, setShowRules] = useState(1);
    // const [activeItem, setActiveItem] = useState(1);

    const toggleSection = (id) => {
        setShowRules(prev => (prev === id ? null : id));
    };

    // const viewRulesSection = (data) => {
    //     setShowRules(data)
    //     setActiveItem(data);
    // }

    const { setModalFalse } = props;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " onClick={() => setModalFalse()}>
            <div className="w-full h-full flex items-start justify-center pt-7 overflow-y-auto rounded-t-lg">
                <div onClick={(e) => e.stopPropagation()} className="xl:w-[800px] p-0 lg:w-[500px] mx-2 w-full text-black rounded-t-lg shadow-md">
                    <div className="rounded-t-lg bg-white">
                        <div className=" w-full h-full bg-[var(--darkcolor)] flex justify-between px-2 py-2 items-center rounded-t-lg">
                            <h2 className="text-white font-[400] text-[22px] tracking-wide">
                                Rules
                            </h2>
                            <span onClick={() => setModalFalse()}>
                                <RiCloseFill size={24} className='text-white cursor-pointer' />
                            </span>
                        </div>
                        <div className='px-[10px] py-[9px]'>
                            <div className='w-full font-normal text-black space-y-2'>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(1)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Football Fancy
                                    </button>

                                    {showRules === 1 && (
                                        <>
                                            <div className='md:px-0 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <div className='p-3 leading-none'>
                                                        Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others. Note : only winning bets will be voided...
                                                    </div>
                                                    <div className='p-3 leading-none'>
                                                        Tournament Total Goals, Team Total Goals goals.scored in 90 minutes or in extra-time will count.Goals scored in penalty shootouts do not count.
                                                    </div>
                                                    <div className='p-3 leading-none'>
                                                        Tournament Corners - Only corners taken in 90 minutes count.
                                                    </div>
                                                    <div className='p-3 leading-none'>
                                                        Tournament Penalties Missed/Converted - Penalties taken in 90 minutes, extra-time and penalty shootouts all count. If a penalty has to be re-taken the previous disallowed penalty(ies) do not count.
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(2)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Big Bash League
                                    </button>

                                    {showRules === 2 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Handball
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Total match 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Highest innings run - Only first innings is valid</p>
                                                    <p className='p-3 leading-none'>Lowest innings run - Only first innings is valid</p>
                                                    <p className='p-3 leading-none'>Total 1st 6 over run:- Average 46 runs will be given if total 20 overs is not played, This event is valid only for the 1st innings</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 25 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wides - Average 8 wides will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Fifties - Average 2 fifties will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Caught out - Average 8 catch out will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Bowled out - Average 2 bowled out will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Highest 6 over run: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Highest run in individual match: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Highest Fours in individual match: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Highest Sixes in individual match: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Highest Wickets in individual match: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Highest extras in individual match: Both innings are valid</p>
                                                    <p className='p-3 leading-none'>Highest match 1st over run in individual match: Only 1st inning will be considered as valid valid</p>
                                                    <p className='p-3 leading-none'>All events related to bowler are valid only for the league stages, both the innings will be considered as valid. A minimum of 32 overs has to be bowled else the same will be voided. If the mentioned bowler has bowled one legal delivery then it will be considered as 1 over even if the over is not completed</p>
                                                    <p className='p-3 leading-none'>All events based on ground are decided based on the initial fixture, in case of any changes in the venue between the series. Then average will be given based on the initial fixture for the number of games reduced, Similarly if any match is added newly to the venue will not be considered</p>
                                                    <p className='p-3 leading-none'>Average for wickets taken will be given in case match abandoned or over reduced or the player has not bowled single legal delivery before the over got reduced</p>
                                                    <p className='p-3 leading-none'>Fancy based on all individual teams/players/ground are valid only for league stage</p>
                                                    <p className='p-3 leading-none'>Management decision will be final</p>
                                                    <p className='p-3 leading-none'>Bellerive Oval:- Hobart</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 28 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 11 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 330 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Manuka Oval:- Canberra</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 5 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 24 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 13 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 318 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Bellerive Oval:- Hobart</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Aurora stadium:- Launceston</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 45 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 25 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 320 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>The Gabba:- Brisbane</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 24 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 9 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 13 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 310 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>QUEENSLAND</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 24 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 315 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Adelaide Oval</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 27 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 320 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Perth Stadium</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 26 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 12 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 9 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 16 Extras will be given in case match abandoned or over reducedTotal Extras - Average 16 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 340 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Showground Stadium</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 25 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 9 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 315 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Docklands Stadium</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 25 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 11 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 320 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Melbourne Ground</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 45 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 26 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 15 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 330 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Sydney Ground</p>
                                                    <p className='p-3 leading-none'>Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</p>
                                                    <p className='p-3 leading-none'>Total Fours - Average 26 fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Sixes - Average 12 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Extras - Average 15 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Total Run- Average 335 runs will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-none'>Average will be given for player if the mentioned player is not included in the playing 11</p>
                                                    <p className='p-3 leading-none'>If the mentioned player is not included in playing 11 for 3 consecutive matches and the mentioned player will be deleted</p>
                                                    <p className='p-3 leading-none'>Super over will not be included</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(3)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Lunch Favourite
                                    </button>
                                    {showRules === 3 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Table Tennis
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. The team which is favourite at lunch will be considered as lunch favourite or the team which is favourite after first inning last ball will be considered as lunch favourite in our exchange.</p>
                                                    <p className='p-3 leading-4'>2. In any circumstances management decision will be final.</p>
                                                    <p className='p-3 leading-4'>3. In case of tie in T20 or one day in lunch favourite game, all bets will be deleted in our exchange.</p>
                                                    <p className='p-3 leading-4'>4. In case overs are reduced in a match, the team which is favourite at lunch will be considered as lunch favourite.</p>
                                                    <p className='p-3 leading-4'>4.1 For example :- if match is reduced to 18 over per side in T20 or One Day then after 18 over the team which is favourite at lunch will be considered as lunch favourite.</p>
                                                    <p className='p-3 leading-4'>5. In case of weather, 1st innings match overs are reduced and direct target is given to team which will bat in 2nd inning then lunch favourite will be considered after target is given at lunch.</p>
                                                    <p className='p-3 leading-4'>5.1 For example :- in T20 match rain comes at 14 over and match is interrupted due to rain and direct target is given to 2nd batting team, then team which is favourite in match odds after target is given in match, will be considered as lunch favourite.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(4)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Bookmaker
                                    </button>
                                    {showRules === 4 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Basketball
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example in case of vpn/robot-use/multiple entry from same IP/multiple bets at same time (Punching) and others. Note: only winning bets will be voided...</p>
                                                    <p className='p-3 leading-4'>Due to any reason any team will be getting advantage or disadvantage we are not concerned.</p>
                                                    <p className='p-3 leading-4'>Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example in case of vpn/robot-use/multiple entry from same IP/multiple bets at the same time (Punching) and others. Note: only winning bets will be voided.</p>
                                                    <p className='p-3 leading-4'>Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.</p>
                                                    <p className='p-3 leading-4'>If two team ends up with equal points, then result will be given based on the official point table.</p>
                                                    <p className='p-3 leading-4'>We will simply compare both teams 10 overs score, higher score team will be declared winner in ODI (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner. If all same then will be declared No result).</p>
                                                    <p className='p-3 leading-4'>We will simply compare both teams 6 overs score, higher score team will be declared winner in T20 matches (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner. If all same then will be declared No result).</p>
                                                    <p className='p-3 leading-4'>Tennis:- Advance fancy market</p>
                                                    <p className='p-3 leading-4'>If the second set is not completed all bets regarding this market will be voided.</p>
                                                    <p className='p-3 leading-4'>If a player retires after completion of second set, then the market will be settled as three sets.</p>
                                                    <p className='p-3 leading-4'>Virtual Cricket</p>
                                                    <p className='p-3 leading-4'>At any situation if the video gets interrupted/stopped then the same cannot be continued due to any technical issues bookmaker market will be voided.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(5)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Politics
                                    </button>
                                    {showRules === 5 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Vollyball
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Indian state legislative assembly elections.</p>
                                                    <p className='p-3 leading-4'>1. This event is to decide the winner of various legislative assemblies of India.</p>
                                                    <p className='p-3 leading-4'>2. The final result declared by Election Commission of India for assembly elections of various states of India for a particular year will be valid in our exchange. The customers are entirely responsible for their bets at all times.</p>
                                                    <p className='p-3 leading-4'>3. All bets will be voided if the election doesn’t take place in given time by Election Commission or as per our exchange management decision.</p>
                                                    <p className='p-3 leading-4'>4. Company reserves the right to suspend/void any bets on this event at any time if we find the same not to be legitimate with the certainty of the outcome.</p>
                                                    <p className='p-3 leading-4'>5. Accidental issues during assembly elections will not be counted in our exchange. If required, additional candidates may be added on request.</p>
                                                    <p className='p-3 leading-4'>6. Kindly be informed no candidates will be partially settled and will remain in the market until it is fully settled. This is to ensure that all customers can continue trading for the candidates that they have positions on, since each candidate is still a valid runner in this market.</p>
                                                    <p className='p-3 leading-4'>7. Please be informed that the transmissions described as “live” by few broadcasters may actually be delayed due to multiple scenarios.</p>
                                                    <p className='p-3 leading-4'>8. If any candidate withdraws for any reason, including death, all bets on the market will be valid and be settled as per the defined rules.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(6)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Genie Combo Special
                                    </button>
                                    {showRules === 6 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Ice Hockey
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>What is Genie Bet?</p>
                                                    <p className='p-3 leading-4'>Mumbai Indians will win + Quinton De Kock will score 20+ runs + Total Match Runs 385+ = 41.00 Combined Rate.</p>

                                                    <p className='p-3 leading-4'>1. If a ball is not bowled during a match, then all bets will be void.</p>
                                                    <p className='p-3 leading-4'>2. In the event of a match being decided by a bowl-off or toss of the coin, all bets will be void.</p>
                                                    <p className='p-3 leading-4'>3. If a player included in any selection in the bet is not named in the official starting XI then the whole bet will be made void, regardless of the rest of the selections within the bet. If the player takes to the pitch, then all player related bets will be settled accordingly as win/loss. ‘Player A to get 1+ Six’ would be a losing selection if he participates in fielding but does not bat. ‘Player B to get 1+ Wicket’ would be a losing selection if he takes any part in the match regardless of whether he bowls. This ruling refers to any player related markets.</p>
                                                    <p className='p-3 leading-4'>4. In the case of official substitutes/impact players etc, bets containing players that are official substitutes and not in the official starting XI’s will be void.</p>
                                                    <p className='p-3 leading-4'>5. Any void selection within your bet, will deem the entire bet void.</p>
                                                    <p className='p-3 leading-4'>6. In the event of a batsman retiring for any reason, all relevant batting markets for this batsman will be settled on the runs at the time of their retirement.</p>
                                                    <p className='p-3 leading-4'>7. Penalty runs will not be included in any settlement totals.</p>
                                                    <p className='p-3 leading-4'>8. In case of rain or if overs get reduced then all bets will be void.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(7)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Football
                                    </button>
                                    {showRules === 7 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Football
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border-2 border-gray-300 divide-y-2 divide-gray-300'>
                                                    <div className='text-red-500 p-2'>
                                                        Match
                                                    </div>
                                                    <div className='text-black p-2 leading-none'>
                                                        Match Odds: - Predict which team will be the winner. Bets will be void if the match is not completed.
                                                    </div>
                                                    <div className='text-black p-2 leading-none'>
                                                        Next Goal: - Predict which team will score the X-th goal.
                                                    </div>
                                                    <div className='text-black p-2 leading-none'>
                                                        Highest Scoring Half: - Predict which half will have the most goals scored (1st, 2nd, or Draw). Bet will be settled on regulation time only and exclude overtime if played:
                                                    </div>
                                                    <div className='text-black p-2 leading-none'>
                                                        Halftime/Fulltime: - Predict the result of a match at halftime and at the end of regular time. If a game is abandoned, bets will be void. Example: If you choose 1/X, you bet on the home team to lead in the first half and the match to end in a draw. Extra time doesn’t count.
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(8)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        IPL
                                    </button>
                                    {showRules === 8 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Tennis
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Indian Premier League (IPL)</p>
                                                    <p className='p-3 leading-4'>If IPL fixture of 74 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)</p>
                                                    <p className='p-3 leading-4'>At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid</p>
                                                    <p className='p-3 leading-4'>Management decision will be final</p>
                                                    <p className='p-3 leading-4'>Highest innings run - Only First innings is valid</p>
                                                    <p className='p-3 leading-4'>Lowest innings run - Only First innings is valid</p>
                                                    <p className='p-3 leading-4'>Highest Partnership Runs in IPL: Both Innings are valid</p>
                                                    <p className='p-3 leading-4'>Highest Run Scorer : Total Runs Scored by An Individual Batsman in Full Tournament</p>
                                                    <p className='p-3 leading-4'>Highest Wicket Taker : Total Wickets Taken by a Bowler in Full Tournament</p>
                                                    <p className='p-3 leading-4'>How Many time 5 or More Wickets taken by Bowlers : Number of time 5 or More Wickets taken by Bowlers. In Case Same Bowler 2 time 5 or More Wickets taken means Result Counted as 2.</p>
                                                    <p className='p-3 leading-4'>Total 4's: Average 29 Fours will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total 6's: Average 16 Sixes will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total 50's: Average 2 Fifties will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total No balls:- Average 1 No ball will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Wides - Average 11 Wides will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Extras - Average 18 Extras will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Caught outs: Average 9 Caught out will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total Duckouts in IPL : Average 1 Duckout will be given in case match abandoned or over reduced</p>
                                                    <p className='p-3 leading-4'>Total 50+ Partnerships - Average 2 Fifty plus Partnerships will be given in case match abandoned or over reduced. 50 and 50 Above Partnerships All Counted in this.</p>
                                                    <p className='p-3 leading-4'>Total Highest Scoring Over Runs in IPL: Total of Every Match Highest Scoring Over Runs. Average 20 Runs will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Runs Scored in IPL : Total Runs Scored in Full Tournament. Average 350 Runs will be Counted in case match abandoned or over reduced. Both Innings Counted.</p>
                                                    <p className='p-3 leading-4'>Highest Match 1st Over Run of IPL :Only First Innings is Valid.</p>
                                                    <p className='p-3 leading-4'>Highest 1st 6 over run: Only First Innings is Valid. Will not consider if over reduce before completion 6 over.</p>
                                                    <p className='p-3 leading-4'>Highest 1st 10 over run : Only First Innings is Valid. Will not consider if over reduce before completion 10 over.</p>
                                                    <p className='p-3 leading-4'>Highest 4s,6s,30s,50s Single Digit Scorers, Double Digit Scorers,Wickets,Caught Outs,Bowled,Lbw, Runouts, Stumpings, Duckouts,Wides and Extras in individual match: All Both innings are Counted.</p>
                                                    <p className='p-3 leading-4'>Highest Scoring Over Runs in IPL: Both innings are valid</p>
                                                    <p className='p-3 leading-4'>Single Digit Scorers : Duck outs Not Considered in this Event. If Not out Batsman/Injured Batsman facing One Legal Delivery and scored 1 or above means Considered as Single Digit.</p>
                                                    <p className='p-3 leading-4'>Bowler Event :- 2 Over Wkts , Dotballs, Boundaries , Runs bets valid in 1st two overs (1st inning valid ) The mention bowler has to run (start Over) the defined number of overs , else the bets related to that particular event will get void For example if the mentioned bowler has bowled 3 overs , then 2 over of that particular bowler will be considered as valid and the 4 over will get void. If team get all out in the mentioned bowler running over then result considered as valid. For example mentioned bowler 1.4 over bowler & team all out in 19.4 then bowler 2nd over result is valid and 4th over fancy is voided or bowler bowled 3.3 over & team all out on 19.3 then both 2 & 4 over is valid.</p>
                                                    <p className='p-3 leading-4'>Most 6's by individual batsman of IPL : Maximum Number of Sixes Hit By A Batsman in full Tournament. Ex. Last Season (2021) KL Rahul Hit 30 Sixes in 13 Matches. So, 30 was the Result for last season.</p>
                                                    <p className='p-3 leading-4'>Most Balls Faced By a Batsman of IPL : Maximum balls Faced by an Individual Batsman in the Single Match.</p>
                                                    <p className='p-3 leading-4'>Most runs given by Bowler in an Inning of IPL : Maximum Runs conceded by a individual Bowler in an Innings.</p>
                                                    <p className='p-3 leading-4'>Most Wide, Noball,Extras,4s,6s,30s,50s,50+ Pships,Caught Outs,LBWs, Runouts and Duckouts in an Innings Of the Match : Considered For Any Innings.All Both Innings Considered as Valid</p>
                                                    <p className='p-3 leading-4'>In fastest fifty always the first 50 runs will be considered, for example of R Sharma scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will be given based on the balls for the 1st fifty runs</p>
                                                    <p className='p-3 leading-4'>Super over will not be included</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(9)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        The Hundred Men's
                                    </button>
                                    {showRules === 9 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Snooker
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. If Hundred fixture of 34 matches gets reduced due to any reason, then all the special fancies will be voided. (Match abandoned due to rain/bad light will not be considered in this)</p>
                                                    <p className='p-3 leading-4'>2. At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid.</p>
                                                    <p className='p-3 leading-4'>3. Management decision will be final.</p>
                                                    <p className='p-3 leading-4'>4. Highest innings run - Only First innings is valid.</p>
                                                    <p className='p-3 leading-4'>5. Lowest innings run - Only First innings is valid. 1st Inning playing team must be facing 100 balls or If team get all out means considered.</p>
                                                    <p className='p-3 leading-4'>6. Highest Partnership Runs in Hundred: Both Innings are valid.</p>
                                                    <p className='p-3 leading-4'>7. Highest Partnership Balls in Hundred: Both Innings are valid.</p>
                                                    <p className='p-3 leading-4'>8. Highest Run Scorer : Total Runs Scored by An Individual Batsman in Full Tournament.</p>
                                                    <p className='p-3 leading-4'>9. Highest Wicket Taker : Total Wickets Taken by a Bowler in Full Tournament.</p>
                                                    <p className='p-3 leading-4'>10. Total 4's: Average 22 Fours will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>11. Total 6's: Average 11 Sixes will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>12. Total Boundaries: Average 34 Boundaries will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>13. Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>14. Total 50's: Average 1 Fifties will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>15. Total Wickets - Average will 13 Wickets be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>16. Total Wides - Average 8 Wides will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>17. Total Extras - Average 17 Extras will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>18. Total Caught outs: Average 8 Caught out will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>19. Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>20. Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>21. Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>22. Total Duckouts in Hundred : Average 1 Duckout will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>23. Total Single Digit Scorers in Hundred : Average 6 Single Digit Scorers will be given in case match abandoned or over reduced. Duck outs Not Considered in this Event. If Not out Batsman/Injured Batsman facing One Legal Delivery and nothing scored ('0') means Considered as Single Digit.</p>
                                                    <p className='p-3 leading-4'>24. Total Double Digit Scorers in Hundred : Average 9 Double Digit Scorers will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>25. Highest 4s,6s,Boundaries,30s,50s,Wickets,Wides,Extras,Caught Outs,Bowled,Lbw, Runouts, Duckouts,Single Digit Scorers and Double Digit Scorers in individual match: All Both innings are Counted.</p>
                                                    <p className='p-3 leading-4'>26. Most 4s,6s,Boundaries,30s,50s,Caught Outs,Bowled,Duckouts and Wicketkeeper Dismissals in an Innings Of the Match : Considered For Any Innings. All Both Innings Considered as Valid.</p>
                                                    <p className='p-3 leading-4'>27. Most 4s by a Batsman in the Match : Maximum 4s Hitted by an Individual Batsman in any Single Match.</p>
                                                    <p className='p-3 leading-4'>28. Most 6s by a Batsman in the Match : Maximum 6s Hitted by an Individual Batsman in any Single Match.</p>
                                                    <p className='p-3 leading-4'>29. Most Balls Faced By a Batsman of Hundred : Maximum balls Faced by an Individual Batsman in the Single Match.</p>
                                                    <p className='p-3 leading-4'>30. Most runs given by Bowler in an Inning of Hundred : Maximum Runs conceded by a individual Bowler in an Innings.</p>
                                                    <p className='p-3 leading-4'>31. Most wickets by Bowler in an inning : Maximum Wickets taken by a individual Bowler in an Innings.</p>
                                                    <p className='p-3 leading-4'>• "If the match starts as a 100 ball game, after the balls are reduced due to rain interrupting means comparison Events like Highest 4s,6s, boundaries,30s,50s, Wickets,Wides,Extras,Caughtouts,Bowled,Lbw,Runout,Duckout,Single Digit Scorers, Double Digit Scorers and Most 4s,6s,boundaries,30s,50s, Caught outs,Bowled,Duckout, wicket Keeper Dismissals all are considered for Result. Example : If a match started as 100 balls game after rain balls reduced to 80 balls match, in that match Maximum 6s reached means that Value considered for Result of Highest 6s in Individual Match."</p>
                                                    <p className='p-3 leading-4'>• "Due to Rain match started as Balls reduced match all the comparison Events not considered for Result. Example: Due to Rain match only 30 ball both side Means Maximum Single Digit Scorers reached maximum in that match means Not considered for Result."</p>
                                                    <p className='p-3 leading-4'>• "Super over (Super 5) will not be included."</p>

                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(10)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Women's Premier League (WPL)
                                    </button>
                                    {showRules === 10 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            E-Games
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. If WPL fixture of 22 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this).</p>

                                                    <p className='p-3 leading-4'>2. Total matches 1st over runs : Average 5 runs will be given in case match abandoned or over reduced (only 1st innings valid).</p>

                                                    <p className='p-3 leading-4'>3. Total matches 1st 6 over runs:- Average 40 runs will be given in case match abandoned or over reduced (Only 1st Innings valid).</p>

                                                    <p className='p-3 leading-4'>4. Total 4's : Average 32 fours will be given in case match abandoned or over reduced.</p>

                                                    <p className='p-3 leading-4'>5. Total 30's: Average 2 sixes will be given in case match abandoned or over reduced.</p>

                                                    <p className='p-3 leading-4'>6. Total 50's - Average 1 fifties will be given in case match abandoned or over reduced.</p>

                                                    <p className='p-3 leading-4'>7. Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced.</p>

                                                    <p className='p-3 leading-4'>8. At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid.</p>

                                                    <p className='p-3 leading-4'>9. Highest innings run - Both innings are valid.</p>

                                                    <p className='p-3 leading-4'>10. Lowest innings run - Only first innings is valid.</p>

                                                    <p className='p-3 leading-4'>11. Highest Match 1st over runs in the match: Only first innings is valid.</p>

                                                    <p className='p-3 leading-4'>12. Highest 1st 6 over runs: - Only first innings is valid.</p>

                                                    <p className='p-3 leading-4'>13. Highest 4's in individual match: Both innings are valid.</p>

                                                    <p className='p-3 leading-4'>14. Highest Wickets in individual match: Both innings are valid.</p>

                                                    <p className='p-3 leading-4'>15. Highest over runs: Both innings are valid.</p>

                                                    <p className='p-3 leading-4'>16. Most Balls Faced By a Batsman : Maximum Balls Faced by a batsman in one Innings.</p>

                                                    <p className='p-3 leading-4'>17. Most 4's by individual batsman in an Inning : Maximum Number of Fours Hit By A Batsman in one Innings.</p>

                                                    <p className='p-3 leading-4'>18. Most Dot balls By a Bowler in an Inning : Maximum Dot balls Bowled by a Bowler in his Quota of Innings.</p>

                                                    <p className='p-3 leading-4'>19. Most runs given by Bowler in an Inning : Maximum Runs conceded by a individual Bowler in an Innings.</p>

                                                    <p className='p-3 leading-4'>20. Most wickets by Bowler in an inning : Maximum Wickets taken by a individual Bowler in an Innings.</p>

                                                    <p className='p-3 leading-4'>21. In fastest fifty always the first 50 runs will be considered, for example of S Mandhana scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will not be included. Super over will not be included.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(11)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Pakistan Premier League (PSL)
                                    </button>
                                    {showRules === 11 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Fustal
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. If PSL fixture of 34 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this).</p>
                                                    <p className='p-3 leading-4'>2. Total Matches 1st over runs : Average 6 runs will be given in case match abandoned or over reduced (only 1st innings valid).</p>
                                                    <p className='p-3 leading-4'>3. Total Matches 1st 6 over runs : Average 50 runs will be given in case match abandoned or over reduced (Only 1st Innings valid).</p>
                                                    <p className='p-3 leading-4'>4. Total fours: Average 32 fours will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>5. Total sixes: Average 13 sixes will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>6. Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>7. Total Fifties - Average 2 Fifties will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>8. Total Wickets - Average 13 Wickets will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>9. Total Wides - Average 11 Wides will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>10. Total Extras - Average 18 Extras will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>11. Total Caught outs: Average 8 Caught out will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>12. Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>13. Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>14. Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid.</p>
                                                    <p className='p-3 leading-4'>15. Highest innings run - Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>16. Lowest innings run - Only first innings is valid.</p>
                                                    <p className='p-3 leading-4'>17. Highest Match 1st over runs in the match: Only first innings is valid.</p>
                                                    <p className='p-3 leading-4'>18. Highest 1st 6 over runs: - Only first innings is valid.</p>
                                                    <p className='p-3 leading-4'>19. Highest 4's in individual match: Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>20. Highest 6's in individual match: Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>21. Highest Wickets in individual match: Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>22. Highest Extras in individual match: Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>23. Highest over runs: Both innings are valid.</p>
                                                    <p className='p-3 leading-4'>24. Most Balls Faced By a Batsman : Maximum Balls Faced by a batsman in one Innings.</p>
                                                    <p className='p-3 leading-4'>25. Most 4's by individual batsman in an Inning : Maximum Number of Fours Hit By A Batsman in one Innings.</p>
                                                    <p className='p-3 leading-4'>26. Most 6's by individual batsman in an Inning : Maximum Number of Sixes Hit By A Batsman in one Innings.</p>
                                                    <p className='p-3 leading-4'>27. Most Dot balls By a Bowler in an Inning : Maximum Dot balls Bowled by a Bowler in his Quota of Innings.</p>
                                                    <p className='p-3 leading-4'>28. Most runs given by Bowler in an Inning : Maximum Runs conceded by a individual Bowler in an Innings.</p>
                                                    <p className='p-3 leading-4'>29. Most wickets by Bowler in an inning : Maximum Wickets taken by a individual Bowler in an Innings.</p>
                                                    <p className='p-3 leading-4'>30. Total 50 Plus Partnership runs- 50 and above 50 runs partnership will be counted in this event..</p>
                                                    <p className='p-3 leading-4'>31. In fastest fifty always the first 50 runs will be considered, for example of R Sharma scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will be given based on the balls for the 1st fifty runs Super over will not be included.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white ">
                                    <button
                                        onClick={() => toggleSection(12)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Kabaddi
                                    </button>
                                    {showRules === 12 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Big Bash League
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>In any circumstances management decision will be final related to all Fancy of kabaddi of our exchange.</p>
                                                    <p className='p-3 leading-4'>All fancy bets will be validated when match has been tied.</p>
                                                    <p className='p-3 leading-4'>Result of individual player of fancy will be validated only when player play that match.</p>
                                                    <p className='p-3 leading-4'>In any case wrong rate has been given in fancy that particular bets will be deleted.</p>
                                                    <p className='p-3 leading-4'>For Playoffs Final Result Of 40 Minutes Of Two Halves Will Be Valid In Our Exchange.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(13)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Horse Racing
                                    </button>
                                    {showRules === 13 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Lunch Favourite
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'><strong>General</strong></p>
                                                    <p className='p-3 leading-4'>1. All individual race markets will be determined according to the official result at the time of the 'weigh-in' announcement (or equivalent). Subsequent disqualifications, appeals or amendments to the result will be disregarded.</p>
                                                    <p className='p-3 leading-4'>2. If a race is abandoned or otherwise declared void, or in the event of a walkover, all bets on that race will be void.</p>
                                                    <p className='p-3 leading-4'>3. If the scheduled venue is changed after the market has been loaded by us, all bets will be void. Where a race does not take part on its scheduled day, all bets will be void.</p>
                                                    <p className='p-3 leading-4'>4. If a scheduled surface type is changed (e.g., turf to dirt) all bets will stand.</p>

                                                    <p className='p-3 leading-4'><strong>Non-Runner Rule</strong></p>
                                                    <p className='p-3 leading-4'>5. Our's non-runner rule relates to the adjustment of odds-on bets already matched when a horse in a race is declared a non-runner. To adjust We apply a reduction factor to the remaining runners. The reduction factor allocated to a non-runner is a calculation (the details of which are described below) of that horse's chances of winning (or being placed, etc as appropriate) and is applied to bets already matched on the other runners in the relevant market or markets. Any horse listed when the relevant market is loaded which does not subsequently come under the starter's orders is deemed to be a non-runner.</p>
                                                    <p className='p-3 leading-4'>6. When the market is loaded each horse is given a 'reduction factor, based on a forecast price, which is expressed as a percentage. These reduction factors may be updated periodically at the discretion of the Us based on trading in the market, but after approximately 15 minutes (approximately 5 minutes for Australian and US markets) from the scheduled 'off' time of a given race, they will be updated only in exceptional circumstances. The current reduction factor percentage for each horse can be viewed on the 'info' page on Our website or by asking the Helpdesk.</p>
                                                    <p className='p-3 leading-4'>7. Accurate reduction factors will only be applied to selections in the event of a non-runner. Once a non-runner is declared each selection in the market will be given an appropriate reduction factor. Reduction factors can be amended at Our’s discretion at any time throughout the market life cycle (including post-race).</p>
                                                    <p className='p-3 leading-4'>8. For Australian racing, reduction factors may be updated periodically at the discretion of the Us based on trading in the market, but after approximately five minutes from the scheduled off time of a given race, they will be updated only in exceptional circumstances.</p>
                                                    <p className='p-3 leading-4'>9. Reductions will be made to both win and place markets but applied differently (as described below), and horses will have a different reduction factor for each market.</p>
                                                    <p className='p-3 leading-4'>10. As soon as We become aware that a horse is an official non-runner or a highly likely non-runner, following a statement to the press from connections, the following will happen: All matched bets on that horse will be void and the horse will be removed from the market. In the win market: if the reduction factor of the non-runner is 2.5% or greater, the traded price of all the matched bets on the remaining horses will be reduced by an amount equal to the non-runner final reduction factor and all the unmatched offers to lay will be cancelled. If the non-runners reduction factor is less than 2.5%, reductions will not be applied and unmatched bets will not be cancelled.</p>
                                                    <p className='p-3 leading-4'>11. In the place market, the reduction factor of all non-runners will be applied (even if less than 2.5%) and the potential winnings about matched bets on the remaining horses will be reduced by an amount equal to the non-runners final reduction factor. Only if the non-runners reduction factor is 4.0% or greater will all the unmatched offers to lay be cancelled.</p>
                                                    <p className='p-3 leading-4'>12. All the reduction factors on the remaining horses will be adjusted to reflect their improved chance of winning.</p>
                                                    <p className='p-3 leading-4'>13. Reduction factors are not applied to bets which are struck in play. However, if a market is turned in-play prematurely by error (or, for example, there is a false start), all bets matched during this time will be subject to any later reduction factor, provided the market is turned out of play before the race commences. In the event of a late withdrawal, we reserve the right to remove the runner after the completion of the race. In this case, only those bets matched before the off will be affected by a reduction factor.</p>
                                                    <p className='p-3 leading-4'>14. In the event of a non-runner being removed from a race in error or following incorrect information regarding a runner’s participation, we will reinstate both the runner and all previously matched bets associated with that runner. All bets made between the time of withdrawal and reinstatement will be void in both the place market and the win market. The reduction factor applied to matched bets at the time of withdrawal will be reversed and the original prices will become valid.</p>
                                                    <p className='p-3 leading-4'>15. Any non-runners will be removed from the relevant markets in the order in which they are brought to our attention. If We become aware of more than one non-runner at the same time, it will remove the non-runners from the relevant markets in race card order.</p>
                                                    <p className='p-3 leading-4'>16. If a runner is not included in a market because of an error or because of incorrect information regarding a runner’s participation, we reserve the right to introduce the missing runner into the market at any time before settlement (even after the race has been run), provided that We are determined that the missing runner is not a material runner (i.e., a selection with a reduction factor of approx. 2.5% or less in the win market). In such circumstances, all pre-play unmatched and matched bets will stand, however, if the runner is not introduced before the start of the race, all in-play bets will be void. However, if the missing runner is deemed to be a material runner, then the malformed market will be void and a new market will be loaded where possible.</p>
                                                    <p className='p-3 leading-4'>17. How the Reductions are applied to Exchange markets: In the win market, reductions will be made on the traded price. For example: if the non-runners final reduction factor is 25% the traded price on all previously matched bets on other horses will be reduced by 25% - the traded price of 8.0 would become 6.0 etc. And these might be further reduced if another horse is subsequently declared a non-runner.</p>
                                                    <p className='p-3 leading-4'>18. In the EW Market, reductions will be made on the traded win price. The advertised place terms will then apply to the revised win prices. For example: if the non-runners final reduction factor is 25% the traded price on all previously matched bets on other horses will be reduced by 25% - the traded price of 8.0 would become 6.0. If each Way terms were 1/5th odds for 3 places, the corresponding price for the Place portion of the bet would reduce from 2.4 to 2.0. In the place market, reductions will be made to the potential winnings on the bet only, and not the traded price. For example: if the non-runners final reduction factor is 25% the potential winnings on all previously matched bets on the other horses will be reduced by 25% - a traded price of 8.0 would become 6.25. For example, a £10 bet on a horse to be placed at a traded price of 8.0 would provide winnings of £70. If there is a non-runner with a reduction factor of 25% in the race, that factor will be applied to the £70 of potential winnings leaving potential winnings of £52.50. Therefore, the revised traded price will be 6.25.</p>
                                                    <p className='p-3 leading-4'>19. The traded price may be further reduced if any other horse(s) is subsequently declared a non-runner, however, odds cannot be reduced below 1.01.</p>
                                                    <p className='p-3 leading-4'>20. Reserves: A reserve runner may appear in the relevant markets but will have a non-applicable reduction factor until we are received confirmation that it is a confirmed runner, in which case an applicable reduction factor may apply to it.</p>
                                                    <p className='p-3 leading-4'>21. For the avoidance of doubt, any reduction factor applicable to a non-runner replaced by a reserve will be applied to all bets struck on the relevant markets, before the removal from those markets of such non-runner by Us. Likewise, should a reserve runner become a confirmed runner but subsequently become a non-runner, any reduction factor applicable to such non-runner will be applied to all bets struck on the relevant markets, before the removal from those markets of such non-runner by Us.</p>
                                                    <p className='p-3 leading-4'>22. Additional rules: Card numbers are posted as a guide only: bets are placed on a named horse. Horses will not be coupled. Where any horse(s) runs for purse money only it is deemed a non-runner for betting purposes. Should this result in the number of possible winners stated in the relevant Market Information being equal to or greater than the number of runners in the relevant Betfair market, all bets in the market will be void.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(14)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        World Cup
                                    </button>
                                    {showRules === 14 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Politics
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others. Note : only winning bets will be voided.</p>
                                                    <p className='p-3 leading-4'>In case of any circumstances, management decision will be final for all the fancies under world cup.</p>
                                                    <p className='p-3 leading-4'>WC :- WORLD CUP</p>
                                                    <p className='p-3 leading-4'>MOM :- MAN OF THE MATCH</p>
                                                    <p className='p-3 leading-4'>Match 1st over run :- This fancy is valid only for first innings of the match, Average 4 runs will be given in case of match abandoned or the entire 50 over is not played.</p>
                                                    <p className='p-3 leading-4'>Highest inning run :- This fancy is valid only for first innings of the match.</p>
                                                    <p className='p-3 leading-4'>Lowest innings run :- This fancy is valid only for first innings of the match.</p>
                                                    <p className='p-3 leading-4'>Total Fours :- Average 48 Fours will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Sixes :- Average 10 Sixes will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Wickets :- Average 15 Wickets will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Wide :- Average 14 Wide will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Extras :- Average 25 Extras will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total No ball :- Average 2 No ball will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Fifties :- Average 3 Fifties will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Centuries :- Average 1 century will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Run outs :- Average 1 Run out will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>Total Ducks :- Average 1 Duck out will be given if the match is abandoned or over reduced. If the player is not out in the score of zero the same will not be considered as Duck out.</p>
                                                    <p className='p-3 leading-4'>Total Caught Out :- Average 10 Caught Out will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>All fancy related to Individual teams are valid only for league matches (9 matches played by the teams in league stages).</p>
                                                    <p className='p-3 leading-4'>In case any player mentioned in our world cup fancy doesn’t play for the first three consecutive matches all the bets will be deleted.</p>
                                                    <p className='p-3 leading-4'>1. In case any player mentioned in our world cup fancy got ruled out or doesn’t play post few matches the bets after the last match played by the above mentioned player will be deleted. For example: U Khawaja played for first three league matches and doesn’t play after that, then bets for the first three matches will be valid. Bets after third match will be deleted.</p>
                                                    <p className='p-3 leading-4'>2. First 10 over runs is valid for both innings for all the teams.</p>
                                                    <p className='p-3 leading-4'>3. Total runs by team :- Average will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>4. First 10 over runs by team :- Average will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>5. Fours by team :- Average will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>6. Sixes by team :- Average will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>7. Opening wicket partnership :- Average will be given if the match is abandoned or over reduced.</p>
                                                    <p className='p-3 leading-4'>8. Runs by player :- Average will be given if the match is abandoned or over reduced, Average will be given unless one ball is being played after the player enters the crease.</p>
                                                    <p className='p-3 leading-4'>9. Wickets by player :- Average will be given if the match is abandoned or over reduced, Average will be given unless one legal delivery has been bowled by the mentioned player.</p>
                                                    <p className='p-3 leading-4'>10. Sixes by player :- Average will be given if the match is abandoned or over reduced, Average will be given unless one ball is being played after the player enters the crease.</p>

                                                    <p className='p-3 leading-4'><b>Average of every fancy follows:</b></p>

                                                    <p className='p-3 leading-4'>Total runs by ENG 295 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of ENG 56 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by ENG 25 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by ENG 7 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of ENG 44 runs per game</p>
                                                    <p className='p-3 leading-4'>J Roy runs 38 runs per game</p>
                                                    <p className='p-3 leading-4'>J Bairstow runs 43 runs per game</p>
                                                    <p className='p-3 leading-4'>J Root runs 43 runs per game</p>
                                                    <p className='p-3 leading-4'>J Archer wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>C Woakes wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>A Rashid wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>J Bairstow Sixes 2 sixes per game</p>
                                                    <p className='p-3 leading-4'>J Buttler Sixes 2 sixes per game</p>

                                                    <p className='p-3 leading-4'>Total runs by IND 285 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of IND 53 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Four by IND 26 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by IND 6 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of IND 41 runs per game</p>
                                                    <p className='p-3 leading-4'>S Dhawan runs 38 runs per game</p>
                                                    <p className='p-3 leading-4'>R Sharma runs 43 runs per game</p>
                                                    <p className='p-3 leading-4'>V Kohli runs 48 runs per game</p>
                                                    <p className='p-3 leading-4'>J Bumrah wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>M Shami wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>K Yadav wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>R Sharma Sixes 2 sixes per game</p>
                                                    <p className='p-3 leading-4'>H Pandya Sixes 1 sixes per game</p>

                                                    <p className='p-3 leading-4'>Total runs by AUS 280 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of AUS 52 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Four by AUS 26 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by AUS 6 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of AUS 40 runs per game</p>
                                                    <p className='p-3 leading-4'>D Warner runs 43 runs per game</p>
                                                    <p className='p-3 leading-4'>A Finch runs 38 runs per game</p>
                                                    <p className='p-3 leading-4'>S Smith runs 42 runs per game</p>
                                                    <p className='p-3 leading-4'>M Starc wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>P Cummins wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>A Zampa wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>D Warner Sixes 2 sixes per game</p>

                                                    <p className='p-3 leading-4'>Total runs by SA 270 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of SA 51 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by SA 24 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by SA 5 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of SA 37 runs per game</p>
                                                    <p className='p-3 leading-4'>H Amla runs 38 runs per game</p>
                                                    <p className='p-3 leading-4'>F Du plessis runs 39 runs per game</p>
                                                    <p className='p-3 leading-4'>V Der Dussen runs per game</p>
                                                    <p className='p-3 leading-4'>Q De Kock runs 36 runs per game</p>
                                                    <p className='p-3 leading-4'>I Tahir wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>K Rabada wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>D Steyn wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>Q De Kock Sixes 1 six per game</p>

                                                    <p className='p-3 leading-4'>Total runs by NZ 275 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of NZ 50 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by NZ 25 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by NZ 5 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of NZ 37 runs per game</p>
                                                    <p className='p-3 leading-4'>C Munro runs 32 runs per game</p>
                                                    <p className='p-3 leading-4'>M Guptill runs 38 runs per game</p>
                                                    <p className='p-3 leading-4'>K Williamson runs 45 runs per game</p>
                                                    <p className='p-3 leading-4'>H Nicholls runs per game</p>
                                                    <p className='p-3 leading-4'>T Boult wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>T Southee wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>M Santner wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>M Guptill Sixes 2 sixes per game</p>

                                                    <p className='p-3 leading-4'>Total runs by WI 270 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of WI 49 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by WI 23 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by WI 7 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of WI 35 runs per game</p>
                                                    <p className='p-3 leading-4'>C Gayle runs 37 runs per game</p>
                                                    <p className='p-3 leading-4'>E Lewis runs 32 runs per game</p>
                                                    <p className='p-3 leading-4'>DM Bravo runs 32 runs per game</p>
                                                    <p className='p-3 leading-4'>S Hope runs 37 runs per game</p>
                                                    <p className='p-3 leading-4'>K Roach wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>S Cottrell wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>J Holder wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>A Nurse wickets 1 wicket per game</p>

                                                    <p className='p-3 leading-4'>Total runs by PAK 270 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of PAK 50 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by PAK 24 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by PAK 5 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of PAK 36 runs per game</p>
                                                    <p className='p-3 leading-4'>Imam Ul Haq runs 36 runs per game</p>
                                                    <p className='p-3 leading-4'>B Azam runs 44 runs per game</p>
                                                    <p className='p-3 leading-4'>F Zaman runs 34 runs per game</p>
                                                    <p className='p-3 leading-4'>H Ali wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>Shadab Khan wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>Shaheen Afridi wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>F Zaman Sixes 1 six per game</p>
                                                    <p className='p-3 leading-4'>C Gayle Sixes 2 sixes per game</p>
                                                    <p className='p-3 leading-4'>A Russell Sixes 2 sixes per game</p>

                                                    <p className='p-3 leading-4'>Total runs by SL 250 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of SL 48 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by SL 22 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by SL 4 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of SL 32 runs per game</p>
                                                    <p className='p-3 leading-4'>D Karunaratne runs 31 runs per game</p>
                                                    <p className='p-3 leading-4'>L Thirimanne runs 29 runs per game</p>
                                                    <p className='p-3 leading-4'>K Mendis runs 33 runs per game</p>
                                                    <p className='p-3 leading-4'>L Malinga wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>S Lakmal wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>J Vandersay wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>T Perera Sixes 1 six per game</p>

                                                    <p className='p-3 leading-4'>Total runs by BAN 245 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of BAN 48 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by BAN 22 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by BAN 4 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of BAN 32 runs per game</p>
                                                    <p className='p-3 leading-4'>T Iqbal runs 34 runs per game</p>
                                                    <p className='p-3 leading-4'>S Sarkar runs 29 runs per game</p>
                                                    <p className='p-3 leading-4'>M Rahim runs 31 runs per game</p>
                                                    <p className='p-3 leading-4'>M Hasan wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>M Rahman wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>M Mortaza wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>T Iqbal Sixes 1 six per game</p>

                                                    <p className='p-3 leading-4'>Total runs by AFG 235 runs per game</p>
                                                    <p className='p-3 leading-4'>First 10 over runs of AFG 46 runs per game</p>
                                                    <p className='p-3 leading-4'>Total Fours by AFG 20 fours per game</p>
                                                    <p className='p-3 leading-4'>Total Sixes by AFG 4 sixes per game</p>
                                                    <p className='p-3 leading-4'>Opening wicket partnership runs of AFG 28 runs per game</p>
                                                    <p className='p-3 leading-4'>R Shah runs 27 runs per game</p>
                                                    <p className='p-3 leading-4'>H Zazai runs 26 runs per game</p>
                                                    <p className='p-3 leading-4'>A Afghan runs per game</p>
                                                    <p className='p-3 leading-4'>M Shahzad runs 27 runs per game</p>
                                                    <p className='p-3 leading-4'>D Zadran wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>Rashid Khan wickets 2 wickets per game</p>
                                                    <p className='p-3 leading-4'>Mujeeb Ur Rahman wickets 1 wicket per game</p>
                                                    <p className='p-3 leading-4'>H Zazai Sixes 1 six per game</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(15)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Binary
                                    </button>
                                    {showRules === 15 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Bookmaker
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. All session's bets will be confirmed at market rate only.</p>
                                                    <p className='p-3 leading-4'>2. All session's settlement price means result can be checked from exchange's official sites.</p>
                                                    <p className='p-3 leading-4'>3. All session's result will be settlement price provided by exchange after market close.</p>
                                                    <p className='p-3 leading-4'>4. Every product has two types of prices SPOT and FUTURE. We provide only near month's FUTURE price in Binary Session. You can check it from the official website of that product.</p>
                                                    <p className='p-3 leading-4'>5. Session's timings : NFY, B-NFY, AXS, ICI, RIL, SBI, TT STL - Monday to Friday 10:00 a.m. to 2:30 p.m. GOLD, SILVER, CRUDE - Monday to Friday 11:30 a.m. to 10:30 p.m. CMX CRUDE, DOWJONES, NASDAQ, SNP - Monday to Friday 7:30 p.m. to 12:00 a.m.</p>
                                                    <p className='p-3 leading-4'>6. Same bets same time from multiple id not allowed.</p>
                                                    <p className='p-3 leading-4'>7. Operating and market making bets (cheating/line/chamka bets) are not allowed.</p>
                                                    <p className='p-3 leading-4'>8. If any case wrong rate has been given in fancy that particular bets will be cancelled.</p>
                                                    <p className='p-3 leading-4'>9. Deleted bets will remove under 24hr and clients will be notified.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(16)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Match
                                    </button>
                                    {showRules === 16 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Teenpatti
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others. Note : only winning bets will be voided, For example: If we find such entries (above mentioned) from any id and their bets are (200000 lay in a 6 over session for the rate 40 and 200000 back for the rate of 48) and the actual score is 38, bets of 40 lay will be voided and the bets for 48 back will be considered valid.</p>
                                                    <p className='p-3 leading-4'><strong>TENNIS Match Odds :-</strong> If 1st set has been not completed at the time of the retirement or disqualification, then all bets relating to that individual match will be void.</p>
                                                    <p className='p-3 leading-4'><strong>FOOTBALL Match Odds :-</strong> All bets apply to the relevant full 'regular time' period including stoppage time. Any extra-time and/or penalty shoot-out is not included. For the cancellation of a goal, due to VAR, bets matched between the time of the goal being scored and the time at which the video assistant referee finishes the review will be voided. For the cancellation of a red card, due to VAR, bets matched after the time at which the video assistant referee commences the review will be voided.</p>
                                                    <p className='p-3 leading-4'><strong>FOOTBALL Under/Over Goals :-</strong> In the event of a match starting but not being completed, all bets will be void, unless the specific market outcome is already determined.</p>

                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(17)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Khado
                                    </button>
                                    {showRules === 17 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            CricketCasino
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>Only First inning valid for T20 and one day matches.</p>
                                                    <p className='p-3 leading-4'>Same will be work like Lambi. If match abandoned or over reduced, all bets will be deleted.</p>
                                                    <p className='p-3 leading-4'>You can choose your own value in this event.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(18)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Election
                                    </button>
                                    {showRules === 18 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Fancy Market 1
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>1. The final result declared by election commission of India for Loksabha election 2019 will be valid in our exchange.</p>
                                                    <p className='p-3 leading-4'>2. Accidental issues during Loksabha election 2019 will not be counted in our exchange.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className=" border border-white">
                                    <button
                                        onClick={() => toggleSection(19)}
                                        className="w-full text-left bg-[var(--darkred)]  text-white font-[400] px-4 py-2"
                                    >
                                        Virtual Tennis
                                    </button>
                                    {showRules === 19 && (
                                        <>
                                            {/* <h2 className="text-white bg-[var(--secondary)] m-2 text-xl colour_sky px-2 py-1">
                                            Football Fancy
                                        </h2> */}
                                            <div className='md:px-2 px-0 py-2'>
                                                <div className='border border-gray-300 divide-y divide-gray-300 text-[#DC3545] text-[13px]'>
                                                    <p className='p-3 leading-4'>
                                                        1. If streaming stops or some technical issue occurs, the match will be abandoned.
                                                    </p>
                                                    <p className='p-3 leading-4'>2. If there is any technical interference in the match then also the match will be abandoned.</p>
                                                    <p className='p-3 leading-4'>3. *There will be 3 sets in the match. There are 3 games in 1 set.</p>
                                                    <p className='p-3 leading-4'>4. *In the match, within any set, there are 3-3 games between the two players (level game) till a tie break of 5 points is played, according to which the one who gets 2 points more than the difference of points will win the set.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}









