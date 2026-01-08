import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';


const BonusList = () => {

    const [activeTab, setActiveTab] = useState('in-progress');

    // Sample data for each tab
    const tabData = {
        'in-progress': [
            { id: 1, title: 'Weekend Bonus', description: 'Complete 5 tasks by Sunday', progress: 65 },
            { id: 2, title: 'Daily Login', description: 'Login for 7 consecutive days', progress: 42 },
            { id: 3, title: 'Referral Program', description: 'Refer 3 friends this month', progress: 33 },
        ],
        'redeemed': [
            { id: 1, title: 'Welcome Bonus', description: '$10 free credit', date: '2023-05-15' },
            { id: 2, title: 'Loyalty Reward', description: '500 loyalty points', date: '2023-05-10' },
            { id: 3, title: 'Birthday Gift', description: 'Free spins package', date: '2023-04-28' },
        ],
        'expired-void': [
            { id: 1, title: 'Weekly Challenge', description: 'Expired on 2023-05-01', status: 'Expired' },
            { id: 2, title: 'Deposit Bonus', description: 'Voided due to terms violation', status: 'Void' },
            { id: 3, title: 'Tournament Prize', description: 'Expired on 2023-04-15', status: 'Expired' },
        ],
    };

    return (
        <>

            <div className='w-full'>
                <div className='bg-[#e9eff8]'>
                    <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                        Bonus List
                        <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
                    </div>
                </div>

                <div className=" text-white mt-3">

                    <div className="flex border-b border-gray-700 bg-[var(--darkcolor)] overflow-x-auto">
                        <button
                            className={`py-2 px-6 uppercase font-medium text-sm transition-all duration-300 ${activeTab === 'in-progress'
                                ? 'bg-[var(--secondary)] text-white border-r-2 border-blue-400'
                                : ' text-gray-300 hover:bg-[var(--secondary)]'
                                }`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            <div className="flex items-center whitespace-nowrap">
                                <svg className="w-5 h-5 mr-2 sm:block hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                In-progress
                            </div>
                        </button>
                        <button
                            className={`py-2 px-6 uppercase font-medium text-sm transition-all duration-300 ${activeTab === 'redeemed'
                                ? 'bg-[var(--secondary)] text-white border-r-2 border-green-400'
                                : ' text-gray-300 hover:bg-[var(--secondary)]'
                                }`}
                            onClick={() => setActiveTab('redeemed')}
                        >
                            <div className="flex items-center whitespace-nowrap">
                                <svg className="w-5 h-5 mr-2 sm:block hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Redeemed
                            </div>
                        </button>
                        <button
                            className={`py-2 px-6 uppercase font-medium text-sm transition-all duration-300 ${activeTab === 'expired-void'
                                ? 'bg-[var(--secondary)] text-white border-r-2 border-red-400'
                                : ' text-gray-300 hover:bg-[var(--secondary)]'
                                }`}
                            onClick={() => setActiveTab('expired-void')}
                        >
                            <div className="flex items-center whitespace-nowrap">
                                <svg className="w-5 h-5 mr-2 sm:block hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Expired & Void
                            </div>
                        </button>
                    </div>

                    <div className="p-5">
                        {activeTab === 'in-progress' && (
                            <div className="flex items-center">
                                <h2 className="text-lg font-semibold text-blue-500">Your Active Bonuses Not Found!</h2>
                            </div>
                        )}

                        {activeTab === 'redeemed' && (
                            <div className="flex items-center">
                                <h2 className="text-lg font-semibold text-green-500">Redeemed Rewards Not Found!</h2>

                            </div>
                        )}

                        {activeTab === 'expired-void' && (
                            <div className="flex items-center">
                                <h2 className="text-lg font-semibold text-red-500">Expired & Voided Offers Not Found!</h2>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};


export default BonusList;