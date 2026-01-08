import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { domainName } from '../../config/Auth';
import settings from '../../domainConfig';

const Overview = () => {

    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

    const [balance, setBalance] = useState({
        coins: "",
        exposure: "",
    });
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            let Balance = JSON.parse(localStorage.getItem("clientBalance"));
            let clientExposure = JSON.parse(localStorage.getItem("clientExposure"));
            setBalance({
                coins: Balance,
                exposure: clientExposure,
            });
        }, 1000);
    }, [balance]);

    return (
        <>

            <div className='w-full'>
                <div className='lg:flex justify-between items-start lg:space-x-5 w-full mt-2'>
                    <div className='w-full'>
                        <>
                            <div className='py-4 px-2'>
                                <span className='flex justify-start items-center space-x-1 py-3 text-[18px] text-[var(--secondary)]'>
                                    <p>Welcome to {settings.domainName},</p>
                                    <p className='font-[700]'>
                                        {user && user?.data && user?.data?.username}
                                    </p>
                                </span>

                                <div className='space-y-2 text-[12px] text-[#444444] font-[600]'>
                                    <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                        <span className='sm:w-[234px] w-1/2'>User Id :</span>
                                        <span> {user && user?.data && user?.data?.username}</span>
                                    </div>
                                    <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                        <span className='sm:w-[234px] w-1/2'>Available Chips :</span>
                                        <span>{balance && balance.coins
                                            ? Number(balance.coins).toFixed(2)
                                            : "0"}</span>
                                    </div>
                                    <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                        <span className='sm:w-[234px] w-1/2'>Exposure :</span>
                                        <span>{balance && balance.exposure ? Number(balance.exposure).toFixed(2) : "0"}</span>
                                    </div>
                                    <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                        <span className='sm:w-[234px] w-1/2'>Total Chips :</span>
                                        <span>0.00</span>
                                    </div>
                                    <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                        <span className='sm:w-[234px] w-1/2'>Profit/Loss :</span>
                                        <span>0.00</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Overview;