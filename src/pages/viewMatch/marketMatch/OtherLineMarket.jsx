import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import FormateValueNumber from './FormateValueNumber';
import settings from '../../../domainConfig';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';

const OtherMarketsComponent = ({
  activeTab,
  otherFinalSocket,
  isTieCoin,
  positionObj,
  returnDataObject,
  handleBackOpen,
  isMatchCoin,
  formatNumber,
  betplaceSection,
  inplayMatch
}) => {
  if (!inplayMatch?.isLineMarketOdds || activeTab !== "all" && activeTab !== "other") {
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
      {Object.values(otherFinalSocket).filter(item => {
    const t = item.marketType.trim();
    return !/(Line|Total)$/.test(t) && t !== "Match Odds (Inc. Tie)";
  }).sort((a, b) => {
    const isFirstA = a.marketType.includes("1st Innings");
                const isFirstB = b.marketType.includes("1st Innings");
                if (isFirstA && !isFirstB) return -1;
                if (!isFirstA && isFirstB) return 1;

                const numA = parseFloat(a.marketType.match(/(\d+(?:\.\d+)?)\s*Overs/)?.[1]) || 0;
                const numB = parseFloat(b.marketType.match(/(\d+(?:\.\d+)?)\s*Overs/)?.[1]) || 0;

                return numA - numB;
  }).map((element, index) => 
        element.marketType !== "Tied Match" && 
        element.marketType !== "Match Odds" && 
        element.marketType !== "To Win the Toss" && 
        element.marketType !== "Completed Match" && (
          <div key={index}>
         
            <MatchDetailsHeaderSection marketType={element.marketType} minMax={{ min: 100, max: formatNumber(isTieCoin?.max) }}>
            
            <div className="flex  whitespace-normal max-w-full border-b border-gray-200">
                  <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex items-center text-[12px] px-2">
                  </div>

                  <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2 pe-2">
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
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                </div>
              </div>

            {element?.runners?.length > 0 && element.runners.map((elementtemp, index) => (
              <>
              
              
              
              <div className="flex whitespace-normal max-w-full border-b border-gray-200 py-1" key={index}>
                <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex px-2">
                  <div className="w-full py-1 leading-3 flex items-center text-[#2B2f35]">
                    <span className="text-[14px] font-bold">
                      <span className="flex items-center py-2">
                        {elementtemp.selectionName}{" "}
                        <div
                          key={index}
                          className={
                            positionObj[elementtemp.selectionId] > 0
                              ? "text-[var(--success-color)]"
                              : positionObj[elementtemp.selectionId] < 0
                                ? "text-red-500 mt-2"
                                : "text-[var(--success-color)] mt-2"
                          }
                        >
                          {positionObj[elementtemp.selectionId]
                            ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(2)
                            : ''}
                        </div>
                      </span>
                    </span>
                  </div>
                </div>
                <div className="lg:w-1/2 xl:w-[70%] w-[35%] gap-x-2 grid grid-cols-6 pe-2 relative">

                  {elementtemp?.ex?.availableToBack?.length > 0 || elementtemp?.ex?.availableToLay?.length > 0 ? (
                    <>

                      {/* {elementtemp?.ex?.availableToBack?.length > 0 && 
                        elementtemp.ex.availableToBack.slice(1).map((tempData, index) => {
                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                                                              (trade) => trade.price === tempData.price);
                                                                              const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                          return(
                          <span key={index} className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                            <BlinkingComponent
                              price={tempData.price}
                              size={FormateValueNumber(displaySize)}
                              color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#00B2FF]"}
                              hoverColor={"bg-sky-600"}
                            />
                          </span>
                        )})
                      }

                      {elementtemp?.ex?.availableToBack?.length > 0 && 
                        elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => {
                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                                                              (trade) => trade.price === tempData.price);
                                                                              const displaySize = matchedTrade ? matchedTrade.size : tempData.size
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
                                  price: elementtemp.ex.availableToLay?.[0]?.price,
                                  size: elementtemp.ex.availableToLay?.[0]?.size,
                                  position: returnDataObject,
                                  newPosition: returnDataObject
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
                                  price: elementtemp.ex.availableToLay?.[0]?.price,
                                  size: elementtemp.ex.availableToLay?.[0]?.size,
                                  position: returnDataObject,
                                  newPosition: returnDataObject
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
                          </React.Fragment>
                        )})
                      } */}
                       {(() => {
                                    const availableToBack = elementtemp.ex?.availableToBack || [];
                                    const paddedBack = [...availableToBack];
                                    while (paddedBack.length < 3) {
                                      paddedBack.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {/* Extra 2 Back items (index 1 and 2) - reverse order, desktop only */}
                                        {paddedBack.slice(1).reverse().map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;

                                          return (
                                            <span
                                              key={`back-extra-${elementtemp.selectionId}-${idx}`}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                               onClick={() =>
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
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#00B2FF]"}
                              hoverColor={"bg-sky-600"}
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
                                                onClick={() =>
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
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#00B2FF]"}
                              hoverColor={"bg-sky-600"}
                                                />
                                              </span>

                                              {/* Desktop View */}
                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() =>
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
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                 color={"bg-[#8DD9FF]"}
                              blinkColor={"bg-[#00B2FF]"}
                              hoverColor={"bg-sky-600"}
                                                />
                                              </span>
                                            </React.Fragment>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}

                      {/* {elementtemp?.ex?.availableToLay?.length > 0 && 
                        elementtemp.ex.availableToLay.map((tempData, index) => {
                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                                                              (trade) => trade.price === tempData.price);
                                                                              const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                          return(
                          <React.Fragment key={index}>
                            {index === 0 ? (
                              <>
                                <span 
                                  className="lg:col-span-1 col-span-3 rounded-md lg:hidden cursor-pointer"
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
                                      selectionId: elementtemp.selectionId,
                                      teamData: tempData.price,
                                      betfairMarketId: element.marketId,
                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                      position: returnDataObject,
                                      newPosition: returnDataObject
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
                                      selectionId: elementtemp.selectionId,
                                      teamData: tempData.price,
                                      betfairMarketId: element.marketId,
                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                      position: returnDataObject,
                                      newPosition: returnDataObject
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
                        )})
                      } */}

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
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
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
                                          );
                                        })}
                                      </>
                                    );
                                  })()}

                    </>
                  ) : (
                  
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-90  text-[--primary] font-normal">
                    SUSPENDED
                    </div>
                  )}
              </div>


                {/* <div className="lg:w-1/2 relative xl:w-[35%] w-[35%] grid grid-cols-6 gap-x-1">
                  {elementtemp?.ex?.availableToBack?.length > 0 && 
                    elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                      <span key={index} className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                        <BlinkingComponent
                          price={tempData.price}
                          size={tempData.size}
                          color={"bg-[#E6F2FC]"}
                          blinkColor={"bg-[#00B2FF]"}
                          hoverColor={"bg-sky-600"}
                        />
                      </span>
                    ))
                  }
                  {elementtemp?.ex?.availableToBack?.length > 0 && 
                    elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                      <React.Fragment key={index}>
                        <span 
                          className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block cursor-pointer"
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
                              price: elementtemp.ex.availableToLay[0].price,
                              size: elementtemp.ex.availableToLay[0].size,
                              position: returnDataObject,
                              newPosition: returnDataObject
                            });
                          }}
                        >
                          <BlinkingComponent
                            price={tempData.price}
                            size={tempData.size}
                            color={"bg-[#8DD2F0]"}
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
                              price: elementtemp.ex.availableToLay[0].price,
                              size: elementtemp.ex.availableToLay[0].size,
                              position: returnDataObject,
                              newPosition: returnDataObject
                            });
                          }}
                        >
                          <BlinkingComponent
                            price={tempData.price}
                            size={tempData.size}
                            color={"bg-[#8DD2F0]"}
                            blinkColor={"bg-[#00B2FF]"}
                          />
                        </span>
                      </React.Fragment>
                    ))
                  }
                  {elementtemp?.ex?.availableToLay?.length > 0 && 
                    elementtemp.ex.availableToLay.map((tempData, index) => (
                      <React.Fragment key={index}>
                        {index === 0 ? (
                          <>
                            <span 
                              className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block cursor-pointer"
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
                                  selectionId: elementtemp.selectionId,
                                  teamData: tempData.price,
                                  betfairMarketId: element.marketId,
                                  price: elementtemp.ex.availableToBack[0].price,
                                  size: elementtemp.ex.availableToBack[0].size,
                                  position: returnDataObject,
                                  newPosition: returnDataObject
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={tempData.price}
                                size={tempData.size}
                                color={"bg-[#FEAFB2]"}
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
                                  selectionId: elementtemp.selectionId,
                                  teamData: tempData.price,
                                  betfairMarketId: element.marketId,
                                  price: elementtemp.ex.availableToBack[0].price,
                                  size: elementtemp.ex.availableToBack[0].size,
                                  position: returnDataObject,
                                  newPosition: returnDataObject
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={tempData.price}
                                size={tempData.size}
                                color={"bg-[#FEAFB2]"}
                                blinkColor={"bg-[#FE7A7F]"}
                              />
                            </span>
                          </>
                        ) : (
                          <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                            <BlinkingComponent
                              price={tempData.price}
                              size={tempData.size}
                              color={"bg-[#FCE3E4]"}
                              blinkColor={"bg-[#CDEBEB]"}
                            />
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  }
                  <div className='absolute bg-red-500'>
                  live market Close measse dikhana hai
                  </div>
                </div> */}
              </div>
              {console.log(betSlipData, "betSlipData?.oddsTypebetSlipData?.oddsType")
              }
              {betSlipData?.oddsType === element.marketType &&
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
            ))}
            </MatchDetailsHeaderSection >
          </div>
        )
      )}
    </>
  );
};

export default OtherMarketsComponent;