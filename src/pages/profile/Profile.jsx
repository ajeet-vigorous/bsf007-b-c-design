import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import Overview from '../../component/profile/Overview';
import StakeSettings from '../../component/profile/StakeSettings';
import ChangePassword from '../../component/profile/ChangePassword';
import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../../component/layout/AppHeader';
import AppFooter from '../../component/layout/AppFooter';
import MobileFooter from '../../component/mobileFooter/MobileFooter';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profile');




    return (
        <>
                <div className='w-full md:min-h-screen'>

                    <div className='bg-[var(--secondary)] rounded-t-[4px] uppercase text-black py-1 px-1.5'>
                        <h2 className='text-[13px] text-black'>PROFILE</h2>
                    </div>

                    <div className='lg:flex lg:flex-col justify-between items-center lg:space-x-5 w-full mt-2'>

                      <div className="lg:w-[65%]  p-3 border-gray-200 w-full flex flex-col justify-center items-center">

<div class="mx-auto relative w-fit py-6"><div class="relative w-[100px] ">
    <svg viewBox="0 0 36 36" class="rotate-[86deg] "><circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle><circle cx="18" cy="18" r="16" fill="none" stroke-width="1.5" stroke-linecap="round" class="stroke-current text-red-500" stroke-dasharray="25 100"></circle></svg> 
<div class="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center "><label class="text-sm rtl:text-right font-medium block text-gray-900 dark:text-gray-300 space-y-2 w-full m-auto"><div>
    <img class="mx-auto w-full" src="/profile.png" alt=""/>
     <div class="w-5 h-5 flex absolute bg-black rounded-full -right-2 bottom-0 "><span class="text-skin-primary1 text-[12px] font-semibold m-auto">+</span></div></div>  
<input type="file" accept="image/*" class="disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg hidden border p-6 w-full"/>  </label></div></div> <div><button class="text-gray-400 text-[14px] relative mx-auto hidden">
    <span class="font-semibold text-grya-500">Remove Profile</span></button> 
    
    <div class="text-gray-400 text-[14px] relative mx-auto ">
        
        <span class="font-semibold text-black">25%</span> Completed</div></div></div>

    {/* Username */}
    <div className="w-full mb-2">
        <div className="border p-2 rounded-md text-sm text-gray-700 text-center">
            Username: <strong>{user?.data?.username || 'N/A'}</strong>
        </div>
    </div>

    {/* Phone Number */}
    <div className="w-full mb-4">
        <div className="border p-2 rounded-md text-sm text-gray-700 text-center">
            Phone Number: <strong>{user?.data?.phone || '+91XXXXXXXXXX'}</strong>
        </div>
    </div>

    {/* CTA Button */}
    <button className="bg-[--primary] text-[--white] font-semibold py-2 px-4 rounded w-full hover:opacity-90 transition">
        COMPLETE YOUR PROFILE
    </button>
</div>

                    </div>
                </div>
                 <MobileFooter />
                        <div className='w-full max-lg:pb-16'>
                        
                            </div>
        </>
    );
};


export default Profile;