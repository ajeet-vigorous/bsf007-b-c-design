import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileFooter from '../../component/mobileFooter/MobileFooter';

const Referral1 = () => {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const navigate = useNavigate();

   
    

    return (
        <>
                <div className=''>

                    <div className='bg-[var(--secondary)] rounded-t-[4px] uppercase text-black py-1 px-1.5'>
                        <h2 className='text-[13px] text-black'>
Wallet
/
Referral Earnings</h2>
                    </div>

                    <div className='flex flex-col justify-center'>
                        <div  className='flex justify-center my-8'>No Referrals</div>
                        <div className='flex justify-center my-8'>
                          <Link to={'/referAFriend'} className='text-[var(--secondary)] bg-[var(--primary)] p-2 uppercase rounded'>  Refer a Friend </Link>
                            </div>
                    </div>
                </div>
                 <MobileFooter />
        <div className='w-full max-lg:pb-16'>
        
            </div>
        </>
    );
};


export default Referral1;