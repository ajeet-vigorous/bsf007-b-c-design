import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';

const GroupedFancyComponent = ({
  inplayMatch,
  activeTab,
  groupedData,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataFancyObject,
  betplaceSection,
  isMatchCoin

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
    handleButtonValues,
  } = betplaceSection;
  return (
    inplayMatch?.isFancy && (activeTab === "fancy" || activeTab === "all") && (
      <div className="grid xl:grid-cols-1 gap-0.5 grid-cols-1">
        {groupedData && Object.keys(groupedData).length > 0 &&
          Object.entries(groupedData).map(([sessionName, items], index) => (
            <div key={index} className="mb-4 overflow-hidden">
              {/* Header */}
              <header className="mt-1">
                <div className="bg-slate-300 items-center flex justify-between relative z-0 ">
                  <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold bg-slate-300">
                    <span className="
              h-10 inline-flex items-center px-[10px] mr-[10px] relative 
              text-white text-[13px] font-semibold uppercase bg-[var(--primary)] 
              leading-none mobile:text-[11px] mobile:px-[5px] 
              before:content-[''] before:absolute before:right-[-17px] before:top-0 
              before:w-[18px] before:h-full 
              before:bg-[linear-gradient(180deg,var(--primary)_0,var(--primary))] 
              before:[clip-path:polygon(0_-1px,100%_-1px,1px_100%,0_100%)]
            ">
                      {sessionName}

                    </span>
                  </div>
                </div>
              </header>

              {/* Min/Max */}
              <div className="grid grid-cols-[85%_15%] bg-white gap-2 border-t text-sm">
                <div className="text-[11px] text-black/75 px-2 py-1 font-medium">
                  Min: 100 Max: {Number(isMatchCoin?.max).toFixed(2)}
                </div>
                <div className={`py-1.5 flex justify-center items-center`}>
                  <div className='text-center leading-3'>
                    <span className="text-xs uppercase text-gray-800 font-bold">yes</span>
                  </div>
                </div>
              </div>

              {/* Odds Rows */}
              {items.map((commList, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[85%_15%] bg-white border-t text-sm"
                >
                  <div className="px-2 flex justify-start items-center">{i} Number</div>
                  <div className="text-center bg-red-900 text-black cursor-pointer"
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
                  </div>
                  <div className="col-span-2">
                    {betSlipData?.oddsType === "fancy" &&
                      commList?.Selection_id ===
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
                  </div>

                </div>
              ))}
            </div>
          ))}


      </div>
    )
  );
};

export default GroupedFancyComponent;