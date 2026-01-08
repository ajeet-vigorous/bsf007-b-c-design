import React from 'react'

function MarqueeNotification() {
    const clientdomainSettingData = JSON.parse(localStorage.getItem('clientdomainSetting'));
    return (
        <section className='h-[30px] bg-[var(--white)] flex items-center  '>
            <div className="w-full flex justify-start items-center overflow-hidden">
                    <div className="w-[38px] min-w-[30px] px-[3px] !bg-white flex justify-center items-center">
                        <img src='/images/zetto/speaker.png' className="w-[22px] h-[30px]" />
                    </div>
                            <marquee behavior="scroll" direction="left" scrollamount="4" className='whitespace-nowrap uppercase font-bold w-[96%] text-xs'>
                                {clientdomainSettingData?.clientNotification !== undefined && clientdomainSettingData?.clientNotification !== null && clientdomainSettingData?.clientNotification}
                            </marquee>
            </div>
        </section>

    )
}

export default MarqueeNotification;