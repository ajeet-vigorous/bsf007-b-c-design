import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const ActiveLogs = () =>{
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const accordionData = [

        {
        title: "Session",
        content: (
            <div className="text-gray-400 space-y-1">
                <table className="w-full max-h-[70vh] overflow-auto">
                    <thead>
                        <tr className="h-[35px] font-semibold bg-gray-100">
                            <th className="border text-[12px]">Token Type</th>
                            <th className="border text-[12px]">Status</th>
                            <th className="border text-[12px]">Created At</th>
                            <th className="border text-[12px]">Updated At</th>
                            <th className="border text-[12px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-[12px] py-6 px-2 border text-center">web</td>
                            <td className="text-[12px] py-6 px-2 border text-center">Active</td>
                            <td className="text-[12px] py-6 px-2 border text-center">10/20/2025, 12:04:49 PM</td>
                            <td className="text-[12px] py-6 px-2 border text-center">10/20/2025, 12:04:49 PM</td>
                            <td className="text-red-600 border">
                                <div className=" flex justify-center items-center h-full">
                                    <RiDeleteBinLine />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
        },
        {
        title: "Activity Log",
        content: (
            <div className="text-gray-400 space-y-1">
                <table className="w-full max-h-[70vh] overflow-auto">
                    <thead>
                        <tr className="h-[35px] font-semibold bg-gray-100">
                            <th className="border text-[12px]">Type</th>
                            <th className="border text-[12px]">Notes</th>
                            <th className="border text-[12px]">IP</th>
                            <th className="border text-[12px]">Date/Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-[12px] py-6 px-2 border text-center">login</td>
                            <td className="text-[12px] py-6 px-2 border text-center">user login</td>
                            <td className="text-[12px] py-6 px-2 border text-center">10.503.255.31</td>
                            <td className="text-[12px] py-6 px-2 border text-center">10/20/2025, 12:04:49 PM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
        },
    ];

    return(
        <>
            <div className="text-[15px] gap-3 rounded-t-[5px] text-black bg-[--secondary] px-5 h-[31px] flex items-center font-semibold">
                <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
                <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
                Activity Log
            </div>
            <div className="m-5">
                {accordionData.map((item, index) => (
                    <div key={index} className="">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex justify-between my-1 font-semibold border border-gray-300 h-[30px] bg-[#f3f4f6] rounded-[5px] items-center px-4 py-3 text-left text-black text-[13px] transition duration-300"
                    >
                        <span>{item.title}</span>
                        <MdKeyboardArrowDown
                        className={`w-5 h-5 transform transition-transform duration-300 ${
                            openIndex === index ? "rotate-180" : "rotate-0"
                        }`}
                        />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-500 ${
                        openIndex === index ? "max-h-40 bg-white" : "max-h-0 p-0"
                        }`}
                    >
                        {item.content}
                    </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ActiveLogs;