import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react"; // npm install lucide-react

import { getAccountStatement } from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";

const AccountSatement = () => {
  const [fromDate, setFromDate] = useState(moment().startOf("month").toDate());
  const [toDate, setToDate] = useState(moment().endOf("month").toDate());
  const [userLists, setUserLists] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [activeTab, setActiveTab] = useState(1);

  const { userId } = useParams();
  const pageSize = 50;
  const dispatch = useDispatch();
  const { accountStatement, loading, userStatementMessage } = useSelector(
    (state) => state.user
  );

  // Initial load only
  useEffect(() => {
    fetchStatement();
  }, [dispatch, currentPage, userId]);

  useEffect(() => {
    filterData();
  }, [userLists, activeTab]);

  useEffect(() => {
    if (!accountStatement) return;

    let balance = 0;
    let dataSource = [];

    if (accountStatement?.totalCount && accountStatement?.statementData) {
      balance = Number(accountStatement.balanceAmount || 0);
      const reversed = [...accountStatement.statementData].reverse();
      dataSource = reversed.map((item, i) => {
        balance += Number(item.amount);
        return {
          key: i,
          createdAt: item.createdAt,
          remark: item.remark,
          amount: Number(item.amount),
          newAmount: balance,
          statementFor: item.statementFor || "All",
        };
      });
      dataSource = dataSource.reverse();
      setTotalSize(accountStatement.totalCount);
    } else if (Array.isArray(accountStatement) && accountStatement.length > 0) {
      balance = Number(accountStatement.balanceAmount || 0);
      let resetDone = false;
      const reversed = [...accountStatement].reverse();
      dataSource = reversed.map((item) => {
        if (item.statementFor === "ACCOUNT_STATEMENT" && !resetDone) {
          balance = 0;
          resetDone = true;
        }
        balance += Number(item.amount);
        return {
          key: item._id || Math.random(),
          createdAt: item.createdAt,
          remark: item.remark,
          amount: Number(item.amount),
          newAmount: balance,
          statementFor: item.statementFor || "All",
        };
      });
      dataSource = dataSource.reverse();
    } else if (userStatementMessage?.data) {
      balance = 0;
      const reversed = [...userStatementMessage.data].reverse();
      dataSource = reversed.map((item) => {
        if (item.statementFor === "ACCOUNT_STATEMENT") balance = 0;
        balance += Number(item.amount);
        return {
          key: item._id || Math.random(),
          createdAt: item.createdAt,
          remark: item.remark,
          amount: Number(item.amount),
          newAmount: balance,
          statementFor: item.statementFor || "All",
        };
      });
      dataSource = dataSource.reverse();
    }

    setUserLists(dataSource);
  }, [accountStatement, userStatementMessage]);

  // API call only on Submit or Tab change or Pagination
  const fetchStatement = (extraParams = {}) => {
    const payload = {
      userId,
      pageNo: currentPage,
      size: pageSize,
      fromDate: fromDate ? moment(fromDate).format("YYYY-MM-DD") : undefined,
      toDate: toDate ? moment(toDate).format("YYYY-MM-DD") : undefined,
      ...extraParams,
    };

    if (activeTab === 2) payload.statementFor = "profitLoss";
    if (activeTab === 3) payload.statementFor = "ACCOUNT_STATEMENT";

    dispatch(getAccountStatement(payload));
  };

  const handleSubmit = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchStatement();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    fetchStatement(); // Tab change par bhi data refresh ho jayega
  };

  const filterData = () => {
    let filtered = userLists;
    if (activeTab === 2) filtered = userLists.filter((i) => i.statementFor !== "ACCOUNT_STATEMENT");
    if (activeTab === 3) filtered = userLists.filter((i) => i.statementFor === "ACCOUNT_STATEMENT");
    setDisplayedData(filtered);
  };

  const totalPages = Math.ceil(totalSize / pageSize);

  return (
    <>
      {loading ? (
        <Loader props={loading} />
      ) : (
        <div className="w-full min-h-screen flex">
        <div className="border w-full">
          <div className='bg-[var(--primary)] rounded-t-[4px] uppercase text-white py-1 px-1.5'>
            <h2 className='text-[13px] text-white font-semibold'>Account Statement</h2>
          </div>
            <div className="py-1 md:flex ">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-2 md:mb-6 mb-2 items-end">
                {/* From Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-[var(--primary)] mb-1">From Date</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="From Date"
                    className="w-full px-4 py-2 pr-12 text-sm border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelectorAll(".react-datepicker__input-container input")[0]?.focus()}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-blue-600 mt-6" // mt-6 to align with input
                  >
                    <Calendar size={20} />
                  </button>
                </div>

                {/* To Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-[var(--primary)] mb-1">To Date</label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To Date"
                    minDate={fromDate}
                    className="w-full px-4 py-2 pr-12 text-sm border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelectorAll(".react-datepicker__input-container input")[1]?.focus()}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-blue-600 mt-6"
                  >
                    <Calendar size={20} />
                  </button>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    className=" bg-[var(--primary)] md:w-24 w-full hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex justify-center items-center ">
                <div className="flex border-[var(--primary)] border overflow-hidden h-10">
                  {["All", "P&L", "Account"].map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => handleTabClick(i + 1)}
                      className={`px-10 py-0.5 font-semibold transition ${
                        activeTab === i + 1
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#DFDDE0] text-black">
                    <tr>
                      <th className="px-6 py-2 text-left">Date</th>
                      <th className="px-6 py-2 text-left">Description</th>
                      <th className="px-6 py-2 text-right">Credit</th>
                      <th className="px-6 py-2 text-right">Debit</th>
                      <th className="px-6 py-2 text-right font-bold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.length > 0 ? (
                      displayedData.map((item) => (
                        <tr key={item.key} className="border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-2 whitespace-nowrap">
                            {moment(item.createdAt).utcOffset("+05:30").format("DD MMM YY")}
                          </td>
                          <td className="px-6 py-2 max-w-md truncate" title={item.remark}>
                            {item.remark}
                          </td>
                          <td className="px-6 py-2 text-right">
                            {item.amount > 0 ? (
                              <span className="text-green-600 font-bold">
                                {Math.abs(item.amount).toFixed(2).replace(/\.?0+$/, "")}
                              </span>
                            ) : (
                              "0.00"
                            )}
                          </td>
                          <td className="px-6 py-2 text-right">
                            {item.amount < 0 ? (
                              <span className="text-red-600 font-bold">
                                {Math.abs(item.amount).toFixed(2).replace(/\.?0+$/, "")}
                              </span>
                            ) : (
                              "0.00"
                            )}
                          </td>
                          <td className="px-6 py-2 text-right font-bold text-gray-800">
                            {item.newAmount.toFixed(2).replace(/\.?0+$/, "")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-gray-500">
                          No statement data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalSize > pageSize && (
                <div className="flex justify-center items-center gap-4 py-6 bg-gray-50">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    disabled={currentPage === totalPages}
                    className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

        </div>
        </div>
      )}
    </>
  );
};

export default AccountSatement;