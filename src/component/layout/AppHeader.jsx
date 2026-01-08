import { useEffect, useRef, useState } from "react";
import settings from "../../domainConfig";
import { useDispatch } from "react-redux";
import { getSportMatchList } from "../../redux/reducers/sport_reducer";
import RulesModal from "../rulesModal/RulesModal";
import { FaBullseye, FaSearch } from "react-icons/fa";
import { BiLockAlt } from "react-icons/bi";
import { IoClose, IoPerson, IoPersonOutline } from "react-icons/io5";
import { BsBarChart, BsBarChartSteps, BsBoxArrowRight, BsCardText, BsListNested } from "react-icons/bs";
import BonusRules from "../bonusRules/BonusRules";
import { Link, useNavigate } from "react-router-dom";
import LiveMatches from "../dashboard/LiveMatches";
import Login from "../login/Login";
import { domainName } from "../../config/Auth";
import { getClientExposure, getDomainSettingData, getUserBalance } from "../../redux/reducers/user_reducer";
import { IoMdArrowDropdown } from "react-icons/io";
import Signup from "../../pages/signup/Signup";

const AppHeader = ({ setSidebarOpen }) => {
  const dispatch = useDispatch()
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [singupModalOpen, setSingupModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [clickedOutside, setClickedOutside] = useState(false);
  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [balance, setBalance] = useState({
    coins: "",
    exposure: "",
  });
  const handleClickInside = () => setClickedOutside(true);
  const myRef = useRef();
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = () => {
    setIsLoginOpen(true);
  }

  const closeModal = () => {
    setIsLoginOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (myRef.current && !myRef.current.contains(event.target)) {
        setClickedOutside(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(getSportMatchList());
    const sportInterval = setInterval(() => {
      dispatch(getSportMatchList());
    }, 10000);

    return () => { clearInterval(sportInterval); }
  }, [])

  
  const setModalTrue = () => {
    setRulesModalOpen(true);
  };

  const setModalFalse = () => {
    setRulesModalOpen(false);
  };

  const setBonusTrue = () => {
    setBonusModalOpen(true);
  };

  const setBonusFalse = () => {
    setBonusModalOpen(false);
  };
  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    const matchListLocal = localStorage.getItem("matchList");
    const parsedData = matchListLocal ? JSON.parse(matchListLocal) : [];
    setMatchData(parsedData);
  }, []);


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


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getExposureFunc();
      const intervalBalance = setInterval(() => {
        dispatch(getUserBalance());
      }, 3000);

      return () => {
        clearInterval(intervalBalance);
      }
    }
  }, [dispatch]);

  const getExposureFunc = async () => {
    const reqData = {
      fancyBet: true,
      oddsBet: true,
      isDeclare: false,
      diamondBet: true,
      isClientExposure: true,
    };
    // dispatch(getClientExposure(reqData)); //betList
  };

  const handleClose = ()=> {
    setIsOpen(false)
    document.body.classList.remove("!overflow-hidden")
  }

  const fetchDomainSetting = () => {
        let domainSetting = {
          domainUrl: window.location.origin,
        };
    
        dispatch(getDomainSettingData(domainSetting)).then((res) => {
          if (!res?.error) {
            const domainData = res?.payload?.data;
            localStorage.setItem(
              "clientdomainSetting",
              JSON.stringify(domainData)
            );
          }
        });
      };
    


  useEffect(() => {
  if (singupModalOpen || loginModalOpen) {
    fetchDomainSetting()

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
}, [singupModalOpen, loginModalOpen]);

  return (
    <>
        <div
          className={`border-b border-[#00FFE6] !px-2 lg:!px-10 h-[64px] flex items-center w-full bg-[var(--primary)]`}
        >

          {/* {singupModalOpen && <Signup onClose={() => setSingupModalOpen(false)} />} */}
          {loginModalOpen && <Login  onClose={() => setLoginModalOpen(false)}  />}
          <div className="w-full">
            <div className="flex justify-between items-center mx-auto w-full py-0">
              <div className="flex justify-start items-center py-3 gap-2">
                {/* <BsListNested size={18}  color="white" onClick={() => setSidebarOpen(true)} className="md:hidden block"/> */}
                <div onClick={() => setSidebarOpen(true)} className="text-white block lg:hidden !md:w-[80px] !h-[15px]">
                  <img className="text-white !w-[20px] min-w-[20px] !h-[15px]" src="/images/zetto/menu.png" alt="" />
                </div>
                <img onClick={() => {
                  navigate("/dashboard");
                }}
                  src={settings.logo} className="h-[3rem] md:h-[50px] md:w-52 w-48  cursor-pointer" />
              </div>
              {token ? (
                <>
                  <div className="flex justify-end w-full items-center">
                    <div className="flex items-center">
                        <div className="">
                            <div className="flex gap-2 justify-end w-full">
                              <ul className="flex gap-3 justify-end  items-start mb-0 ps-0 w-100 ">
                                {/* <li className="hidden lg:block"><input placeholder="Search Events...." className="!text-[12px] h-[27px] bg-white rounded-[3px] focus:outline-0 px-2" type="text" name="" id="" /></li> */}
                                <li className="flex flex-col justify-center items-center md:gap-1">
                               
                                  {/* <button onClick={()=> navigate("/deposit")} className="bg-[var(--secondary)] hover:opacity-[0.7] transition text-black !rounded-[3px] !text-[10px] font-bold !px-[22px] h-[25px]">
                                    DEPOSIT
                                  </button> */}
                                  <div className="text-[var(--secondary)] md:hidden block text-[11px]">B: <span className="text-white font-bold">{balance && balance.coins
                                  ? Number(balance.coins).toFixed(2)
                                  : "0"}</span></div>
                                   <div className="text-[var(--secondary)] md:hidden block  text-[11px]">EX: <span onClick={()=> navigate("/unsettled-bets")} className="text-red-700 font-bold"> 
                                  
                                  {balance && balance.exposure ? Number(balance.exposure).toFixed(2) : "0"}
                                  </span></div>
                                </li>
                                <li className="flex flex-col justify-center items-center gap-1">
                                    {/* <button onClick={()=> navigate("/wallet")} className="text-white transition hover:!text-black hover:!bg-white font-bold border !border-white !rounded-[3px] !text-[10px] !px-[20px] h-[25px] !bg-transparent">
                                    WITHDRAW
                                  </button> */}
                                  <div className="text-[var(--secondary)] md:hidden block text-[11px]"> <span className="text-white font-bold">{user?.data?.username} <div> [{user?.data?.name}]</div></span></div>
                                 
                                </li>
                                <li className="relative hidden lg:block cursor-pointer">
                                  <div 
                                    ref={myRef}
                                    onClick={() => {
                                      document.body.classList.add("!overflow-hidden")
                                      setIsOpen(true)
                                    }}
                                    >
                                    <img className="!w-[28px] !h-[28px]" src="/images/zetto/profile.png" alt="" />
                                    <img className="absolute top-0 -right-[8px] !w-[17px] !h-[30px]" src="/images/zetto/flash.png" alt=""/>
                                    
                                  </div>
                                    {isOpen && (
                                        <div className="fixed inset-0 z-50">
                                          <div
                                            className="absolute inset-0 bg-white/75 bg-opacity-50"
                                            onClick={handleClose}
                                          ></div>
                                          <div
                                            className={`absolute py-2 right-0 top-0 w-80 bg-[--primary] text-white shadow-2xl transform h-dvh overflow-y-auto transition-transform duration-300 ${
                                              isOpen ? "translate-x-0" : "translate-x-full"
                                            } flex flex-col z-50`}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <div className="flex items-center capitlize justify-center gap-2">
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
                                                window.location.href = '/login'
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
                                      )}
                                </li>
                              </ul>
                            </div>
                        </div>
                      </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex space-x-1">
                    {/* <div
                      onClick={() => { setSingupModalOpen(true);
                      }}
                      className="hover:bg-[var(--primary)]  text-xs uppercase py-1 cursor-pointer text-black hover:!text-white bg-white font-bold border !border-white !rounded-[3px] !text-[10px] !px-[25px] h-[25px] ">
                      SIGNUP
                    </div> */}
                    
                    {/* <div onClick={() => { setLoginModalOpen(true);
                      }}
                      className="hover:bg-[var(--primary)]  text-xs uppercase py-1 cursor-pointer text-black hover:!text-white bg-white font-bold border !border-white !rounded-[3px] !text-[10px] !px-[25px] h-[25px] ">
                      Login
                    </div> */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div >
    </>
  );
};

export default AppHeader;