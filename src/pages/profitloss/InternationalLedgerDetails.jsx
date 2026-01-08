

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment";


import { getBetListfunc, getCasinoTransactionReportSaga } from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";

const InternationalLedgerDetails = () => {
  const [userLadger, setLadger] = useState([]);

  const dispatch = useDispatch();
  const { marketId, eventId, date, ledgerType } = useParams();
  const {
    casinoTransactionReport,
    casinoReportLoader,
    betList,
  } = useSelector((state) => state.user);

  useEffect(() => {
    setLadger([]);
    completedLedger();
    BetListfunc(eventId);
  }, [dispatch]);

  const completedLedger = () => {
    let reqData = {
      eventId: eventId,
      fromDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      casinoType: ledgerType,
    };
    dispatch(getCasinoTransactionReportSaga(reqData));
  };

  const BetListfunc = (eventId) => {
    let betReq = {
      eventId: eventId,
      casinoBet: true,
      fromDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
    };
    dispatch(getBetListfunc(betReq));
  };


  useEffect(() => {

    if (betList?.casinoBetData) {
      const { casinoBetData } = betList;
     
      
      const filteredData = casinoBetData?.map((item, index) => ({
        key: `${index}`,
        createdAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        profitLoss: item.creditAmount - item.debitAmount + item.rollbackAmount,
        amount: item.debitAmount,
        roundId: item.roundId,
        playerName: item.gameName,
        showResult: item.isDeclare ? "Declare" : "Not Declare",
      }));
      setLadger(filteredData);
    }
  }, [betList]);

  return (
    <>
      {casinoReportLoader ? (
        <Loader props={casinoReportLoader} />
      ) : (
        <div className="min-h-screen md:px-4 px-1">
              <div className='bg-[var(--secondary)] uppercase rounded-t-[4px] text-black py-1 px-1.5'>
            <h2 className='text-[13px] text-black font-semibold'> International Casino Bets</h2>
          </div>
          <div className="w-full py-2 mx-auto">
            {/* International Casino Bets Table */}
            {userLadger && userLadger.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-2 text-left font-semibold">Game Name</th>
                        <th className="px-6 py-2 text-left font-semibold">Date</th>
                        <th className="px-6 py-2 text-left font-semibold">Amount</th>
                        <th className="px-6 py-2 text-left font-semibold">Result</th>
                        <th className="px-6 py-2 text-left font-semibold">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLadger.map((row) => (
                        <tr key={row.key} className="border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-2">
                            <div className="font-medium text-black">{row.playerName}</div>
                            <div className="text-gray-600 text-sm whitespace-nowrap">{row.roundId}</div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">{row.createdAt}</td>
                          <td className="px-6 py-2 whitespace-nowrap font-medium">{row.amount}</td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                row.showResult === "Declare"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {row.showResult}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-2 whitespace-nowrap font-bold ${
                              row.profitLoss >= 0 ? "text-blue-600" : "text-red-600"
                            }`}
                          >
                            {Math.abs(row.profitLoss).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {casinoTransactionReport && casinoTransactionReport.length > 0 && (
              <div className="space-y-8 mb-12">
                {casinoTransactionReport.map((element, index) => {
                  const netAmount = (element?.totalAmount ?? 0) + (element?.clientSessionComm ?? 0);

                  return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold text-lg">
                          Casino Plus Minus
                        </div>
                        <div
                          className={`text-center py-8 text-3xl font-bold ${
                            element?.amount >= 0 ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          {element?.amount >= 0 ? "You Won" : "You Lost"}{" "}
                          {element?.amount
                            ? Math.abs(Number.parseFloat(element.amount)).toFixed(2).replace(/\.?0+$/, "")
                            : 0}{" "}
                          /- Coins
                        </div>
                      </div>

                      {/* Total Commission */}
                      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold text-lg">
                          Total Commission
                        </div>
                        <div
                          className={`text-center py-8 text-3xl font-bold ${
                            element?.totalComm >= 0 ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          {element?.totalComm >= 0 ? "You Won" : "You Lost"}{" "}
                          {element?.totalComm
                            ? Math.abs(Number.parseFloat(element.totalComm)).toFixed(2).replace(/\.?0+$/, "")
                            : 0}{" "}
                          /- Coins
                        </div>
                      </div>

                      {/* Net Plus Minus */}
                      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold text-lg">
                          Net Plus Minus
                        </div>
                        <div
                          className={`text-center py-8 text-3xl font-bold ${
                            netAmount >= 0 ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          {netAmount >= 0 ? "You Won" : "You Lost"}{" "}
                          {Math.abs(netAmount).toFixed(2).replace(/\.?0+$/, "")} /- Coins
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default InternationalLedgerDetails;