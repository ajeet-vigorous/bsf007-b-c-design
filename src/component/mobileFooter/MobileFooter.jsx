import { Link } from "react-router-dom"

const MobileFooter = () => {

    const domainSetting = JSON.parse(localStorage.getItem('clientdomainSetting'));
    let socialMediaLink = domainSetting?.socialMedia
    return (
        <div><div className='block lg:hidden'>
                    <div className='flex justify-center flex-col items-center my-5'>
                        <div className='text-[16px] uppercase font-semibold'>follow us on</div>
                        <div className='flex gap-2 mt-2'>
                            <a href={socialMediaLink?.instaLink ? socialMediaLink?.instaLink : ''} target="_blank" className="text-pink-500 hover:text-pink-400"><img className='!w-[26px] !h-[26px]' src="/images/zetto/insta.png" alt="" /></a>
                             <a href={socialMediaLink?.telegramLink ? socialMediaLink?.telegramLink : ''} target="_blank" className="text-blue-400 hover:text-blue-300"><img className='!w-[26px] !h-[26px]' src="/images/zetto/telegram.png" alt="" /></a>
                        </div>
                    </div>
                    <div className='flex gap-4  my-3 md:my-10 px-12'>
                        <div><img className='!w-[100px] !h-auto' src="/images/zetto/gaming.webp" alt="" srcset="" /></div>
                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/game-care1.webp" alt="" srcset="" /></div>
                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/18plus1.png" alt="" srcset="" /></div>
                        <div><img className='!w-[30px] !h-auto' src="/images/zetto/gamble-aware.webp" alt="" srcset="" /></div>
                    </div>
                    <div className='text-center my-5 md:my-10 mx-5'>
                        <Link to={"/about-us"} className='text-[14px]'>About us |</Link>
                        <Link to={"/promotions"} className='text-[14px]'> Promotions |</Link>
                        <Link to={"/contact-us"} className='text-[14px]'> Contact Us |</Link>
                        <Link to={"/faq"} className='text-[14px]'> FAQs |</Link>
                        <Link to={"/responsible-gambling"} className='text-[14px]'> Responsible Gambling |</Link>
                        <Link to={"/term-condition"} className='text-[14px]'> Terms and Conditions |</Link>
                        <Link to={"/rules"} className='text-[14px]'> Rules |</Link>
                        {/* <Link className='text-[14px]'> Zetto Blog |</Link> */}
                        <Link to={"/privacy-policy"} className='text-[14px]'> Privacy Policy </Link>
                        {/* <Link className='text-[14px]'> Sitemap </Link> */}
                    </div>
                    {/* <div className='mx-14 my-5 md:my-10'>
                        <img className='!w-[250px] !h-[60px] !md:h-[130px]' src="/images/zetto/affiliate1.png" alt="" srcset="" />
                    </div> */}
                </div></div>
    )
}
export default MobileFooter