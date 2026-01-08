import React from 'react'
import { Link } from 'react-router-dom'

const Refferal = () => {
    return (
        <>
            <div className='h-[31px] text-[15px] bg-[--secondary] px-3 flex items-center justify-start font-semibold text-[--primary] rounded-t-[4px]'>
                Referral Earnings
            </div>
            <div className='text-center text-[16px] font-medium my-10'>No Refferals</div>
            <div className='flex justify-center'>
                <Link to='/referAFriend' className='bg-[--primary] text-[16px] text-[--secondary] rounded-lg px-3 py-3'>REFER A FRIEND</Link>
            </div>
        </>
    )
}

export default Refferal