import React, { useState } from "react";
import UpiBank from "./UpiBank";
import Crypto from "./Crypto";

const Deposit = () => {
  const [activeTab, setActiveTab] = useState("upi");

  return (
        <section className="w-full md:max-w-5xl mx-auto flex justify-center ">
        <div className="lg:w-[97%] md:w-[75%] lg:px-0 px-4 w-full sm:rounded-md bg-white">
      {/* Tabs */}
      <div className="flex justify-around gap-10 border-b border-gray-200 ">
        {/* UPI / Bank */}
        {/* <button
          onClick={() => setActiveTab("upi")}
          className={`p-2 font-semibold transition-all w-full  ${
            activeTab === "upi"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
        >
          UPI / Bank
        </button> */}

        {/* Crypto */}
        {/* <button
          onClick={() => setActiveTab("crypto")}
          className={` p-2 font-semibold transition-all w-full ${
            activeTab === "crypto"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
        >
          USDT
        
        </button> */}
      </div>

      {/* Content */}
      <div className="">
        {activeTab === "upi" ? <UpiBank /> : <Crypto />}
      </div>
    </div>
    </section>
  );
};

export default Deposit;
