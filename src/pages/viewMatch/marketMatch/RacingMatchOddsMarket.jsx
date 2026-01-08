import React from "react";
import BlinkingComponent from "../BlinkingComponent";
import MatchDetailsHeaderSection from "../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection";
import PlaceBetMobile from "../../../component/betplaceMobile/PlaceBetMobile";
import FormateValueNumber from "./FormateValueNumber";

const RacingMatchOddsMarket = ({
  inplayMatch,
  activeTab,
  finalSocket,
  isMatchCoin,
  positionObj,
  returnDataObject,
  toggleRowVisibility,
  handleBackOpen,
  formatNumber,
  betplaceSection,
  matchOddsSelected,
  handleCheckboxClick,
  minMax
}) => {
  if (!inplayMatch?.isMatchOdds || !(activeTab === "MatchOdds" || activeTab === "all")) {
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
    handleButtonValues,
  } = betplaceSection;

  return (
    <>
      {Object.values(finalSocket).map(
        (element, index) =>
          element.marketType === "Match Odds" && (
            <div className="" key={index}>
           
              <MatchDetailsHeaderSection
                marketType={inplayMatch?.marketName || ""}
                minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}
                
              >
                <div className="flex whitespace-normal max-w-full border-b border-gray-200">
                  <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex items-center text-[12px] px-2">
                  Min: 100 | Max: 50000
                  </div>

                  <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2">
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                    <span className="lg:col-span-1 col-span-3 rounded-md w-full">
                      <div className="py-1.5 w-full flex justify-center items-center ">
                        <div className="text-center leading-3 w-full">
                          <span className="text-xs uppercase w-full block  bg-[#8DD9FF] h-[20px] rounded-[4px] px-4 text-gray-800 font-bold">
                            Back
                          </span>
                        </div>
                      </div>
                    </span>
                    <span className="lg:col-span-1 col-span-3 rounded-md">
                      <div className="py-1.5 w-full flex justify-center items-center">
                        <div className="text-center leading-3 w-full">
                          <span className="text-xs px-4 w-full  block rounded-[4px] h-[20px] bg-[#FF94BC] uppercase text-gray-800 font-bold">
                            Lay
                          </span>
                        </div>
                      </div>
                    </span>
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  </div>
                </div>
                {element?.runners?.length > 0 &&
                  element.runners.map((elementtemp, index) =>{
                       const matchingMarket = inplayMatch?.marketList?.find(
                    (mkt) => mkt?.marketId === element?.marketId
                  );

                  const selectionInfo = matchingMarket?.selectionIdData?.find(
                    (sel) => sel?.selectionId === elementtemp?.selectionId
                  );

                  const parsedMetaData = (() => {
  try {
    return typeof selectionInfo?.metadata === "string"
      ? JSON.parse(selectionInfo.metadata)
      : selectionInfo?.metadata || {};
  } catch {
    return {};
  }
})();
                    return (
                    <>
                      <div
                        className="flex whitespace-normal py-1 max-w-full border-b border-gray-200"
                        key={index}
                      >
                        <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex px-2">
                          <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                            {inplayMatch?.sportId == 7 && (
                                        <div className="px-1 flex  items-center justify-center">
                                          
                                          <span className="px-2">
                                            <input
                                              checked={matchOddsSelected?.includes(index + 1)}
                                              onClick={() => {
                                                handleCheckboxClick(index + 1);
                                              }}
                                              type="checkbox"
                                              className="appearance-none bg-white border border-gray-400 rounded-sm checked:bg-blue-600 h-4 w-4"
                                            />
                                          </span>
                                        </div>
                                      )} 
                            <span className="text-[13px] font-bold">
                               <span className="inline-flex items-center gap-1">
                                         {inplayMatch?.countryCode != 'AU' && <span className="text-sm w-5 font-bold">
                                            {parsedMetaData?.CLOTH_NUMBER
                                              ? `${parsedMetaData.CLOTH_NUMBER}.`
                                              : ""}
                                          </span>}


                                          {inplayMatch?.sportId === 7 && <span className="text-base font-bold">
                                            {inplayMatch?.countryCode === 'GB' ? <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                              : inplayMatch?.countryCode === 'US' ? inplayMatch?.countryCode === 'US' && <img src={`https://bp-silks.lhre.net/saddle/us/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt="" />
                                                : <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                            }

                                          </span>}


                                          {inplayMatch?.sportId !== 7 && <span className="text-base font-bold">
                                            {inplayMatch?.countryCode === 'GB' ? <img src={`https://bp-silks.lhre.net/saddle/uk/${getTrapColorDogRace(selectionInfo?.runnerName)}.svg`} className="w-4 h-4" alt="" />
                                              : inplayMatch?.countryCode === 'AU' ? inplayMatch?.countryCode === 'AU' && <img src={`https://bp-silks.lhre.net/saddle/au/${getTrapColorDogRace(selectionInfo?.runnerName)}.svg`} className="w-4 h-4" alt={`${getTrapColorDogRace(selectionInfo?.runnerName)}`} />
                                                : <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                            }

                                          </span>}
{elementtemp?.selectionName}
                                        </span>
                              <div
                                  key={index}
                                  className={
                                    positionObj[elementtemp.selectionId] > 0
                                      ? "text-[var(--success-color)] !mt-2"
                                      : positionObj[elementtemp.selectionId] < 0
                                      ? "text-red-500 !mt-2"
                                      : "black"
                                  }
                                >
                                  {positionObj[elementtemp.selectionId]
                                    ? (
                                        Math.floor(
                                          Number(
                                            positionObj[elementtemp.selectionId]
                                          ) * 100
                                        ) / 100
                                      ).toFixed(2)
                                    : ""}
                                </div>
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-1/2 xl:w-[70%] w-[35%] gap-x-2 grid grid-cols-6">
                       
                          {/* {elementtemp?.ex?.availableToBack?.length > 0 &&
                            elementtemp.ex.availableToBack
                              .slice(1)
                              .map((tempData, index) => {
                                 const matchedTrade = elementtemp.ex.tradedVolume?.find(
      (trade) => trade.price === tempData.price
    );
    const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                return(
                                <span
                                  key={index}
                                  className="lg:col-span-1 col-span-3 h-[33px] rounded-md lg:block hidden"
                                >
                                  <BlinkingComponent
                                    price={tempData.price}
                                    size={FormateValueNumber(displaySize)}
                                    color={"bg-[#8DD9FF]"}
                                    blinkColor={"bg-[#00B2FF]"}
                                    hoverColor={"bg-sky-600"}
                                  />
                                </span>
                              )})}
                          {elementtemp?.ex?.availableToBack?.length > 0 &&
                            elementtemp.ex.availableToBack
                              .slice(0, 1)
                              .map((tempData, index) => {
                                 const matchedTrade = elementtemp.ex.tradedVolume?.find(
      (trade) => trade.price === tempData.price
    );
    const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                return(
                                <React.Fragment key={index}>
                                  <span
                                    className="md:col-span-3 sm:col-span-3 rounded-md col-span-3 lg:hidden block cursor-pointer"
                                    onClick={() => {
                                      handleBackOpen({
                                        data: tempData,
                                        type: "Yes",
                                        odds: tempData.price,
                                        name: elementtemp.selectionName,
                                        nameOther: element.runners,
                                        betFor: "matchOdds",
                                        oddsType: element.marketType,
                                        betType: "L",
                                        selectionId: elementtemp.selectionId,
                                        teamData: tempData.price,
                                        betfairMarketId: element.marketId,
                                        price:
                                          elementtemp.ex.availableToLay[0]
                                            .price,
                                        size: elementtemp.ex.availableToLay[0]
                                          .size,
                                        position: returnDataObject,
                                        newPosition: returnDataObject,
                                      });
                                    }}
                                  >
                                    <BlinkingComponent
                                      price={tempData.price}
                                      size={FormateValueNumber(displaySize)}
                                      color={"bg-[#8DD9FF]"}
                                      blinkColor={"bg-[#00B2FF]"}
                                    />
                                  </span>

                                  <span
                                    className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                    onClick={() => {
                                      handleBackOpen({
                                        data: tempData,
                                        type: "Yes",
                                        odds: tempData.price,
                                        name: elementtemp.selectionName,
                                        nameOther: element.runners,
                                        betFor: "matchOdds",
                                        oddsType: element.marketType,
                                        betType: "L",
                                        selectionId: elementtemp.selectionId,
                                        teamData: tempData.price,
                                        betfairMarketId: element.marketId,
                                        price:
                                          elementtemp.ex.availableToLay[0]
                                            .price,
                                        size: elementtemp.ex.availableToLay[0]
                                          .size,
                                        position: returnDataObject,
                                        newPosition: returnDataObject,
                                      });
                                    }}
                                  >
                                    <BlinkingComponent
                                      price={tempData.price}
                                      size={FormateValueNumber(displaySize)}
                                      color={"bg-[#94dfff]"}
                                      blinkColor={"bg-[#00B2FF]"}
                                    />
                                  </span>
                                </React.Fragment>
                              )})} */}
                               {(() => {
                                    const availableToBack = elementtemp.ex?.availableToBack || [];
                                    const paddedBack = [...availableToBack];
                                    while (paddedBack.length < 3) {
                                      paddedBack.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {/* Extra 2 Back items (index 1, 2) - reverse order, desktop only */}
                                        {paddedBack.slice(1).reverse().map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;

                                          return (
                                            <span
                                              key={`back-extra-${elementtemp.selectionId}-${idx}`}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={"bg-[#8DD9FF]"}
                                      blinkColor={"bg-[#00B2FF]"}
                                              />
                                            </span>
                                          );
                                        })}

                                        {/* First Back item (index 0) - special, clickable */}
                                        {paddedBack.slice(0, 1).map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;

                                          return (
                                            <React.Fragment key={`back-main-${elementtemp.selectionId}`}>
                                              {/* Mobile View */}
                                              <span
                                                className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block"
                                                onClick={() => {
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color={"bg-[#8DD9FF]"}
                                      blinkColor={"bg-[#00B2FF]"}
                                                />
                                              </span>

                                              {/* Desktop View */}
                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() => {
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color={"bg-[#8DD9FF]"}
                                      blinkColor={"bg-[#00B2FF]"}
                                                />
                                              </span>
                                            </React.Fragment>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}

                          {/* Available to Lay */}
                          {/* {elementtemp?.ex?.availableToLay?.length > 0 &&
                            elementtemp.ex.availableToLay.map(
                              (tempData, index) => {
                                const matchedTrade = elementtemp.ex.tradedVolume?.find(
      (trade) => trade.price === tempData.price
    );
    const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                return(
                                <React.Fragment key={index}>
                                  {index === 0 ? (
                                    <>
                                      <span
                                        className="lg:col-span-1 col-span-3 rounded-md lg:hidden cursor-pointer"
                                        onClick={() => {
                                          toggleRowVisibility(
                                            elementtemp.selectionId
                                          );
                                          handleBackOpen({
                                            data: tempData,
                                            type: "No",
                                            odds: tempData.price,
                                            name: elementtemp.selectionName,
                                            nameOther: element.runners,
                                            betFor: "matchOdds",
                                            oddsType: element.marketType,
                                            betType: "K",
                                            selectionId:
                                              elementtemp.selectionId,
                                            teamData: tempData.price,
                                            betfairMarketId: element.marketId,
                                            price:
                                              elementtemp.ex.availableToBack[0]
                                                .price,
                                            size: elementtemp.ex
                                              .availableToBack[0].size,
                                            position: returnDataObject,
                                            newPosition: returnDataObject,
                                          });
                                        }}
                                      >
                                        <BlinkingComponent
                                          price={tempData.price}
                                           size={FormateValueNumber(displaySize)}
                                          color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#FE7A7F]"}
                                        />
                                      </span>

                                      <span
                                        className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                        onClick={() => {
                                          handleBackOpen({
                                            data: tempData,
                                            type: "No",
                                            odds: tempData.price,
                                            name: elementtemp.selectionName,
                                            nameOther: element.runners,
                                            betFor: "matchOdds",
                                            oddsType: element.marketType,
                                            betType: "K",
                                            selectionId:
                                              elementtemp.selectionId,
                                            teamData: tempData.price,
                                            betfairMarketId: element.marketId,
                                            price:
                                              elementtemp.ex.availableToBack[0]
                                                .price,
                                            size: elementtemp.ex
                                              .availableToBack[0].size,
                                            position: returnDataObject,
                                            newPosition: returnDataObject,
                                          });
                                        }}
                                      >
                                        <BlinkingComponent
                                          price={tempData.price}
                                           size={FormateValueNumber(displaySize)}
                                          color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#FE7A7F]"}
                                        />
                                      </span>
                                    </>
                                  ) : (
                                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                      <BlinkingComponent
                                        price={tempData.price}
                                        size={FormateValueNumber(displaySize)}
                                        color={"bg-[#FF94BC]"}
                                        blinkColor={"bg-[#CDEBEB]"}
                                      />
                                    </span>
                                  )}
                                </React.Fragment>
                              )}
                            )} */}
                            {(() => {
                                    const availableToLay = elementtemp.ex?.availableToLay || [];
                                    const paddedLay = [...availableToLay];
                                    while (paddedLay.length < 3) {
                                      paddedLay.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {paddedLay.map((tempData, layIdx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const isFirst = layIdx === 0;
                                          const key = `lay-${elementtemp.selectionId}-${layIdx}`;

                                          if (isFirst) {
                                            return (
                                              <React.Fragment key={key}>
                                                {/* Mobile: First Lay */}
                                                <span
                                                  className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                  onClick={() => {
                                                    toggleRowVisibility(elementtemp.selectionId);
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      inplayCheck: element.inplay,
                                                      statusCheck: element.status,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#FE7A7F]"}
                                                  />
                                                </span>

                                                {/* Desktop: First Lay */}
                                                <span
                                                  className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                  onClick={() => {
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      inplayCheck: element.inplay,
                                                      statusCheck: element.status,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#FE7A7F]"}
                                                  />
                                                </span>
                                              </React.Fragment>
                                            );
                                          }

                                          // Other Lay items (index 1, 2) - Desktop only
                                          return (
                                            <span
                                              key={key}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#FE7A7F]"}
                                              />
                                            </span>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                        </div>
                      </div>
                      {betSlipData?.oddsType === "Match Odds" &&
                        elementtemp?.selectionId ===
                          betSlipData?.selectionId && (
                          <PlaceBetMobile
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
                          />
                        )}
                    </>
                  )})}
              </MatchDetailsHeaderSection>
            </div>
          )
      )}
    </>
  );
};

export default RacingMatchOddsMarket;
