import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { FaCircleInfo } from "react-icons/fa6";
import Loader from "../../component/loader/Loader";
import { getBetListfunc } from "../../redux/reducers/user_reducer";

const BetHistory = () => {
  const [userBetHistory, setUserBetHistory] = useState([]);
   const [modalData, setModalData] = useState({
      status: false,
      id: ""
    })
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState();
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isPast, setIsPast] = useState(true);
  const pageSize = 7;

  const dispatch = useDispatch();
  const { betList, loading } = useSelector((state) => state.user);

  // Fetch bet data on mount or pagination change
  useEffect(() => {
    getBetLists();
  }, [currentPage, isPast]);

  // Process and filter the sport bet list data
useEffect(() => {
  if (betList) {
    const casinoBetData = betList?.casinoBetData || [];
    const fancyBetData = betList?.fancyBetData || [];
    const oddsBetData = betList?.oddsBetData || [];

    // Process casino bets
    const filteredCasinoData = casinoBetData.map((casinoData) => {
      const profitLoss =
        parseFloat(casinoData.creditAmount || 0) -
        parseFloat(casinoData.debitAmount || 0) +
        parseFloat(casinoData.rollbackAmount || 0);

      return {
        userInfo: casinoData?.userInfo,
        description: casinoData?.subProviderName,
        selection: casinoData?.gameName,
        selectionId: casinoData?.selectionId,
        stack: casinoData?.actualBetAmount,
        odds: casinoData?.odds,
        Type: "Casino Odds",
        createdAt: casinoData?.createdAt,
        profit: casinoData?.debitAmount,
        loss: casinoData?.creditAmount,
        type: casinoData?.gameName,
        isDeclare: casinoData?.isDeclare,
        ip: casinoData?.ip,
        run: "",
        oddsType: casinoData?.oddsType,
        positionInfo: casinoData?.positionInfo,
        providerName: casinoData?.providerName,
        profitLoss: parseFloat(profitLoss).toFixed(2).replace(/\.?0+$/, ''),
      };
    });

    // Compute profitLoss for fancy data (in a new array)
    const enhancedFancyData = fancyBetData.map((fancyData) => {
      let profitLoss = 0;
      if (fancyData?.decisionRun && fancyData?.isDeclare) {
        if (
          (fancyData?.type === "N" && fancyData?.decisionRun >= fancyData?.run) ||
          (fancyData?.type === "Y" && fancyData?.decisionRun < fancyData?.run)
        ) {
          profitLoss = fancyData?.loss;
        } else if (
          (fancyData?.type === "N" && fancyData?.decisionRun < fancyData?.run) ||
          (fancyData?.type === "Y" && fancyData?.decisionRun >= fancyData?.run)
        ) {
          profitLoss = fancyData?.profit;
        }
      }

      return {
        ...fancyData,
        profitLoss: parseFloat(profitLoss || 0),
      };
    });

    // Process fancy bets
    const filteredFancyData = enhancedFancyData.map((fancyData) => ({
      userInfo: fancyData?.userInfo,
      description: fancyData?.sessionName,
      selection: "Fancy",
      selectionId: fancyData?.selectionId,
      stack: fancyData?.amount,
      odds: fancyData?.run,
      run: fancyData?.run,
      Type: "Fancy Odds",
      createdAt: fancyData?.createdAt,
      profit: fancyData?.profit,
      loss: fancyData?.loss,
      profitLoss: fancyData?.profitLoss,
      type: fancyData?.type,
      isDeclare: fancyData?.isDeclare,
      ip: fancyData?.ip,
      oddsType: fancyData?.oddsType,
      positionInfo: fancyData?.positionInfo,
    }));

    // Process odds bets
    const filteredOddsData = oddsBetData.map((oddsData) => ({
      userInfo: oddsData?.userInfo,
      description: oddsData?.teamName,
      selection: oddsData?.oddsType,
      selectionId: oddsData?.selectionId,
      stack: oddsData?.amount,
      odds: oddsData?.odds,
      Type: "Match Odds",
      createdAt: oddsData?.createdAt,
      profit: oddsData?.profit,
      loss: oddsData?.loss,
      type: oddsData?.type,
      isDeclare: oddsData?.isDeclare,
      ip: oddsData?.ip,
      run: "",
      oddsType: oddsData?.oddsType,
      profitLoss: oddsData?.positionInfo?.[oddsData.selectionId] || 0,
      positionInfo: oddsData?.positionInfo,
    }));

    // Combine all
    setUserBetHistory([
      ...filteredCasinoData,
      ...filteredFancyData,
      ...filteredOddsData,
    ]);
  }
}, [betList, currentPage]);


  const getBetLists = () => {
    const reqData = {
      fancyBet: true,
      oddsBet: true,
      casinoBet: true,
      isDeleted: false,
            fromDate: fromDate,
        toDate: toDate,
    };
    dispatch(getBetListfunc(reqData));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...userBetHistory].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setUserBetHistory(sortedData);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "fromDate") setFromDate(value);
  if (name === "toDate") setToDate(value);
};

  // const handleChange = (e) => {
  //   setSelectedValue(e.target.value);
   
  // };
    const openModal = (id) => {
    setModalData({ status: true, id });
  };
    const closeModal = () => {
    setModalData({ status: false, id: '' });
  };


  return (
    <>
  
      <div className="w-full rounded-md shadow-md mt-2">
        {isPast && (
          <div className="w-full flex flex-col gap-2">
            <div className="w-full overflow-x-auto">
              <div className="flex md:flex-row flex-col justify-center text-center relative lg:gap-3 gap-1 py-2.5">

                <div className="flex w-full lg:w-52 items-start border-2 border-secondary  rounded-sm my-2 transition-colors relative">
                  <div className="absolute mx-2 -top-[10px] space-x-2 text-[#7b7b7b] max-w-[85%] flex justify-satrt items-center bg-white px-2">
                    {/* <h2 className="text-xs font-semibold">From</h2> */}
                  </div>
                  <input
                    type="date"
                    name="fromDate"
                    id="fromDate"
                    value={fromDate}
                    onChange={handleChange}
                    className="block w-full h-[43px] mt-1 bg-transparent border border-black rounded-[5px] text-black py-2.5 px-3 shadow-sm focus:outline-none "
                  />
                </div>
                <div className="flex w-full lg:w-52 items-start border-2 border-secondary  rounded-sm my-2 transition-colors relative">
                  <div className="absolute mx-2 -top-[10px] space-x-2 text-[#7b7b7b] max-w-[85%] flex justify-satrt items-center bg-white px-2">
                    {/* <h2 className="text-xs font-semibold">To</h2> */}
                  </div>
                  <input
                    type="date"
                    name="toDate"
                    id="toDate"
                    value={toDate}
                    onChange={handleChange}
                    className="block w-full h-[43px] mt-1 bg-transparent border border-black rounded-[5px] text-black py-2.5 px-3 shadow-sm focus:outline-none "
                  />
                </div>


                <div className="my-2">
                  <button
                    type="submit"
                    className="bg-[var(--primary)] flex rounded-[5px] justify-center items-center mt-1 h-[43px] text-white text-sm font-bold px-4 py-2.5 lg:w-52 w-full"
                    onClick={getBetLists}
                  >
                    Load Report
                  </button>
                </div>
              </div>
            </div>
           {loading ?
    <Loader/> : <div className="w-full rounded-md shadow-md bg-white">
              <div className="lg:flex gap-4 w-full">
                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-sm text-left text-white bg-black border border-secondary capitalize">
                                      <thead className="text-xs uppercase bg-[#DFDDE0] text-black">
                                        <tr>
                                          <th scope="col" className="px-6 py-2.5">Date</th>
                                          <th scope="col" className="px-6 py-2.5">DESC</th>
                                          <th scope="col" className="px-6 py-2.5">Type</th>
                                          <th scope="col" className="px-6 py-2.5">Odds</th>
                                          <th scope="col" className="px-6 py-2.5">Stake </th>
                                          <th scope="col" className="px-6 py-2.5">Exp/Profit </th>
                
                                        </tr>
                                      </thead>
                                      {userBetHistory?.length > 0 ?(userBetHistory?.map((item, index) => (
                                        <tbody key={index}>
                                          <tr className="bg-white border-b-[1px] text-black border-secondary">
                                            <th
                                              scope="row"
                                              className="px-6 py-2.5 font-medium whitespace-nowrap"
                                            >
                                      
                                              
                                              {moment(item?.createdAt).format("DD/MM/YYYY hh:mm:ss A")}
                                            </th>
                                            <td className="px-6 py-2.5">{item?.description}</td>
                                            <td
                                              className={`px-6 py-2.5`}
                                            >
                                              {{
                                N: "No",
                                Y: "Yes",
                                L: "Lagai",
                                K: "Khai",
                              }[item?.type] || item?.type || "-"}
                                            </td>
                                            <td className={`px-6 py-2.5 `}>
                                              {item?.odds || "-"}
                                            </td>
                                            <td className={`px-6 py-2.5 `}>
                                              {item?.stack || '-'}
                                            </td>

                                            <td className={`px-6 py-2.5 ${
                                item?.profitLoss >= 0 ? "text-green-800" : "text-red-800"
                              }`}>
                                                {parseFloat(item?.profitLoss).toFixed(2)}
                                            </td>
                                           
                
                                          </tr>
                                        </tbody>
                                      ))):(
                                        <tr>
                                          <td colSpan="7" className="text-center p-2 bg-[#dee2e6]/50 font-semibold">
                                            No Bet List Available
                                          </td>
                                        </tr>
                                      )}
                                    </table>
                
                                  </div>
              </div>
            </div>}
          </div>
        )}
      </div>
    </>
  );
};

export default BetHistory;
