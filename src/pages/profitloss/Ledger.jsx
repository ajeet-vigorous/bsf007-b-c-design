import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import Loader from "../../component/loader/Loader";
import { getUserLedger1 } from "../../redux/reducers/user_reducer";
import { Link } from "react-router-dom";


const Ledger = () => {
  const [userLedger, setLedger] = useState([]);
  const [calAmount, setCalAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [debitAmount, setDebitAmount] = useState(0);
  const dispatch = useDispatch();

  const { getUserLedger1Data, loading } = useSelector((state) => state.user);

  useEffect(() => {
    userLedgerFetch();
  }, [dispatch]);

  useEffect(() => {
    if (getUserLedger1Data) {
      const { calAmount, creditAmount, debitAmount, ledgerData } = getUserLedger1Data;
      const filteredData = ledgerData.map((item, index) => ({
        key: `${item.userId}-${index}`,
        userID: `${item.userId}`,
        createdAt: item.createdAt,
        eventName: item.eventName,
        balance: item.balance,
        debit: item.amount > 0 ? item.amount : 0,
        credit: item.amount < 0 ? item.amount : 0,
        ledgerType: item.ledgerType,
        remark: item.remark,
        userType: item.userType,
        marketId: item.marketId,
        date: item.date,
        eventId: item.eventId,
      }));
      setLedger(filteredData);
      setCalAmount(calAmount);
      setCreditAmount(creditAmount);
      setDebitAmount(debitAmount);
    }
  }, [getUserLedger1Data]);

  const userLedgerFetch = async () => {
    let localData = JSON.parse(localStorage.getItem("user_id"));
    let reqData = {
      downlineUserId: localData?.data?.userId,
    };
    dispatch(getUserLedger1(reqData));
  };

  return (
    <>
      {loading ? (
        <Loader active={loading} />
      ) : (

          <div className="">
             <div className='bg-[var(--primary)] uppercase rounded-t-[4px] text-black py-1 px-1.5'>
            <h2 className='text-[13px] text-white font-semibold'>Ledger Report</h2>
          </div>

              <div className="flex justify-between py-2 px-4 text-sm font-semibold text-gray-700">
                <div className="flex md:flex-row flex-col items-center">
                  <span className="text-base font-semibold px-2">Lena:</span>
                  <span className="text-base font-semibold text-green-600">
                    {Number.parseFloat(Math.abs(creditAmount || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex md:flex-row flex-col items-center">
                  <span className="text-base font-semibold px-2">Dena:</span>
                  <span className="text-base font-semibold text-red-600">
                    {Number.parseFloat(Math.abs(debitAmount || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex md:flex-row flex-col items-center">
                  <span className="text-base font-semibold px-2">Balance:</span>
                  <span
                    className={`text-base font-semibold ${
                      calAmount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {Number.parseFloat(Math.abs(calAmount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Ledger Table */}

              {userLedger && userLedger.length > 0 ? (
                                <div className="overflow-hidden">
                            <div className="max-w-full overflow-auto">
                              <div className="inline-block min-w-full">
                                <div className="overflow-hidden w-full">
                                  <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                                    <thead className="bg-gray-100">
                                      <tr className="text-left text-[12px] lg:bg-transparent text-[#212529]  font-semibold border border-[#c7c8ca]/50">
                                        
                                        <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">DESCRIPTION</th>
                      <th className="px-3 py-2  border border-[#c7c8ca]/50">WON BY</th>
                      <th className="px-3 py-2  border border-[#c7c8ca]/50">CREDIT</th>
                      <th className="px-3 py-2  border border-[#c7c8ca]/50">DEBIT</th>
                      <th className="px-3 py-2  border border-[#c7c8ca]/50">HISAB</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {userLedger?.map((row, index) => (
                                          <tr
                                            className={index % 2 === 0 ? "bg-white text-[12px]" : "bg-white text-[12px]"}
                                            key={index}
                                          >
                                            <td className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">
                                            {row.ledgerType === "diamondCasino" ? (
                            <Link
                              to={`/ledger-casino-details/${row.eventId}/${row.ledgerType}/${row.date}`}
                              className="text-blue-600 hover:underline"
                            >
                              {row.eventName} ({moment(row.createdAt).format("DD-MMM-YYYY")})
                            </Link>
                          ) : row.ledgerType === "internationalCasino" ? (
                            <Link
                              to={`/international-ledger-casino-details/${row.marketId}/${row.ledgerType}/${row.date}`}
                              className="text-blue-600 hover:underline"
                            >
                              {row.eventName} ({moment(row.createdAt).format("DD-MMM-YYYY")})
                            </Link>
                          ) : (
                            <Link
                              to={`/ledger-details/${row.marketId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {row.eventName} ({moment(row.createdAt).format("DD-MMM-YYYY")})
                            </Link>
                          )}
                                            </td>





                                            <td className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">
                                              {row.remark}
                                            </td>
                                            <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                               {row.debit > 0 ? Number.parseFloat(Math.abs(row.debit)).toFixed(2).replace(/\.?0+$/, "") : 0}
                                            </td>
              
                                            <td className="px-3 py-2 border border-[#c7c8ca]/50 text-red-600">
                                              {row.credit < 0 ? Number.parseFloat(Math.abs(row.credit)).toFixed(2).replace(/\.?0+$/, "") : 0}
                                            </td>
              
                                            <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                               {row.balance ? Number.parseFloat(Math.abs(row.balance)).toFixed(2).replace(/\.?0+$/, "") : 0}
                                            </td>
                                  
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



          
          </div>
   
      )}
    </>
  );
};

export default Ledger;
