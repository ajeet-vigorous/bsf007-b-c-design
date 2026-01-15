import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';
import settings from '../../../domainConfig';

const TossDataComponent = ({
  inplayMatch,
  activeTab,
  matchScoreDetails,
  isTossCoin,
  isMatchCoin,
  positionObj,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataObject,
  formatNumber,
  betplaceSection
}) => {
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
    inplayMatch?.isToss && (activeTab === "toss" || activeTab === "all") ? (
      <>
        <div className='bg-white'>
          {matchScoreDetails &&
            matchScoreDetails.toss_data &&
            matchScoreDetails.toss_data.length > 0 ? (
            <>
            <MatchDetailsHeaderSection marketType={"toss_data"} minMax={{ min: 100, max: formatNumber(isTossCoin?.max) }}>
              
              
              <div className="flex  whitespace-normal max-w-full border-b border-gray-200">
                  <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex items-center text-[12px] px-2">
                  {/* Min: {minMax} | Max: {minMax} */}
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

              <>
                {matchScoreDetails &&
                  matchScoreDetails.toss_data &&
                  matchScoreDetails.toss_data.length > 0
                  ? matchScoreDetails.toss_data.map((commList, index) => {
                                        const tossOdds =
  inplayMatch?.tossRate != undefined &&
  inplayMatch?.tossRate != null &&
  inplayMatch?.tossRate != 0
    ? inplayMatch.tossRate
    : commList.lgaai
                    
                    return(
                    <>
                      <div
                        key={index}
                        className="relative border-b border-gray-200 flex decoration-none whitespace-normal max-w-full"
                      >
                    
                        <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex px-2">
                          <div className="w-full leading-3 flex items-center">
                            <span className="text-[13px] font-bold text-[#333333]">
                              <span>{commList.team_name}</span>
                              <br />
                              <span
                                key={index}
                                className={
                                  positionObj[commList?.selectionId] > 0
                                    ? "text-[var(--success-color)]"
                                    : positionObj[commList?.selectionId] < 0
                                      ? "text-red-500"
                                      : "text-[var(--success-color)]"
                                }
                              >
                                {positionObj[commList?.selectionId]
                                  ? (Math.floor(Number(positionObj[commList?.selectionId]) * 100) / 100).toFixed(2)
                                  : ''}
                              </span>
                            </span>
                          </div>
                        </div>
                        

                        <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2 py-1">
                          {/* <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span> */}
                          <span
                            className="col-span-1 col-start-5 lg:block hidden cursor-pointer"
                            onClick={() =>
                              handleBackOpen({
                                data: commList,
                                type: "Yes",
                                odds: tossOdds,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "L",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.khaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              })
                            }
                          >
                            <BlinkingComponent
                              price={parseFloat(tossOdds * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#00B2FF]"}
                              textColors={"text-black"}
                              boderColors={"border-[#489bbd]"}
                            />
                          </span>

                          <span
                            className="col-span-3 lg:hidden block cursor-pointer"
                            onClick={() => {
                              toggleRowVisibility(commList.selectionid);
                              handleBackOpen({
                                data: commList,
                                type: "Yes",
                                odds: tossOdds,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "L",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.khaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              });
                            }}
                          >
                            <BlinkingComponent
                              price={parseFloat(tossOdds * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#8DD2F0]"}
                              blinkColor={"bg-[#00B2FF]"}
                              textColors={"text-black"}
                              boderColors={"border-[#489bbd]"}
                            />
                          </span>
                          <span
                            className="col-span-3 lg:col-span-1 w-full cursor-pointer"
                            onClick={() =>
                              handleBackOpen({
                                data: commList,
                                type: "No",
                                odds: commList.khaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "K",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.lgaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              })
                            }
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.khaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={0}
                              color={"bg-[#FF94BC]"}
                              blinkColor={"bg-[#FE7A7F]"}
                              textColors={"text-black"}
                              boderColors={"border-[#f996ab]"}
                            />
                          </span>

                          {/* <span
                            className="col-span-3 lg:hidden block cursor-pointer"
                            onClick={() => {
                              toggleRowVisibility(commList.selectionid);
                              handleBackOpen({
                                data: commList,
                                type: "No",
                                odds: commList.khaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "K",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.lgaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              });
                            }}
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.khaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#FF94BC]"}
                              blinkColor={"bg-[#FE7A7F]"}
                              textColors={"text-black"}
                              boderColors={"border-[#f996ab]"}
                            />
                          </span> */}
                          {/* <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#FF94BC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#FF94BC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span> */}
                        </div>
                        

                        {commList.lgaai === "0.00" || commList.lgaai === "0.000" ? (
                          <div className="xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-[var(--suspended-color)] flex justify-center items-center z-30">
                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                              <span className="text-[#FF071B] xl:text-lg text-sm font-bold uppercase">
                                SUSPENDED
                              </span>
                              
                            </div>
                            
                          </div>
                        ) : null}

                        
                      </div>
                      {betSlipData?.oddsType === "toss" && commList?.selectionId === betSlipData?.selectionId && <PlaceBetMobile
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
                            isMatchCoin={isMatchCoin}
                            handleButtonValues={handleButtonValues}
                          />}
                      </>
                      
                    )})
                  : null}
              </>
              </MatchDetailsHeaderSection>
            </>
          ) : null}
          
        </div>
      </>
    ) : null
  );
};

export default TossDataComponent;