import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import Loader from "../../component/loader/Loader";
import { getCasinoDiamondCasinoReportByUser, getDiamondBetsListSaga } from "../../redux/reducers/user_reducer";

const LedgerCasinoDetails = () => {
  const [userLadger, setLadger] = useState([]);
  const [showModalData, setModalData] = useState(null);
  const [showModal, setModal] = useState(false);

  const dispatch = useDispatch();
  const { marketId, eventId, date, ledgerType } = useParams();
  const { diamondBetsList, casinoReportLoader, diamondCasinoReportByUserData } = useSelector(
    (state) => state.UserReducer
  );

  useEffect(() => {
    setLadger([]);
    completedLedger();
    betList(eventId);
  }, [dispatch]);

  const completedLedger = () => {
    let reqData = {
      eventId: eventId,
      fromDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      casinoType: ledgerType,
    };
    dispatch(getCasinoDiamondCasinoReportByUser(reqData));
  };

  const betList = (eventId) => {
    let betReq = {
      eventId: eventId,
      isDeleted: false,
      fromDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("YYYY-MM-DD"),
    };
    dispatch(getDiamondBetsListSaga(betReq));
  };

  useEffect(() => {
    if (diamondBetsList && diamondBetsList.casinoBetData) {
      const filteredData = diamondBetsList.casinoBetData.map((item, index) => ({
        key: `${index}`,
        createdAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        teamName: item.teamName,
        profitLoss: item.profitLoss,
        amount: item.amount,
        rate: item.odds,
        mode: item.type === "K" ? "KHAI" : "LAGAI",
        roundId: item.roundId,
        playerName: item.playerName,
        showResult: item.showResult,
        eventId: item.eventId,
        sid: item.sid,
        userName: item.userInfo?.username,
        userFullName: item.userInfo?.name,
        posArray: item.posArray,
        result: item.result,
        isDeclare: item.isDeclare,
        ip: item.ip,
        cards: item.resultDetails?.cards,
        gtype: item.resultDetails?.gtype,
        win: item.resultDetails?.win,
        desc: item.resultDetails?.desc,
      }));
      setLadger(filteredData);
    }
  }, [diamondBetsList]);

  const handleResultModel = (data) => {
    setModalData(data);
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
    setModalData(null);
  };

  return (
    <>
      {casinoReportLoader ? (
        <Loader props={casinoReportLoader} />
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Diamond Casino Bets Table */}
            {userLadger && userLadger.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
                <div className="bg-red-600 text-white text-center py-4 font-bold text-lg">
                  Diamond Casino Bets
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">TEAM</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Rate</th>
                        <th className="px-4 py-3 text-left font-medium">Amount</th>
                        <th className="px-4 py-3 text-left font-medium">Mode</th>
                        <th className="px-4 py-3 text-left font-medium">Show Result</th>
                        <th className="px-4 py-3 text-left font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLadger.map((row) => (
                        <tr key={row.key} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleResultModel(row)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              <div className="text-black font-normal">{row.playerName}</div>
                              <div>{row.roundId}</div>
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.createdAt}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.rate}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.amount}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.mode}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.showResult}</td>
                          <td className={`px-4 py-3 whitespace-nowrap font-bold ${row.profitLoss >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            {Math.abs(row.profitLoss).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            {diamondCasinoReportByUserData && diamondCasinoReportByUserData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {diamondCasinoReportByUserData.map((element, index) => {
                  const totalPL = (element?.clientProfitLoss ?? 0) + (element?.clientComm ?? 0);
                  const isWin = totalPL > 0;

                  return (
                    <div key={index} className="space-y-4">
                      {/* Casino Plus Minus */}
                      <div className="bg-white rounded-lg shadow border">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold">
                          Casino Plus Minus
                        </div>
                        <div className={`text-center py-6 text-2xl font-bold ${isWin ? "text-blue-600" : "text-red-600"}`}>
                          {isWin ? "You Won" : "You Lost"}{" "}
                          {Math.abs(totalPL).toFixed(2).replace(/\.?0+$/, "")} /- Coins
                        </div>
                      </div>

                      {/* Total Commission */}
                      <div className="bg-white rounded-lg shadow border">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold">
                          Total Commission
                        </div>
                        <div className={`text-center py-6 text-2xl font-bold ${element?.clientComm >= 0 ? "text-blue-600" : "text-red-600"}`}>
                          {element?.clientComm >= 0 ? "You Won" : "You Lost"}{" "}
                          {Math.abs(element?.clientComm ?? 0).toFixed(2).replace(/\.?0+$/, "")} /- Coins
                        </div>
                      </div>

                      {/* Net Plus Minus */}
                      <div className="bg-white rounded-lg shadow border">
                        <div className="bg-gray-700 text-white text-center py-3 font-semibold">
                          Net Plus Minus
                        </div>
                        <div className={`text-center py-6 text-2xl font-bold ${element?.clientProfitLoss >= 0 ? "text-blue-600" : "text-red-600"}`}>
                          {element?.clientProfitLoss >= 0 ? "You Won" : "You Lost"}{" "}
                          {Math.abs(element?.clientProfitLoss ?? 0).toFixed(2).replace(/\.?0+$/, "")} /- Coins
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Back Button */}
            <div className="text-center mt-12">
              <Link to="/main/dashboard/">
                <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-lg transition transform hover:scale-105">
                  BACK TO MAIN MENU
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal for Result Details */}
      {showModal && showModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="bg-red-600 text-white py-4 px-6 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold">Bet Result Details</h3>
              <button
                onClick={handleClose}
                className="text-2xl hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 text-gray-800">
              <div><strong>Player:</strong> {showModalData.playerName}</div>
              <div><strong>Round ID:</strong> {showModalData.roundId}</div>
              <div><strong>Date:</strong> {showModalData.createdAt}</div>
              <div><strong>Mode:</strong> {showModalData.mode}</div>
              <div><strong>Rate:</strong> {showModalData.rate}</div>
              <div><strong>Amount:</strong> {showModalData.amount}</div>
              <div><strong>Result:</strong> {showModalData.result || "N/A"}</div>
              <div><strong>Win:</strong> {showModalData.win || "N/A"}</div>
              <div><strong>Description:</strong> {showModalData.desc || "N/A"}</div>
              {showModalData.cards && (
                <div>
                  <strong>Cards:</strong> {JSON.stringify(showModalData.cards)}
                </div>
              )}
              <div><strong>P&L:</strong>{" "}
                <span className={showModalData.profitLoss >= 0 ? "text-blue-600" : "text-red-600"} font-bold>
                  {showModalData.profitLoss?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleClose}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LedgerCasinoDetails;