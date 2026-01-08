import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import { FaCopy } from 'react-icons/fa6';
import CopyToClipboard from 'react-copy-to-clipboard';

const ReferAndEarn = () => {

    const [userDeatils, setUserDeatils] = useState({})

    useEffect(() => {

    }, [])

    const clientUserData = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const hostname = window.location.origin;
    const referralCode = clientUserData?.data?.referralCode;
    const clipboardText = `${hostname}/ragister/${referralCode}`;

    return (
        <>

            <div className='w-full'>
                <div className='bg-[#e9eff8]'>
                    <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                        Referral
                        <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
                    </div>
                </div>

                <div className='mt-2'>
                    <div className="bg-[var(--primary)]">
                        <div className="w-full py-4 text-2xl font-bold text-white text-center">
                            REFER AND EARN!
                            <br />
                            <span className="text-sm font-normal">
                                Keep your friends close and referral friends closer! Invite your friends and family to sign up using your personal referral code (mentioned below) and get 20% of each and every one of their deposits made thereafter!
                            </span>
                        </div>
                    </div>

                    <div className="lg:w-[78%] mx-auto">
                        <div className="bg-black text-center mt-3 rounded-md">
                            <div className="py-2 text-[16px] font-[400] text-white">
                                Don’t wait, start making HUGE PROFITS NOW! Use my special code{" "}
                                {clientUserData?.data?.referralCode} to Sign-Up & Get a  Referral Bonus!
                            </div>
                            <div className="py-2 text-[20px] font-[500] text-white  overflow-x-auto">
                                {hostname}/{clientUserData?.data?.referralCode}
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-2">
                            <CopyToClipboard text={clipboardText} >
                                <button className="py-[8px] px-[25px] bg-[var(--primary)] text-white rounded-[50px] flex space-x-1 justify-center items-center transition">
                                    <p> COPY</p> <FaCopy size={15} color="white" />
                                </button>
                            </CopyToClipboard>
                        </div>


                        <div className="bg-black text-center mt-3 rounded-md w-full">
                            <div className=" py-2 text-lg font-bold text-white overflow-x-auto">{clientUserData?.data?.referralCode}</div>
                        </div>
                        <div className="flex justify-center items-center mt-2">
                            <CopyToClipboard text={referralCode} >
                                <button className="py-[8px] px-[25px] bg-[var(--primary)] text-white rounded-[50px] space-x-1 justify-center items-center flex transition">
                                    <p>COPY</p> <FaCopy size={15} color="white" />
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};


export default ReferAndEarn;