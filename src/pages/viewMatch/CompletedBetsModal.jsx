import { Button, Modal, Table } from "antd"
import { useEffect, useState } from "react";
import { apiCall } from "../../config/HTTP";
import moment from "moment";

function CompletedBetsModal({ handleClose, marketId }) {

        const [compltedFancy, setCompletedFancy] = useState();
          const [totalSessionPlusMinus, setTotalSessionPlusMinus] = useState()

         const compltedBetsColumn = [
        {
          title: "Runner",
          dataIndex: "Team",
          key: "Team",
          render: (value) => <span className="text-nowrap text-uppercase">{value}</span>,
        },
    
        {
          title: "Amount",
          dataIndex: "Amount",
          key: "Amount",
        },
        {
          title: "Run",
          dataIndex: "Runs",
          key: "Runs",
        },
        {
          title: "Rate",
          dataIndex: "Rate",
          key: "Rate",
        },
        {
          title: "Mode",
          dataIndex: "Type",
          key: "Type",
        },
        {
          title: "Date",
          dataIndex: "Date",
          key: "Date",
          render: (value) => <span className="text-nowrap">{value}</span>,
        },
        {
          title: "Results",
          dataIndex: "results",
          key: "results",
        },
        {
          title: "P&L",
          dataIndex: "pos",
          key: "pos",
          render: (value) => (
            <span className={`${value > 0 ? "text-green-700" : value < 0 ? "text-red-700" : "text-black"}`}>
              {value}
            </span>
          ),
        },
      ];

        useEffect(() => {
          let sessionPlusMinus = 0
          compltedFancy?.map((data, key) => {
            let pos = 0;
            if (data.decisionRun >= data.run && data.type === "Y") {
              pos = Math.round(data.amount * data.odds);
            } else if (data.decisionRun >= data.run && data.type === "N") {
              pos = Math.round(-1 * data.amount * data.odds);
            } else if (data.decisionRun < data.run && data.type === "Y") {
              pos = Math.round(-1 * data.amount);
            } else if (data.decisionRun < data.run && data.type === "N") {
              pos = Math.round(data.amount);
            }
            sessionPlusMinus += pos
            data.pos = pos
            compltedFancy[key].pos = pos
      
      
          })
          setTotalSessionPlusMinus(sessionPlusMinus)
      
        }, [compltedFancy])

            const generateCompletedData = () => {
          const data = []
      
          compltedFancy?.forEach((element, index) => {
      
            data.push({
              key: index,
              Runs: element.run,
              Rate: Number.parseFloat(100 * element.odds).toFixed(2),
              Amount: Number.parseFloat(element.amount).toFixed(2),
              Type:
                element.type === "N"
                  ? "NO"
                  : element.type === "Y"
                    ? "YES"
                    : element.type === "K"
                      ? "Khai"
                      : element.type === "L"
                        ? "Lagai"
                        : "",
      
              Team: element.sessionName,
              Client: `${element.userInfo && element.userInfo.clientName
                ? element.userInfo.clientName
                : ""
                } ${element.userInfo && element.userInfo.clientCode
                  ? element.userInfo.clientCode
                  : ""
                }`,
              Agent: `${element.userInfo && element.userInfo.creatorName
                ? element.userInfo.creatorName
                : ""
                }`,
              oddsType: `${element.oddsType}`,
              results: `${element.decisionRun}`,
              Date: `${element.createdAt
                ? moment(element.createdAt)
                  .utcOffset("+05:30")
                  .format("DD MMM hh:mm:ss A")
                : ""
                }`,
              pos: `${(element.pos)}`,
            });
          });
          return data;
        };

        useEffect(()=>{
            fetchBetLists()
        },[])
      
        const completeddataList = generateCompletedData();
      

            const fetchBetLists = async () => {
                try {
        
                    const BetListData = {
                        fancyBet: true,
                        isDeclare: true,
                        marketId: marketId,
                    };
        
                    const userBetHistory = await apiCall("POST", 'sports/betsList', BetListData);
                    if (userBetHistory && userBetHistory.data) {
                        const { fancyBetData, oddsBetData } = userBetHistory.data;
                        const completeFancyData =
                fancyBetData && fancyBetData.length > 0
                    ? fancyBetData.filter((element) => element.isDeclare === 1)
                    : [];
            let showCompletedFancy = [];

            completeFancyData.map((data, key) => {
                let pos = 0;
                if (data.decisionRun >= data.run && data.type === "Y") {
                    pos = Math.round(data.amount * data.odds);
                } else if (data.decisionRun >= data.run && data.type === "N") {
                    pos = Math.round(-1 * data.amount * data.odds);
                } else if (data.decisionRun < data.run && data.type === "Y") {
                    pos = Math.round(-1 * data.amount);
                } else if (data.decisionRun < data.run && data.type === "N") {
                    pos = Math.round(data.amount);
                }
                data.pos = pos;
                completeFancyData[key].pos = pos

                showCompletedFancy.push(data);
            });
           setCompletedFancy(showCompletedFancy);
                    }
                } catch (error) {
                    console.error('Error fetching bet lists:', error);
                    throw error;
                }
            };

        
            
  return (
    <>
      <Modal
        open={true}
        title={`COMPLETED FANCY BET`}
        onCancel={handleClose}
        footer={
          <Button
            className="gx-bg-grey gx-text-white gx-border-redius0"
            onClick={() => handleClose()}
          > Close </Button>
        }
        className="gx-px-3"
      >
        <div className="flex gx-px-2 justify-between  gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
          <div>Total</div> <div className={`${totalSessionPlusMinus >= 0 ? "text-green-700" : "text-red-700"}`}>{totalSessionPlusMinus ? Number.parseFloat(totalSessionPlusMinus).toFixed(2) : 0}</div>
        </div>
        <Table
          className="gx-w-100 gx-mx-0 gx-my-0"
          size="small"
          rowHoverable={false}
          title=""
          scroll={{ x: true }}
          dataSource={completeddataList}
          columns={compltedBetsColumn}
          pagination={false}
          bordered
          rowClassName={(row, index) => row.Type === 'NO' || row.Type === 'Khai' ? 'bg-sky-700' : row.Type === 'YES' || row.Type === 'Lagai' ? 'bg-red-500' : "gx-bg-light-grey"}
        />
      </Modal>
    </>
  )
}

export default CompletedBetsModal
