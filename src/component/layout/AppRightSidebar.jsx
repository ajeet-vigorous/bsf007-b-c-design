import { useState } from "react";
import { Link } from "react-router-dom";
import MobileFooter from "../mobileFooter/MobileFooter";

const AppRightSIdebar = () => {

        const [activeTab, setActiveTab] = useState("slip");

        const tabs = [
            { id: "slip", label: "Bet Slip" },
            { id: "bet", label: "My Bet" },
        ];

    const token = localStorage.getItem('token');
    const domainSettingData = JSON.parse(localStorage.getItem('clientdomainSetting'))
    return(
        <div>
            {/* <img src="/images/zetto/why.webp" alt="ads" className="w-full h-44"/>
            <img src="/images/zetto/wpbanner.png" alt="ads" className="w- h-44"/> */}
            
        {
            token && 
            
            <div className="w-full  max-w-md mx-auto mb-2">
                <div className="flex bg-[--secondary]  !text-[--primary]">
                    {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-center py-2 font-medium h-[32px] flex items-center justify-center !rounded-t-[4px]] text-sm transition-colors duration-300
                        ${
                            activeTab === tab.id
                            ? "bg-[--primary] text-[10px] text-[--secondary] !rounded-t-[4px]]"
                            : "text-[--primary]  text-[10px] rounded-t-[4px]]"
                        }`}
                    >
                        {tab.label}
                    </button>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-sm">
                    {activeTab === "slip" && <div>
                        <div className="bg-gray-300 text-black flex flex-col justify-center items-center bg-zinc-900  rounded-b-[4px] resWidth h-[311px] svelte-1xp1v4d">
                            <div><img className="w-[87px] h-[87px] mx-auto" src="/images/zetto/empty.png" alt="" srcset="" /></div>
                            <div className="text-[12px] text-black uppercase font-semibold">Your Bet Slip is Empty</div>
                        </div>
                    </div>}
                    {activeTab === "bet" && <p>👤 Profile tab content</p>}
                </div>
            </div>
        }
            <div className="">
                <div className="w-full">
                <ul className="p-0">
                    <li>
                    <Link to={'/why-choose-us'}>
                        <img className="rounded-[4px] w-full h-auto" src="/images/zetto/why.png" alt=""/>
                    </Link>
                    </li>
                    { !token ? 
                        <>
                            <li>
  {domainSettingData?.whatsappNumber ? (
    <a
      passHref={true}
      href={`https://wa.me/${domainSettingData.whatsappNumber}`}
      title="Whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="rounded-[4px] w-full h-auto mt-2"
        src="/images/zetto/wpbanner.png"
        alt="Whatsapp Banner"
      />
    </a>
  ) : (
    <img
      className="rounded-[4px] w-full h-auto mt-2"
      src="/images/zetto/wpbanner.png"
      alt="Whatsapp Banner"
    />
  )}
</li>

                        </>
                        : null
                    }
                </ul>
                </div>
            </div>
        </div>
    )
}

export default AppRightSIdebar;