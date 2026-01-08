import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import settings from "../../domainConfig";
import { FaTimes } from "react-icons/fa";
import { ImAndroid } from "react-icons/im";


function ForgotModal({ closeFModal }) {

  return (
    <>
      <div className="fixed z-[99999] inset-0 flex items-start justify-center bg-black/60 ">

        <div className="bg-[var(--secondary)] top-7 w-[500px] shadow-lg rounded-md relative mx-2 ">
          <div className="rounded-[10px] border-2 border-white px-6 py-20 m-7 bg-[#212121]">
            <div className="flex justify-center items-center p-4">
              <img src={settings.logo1} className="w-[180px] h-[60px]" />
            </div>

            <div className="md:flex w-full">
              {/* Form */}
              <form className="w-full pt-4">
                <div className="flex justify-center items-center">

                  <button
                    onClick={closeFModal}
                    className="text-black w-8 h-8 rounded-full absolute top-0 right-2 z-50 flex justify-end items-center  hover:text-white/70 text-4xl"
                  >
                    <FaTimes className="" size={16} />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="relative flex items-center">
                    <select
                      name="countryCode"
                      // value={countryCode}
                      // onChange={handleOnChange}
                      className="h-[45px] px-2 bg-[var(--darkcolor)] border-b border-gray-300 text-white text-[13px] text-center rounded-none outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white">
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+92">🇵🇰 +92</option>
                    </select>

                    <input
                      type="number"
                      id="mobile"
                      name="mobileNo"
                      // value={mobileNo}
                      // onChange={handleOnChange}
                      placeholder="Mobile No"
                      className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white " />
                  </div>

                  {/* Validation error */}
                  {/* {errors.mobileNo && (
                  <div className="mt-1 text-xs text-[#FF0000]">{errors.mobileNo}</div>
                )} */}
                </div>

                <button
                  className={` flex justify-center items-center space-x-1 w-full text-[16px] mx-auto mt-5 mb-[5px] py-2.5 bg-[var(--primary)] border border-[var(--primary)] text-white rounded-[10px]`}>
                  <p>GET OTP</p>
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>


  );
}

export default ForgotModal;
