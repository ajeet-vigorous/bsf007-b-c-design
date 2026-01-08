import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsListNested } from "react-icons/bs";
import MarqueeNotification from "../marquee/MarqueeNotification";

const menuItems = [
  { id: 1, icon: "/subHeader/menu-home.png", label: "Home", url: "/", inplay: false },
  { id: 2, icon: "/subHeader/menu-inplay.png", label: "In-play", url: `sports_book`, inplay: true },
  { id: 3, icon: "/subHeader/menu-4.png", label: "Cricket", url: `/in-play/4`, inplay: true },
  { id: 4, icon: "/subHeader/menu-1.png", label: "Football", url: `/in-play/1`, inplay: true },
  { id: 5, icon: "/subHeader/menu-2.png", label: "Tennis", url: `/in-play/2`, inplay: true },
  // { id: 6, icon: "/subHeader/menu-2378961.png", label: "Politics", url: `in-play/999`, inplay: false },
  { id: 7, icon: "/subHeader/menu-99998.png", label: "Casino", url: "/casino?name=all&gameName=dragon tiger", inplay: false },
  { id: 9, icon: "/subHeader/menu-7.png", label: "Horse Racing", url: `/in-play/7`, inplay: false },
  { id: 10, icon: "/subHeader/menu-4339.png", label: "Greyhound Racing", url: `/in-play/4339`, inplay: false },
  // { id: 8, icon: "/subHeader/menu-99991.png", label: "Sports Book", inplay: false },
  // { id: 12, icon: "/subHeader/menu-99990.png", label: "Binary", inplay: false },
  // { id: 13, icon: "/subHeader/menu-99994.png", label: "Kabaddi", inplay: false },
  // { id: 14, icon: "/subHeader/menu-7522.png", label: "Basketball", inplay: false },
  // { id: 15, icon: "/subHeader/menu-7511.png", label: "Baseball", inplay: false },
  // { id: 16, icon: "/subHeader/menu-20.png", label: "Table Tennis", inplay: false },
  // { id: 17, icon: "/subHeader/menu-998917.png", label: "Volleyball", inplay: false },
  // { id: 18, icon: "/subHeader/menu-7524.png", label: "Ice hockey", inplay: false },
  // { id: 19, icon: "/subHeader/menu-5.png", label: "Rugby", inplay: false },
  // { id: 20, icon: "/subHeader/menu-26420387.png", label: "Mixed Martial Arts", inplay: false },
  // { id: 21, icon: "/subHeader/menu-3503.png", label: "Darts", inplay: false },
  // { id: 22, icon: "/subHeader/menu-29.png", label: "Futsal", inplay: false },
];

const SubHeader = ({ setSidebarOpen }) => {
  const [activeBar, setActiveBar] = useState(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.url) {
      navigate(item.url);
      setActiveBar(item.id);
      setNavbarOpen(!navbarOpen);
    }
  };

  return (
    <>
      <div className="lg:bg-[var(--darkcolor)] bg-white lg:text-white text-black flex font-normal">
        <div
          className="items-center flex overflow-x-auto whitespace-nowrap scrollbar-height-0 px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {menuItems?.map((item) => {
            const isActive = activeBar === item.id;
            const isClickable = !!item.url;
            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                className={`group px-[22px] uppercase tracking-wide relative flex flex-col justify-center items-center w-full 
                  ${isActive ? "bg-[var(--primary)] h-[45px] text-white" : "h-[44px] lg:text-white text-black"}
                  ${isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
                  lg:border-none border-l-[1px] border-[#eee]`}
              >
                <img className="w-[18px] h-[18px]" src={item.icon} alt={item.label} />
                <span className="text-[11px]">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div
          onClick={() => setSidebarOpen(true)}
          className="text-black px-3 bg-white flex h-[45px] justify-end items-center lg:hidden z-0 cursor-pointer"
        >
          <BsListNested size={18} />
        </div>
      </div>

      <div className="lg:hidden block">
        <MarqueeNotification />
      </div>
    </>
  );
};

export default SubHeader;
