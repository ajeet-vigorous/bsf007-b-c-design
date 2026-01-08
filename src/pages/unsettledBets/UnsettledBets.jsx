import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import { domainName } from "../../config/Auth";

const UnsettledBets = ({ }) => {
    const [oddsBetData, setOddsBetData] = useState([]);
    const fetchBetLists = async () => {
        const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
        try {
            const BetListData = {
                "username": user.data.username
            }
            const userBetHistory = await apiCall("POST", "website/checkExposureClient", BetListData);
            if (userBetHistory && userBetHistory.data) {
                const pendingBetList = userBetHistory.data;
                setOddsBetData(pendingBetList);
            }
        } catch (error) {
            console.error("Error fetching bet lists:", error);
        }
    };

    useEffect(() => {
        fetchBetLists();
    }, []);

    let totalAmount = oddsBetData?.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full min-h-screen flex">
            <div className="border w-full">
                <div className='bg-[var(--primary)] uppercase text-white h-[31px] flex items-center rounded-t-[5px] font-semibold py-1 px-1.5'>
                    <h2 className='text-[13px] '>Unsettled Bets</h2>
                </div>

                <div className="overflow-hidden mt-2">
                    <div className="max-w-full overflow-auto">
                        <div className="inline-block min-w-full">
                            <div className="overflow-hidden w-full">
                                <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                                    <thead className="bg-[#DFDDE0]">
                                        <tr className="text-left text-[12px] lg:bg-transparent text-[#212529]  font-semibold border border-[#c7c8ca]/50">
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">No</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Event Name</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Game Name</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Event Type</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Market Name</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Date</th>
                                            <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">Liability</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {oddsBetData && oddsBetData.length >= 0 ? (
                                            oddsBetData.map((element, index) => (
                                                <tr
                                                    className={index % 2 === 0 ? "bg-[#F2F2F2] text-[12px]" : "bg-[#E6E6E6] text-[12px]"}
                                                    key={index}
                                                >
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50 ">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50">{element?.gameName}</td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50">{element?.gameType}</td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50">{element?.overallType}</td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50">{element?.remarks}</td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50 ">
                                                        {moment(element?.createdAt).format("DD-MM-YYYY HH:mm:ss A")}
                                                    </td>
                                                    <td className="px-3 py-2 border border-[#c7c8ca]/50">{element?.amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-left"
                                                >
                                                    No Data Available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tr className="">
                                        <td colSpan="6" className="text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-right">Total Liability</td>
                                        <td className="text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-left"><p className="text-left">{totalAmount}</p></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default UnsettledBets;