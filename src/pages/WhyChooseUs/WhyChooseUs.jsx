import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const WhyChooseUs = () => {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const navigate = useNavigate();

   
    

    return (
        <div>
            <div className="text-[15px] gap-3 rounded-t-[5px] text-black bg-[--secondary] px-5 h-[31px] flex items-center font-semibold">
              <img className='!w-5 !h-5' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-4 !h-4 rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              Why ?</div>
          <div className="mb-4 text-[25px] px-2 py-4 lg:px-28"><h1 className='text-[25px] font-bold' style={{textAlign: "center"}}>BECAUSE WE ARE <strong>UNCONVENTIONAL</strong></h1>
<p style={{textAlign: "left"}}><span className='my-3' style={{fontSize: "18px"}}>At ministerexch, we believe in being ‘UNCONVENTIONAL’</span></p>
<p style={{textAlign: "left"}}><p className='my-3' style={{fontSize: "18px"}}>Right from offering you the best in class customer service (that actually responds to you) to giving you the highest possible Welcome Bonus Gift at a whopping 100%, here at ministerexch, we do things differently.</p></p>
<p style={{textAlign: "left"}}><p style={{fontSize: "18px"}}>With zapping fast gaming experience (fast loading technology), choice of trusted payment options (UPI &amp; more), and 10K+ games to entertain you - you will feel the difference. </p><p className='mb-5' style={{fontSize: "18px"}}>And that is not all,</p></p>
<p><img src="https://prod-cms-api-s3-bucket.s3.ap-south-1.amazonaws.com/1715156640277%7C%7Cinfographics-phone-2.jpg" alt="" width="600" height="2187"/></p>
<p><p className='my-3' style={{fontSize: "18px"}}>We're not afraid to shake things up and try new things, and we're always looking for ways to surprise and delight our users.</p></p>
<p><span style={{fontSize: "18px"}}>We're ministerexch, and we're here to change the way you play.</span></p>
<p><span style={{fontSize: "14px"}}>So, </span><strong><span style={{fontSize: "18px"}}>Zet. Set. Go.</span></strong></p></div>
        </div>
    );
};


export default WhyChooseUs;