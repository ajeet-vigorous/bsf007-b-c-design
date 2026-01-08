import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';
import FormateValueNumber from './FormateValueNumber';
import settings from '../../../domainConfig';

const TiedOddsComponent = ({
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
  minMax,
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

  if (!inplayMatch?.isTieOdds && (activeTab === "all" || activeTab === "tied")) {
    return null;
  }

  return (
    <>
      {Object.values(finalSocket)?.map((element, index) =>
        element.marketType === "Match Odds" && (
          element && element.runners && element.runners.length <= 2 ?
            <>
              {Object.values(finalSocket)?.map((element, index) =>
                element.marketType === "Tied Match" && (
                  <div className="bg-white" key={index}>
                    
                    <MatchDetailsHeaderSection
                      cashOut={
                        element?.runners?.length > 0 && (
                          <CashOutSystem
                            marketList={element.runners.map(runner => ({
                              selectionid: runner.selectionId,
                              team_name: runner.selectionName,
                              lgaai: runner.ex?.availableToBack?.[0]?.price || 0,
                              khaai: runner.ex?.availableToLay?.[0]?.price || 0,
                              selectionName: runner.selectionName,
                              ex: {
                                availableToBack: runner.ex?.availableToBack || [],
                                availableToLay: runner.ex?.availableToLay || []
                              }
                            }))}
                            positionObj={positionObj}
                            handleBackOpen={handleBackOpen}
                            toggleRowVisibility={toggleRowVisibility}
                            marketId={element.marketId}
                            betFor={"tiedMatch"}
                            oddsType={element.marketType}
                          />
                        )}
                      marketType={"Tied_Match"} minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}>
                      <div className="flex whitespace-normal max-w-full border-b border-gray-200">
                        <div className="lg:w-1/2 xl:w-[30%] w-[65%] flex items-center text-[12px] px-2">
                          Min: {minMax} | Max: {minMax}
                        </div>

                        <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2">
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
                              <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                                <span className="text-[13px] font-bold">
                                  <span>
                                    {elementtemp.selectionName} <br />
                                    <div
                                      key={index}
                                      className={
                                        positionObj[elementtemp.selectionId] > 0
                                          ? 'text-[var(--success-color)] !mt-2'
                                          : positionObj[elementtemp.selectionId] < 0
                                            ? 'text-red-500 !mt-2'
                                            : 'black'
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

                            <div className="lg:w-1/2 xl:w-[70%] w-[35%] grid grid-cols-6 gap-x-2">
                            
                              {/* {elementtemp?.ex?.availableToBack?.length > 0 &&
                                elementtemp.ex.availableToBack.slice(1).map((tempData, index) => {  
                                  const matchedTrade = elementtemp.ex.tradedVolume?.find(
      (trade) => trade.price === tempData.price
    );
    const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                  return(
                                  <span key={index} className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
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
                                          betFor: "tiedMatch",
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
                                          betFor: "tiedMatch",
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
                                              onClick={() =>  handleBackOpen({
                                              data: tempData,
                                              type: "Yes",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // ← Confirm if this is correct
                                              oddsType: element.marketType,
                                              betType: "L",
                                              selectionId: elementtemp.selectionId,
                                              teamData: tempData.price,
                                              betfairMarketId: element.marketId,
                                              price: elementtemp.ex.availableToLay?.[0]?.price,
                                              size: elementtemp.ex.availableToLay?.[0]?.size,
                                              position: returnDataObject,
                                              newPosition: returnDataObject,
                                            })}
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

                                          const handleClick = () => {
                                            handleBackOpen({
                                              data: tempData,
                                              type: "Yes",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // ← Confirm if this is correct
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
                                          };

                                          return (
                                            <React.Fragment key={`back-main-${elementtemp.selectionId}`}>
                                              {/* Mobile View */}
                                              <span
                                                className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block"
                                                onClick={handleClick}
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
                                                onClick={handleClick}
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
                              {/* Available to Lay */}
                              {/* {elementtemp?.ex?.availableToLay?.length > 0 &&
                                elementtemp.ex.availableToLay.map((tempData, index) => {
                                  const matchedTrade = elementtemp.ex.tradedVolume?.find(
      (trade) => trade.price === tempData.price
    );
    const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                  return(
                                  <React.Fragment key={index}>
                                    {index === 0 ? (
                                      <>
                                        <span
                                          className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                          onClick={() => {
                                            toggleRowVisibility(elementtemp.selectionId);
                                            handleBackOpen({
                                              data: tempData,
                                              type: "No",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch",
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
                                            size={FormateValueNumber(displaySize)}
                                            color={"bg-[#FF94BC]"}
                                            blinkColor={"bg-[#FE7A7F]"}
                                          />
                                        </span>

                                        <span
                                          className="lg:col-span-1 col-span-3 rounded-md lg:hidden block cursor-pointer"
                                          onClick={() => {
                                            handleBackOpen({
                                              data: tempData,
                                              type: "No",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch",
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

                                          const handleClick = () => {
                                            handleBackOpen({
                                              data: tempData,
                                              type: "No",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // Confirm if correct
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
                                          };

                                          if (isFirst) {
                                            return (
                                              <React.Fragment key={key}>
                                                {/* Mobile: First Lay */}
                                                <span
                                                  className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                  onClick={() => {
                                                    toggleRowVisibility(elementtemp.selectionId);
                                                    handleClick();
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#CDEBEB]"}
                                                  />
                                                </span>

                                                {/* Desktop: First Lay */}
                                                <span
                                                  className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                  onClick={handleClick}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#CDEBEB]"}
                                                  />
                                                </span>
                                              </React.Fragment>
                                            );
                                          }

                                          // Other Lay items (index 1, 2) – Desktop only
                                          return (
                                            <span
                                              key={key}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                                onClick={handleClick}
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={"bg-[#FF94BC]"}
                                          blinkColor={"bg-[#CDEBEB]"}
                                              />
                                            </span>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                            </div>
                          </div>
                          {betSlipData?.oddsType === "Tied Match" && elementtemp?.selectionId === betSlipData?.selectionId && <PlaceBetMobile
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
                  </div>
                )
              )}
            </> : null))}
    </>
  );
};

export default TiedOddsComponent;