import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';
import settings from '../../../domainConfig';

const BookmakerComponent = ({
  inplayMatch,
  activeTab,
  bookmaker2Fancy,
  matchScoreDetails,
  isMatchCoin,
  positionObj,
  marketId,
  returnDataObject,
  returnDataFancyObject,
  toggleRowVisibility,
  handleBackOpen,
  formatNumber,
  betplaceSection,
  minMax
}) => {
  if (!inplayMatch?.isBookmaker || !(activeTab === "bookmaker" || activeTab === "all")) {
    return null;
  }

  const {
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
  } = betplaceSection;

  return (
    <>

      <div className={`${bookmaker2Fancy?.length > 0 ? "w-[75%]" : 'w-[100%]'}`}>
        {matchScoreDetails?.team_data?.length > 0 && (
          <>
      
            <MatchDetailsHeaderSection 
              cashOut={
                <CashOutSystem
                marketList={matchScoreDetails?.team_data}
                positionObj={positionObj}
                handleBackOpen={handleBackOpen}
                toggleRowVisibility={toggleRowVisibility}
                marketId={marketId}
                betFor={"odds"}
                oddsType={"bookmaker"}
              />
              }
            
             marketType={`Bookmaker`} minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}>
              {/* (${inplayMatch?.matchName + " - " + inplayMatch?.seriesName}) */}
              <div className="flex  whitespace-normal max-w-full border-b border-gray-200">
                  <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex items-center text-[12px] px-2">
                  Min: {minMax} | Max: {minMax}
                  </div>

                <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2">
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-3 rounded-md w-full">
                      <div className="py-1.5 w-full flex justify-center items-center ">
                        <div className="text-center leading-3 w-full">
                          <span className="text-xs uppercase w-full block  bg-[#8DD9FF] h-[20px] rounded-[4px] px-4 text-gray-800 font-bold">
                            {settings.Lagai}
                          </span>
                        </div>
                      </div>
                    </span>
                  <span className="lg:col-span-1 col-span-3 rounded-md">
                      <div className="py-1.5 w-full flex justify-center items-center">
                        <div className="text-center leading-3 w-full">
                          <span className="text-xs px-4 w-full  block rounded-[4px] h-[20px] bg-[#FF94BC] uppercase text-gray-800 font-bold">
                            {settings.Khaai}
                          </span>
                        </div>
                      </div>
                    </span>
                </div>
              </div>

              {matchScoreDetails.team_data.map((commList, index) => (

                <>

                  <div key={index} className="relative border-b border-gray-200 flex decoration-none whitespace-normal max-w-full py-1">
                    <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex ">
                      <div className="w-full leading-3 flex items-center capitalize text-[#333333]">
                        <span className="text-[13px] px-2 font-bold">
                          <span>{commList.team_name}</span>
                          <br />
                          <span className={
                            positionObj[commList?.selectionid] > 0
                              ? "text-[var(--success-color)]"
                              : positionObj[commList?.selectionid] < 0
                                ? "text-red-600"
                                : "text-[var(--success-color)]"
                          }>
                            {positionObj[commList?.selectionid]
                              ? (Math.floor(Number(positionObj[commList?.selectionid]) * 100) / 100).toFixed(2)
                              : ''}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2">

                      <span
                        className="col-span-1 col-start-5 lg:block hidden cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.selectionid);
                          handleBackOpen({
                            data: commList,
                            nameOther: matchScoreDetails.team_data,
                            type: "Yes",
                            odds: commList.lgaai,
                            name: commList.team_name,
                            betFor: "odds",
                            oddsType: "bookmaker",
                            betType: "L",
                            selectionId: commList.selectionid,
                            teamData: commList.lgaai,
                            betfairMarketId: marketId,
                            price: commList.khaai * 100,
                            size: "0",
                            position: returnDataObject,
                            newPosition: returnDataObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={(commList.lgaai * 100).toFixed(2)}
                          size={(commList.khaai * 100).toFixed(2)}
                          color={"bg-[#8DD9FF]"}
                          blinkColor={"bg-[#00B2FF]"}
                          textColors={"text-black"}
                          boderColors={"border-[#489bbd]"}
                        />
                      </span>

                      <span
                        className="col-span-3  lg:hidden block cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.selectionid);
                          handleBackOpen({
                            data: commList,
                            nameOther: matchScoreDetails.team_data,
                            type: "Yes",
                            odds: commList.lgaai,
                            name: commList.team_name,
                            betFor: "odds",
                            oddsType: "bookmaker",
                            betType: "L",
                            selectionId: commList.selectionid,
                            teamData: commList.lgaai,
                            betfairMarketId: marketId,
                            price: commList.khaai * 100,
                            size: "0",
                            position: returnDataObject,
                            newPosition: returnDataObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={(commList.lgaai * 100).toFixed(2)}
                          size={(commList.khaai * 100).toFixed(2)}
                          color={"bg-[#8DD9FF]"}
                          blinkColor={"bg-[#00B2FF]"}
                          textColors={"text-black"}
                          boderColors={"border-[#489bbd]"}
                        />
                      </span>

                     

                      <span
                        className="col-span-3 lg:col-span-1 w-full cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.selectionid);
                          handleBackOpen({
                            data: commList,
                            nameOther: matchScoreDetails.team_data,
                            type: "No",
                            odds: commList.khaai,
                            name: commList.team_name,
                            betFor: "odds",
                            oddsType: "bookmaker",
                            betType: "K",
                            selectionId: commList.selectionid,
                            teamData: commList.khaai,
                            betfairMarketId: marketId,
                            price: commList.lgaai * 100,
                            size: "0",
                            position: returnDataObject,
                            newPosition: returnDataObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={(commList.khaai * 100).toFixed(2)}
                          size={(commList.lgaai * 100).toFixed(2)}
                          color={"bg-[#FF94BC]"}
                          blinkColor={"bg-[#FE7A7F]"}
                          textColors={"text-black"}
                          boderColors={"border-[#f996ab]"}
                        />
                      </span>
                    </div>

                    {(commList.lgaai === "0.00" || commList.lgaai === "0.000") && (
                      <div className=" h-[40px] lg:h-[33px] bg-black/60 rounded-[4px] w-[35%] lg:w-[16%] xl:w-[23%] px-0.5 right-0 absolute flex justify-center items-center ">
                        <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-medium bg-transparent opacity-90">
                          <span className="text-white xl:text-[12px] text-sm font-bold uppercase">
                            SUSPENDED
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {betSlipData?.oddsType === "bookmaker" && commList?.selectionId === betSlipData?.data?.selectionId && <PlaceBetMobile
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
              ))}
            </MatchDetailsHeaderSection>
          </>
        )}
      </div>

      {/* {bookmaker2Fancy?.length > 0 && (
        <div className="w-[25%]">
          <>
            <MatchDetailsHeaderSection marketType={"Bookmaker 2"} minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}>


              <div className="flex whitespace-normal max-w-full border-b border-gray-200">
                <div className="w-1/2 flex px-2">

                </div>

                <div className="w-1/2 grid grid-cols-2">
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-3 rounded-md">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:col-span-1 col-span-3 rounded-md">
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                </div>
              </div>

              {bookmaker2Fancy.map((commList, index) => (
                <>
                  <div key={index} className="relative border-b border-gray-200 flex decoration-none whitespace-normal max-w-full py-1">
                    <div className="w-1/2 flex">
                      <div className="w-full leading-3 flex items-center capitalize text-[#333333]">
                        <span className="text-[13px] px-2 font-bold">
                          <span>{commList.session_name}</span>
                          <br />
                          <span className={
                            positionObj[commList?.selectionid] > 0
                              ? "text-[var(--success-color)]"
                              : positionObj[commList?.selectionid] < 0
                                ? "text-red-600"
                                : "text-[var(--success-color)]"
                          }>
                            {positionObj[commList?.selectionid]
                              ? (Math.floor(Number(positionObj[commList?.selectionid]) * 100) / 100).toFixed(2)
                              : ''}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="w-1/2 grid grid-cols-2">
                      <span
                        className="lg:block hidden cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.session_id);
                          handleBackOpen({
                            data: commList,
                            type: "Yes",
                            odds: commList.oddsYes,
                            name: commList.session_name,
                            nameSession: commList.session_name,
                            betFor: "fancy",
                            oddsType: "fancy",
                            betType: "Y",
                            run: commList.runsYes,
                            selectionId: commList.session_id,
                            betfairMarketId: marketId,
                            price: commList.runsYes,
                            size: commList.oddsYes,
                            position: returnDataFancyObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={commList.runsYes}
                          size={(commList.oddsYes * 100).toFixed(2).replace(/\.00$/, "")}
                          color={"bg-[#8DD2F0]"}
                          blinkColor={"bg-[#00B2FF]"}
                          textColors={"text-black"}
                          boderColors={"border-[#489bbd]"}
                        />
                      </span>

                      <span
                        className="lg:hidden block cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.session_id);
                          handleBackOpen({
                            data: commList,
                            type: "Yes",
                            odds: commList.oddsYes,
                            name: commList.session_name,
                            nameSession: commList.session_name,
                            betFor: "fancy",
                            oddsType: "fancy",
                            betType: "Y",
                            run: commList.runsYes,
                            selectionId: commList.session_id,
                            betfairMarketId: marketId,
                            price: commList.runsYes,
                            size: commList.oddsYes,
                            position: returnDataFancyObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={commList.runsYes}
                          size={(commList.oddsYes * 100).toFixed(2).replace(/\.00$/, "")}
                          color={"bg-[#8DD2F0]"}
                          blinkColor={"bg-[#00B2FF]"}
                          textColors={"text-black"}
                          boderColors={"border-[#489bbd]"}
                        />
                      </span>

                      <span
                        className="lg:block hidden cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.session_id);
                          handleBackOpen({
                            data: commList,
                            type: "No",
                            odds: commList.oddsNo,
                            name: commList.session_name,
                            nameSession: commList.session_name,
                            betFor: "fancy",
                            oddsType: "fancy",
                            betType: "N",
                            run: commList.runsNo,
                            selectionId: commList.session_id,
                            price: commList.runsNo,
                            size: commList.oddsNo,
                            position: returnDataFancyObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={commList.runsNo}
                          size={(commList.oddsNo * 100).toFixed(2).replace(/\.00$/, "")}
                          color={"bg-[#FEAFB2]"}
                          blinkColor={"bg-[#FE7A7F]"}
                          textColors={"text-black"}
                          boderColors={"border-[#f996ab]"}
                        />
                      </span>

                      <span
                        className="lg:hidden block cursor-pointer"
                        onClick={() => {
                          toggleRowVisibility(commList.session_id);
                          handleBackOpen({
                            data: commList,
                            type: "No",
                            odds: commList.oddsNo,
                            name: commList.session_name,
                            nameSession: commList.session_name,
                            betFor: "fancy",
                            oddsType: "fancy",
                            betType: "N",
                            run: commList.runsNo,
                            selectionId: commList.session_id,
                            price: commList.runsNo,
                            size: commList.oddsNo,
                            position: returnDataFancyObject,
                          });
                        }}
                      >
                        <BlinkingComponent
                          price={commList.runsNo}
                          size={(commList.oddsNo * 100).toFixed(2).replace(/\.00$/, "")}
                          color={"bg-[#FEAFB2]"}
                          blinkColor={"bg-[#FE7A7F]"}
                          textColors={"text-black"}
                          boderColors={"border-[#f996ab]"}
                        />
                      </span>
                    </div>

                    {(commList.lgaai === "0.00" || commList.lgaai === "0.000") && (
                      <div className="xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-[var(--suspended-color)] flex justify-center items-center z-30">
                        <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                          <span className="text-[#FF071B] xl:text-lg text-sm font-bold uppercase">
                            SUSPENDED
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {betSlipData?.oddsType === "bookmaker" && commList?.selectionId === betSlipData?.data?.selectionId && <PlaceBetMobile
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
              ))}
            </MatchDetailsHeaderSection>
          </>
        </div>
      )} */}
    </>
  );
};

export default BookmakerComponent;