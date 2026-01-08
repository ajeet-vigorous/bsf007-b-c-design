import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import settings from "../../domainConfig";

export default function ChatPopUp() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-4 hidden lg:block right-4 z-50">
            {!isOpen && (
                            <div onClick={() => setIsOpen(true)} className='fixed bottom-[50px] right-[25px] cursor-pointer w-[71px] h-[71px] bg-white rounded-full flex items-center justify-center z-50'>
                    <img className='!w-[40px] !h-[40px]' src="/images/zetto/chat.png" alt="" srcset="" />
                </div>
            )}

            {
                isOpen ?
            <div className="relative">  
                <div
                className={` bottom-[25px] right-[25px] w-[320px] md:w-[370px] bg-white rounded-[18px] shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"
                }`}
            >
                <div className="bg-[--primary] text-white h-[120px] flex gap-8 items-center px-4 py-3 rounded-t-xl">
                    <div>
                        {/* <img className="!w-[50px] !h-[50px] rounded-full" src="/images/zetto/chatlogo.png" alt="" srcset="" /> */}
                    </div>
                <div>
                    <h2 className="text-[22px] font-bold">{settings.domainName}</h2>
                    <p className="text-[15px] leading-none">ZET SET GO!</p>
                </div>
                {/* <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:rotate-180 w-[48px] h-[48px] rounded-full bg-[#20e2ec] absolute -top-[10px] right-[20px] transition-transform duration-300"
                >
                    <IoIosArrowDown  size={22} />
                </button> */}
                </div>

                <div className="px-4 py-10 bg-gray-50 rounded-t-[16px] text-gray-800 text-sm">
                <p className="font-semibold mb-2">{settings.domainName}</p>
                <p className="rounded-[16px] rounded-bl-0 p-2 bg-[#f8f8f8] max-w-[310px] w-full">Hi, Welcome to ministerexch. How may I help you?</p>

                <div className="mt-4">
                    <p className="font-medium">Please confirm your username</p>
                    <div className="flex items-center mt-2 border rounded-md bg-white overflow-hidden">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="flex-1 px-3 py-2 text-sm outline-none"
                    />
                    <button className="px-3 py-2 text-cyan-600 font-semibold text-sm hover:text-cyan-700 transition">
                        Submit →
                    </button>
                    </div>
                </div>

                <div className="mt-4">
                    <input
                    type="text"
                    disabled
                    placeholder="Enter details in the input field"
                    className="w-full text-sm px-3 py-2 bg-gray-100 rounded-md text-gray-400 border"
                    />
                </div>
                </div>
            </div>
            </div>
            : null
            }
            
            {
                isOpen ? 
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:rotate-180 w-[48px] h-[48px] rounded-full bg-[--primary] absolute -top-[15%] z-[100000] right-[8px] flex items-center justify-center transition-transform duration-300"
                >
                    <IoIosArrowDown  size={22} />
                </button>
                : ""
            }
            </div>
        
        </>
    );
}
