import React, { useEffect, useState } from 'react';


const SportsBook = () => {

    return (
        <>

            <div className='w-full'>
                <div className='bg-[var(--darkcolor)] uppercase text-black py-1 px-1.5'>
                    <h2 className='text-[14px] text-white'>Sports Book</h2>
                </div>
                <div className='bg-white shadow-[0_1px_6px_#00000017] mt-1 p-10 text-center'>
                    <div className='text-[24px] text-[#444444]'>There are currently no followed SportsBook Markets.</div>
                </div>
            </div>
        </>
    );
};


export default SportsBook;