import React, { useState } from "react";

export default function Mfa() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <>
      <div className="text-[15px] gap-3 rounded-t-[5px] text-black bg-[--secondary] px-5 h-[31px] flex items-center font-semibold text-[14px]">
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              Settings
              <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              MFA
      </div>
              
    <div className="flex flex-col items-center px-2 justify-center">
      <div className="rounded-xl w-full ">
        <div className="flex border my-8 mx-auto max-w-sm border-black h-[40px] px-4 rounded-[5px] items-center justify-between mb-6">
          <h2 className="font-semibold text-[14px] text-gray-800">
            Two Factor Authentication
          </h2>

          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isEnabled ? "bg-[#1d3e43]" : "bg-gray-300"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            ></span>
          </button>
        </div>

        {isEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="m-auto flex justify-center md:w-full w-1/2 md:px-5"><img className="!w-[150px] rounded-md !h-[150px]" src="/images/zetto/qr.gif" alt="" srcset="" /></div>
            <div className="animate-fadeIn text-gray-700">
              <p className="mb-3 font-semibold text-[14px]">
                Step-1:
                <span className="font-normal text-[14px]">
                  {" "}
                  Download Authenticator App on your phone directly from AppStore
                  or GooglePlay.
                </span>
              </p>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/zetto/appstore.webp"
                  alt="App Store"
                  className="h-10"
                />
                <img
                  src="/images/zetto/playstore.webp"
                  alt="Google Play"
                  className="h-10"
                />
              </div>

              <p className="mb-3 font-semibold text-[14px]">
                Step-2:
                <span className="font-normal text-[14px]">
                  {" "}
                  Setup account within Authenticator App.
                </span>
              </p>

              <p className="mb-3 font-semibold text-[14px]">
                Step-3:
                <span className="font-normal text-[14px]">
                  {" "}
                  Scan QR in Authenticator App and enter the verification code down
                  below.
                </span>
              </p>

              <input
                type="text"
                placeholder="Verification Code"
                className="w-full md:w-[50%] border border-gray-300 text-sm rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="border border-gray-300 rounded-md my-4 text-sm h-[38px] flex justify-center items-center w-full md:w-[50%] bg-white" disabled>Verify</button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
