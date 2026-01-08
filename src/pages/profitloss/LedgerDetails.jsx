import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import { getCompleteLedgerDetails } from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";

const LedgerDetails = () => {
  const [userLadger, setLadger] = useState([]);
  const [fancyLedger, setFancyLadger] = useState([]);
  const [completeDataLadger, setCompleteDataLadger] = useState([]);
  const [reacjectedFancyLedger, setReacjectedFancyLadger] = useState([]);

  const dispatch = useDispatch();
  const { marketId } = useParams();

  useEffect(() => {
    setLadger([]);
    setFancyLadger([]);
    completedLedger();
  }, [dispatch]);

  const { completeLedgerListData, loading } = useSelector((state) => state.user);

  const completedLedger = () => {
    let reqData = {
      marketId: marketId,
    };
    dispatch(getCompleteLedgerDetails(reqData));
  };

  useEffect(() => {
    if (completeLedgerListData) {
      const { completeData, oddsBetsData, sessionBetsData } = completeLedgerListData;

      const filteredData = oddsBetsData?.map((item, index) => ({
        key: `${index}`,
        createdAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        teamName: item.teamName,
        profitLoss: item.positionInfo[item?.decisionSelectionId],
        oddsType: item.oddsType,
        amount: item.amount,
        rate: item.odds,
        mode: item.type == "K" ? "KHAI" : "LAGAI",
      }));
      setLadger(filteredData);

      const filteredDataSession = sessionBetsData
        ?.filter((item) => item.isDeleted !== 1)
        ?.map((item, index) => ({
          key: `${index}`,
          FcreatedAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
          FsessionName: item.sessionName,
          Frate: item.odds,
          Frun: item.run,
          FdecisionRun: item.decisionRun,
          Famount: item.amount,
          Fmode: item.type === "Y" ? "YES" : "NO",
          FprofitLoss: item.profitLoss,
        }));

      const filteredReajectedDataSession = sessionBetsData
        ?.filter((item) => item.isDeleted === 1)
        ?.map((item, index) => ({
          key: `${index}`,
          FcreatedAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
          FsessionName: item.sessionName,
          Frate: item.odds,
          Frun: item.run,
          FdecisionRun: item.decisionRun,
          Famount: item.amount,
          Fmode: item.type === "Y" ? "YES" : "NO",
          FprofitLoss: item.profitLoss,
          FdeletedRemark: item?.deletedRemark,
        }));

      setReacjectedFancyLadger(filteredReajectedDataSession);
      setFancyLadger(filteredDataSession);
      setCompleteDataLadger(completeData);
    }
  }, [completeLedgerListData]);

  const columns = [
    {
      title: "Team Name",
      dataIndex: "teamName",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Mode",
      dataIndex: "mode",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "ODDSTYPE",
      dataIndex: "oddsType",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "P&L",
      dataIndex: "profitLoss",
      render: (value) => (
        <span className={`font-medium ${value >= 0 ? "text-blue-600" : "text-red-600"}`}>
          {Number.parseFloat(value).toFixed(2)}
        </span>
      ),
    },
  ];

  const columnsFancy = [
    {
      title: "Runner",
      dataIndex: "FsessionName",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Date",
      dataIndex: "FcreatedAt",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Rate",
      dataIndex: "Frate",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Run",
      dataIndex: "Frun",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Res",
      dataIndex: "FdecisionRun",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Amount",
      dataIndex: "Famount",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "Mode",
      dataIndex: "Fmode",
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      title: "P&L",
      dataIndex: "FprofitLoss",
      render: (value) => (
        <span className={`whitespace-nowrap font-medium ${value >= 0 ? "text-blue-600" : "text-red-600"}`}>
          {Number.parseFloat(value).toFixed(2)}
        </span>
      ),
    },
  ];

  const columnsFancyReacject = [
    ...columnsFancy,
    {
      title: "Remark",
      dataIndex: "FdeletedRemark",
      render: (value) => <span className="whitespace-nowrap text-gray-600">{value || "-"}</span>,
    },
  ];

  const customLocale = {
    emptyText: <div className="text-center py-8 text-gray-500">No data found</div>,
  };

  return (
    <>
      {loading ? (
        <Loader props={loading} />
      ) : (
        <>
          <Row justify="center" className="my-6">
            <Col xs={22} md={18} lg={20}>
              {/* Match Bets Table */}
              {userLadger && userLadger.length > 0 && (
                <>
                  <div className="py-3 px-4 bg-gray-700 text-white text-center font-semibold text-sm rounded-t-lg">
                    Match Bets
                  </div>
                  <Table
                    columns={columns}
                    dataSource={userLadger}
                    bordered
                    pagination={false}
                    scroll={{ x: true }}
                    size="small"
                    className="shadow-sm rounded-b-lg overflow-hidden"
                  />
                </>
              )}

              {/* Fancy Bets Table */}
              {fancyLedger && fancyLedger.length > 0 && (
                <>
                  <div className="py-3 px-4 bg-red-600 text-white text-center font-semibold text-sm mt-8 rounded-t-lg">
                    Fancy Bets
                  </div>
                  <Table
                    columns={columnsFancy}
                    dataSource={fancyLedger}
                    bordered
                    pagination={false}
                    scroll={{ x: true }}
                    size="small"
                    className="shadow-sm rounded-b-lg overflow-hidden"
                  />
                </>
              )}
            </Col>
          </Row>

          {/* Summary Cards */}
          <Row justify="center" className="my-8">
            <Col xs={22} md={16} lg={18}>
              <div className="space-y-4">
                {/* Match Plus Minus */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-700 text-white py-2 text-center font-medium">Match Plus Minus</div>
                  <div className={`py-4 text-center text-2xl font-bold ${completeDataLadger?.clientOddsAmount >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {completeDataLadger?.clientOddsAmount >= 0 ? "You Won" : "You Lost"}{" "}
                    {completeDataLadger?.clientOddsAmount
                      ? Math.abs(Number.parseFloat(completeDataLadger.clientOddsAmount)).toFixed(2).replace(/\.?0+$/, "")
                      : 0}{" "}
                    /- Coins
                  </div>
                </div>

                {/* Fancy Plus Minus */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-700 text-white py-2 text-center font-medium">Fancy Plus Minus</div>
                  <div className="py-4 text-center text-2xl font-bold">
                    <span className={completeDataLadger?.clientSessionAmount >= 0 ? "text-blue-600" : "text-red-600"}>
                      {completeDataLadger?.clientSessionAmount >= 0 ? "You Won" : "You Lost"}{" "}
                      {completeDataLadger?.clientSessionAmount
                        ? Math.abs(Number.parseFloat(completeDataLadger.clientSessionAmount)).toFixed(2).replace(/\.?0+$/, "")
                        : 0}{" "}
                      /- Coins
                    </span>
                  </div>
                </div>

                {/* Total Commission */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-700 text-white py-2 text-center font-medium">Total Commission</div>
                  <div className="py-4 text-center text-2xl font-bold">
                    <span className={(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm) >= 0 ? "text-blue-600" : "text-red-600"}>
                      {(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm) >= 0 ? "You Won" : "You Lost"}{" "}
                      {Number.parseFloat((completeDataLadger?.clientOddsComm ?? 0) + (completeDataLadger?.clientSessionComm ?? 0))
                        .toFixed(2)
                        .replace(/\.?0+$/, "")}{" "}
                      /- Coins
                    </span>
                  </div>
                </div>

                {/* Net Plus Minus */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-700 text-white py-2 text-center font-medium">Net Plus Minus</div>
                  <div className={`py-4 text-center text-2xl font-bold ${(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm + completeDataLadger?.clientSessionAmount + completeDataLadger?.clientOddsAmount) >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm + completeDataLadger?.clientSessionAmount + completeDataLadger?.clientOddsAmount) >= 0
                      ? "You Won"
                      : "You Lost"}{" "}
                    {Number.parseFloat(
                      (completeDataLadger?.clientOddsComm ?? 0) +
                        (completeDataLadger?.clientSessionComm ?? 0) +
                        (completeDataLadger?.clientSessionAmount ?? 0) +
                        (completeDataLadger?.clientOddsAmount ?? 0)
                    )
                      .toFixed(2)
                      .replace(/\.?0+$/, "")}{" "}
                    /- Coins
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Rejected Bets */}
          <Row justify="center" className="my-6">
            <Col xs={22} md={18} lg={20}>
              <div className="py-3 px-4 bg-red-600 text-white text-center font-semibold text-sm rounded-t-lg">
                Rejected Bets
              </div>
              <Table
                columns={columnsFancyReacject}
                dataSource={reacjectedFancyLedger}
                locale={customLocale}
                bordered
                pagination={false}
                scroll={{ x: true }}
                size="small"
                className="shadow-sm rounded-b-lg overflow-hidden"
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default LedgerDetails;