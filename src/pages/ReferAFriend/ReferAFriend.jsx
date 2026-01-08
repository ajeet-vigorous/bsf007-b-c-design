import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { domainName } from '../../config/Auth';

export const ReferAFriend = () => {
       const [copied, setCopied] = useState(false);

    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));



    const copyToClipboard = () => {
        const code = user?.data?.referralCode;
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // copied text resets after 2 sec
            });
        }
    };
    return (
        <>
            <div className="text-[15px] gap-3 rounded-t-[5px] text-black bg-[--secondary] px-5 h-[31px] flex items-center font-semibold">
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              Refer A Friend</div>
            <div className='md:px-8 px-2'>
                <img className='m-auto w-full md:w-[350px] mt-2 md:mt-4 rounded' src="/images/zetto/referpromo.webp" alt="" />
            </div>
            <div className="flex flex-col items-center justify-center pt-5 pb-10 px-4 md:px-20 bg-white text-gray-900">
                <div className="w-full max-w-3xl">
                    <img
                    src="/images/zetto/refer-flow.png"
                    alt="Refer a Friend"
                    className="m-auto w-full md:w-[350px] px-5 md:px-0"
                    />
                </div>
                <div onClick={copyToClipboard} className='flex cursor-pointer m-auto rounded hover:bg-[--secondary] px-2 h-[39px] items-center justify-center py-1 w-full md:w-[250px] bg-gray-300 active:bg-skin-hover3 active:bg-skin-hover5 md:hover:bg-skin-hover5  hover:text-skin-primary-text2 mt-4'>
                    <span className="text-[18px] font-medium w-full text-gray-800 text-center">
                        {user?.data?.referralCode}
                        </span>
                        <img className='w-8 h-8 mx-2' src="/images/zetto/copy-icon.png" alt="" srcset="" />
                </div>

               {copied && (
                 <div className='bg-gray-400 mt-3 rounded px-2'>
                <span className="text-black ml-2">Text Copied!</span>
            </div>)}

                    <div className="my-4">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className='text-[16px]'>Invite friends</div>
                        <div className='border items-center flex gap-3 px-3 py-2 border-gray-300 rounded-sm'>
                            <button className="bg-[--primary] text-white px-3 py-1 text-[12px] font-semibold hover:bg-[--primary] block transition">
                            COPY LINK
                            </button>
                            <img className='!w-8 !h-8' src="/images/zetto/whatsapp.png" alt="" srcset="" />
                            <img className='!w-7 !h-7' src="/images/zetto/telegram.png" alt="" srcset="" />
                        </div>
                    </div>
                    </div>
                <div className="w-full max-w-3xl text-center shadow-sm">
                    <h2 className="mb-8 text-2xl font-[900] text-gray-800">
                    Refer a Friend and Win Big!
                    </h2>
                    <p className="text-gray-600 mb-6 text-[18px] text-start">
                    Invite your friends to join and play on ministerexch, and enjoy a bonus of{" "}
                    ₹1000! Refer
                    now and claim your reward!
                    </p>

                    

                    {/* How to Refer Section */}
                    <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800 mb-5">How to Refer?</h3>
                    <p className="text-gray-700 text-[18px] mb-3">
                        Simply follow these easy steps and get ₹1000 FREE REFERRAL BONUS:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-[18px] text-gray-700">
                        <li>Login to your ministerexch account.</li>
                        <li>Click on the Hamburger Menu and choose “Refer a Friend”.</li>
                        <li>Share your Referral Code with your friends.</li>
                        <li>
                        Your friend needs to sign up using your referral code during
                        registration.
                        </li>
                        <li>
                        The bonus will be credited once the conditions are fulfilled.
                        </li>
                    </ol>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-6 text-left">
                    <h3 className="text-lg font-bold text-gray-800 mb-5">
                        Terms and Conditions:
                    </h3>
                    <ul className="list-decimal list-inside space-y-2 text-[18px] text-gray-700">
                        <li>Referrer can refer only up to 10 referees.</li>
                        <li>This promotion is valid for new and existing players.</li>
                        <li>
                        Referee must play for at least ₹20,000 to unlock the referral
                        bonus.
                        </li>
                        <li>
                        A bonus of ₹1000 is added to your wallet and must be wagered 40
                        <li>
                        times.
                        </li>
                        <li>Turnover requirements must be met within 7 days.</li>
                        Void or canceled bets are not considered for bonus turnover.
                        </li>
                        <li>
                        One account per player. Duplicate accounts will be disqualified.
                        </li>
                        <li>
                        ministerexch reserves the right to amend or cancel the promotion anytime.
                        </li>
                        <li>Other General Terms & Conditions apply.</li>
                    </ul>
                    </div>
                </div>
                
                                <div className='block lg:hidden'>
                                    <div className='flex justify-center flex-col items-center my-10'>
                                        <div className='text-[16px] uppercase font-semibold'>follow us on</div>
                                        <div className='flex gap-2 mt-2'>
                                            {/* <Link><img className='!w-[26px] !h-[26px]' src="/images/zetto/fb.png" alt="" /></Link> */}
                                            <Link><img className='!w-[26px] !h-[26px]' src="/images/zetto/insta.png" alt="" /></Link>
                                            {/* <Link><img className='!w-[26px] !h-[26px]' src="/images/zetto/youtube.png" alt="" /></Link> */}
                                            <Link><img className='!w-[26px] !h-[26px]' src="/images/zetto/telegram.png" alt="" /></Link>
                                        </div>
                                    </div>
                                    <div className='flex gap-4  my-5 md:my-10 px-12'>
                                        <div><img className='!w-[100px] !h-auto' src="/images/zetto/gaming.webp" alt="" srcset="" /></div>
                                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/game-care1.webp" alt="" srcset="" /></div>
                                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/18plus1.png" alt="" srcset="" /></div>
                                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/gamble-aware.webp" alt="" srcset="" /></div>
                                    </div>
                                    <div className='text-center my-5 md:my-10 mx-5'>
                                        <Link className='text-[14px]'>About us |</Link>
                                        <Link className='text-[14px]'> Promotions |</Link>
                                        <Link className='text-[14px]'> Contact Us |</Link>
                                        <Link className='text-[14px]'> FAQs |</Link>
                                        <Link className='text-[14px]'> Responsible Gambling |</Link>
                                        <Link className='text-[14px]'> Terms and Conditions |</Link>
                                        <Link className='text-[14px]'> Rules |</Link>
                                        {/* <Link className='text-[14px]'> Zetto Blog |</Link> */}
                                        <Link to={"/privacy-policy"} className='text-[14px]'> Privacy Policy |</Link>
                                        {/* <Link className='text-[14px]'> Sitemap </Link> */}
                                    </div>
                                    <div className='mx-10 my-5 md:my-10'>
                                        <img className='!w-[500px] !h-[90px] !md:h-[130px]' src="/images/zetto/affiliate1.png" alt="" srcset="" />
                                    </div>
                                </div>
            </div>
        </>
    )
}
