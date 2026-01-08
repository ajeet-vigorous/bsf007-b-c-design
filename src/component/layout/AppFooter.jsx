import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { domainName } from '../../config/Auth';
import settings from '../../domainConfig';
import Login from '../login/Login';
import { GiCommercialAirplane } from "react-icons/gi";

const AppFooter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [balance, setBalance] = useState({
    coins: "",
    exposure: "",
  });
  const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
          let Balance = JSON.parse(localStorage.getItem("clientBalance") || "0");
          let clientExposure = JSON.parse(localStorage.getItem("clientExposure") || "0");
          setBalance({
            coins: Balance,
            exposure: clientExposure,
          });
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
    const handleClose = ()=> {
    setIsOpen(false)
  }

   useEffect(() => {
  if (loginModalOpen) {
    // Disable scroll
    document.body.style.overflow = "hidden";
  } else {
    // Re-enable scroll
    document.body.style.overflow = "";
  }

  // Cleanup when component unmounts
  return () => {
    document.body.style.overflow = "";
  };
}, [loginModalOpen]);

const domainSetting = JSON.parse(localStorage.getItem('clientdomainSetting'));
    let socialMediaLink = domainSetting?.socialMedia

  return (
    <>
    {loginModalOpen && <Login  onClose={() => setLoginModalOpen(false)}  />}
      <footer className="bg-[--primary] hidden lg:block w-full text-white">
          <div className="bg-[--primary] grid grid-cols-5 text-white py-8 md:px-5 lg:ps-28 lg:pe-52">
          <div className="">
              {/* Logo */}
              <div className="flex flex-col gap-2 space-x-4">
                <Link to='/dashboard'>
                  <img src={settings.logo} alt="Zetto Logo" className="h-[3rem] md:h-[75px]" />
                </Link>
                <div className='text-[12px] font-semibold !ms-0'>FOLLOW US ON</div>
                <div className='flex gap-2 !ms-0'>
                  {/* <div className='min-w-[30px] cursor-pointer'>
                    <img src="/images/zetto/fb1.png" alt="" className='!w-[26px] !h-[26px]'/>
                  </div> */}
                  <div className='min-w-[30px] cursor-pointer'>
                    <a href={socialMediaLink?.instaLink ? socialMediaLink?.instaLink : ''} target="_blank" className="text-pink-500 hover:text-pink-400"><img src="/images/zetto/insta1.png" alt="" className='!w-[26px] !h-[26px]'/> </a>
                  </div>
                  <div className='min-w-[30px] cursor-pointer'>
                    <a href={socialMediaLink?.telegramLink ? socialMediaLink?.telegramLink : ''} target="_blank" className="text-blue-400 hover:text-blue-300"> <img src="/images/zetto/telegram1.png" alt="" className='!w-[26px] !h-[26px]'/></a>
                  </div>
                  {/* <div className='min-w-[30px] cursor-pointer'>
                    <img src="/images/zetto/youtube1.png" alt="" className='!w-[26px] !h-[26px]'/>
                  </div> */}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="hover:text-[--secondary]">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" className="hover:text-[--secondary]">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com" className="hover:text-[--secondary]">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://telegram.org" className="hover:text-[--secondary]">
                  <i className="fab fa-telegram-plane"></i>
                </a>
              </div>
            </div>

          {/* Footer Links */}
          <div className="flex">
            <div>
              <div className="text-[13px] font-bold mb-3">HELP</div>
              <ul className="">
                <li><a href="/responsible-gambling" className="text-[12px] h-full hover:text-[--secondary]">Responsible Gambling</a></li>
                <li><a href="/term-condition" className="text-[12px] h-full hover:text-[--secondary]">Terms and Conditions</a></li>
                {/* <li><a href="/join-affiliate" className="text-[12px] h-full hover:text-[--secondary]">Join as Affiliate</a></li>
                <li><a href="/download-app" className="text-[12px] h-full hover:text-[--secondary]">Download App</a></li> */}
              </ul>
            </div>
          </div>
          <div>
            <div>
              <div className="text-[13px] mb-3 font-bold">INFORMATION</div>
              <ul className="">
                <li><a href="/privacy-policy" className="text-[12px] h-full hover:text-[--secondary]">Privacy Policy</a></li>
                <li><a href="/rules" className="text-[12px] h-full hover:text-[--secondary]">Rules</a></li>
                {/* <li><a href="/blog" className="text-[12px] h-full hover:text-[--secondary]">Zetto Blog</a></li>
                <li><a href="/sitemap" className="text-[12px] h-full hover:text-[--secondary]">Sitemap</a></li> */}
              </ul>
            </div>
          </div>
          <div>
            <div>
              <div className="text-[13px] mb-3 font-bold">ABOUT</div>
              <ul className="">
                <li><a href="/about-us" className="text-[12px] h-full hover:text-[--secondary]">About us</a></li>
                <li><a href="/promotions" className="text-[12px] h-full hover:text-[--secondary]">Promotions</a></li>
                <li><a href="/contact-us" className="text-[12px] h-full hover:text-[--secondary]">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-5 text-center text-xs">
            <div className="flex gap-8">
              <img src="/images/zetto/gaming.webp" alt="Gaming Curacao" className="!w-[100px] h-auto" />
              <img src="/images/zetto/game-care.png" alt="GamCare" className="!w-[30px] !h-[30px]" />
              {/* <span className="text-[--secondary]">Be Gamble Aware</span>
              <span className="text-[--secondary]">18+</span> */}
            </div>
            <div className='flex items-center gap-2 mt-8'>
              <img className='invert !w-[28px] !h-[28px]' src="/images/zetto/18plus1.png" alt="" srcset="" />
              <img className='invert !w-[40px]' src="/images/zetto/gamble-aware.webp" alt="" srcset="" />
            </div>
          </div>
        </div>
      </footer>

      
      <div className="fixed w-full bottom-0 left-0 flex rounded-t-[30px] lg:hidden bg-[--primary] items-center !h-[59px] sm:!h-[55px]">
        {/* {login && <LoginModal closeLogin={()=>setLogin(false)} />} */}
        <div className="mobile-header-data w-full">
          <ul className="grid grid-cols-5 ps-0 items-center !m-0">
            {/* <li className="footer-toggle-left" onClick={sidbarToggle}>
              <i className="fa fa-bars text-[25px]" aria-hidden="true"></i>
            </li> */}
            <li className='mx-auto h-full'
            // onClick={() => handleConditionalClick()}
            >
            <Link to='/casino?name=all&gameName=dragon tiger'  className="mobile-btn flex flex-col items-center">
              <img alt="casino-icon" src="/images/zetto/casino.png" className="!h-[20px] !w-[20px] !mt-[6px]"/>
              <p className="text-white text-[10px] mt-1">Casino</p>
              </Link>
            </li>
            {
              !token ? 
              (
                <li className='mx-auto h-full'
                // onClick={() => handleConditionalClick()}
                >
                <Link to='/promotions'  className="mobile-btn flex flex-col items-center">
                  <img alt="casino-icon" src="/images/zetto/star.png" className="!h-[20px] !w-[20px] !mt-[6px]"/>
                  <p className="text-white text-[10px] mt-1">Offers</p>
                  </Link>
                </li>
              ) :
              (
                <li className='mx-auto h-full'
                // onClick={() => handleConditionalClick()}
                >
                <Link to={`/iframe-casino/${201206}`}  className="mobile-btn flex flex-col items-center">
                  <GiCommercialAirplane color='white' className="!w-[20px] !h-[20px] !mt-[6px]"/>
                  <p className="text-white text-[10px] mt-1">Aviator</p>
                  </Link>
                </li>
              )
            }
            <li 
            // onClick={() => handleClick("/")} 
            className=" mx-auto absolute z-50 bg-white rounded-full bottom-[10px] left-1/2 -translate-x-1/2">
              <Link to='/' className="">
                {/* <i className="fa fa-home" aria-hidden="true"></i> */}
                <img className="!w-[60px] !h-[60px]" src={settings.footerHome} alt="" />
              </Link>
            </li>
            <li></li>

            <li className='mx-auto h-full'
            // onClick={() => handleClick("/sport/all")}
            >

              {domainSetting?.whatsappNumber ? (
    <a
      passHref={true}
      href={`https://wa.me/${domainSetting.whatsappNumber}`}
      title="Whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      className="mobile-btn flex flex-col items-center"
    >
      <img alt="footballSport_icon" src="/images/zetto/whatsapp-icon.png" className="!h-[20px] !w-[20px] !mt-[6px]"/>
                {/* <p className="text-white text-[10px] mt-1">Helpline</p> */}
                <p className="text-white text-[10px] mt-1">Support</p>
    </a>
  ) : (
    <span className="mobile-btn flex flex-col items-center">
    <img alt="footballSport_icon" src="/images/zetto/whatsapp-icon.png" className="!h-[20px] !w-[20px] !mt-[6px]"/>
                {/* <p className="text-white text-[10px] mt-1">Helpline</p> */}
                <p className="text-white text-[10px] mt-1">Support</p>
                </span>
  )}
             
            </li>
            {token ? (
              <li onClick={() => setIsOpen(true)}>
                <a  className="mobile-btn flex flex-col items-center">
                  <FaUser size={20} color='white' className='mt-2'/>
                <p className="text-[10px] text-white mt-1">Profile</p>
                </a>
              </li>
            ) : (
              <li className='mx-auto h-full'
              onClick={() => { setLoginModalOpen(true);
                      }}
              >
                <img src="/images/zetto/avatar.png"className="!h-[20px] !w-[20px] !mt-[6px]"/>
                <p className="text-white text-[10px] mt-1">Login</p>
               
              </li>
           )} 
          </ul>
        </div>
        {/* {isVisible && (
          <div
            className={`menu-slide graybg-4 ${menuOpen ? "active" : "inactive"}`}
          >
            <AllMenu handleClose={handleClose} />
          </div>
        )} */}
      </div>

      {isOpen && (
    <div className="fixed inset-0 z-[10000]">
      <div
        className="absolute inset-0 bg-white/75 bg-opacity-50"
        onClick={handleClose}
      ></div>
      <div
        className={`absolute z-[10000] right-0 top-0 w-80 bg-[--primary] text-white shadow-2xl transform h-dvh overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col z-[10000]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="!m-4 flex justify-center items-center hover:bg-white rounded-[4px] w-6 h-6">
          <IoClose onClick={handleClose} className="w-5 h-5 text-[--secondary]" />
        </div> */}
        <div className="flex items-center justify-center gap-2">
          <img src="/images/zetto/profile.webp" alt="" className="!w-[30px] !h-[30px]" />
          {user?.data?.username || "User"}
        </div>
  
        <div className="text-[15px] text-white my-2 text-center font-normal">
          Balance Information
        </div>
  
        <div className="p-4 border-b border-black text-sm space-y-2">
          <div className="flex justify-between border-b border-white pb-4">
            <span className="text-[15px] font-[400]">Available Credit</span>
            <span className="font-bold">
              {balance?.coins ? Number(balance.coins).toFixed(2) : "0.00"}
            </span>
          </div>
          <div className="flex justify-between border-b border-white pb-4">
            <span className="text-[15px] font-[400]">Net Exposure</span>
            <span className="font-bold">
              {balance?.exposure ? Number(balance.exposure).toFixed(2) : "0"}
            </span>
          </div>
          {/* <div className="flex gap-2 !mt-5">
          <div
          onClick={() => {
            navigate("/wallet");
            handleClose();
          }}
            className="w-[50%] text-[12px] font-semibold rounded-[3px] h-[35px] border border-[--secondary] flex items-center justify-center text-[--secondary] hover:bg-[--secondary] hover:text-white"
          >
            WITHDRAW
          </div>
          <div
          onClick={() => {
            navigate("/deposit");
            handleClose();
          }}
            className="flex justify-center items-center w-[50%] text-[12px] font-semibold text-black rounded-[3px] h-[35px] border border-[--secondary] hover:opacity-[0.8] bg-[--secondary]"
          >
            DEPOSIT
          </div>
        </div> */}
        </div>
        <div className="flex-1 capitalize text-sm text-[#212529] px-4">
          <div
            onClick={() => {
              navigate("/profile");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/savatar.webp" className="w-4 h-4" />
            <span className="text-[14px]">My Profile</span>
          </div>
          {/* <div
            onClick={() => {
              navigate("/referral");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/refericon.webp" className="w-4 h-4" />
            <span className="text-[14px]">Referral Earnings</span>
          </div> */}
          <div
            onClick={() => {
              navigate("/changepassword");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/editpassword.webp" className="w-4 h-4" />
            <span className="text-[14px]">Change Password</span>
          </div>
          <div
            onClick={() => {
              navigate("/ac-statement");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/accstatement.webp" className="w-4 h-4" />
            <span className="text-[14px]">Account Statement</span>
          </div>
          <div
            onClick={() => {
              navigate("/unsettled-bets");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/bethistory.webp" className="w-4 h-4" />
            <span className="text-[14px]">Current Bets</span>
          </div>
          <div
            onClick={() => {
              navigate("/profit-loss");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/profloss.webp" className="w-4 h-4" />
            <span className="text-[14px]">Profit/Loss</span>
          </div>

           <div
                                                onClick={() => {
                                                  navigate("/ledger");
                                                  handleClose();
                                                }}
                                                className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
                                              >
                                                <img src="/images/zetto/accstatement.webp" className="w-4 h-4" />
                                                <span className="text-[14px]">Ledger</span>
                                              </div>
          <div
            onClick={() => {
              navigate("/bet-list");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/bethistory.webp" className="w-4 h-4" />
            <span className="text-[14px]">Bet History</span>
          </div>
          <div
            onClick={() => {
              navigate("/active-logs");
              handleClose();
            }}
            className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/passhistory.webp" className="w-4 h-4" />
            <span className="text-[14px]">Activity Log</span>
          </div>
          <div
            onClick={() => {
              navigate("/setting");
              handleClose();
            }}
            className="flex items-center gap-2 p-3 border-white text-white cursor-pointer"
          >
            <img src="/images/zetto/setting.webp" className="w-4 h-4" />
            <span className="text-[14px]">Setting</span>
          </div>
        </div>
  
        {/* LOGOUT */}
        <div
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="flex bg-[--secondary] text-[14px] h-[55px] rounded-[4px] p-3 m-4 justify-center items-center gap-2 text-black font-semibold uppercase"
        >
          <span>Logout</span>
        </div>
        <div className="bg-[--secondary]  flex mx-auto  w-6 h-6">
                <IoClose onClick={handleClose} className="w-6 h-6   text-[--primary]" />
              </div>
      </div>
    </div>
 ) }
    </>
  );
};

export default AppFooter;




// const FooterLink = () => {
//   return(isOpen && (
//     <div className="fixed inset-0 z-50">
//       <div
//         className="absolute inset-0 bg-white/75 bg-opacity-50"
//         onClick={handleClose}
//       ></div>
//       <div
//         className={`absolute right-0 top-0 w-80 bg-[--primary] text-white shadow-2xl transform h-dvh overflow-y-auto transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } flex flex-col z-50`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="!m-4 flex justify-center items-center hover:bg-white rounded-[4px] w-6 h-6">
//           <IoClose onClick={handleClose} className="w-5 h-5 text-[--secondary]" />
//         </div>
//         <div className="flex items-center justify-center gap-2">
//           <img src="/images/zetto/profile.webp" alt="" className="!w-[30px] !h-[30px]" />
//           {user?.data?.username || "User"}
//         </div>
  
//         <div className="text-[15px] text-white my-2 text-center font-normal">
//           Balance Information
//         </div>
  
//         <div className="p-4 border-b border-black text-sm space-y-2">
//           <div className="flex justify-between border-b border-white pb-4">
//             <span className="text-[15px] font-[400]">Available Credit</span>
//             <span className="font-bold">
//               {balance?.coins ? Number(balance.coins).toFixed(2) : "0.00"}
//             </span>
//           </div>
//           <div className="flex justify-between border-b border-white pb-4">
//             <span className="text-[15px] font-[400]">Net Exposure</span>
//             <span className="font-bold">
//               {balance?.exposure ? Number(balance.exposure).toFixed(2) : "0"}
//             </span>
//           </div>
//           <div className="flex gap-2 !mt-5">
//             <Link
//               to="/wallet"
//               className="w-[50%] text-[12px] font-semibold rounded-[3px] h-[35px] border border-[--secondary] flex items-center justify-center text-[--secondary] hover:bg-[--secondary] hover:text-white"
//             >
//               WALLET
//             </Link>
//             <Link
//               to="/deposit"
//               className="flex justify-center items-center w-[50%] text-[12px] font-semibold text-black rounded-[3px] h-[35px] border border-[--secondary] hover:opacity-[0.8] bg-[--secondary]"
//             >
//               DEPOSIT
//             </Link>
//           </div>
//         </div>
//         <div className="flex-1 capitalize text-sm text-[#212529] px-4">
//           <div
//             onClick={() => {
//               navigate("/profile");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/savatar.webp" className="w-4 h-4" />
//             <span className="text-[14px]">My Profile</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/referral");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/refericon.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Referral Earnings</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/changepassword");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/editpassword.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Change Password</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/ac-statement");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/accstatement.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Account Statement</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/ac-statement");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/bethistory.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Current Bets</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/profit-loss");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/profloss.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Profit/Loss</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/ac-statement");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/bethistory.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Bet History</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/ac-statement");
//               handleClose();
//             }}
//             className="flex items-center gap-2 px-3 py-4 border-b border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/passhistory.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Activity Log</span>
//           </div>
//           <div
//             onClick={() => {
//               navigate("/profile/changepassword");
//               handleClose();
//             }}
//             className="flex items-center gap-2 p-3 border-white text-white cursor-pointer"
//           >
//             <img src="/images/zetto/setting.webp" className="w-4 h-4" />
//             <span className="text-[14px]">Setting</span>
//           </div>
//         </div>
  
//         {/* LOGOUT */}
//         <div
//           onClick={() => {
//             localStorage.clear();
//             navigate("");
//           }}
//           className="flex bg-[--secondary] text-[14px] h-[55px] rounded-[4px] p-3 m-4 justify-center items-center gap-2 text-black font-semibold uppercase"
//         >
//           <span>Logout</span>
//         </div>
//       </div>
//     </div>
//  ) )}
