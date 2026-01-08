import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getUserLedger } from "../../redux/reducers/user_reducer";
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendar } from "react-icons/fa6";
import AppHeader from "../../component/layout/AppHeader";
import AppFooter from "../../component/layout/AppFooter";
import { domainName } from "../../config/Auth";

const ProfitLoss = () => {
 const [payloadData, setPayloadData] = useState({
    fromDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    statementFor: "",
  });
const { userLegderList } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sportType, setSportType] = useState("");
  
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const [selectedValue, setSelectedValue] = useState('5');

  // const handleChangeSelectedValue = (event) => {
  //   setSelectedValue(event.target.value);
  // };

  const fetchUserLedger = () => {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

    const reqData = {
      isCreatorId: user.data.userId,
      fromDate: fromDate,
      toDate: toDate,
      size: selectedValue,
      pageNo: pageNumber,
    };
if (payloadData?.statementFor) {
      reqData.statementFor = payloadData?.statementFor
    }
    dispatch(getUserLedger(reqData));
  };

  useEffect(() => {
    fetchUserLedger();
  }, [dispatch, selectedValue,pageNumber]);


   let totalAmount = 0;
  userLegderList?.map((data, key) => {
    totalAmount += data.clientNetAmount
  })
  let balance = 0;
  let showAmount = 0;
  let finalData = userLegderList?.map((data, key) => {
    balance = totalAmount - showAmount;
    showAmount += data.userNetProfitLoss;
    const pushObj = {
      amount: data.sessionAmt + data.oddsAmt + data.userOddsComm + data.userSessionComm,
      Amt: data?.clientNetAmount,
      commisition: data.userOddsComm + data.userSessionComm,
      userOddsComm: data.userOddsComm,
      userSessionComm: data.userSessionComm,
      clientNetAmount: data.clientNetAmount,
      date: data.date,
      balance: balance,
      ledgerType: data.ledgerType,
      eventName: data.eventName,
      userRemark: data.userRemark,
      statementFor: data.statementFor,
      isComm: data.isComm,
      marketId: data.marketId,
      createdAt: data.createdAt,
      isCasino: data.isCasino,
      result: data.result ? data.result : '-' ,
      
    };
    return pushObj;
  });

  const handleSearch = () => {
    fetchUserLedger();
  };


  const handleSelectChange = (e) => {
    setPayloadData({
      ...payloadData,
      statementFor: e.target.value,
    });
  };
  
  const calendarIcon = (
    <FaRegCalendar className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
  );


  return (
    <>
      <div className="w-full min-h-screen flex">
        <div className="border w-full">
          <div className='bg-[var(--primary)] uppercase rounded-t-[4px] text-black py-1 px-1.5'>
            <h2 className='text-[13px] text-white font-semibold'>Profit Loss</h2>
          </div>
          <div className="mt-1.5 border-1 border-gray-400 space-y-2">
            {/* desktop view */}
            <div className="mt-3 mb-5 justify-center hidden md:flex items-center">
              <div className="flex justify-between gap-2 md:mx-8">
                {/* <div className="flex flex-col">
                <label className='text-[12px]'>Sports Type:</label>
                <select
                  className="px-3 py-[4px] text-md bg-transparent border bg-white border-gray-400 xl:w-[252px] w-[165px] rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                </div> */}
                <div className="flex flex-col">
                                                  {/* <label className='text-[12px]'>From Date:</label> */}

                  <input
                    type="date"
                    placeholder="From Date"
                    className="!px-2 !py-[4px] text-sm border h-[43px] bg-gray-100 border-gray-400 rounded-md focus:outline-none text-black"
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </div>
                <div className="flex flex-col">
                                                  {/* <label className='text-[12px]'>To Date:</label> */}
                  <input
                    type="date"
                    placeholder="From Date"
                    className="!px-2 !py-[4px] text-sm border h-[43px] bg-gray-100 border-gray-400 rounded-md focus:outline-none text-black"
                    value={toDate}
                    onChange={handleToDateChange}
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="text-[12px] uppercase bg-[--primary] md:border-[var(--primary)] hover:bg-[var(--secondary)] hover:text-black h-[43px] transition text-[--secondary] text-md md:w-[200px] rounded-md">
                  Submit
                </button>
              </div>
            </div>
            {/* mobile view */}
            <div className="p-1 flex flex-col bg-white md:hidden justify-center items-center space-y-2 lg:space-y-0 space-x-0 lg:space-x-6">
              <div className="flex w-full justify-center items-center  gap-2">
                <div className="w-full">
                  <label className='mb-1 text-[12px]'>From Date:</label>
                  <input
                    type="date"
                    placeholder="From Date"
                    className="!px-2 !py-[4px] text-sm border h-[43px] bg-white border-gray-400 w-full rounded-md focus:outline-none text-black"
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </div>
                <div className="w-full">
                                  <label className='mb-1 text-[12px]'>To Date:</label>
                  <input
                    type="date"
                    placeholder="From Date"
                    className="!px-2 !py-[4px] text-sm border h-[43px] bg-white border-gray-400 w-full rounded-md focus:outline-none text-black"
                    value={toDate}
                    onChange={handleToDateChange}
                  />
                </div>               
              </div>
              <div className="flex gap-2 w-full">
                 {/* <select
                  className="px-3 py-[2px] text-md bg-transparent border bg-white w-1/2 border-gray-400 rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select> */}
                <button
                  onClick={handleSearch}
                  className="text-[12px] uppercase bg-[--primary] md:border-[var(--primary)] hover:bg-[var(--secondary)] hover:text-black font-semibold h-[43px] text-[--secondary] text-md w-full rounded-md">
                  Submit
                </button>
              </div>
            </div>

            {finalData && finalData.length > 0 ? (
                          <div className="overflow-hidden">
              <div className="max-w-full overflow-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden w-full">
                    <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                      <thead className="bg-gray-100">
                        <tr className="text-left text-[12px] lg:bg-transparent text-[#212529]  font-semibold border border-[#c7c8ca]/50">
                          <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">No</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Date</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Credit</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Debit</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Balance</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">P&L</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Result</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalData?.map((element, index) => (
                            <tr
                              className={index % 2 === 0 ? "bg-white text-[12px]" : "bg-white text-[12px]"}
                              key={index}
                            >
                              <td className="px-3 py-2 border border-[#c7c8ca]/50">{index + 1}</td>
                              <td className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">
                                {moment(element?.createdAt)
                                  .utcOffset("+05:30")
                                  .format("YYYY/MM/DD hh:mm:ss")}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                {element?.amount > 0
                                  ? Number.parseFloat(element?.amount).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(0).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-red-600">
                                {element?.amount < 0
                                  ? "-" + Number.parseFloat(Math.abs(element?.amount)).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(Math.abs(0)).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                {Number.parseFloat(element?.balance).toFixed(2)}
                              </td>
                              <td className={`px-3 py-2 border border-[#c7c8ca]/50 ${element?.Amt >= 0 ? "text-green-700" : 'text-red-600'}`}>
                                 {Math.abs(Math.floor(parseFloat(element?.Amt * 100) / 100) / 100).toFixed(2)}
                               </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.result}</td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.eventName}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div> ) : (
              <div className="text-center text-gray-500 py-10">No data available</div>
            )}
            {/* <div className="flex justify-between items-center mx-4 my-2">
            <div className="lg:flex lg:flex-row flex-col  justify-start items-center my-1 gap-4">
              <div className="flex justify-start items-center ">
              
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="px-3 py-1 border text-black text-sm"
                  disabled={pageNumber === 1}
                >
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 border text-black text-sm"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next Page
                </button>

              </div>
              <div className='space-x-2 flex justify-center items-center gap-2 lg:mt-0 mt-2'>
                <span>Page {pageNumber} of {totalPages}  </span>
                <span>Go to Page</span>
                <input
                  onChange={(e) => { setPaginationPage(e.target.value) }}
                  value={paginationPage}
                  className='border p-2 w-32'></input>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      </div>
    </>
  );
};

export default ProfitLoss;