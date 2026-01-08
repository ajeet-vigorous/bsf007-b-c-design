import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { SPORTSCONSTANT } from "../../config/global";

const MobileView = ({ filteredData, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);
  const [openKeys1, setOpenKeys1] = useState({});
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleClick = (index, e) => {
    e.stopPropagation();
    const clickedItem = SPORTSCONSTANT[index];

    if (clickedItem?.text === "Casino") {
      navigate("/all-casino");
      onClose();
      return;
    }
    if (clickedItem?.text === "Sports Book") {
      navigate("/sport-sbook");
      onClose();
      return;
    }

    if (openKeys.includes(index)) {
      setOpenKeys(openKeys.filter((key) => key !== index));
    } else {
      setOpenKeys([...openKeys, index]);
    }
  };

  const handleClick1 = (sportIndex, seriesIndex, e) => {
    e.stopPropagation();
    const key = `${sportIndex}-${seriesIndex}`;
    setOpenKeys1((prevOpenKeys1) => ({
      ...prevOpenKeys1,
      [key]: !prevOpenKeys1[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30" />
      <div 
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-64 bg-slate-600 z-40"
      >
        <CgClose
          onClick={onClose}
          className="absolute top-6 left-[220px] z-40 text-white text-2xl"
        />
        <div className="h-full overflow-y-auto pt-4">
          <div className="text-white">
            <div
              onClick={() => {
                navigate("/market-analysis");
                onClose();
              }}
              className="border-b border-[#eceaea] hover:bg-[#FFF6EE] hover:text-primary text-secondary font-medium text-sm px-3 py-2.5 flex items-center cursor-pointer"
            >
              <img src="/subHeader/menu-market.png" className="w-4 h-4 mr-3" />
              <span>Multi Market</span>
            </div>
            
            {SPORTSCONSTANT?.map((menuItem, index) => {
              const sport = filteredData?.find(
                (sport) => sport.sportId.toString() === menuItem.count
              );
              return (
                <div key={index} className="text-[#343435] bg-white">
                  <div className="cursor-pointer border-b border-[#eceaea]">
                    <div
                      className="hover:bg-[#FFF6EE] hover:text-primary text-secondary font-medium text-sm px-3 py-2.5 flex justify-between items-center"
                      onClick={(e) => handleClick(index, e)}
                    >
                      <div className="flex items-center">
                        <img src={menuItem.icon} alt={menuItem.text} className="w-4 h-4 mr-3" />
                        <span>{menuItem.text}</span>
                      </div>
                      {!(menuItem.text === "Casino" || menuItem.text === "Sports Book") && (
                        openKeys.includes(index) ? (
                          <BiUpArrow className="w-3 h-3" />
                        ) : (
                          <BiDownArrow className="w-3 h-3" />
                        )
                      )}
                    </div>
                    
                    {sport && openKeys.includes(index) && (
                      <div className="divide-y divide-[#f1f1f1] bg-[#f6f9ff]">
                        {sport?.series.map((series, seriesIndex) => (
                          <div key={seriesIndex} className="cursor-pointer border-b border-[#eceaea]">
                            <div
                              className="hover:bg-[#FFF6EE] hover:text-primary text-secondary font-medium text-sm px-3 py-2.5 flex justify-between items-center"
                              onClick={(e) => handleClick1(index, seriesIndex, e)}
                            >
                              <span className="truncate px-2">{series.seriesName}</span>
                              {openKeys1[`${index}-${seriesIndex}`] ? (
                                <BiUpArrow className="w-3 h-3" />
                              ) : (
                                <BiDownArrow className="w-3 h-3" />
                              )}
                            </div>

                            {openKeys1[`${index}-${seriesIndex}`] && (
                              <div>
                                {series.data.length > 0 ? (
                                  <ul className="divide-y divide-[#f1f1f1]">
                                    {series.data.map((item) => (
                                      <li
                                        key={item._id}
                                        className="bg-[#f6f9ff] text-xs font-medium py-2 pl-8 text-[#343435] hover:text-primary flex items-center cursor-pointer"
                                        onClick={() => {
                                          window.location.href = `/sport-view/${item.marketId}/${item.eventId}`;
                                          onClose();
                                        }}
                                      >
                                        <span className="truncate">{item.matchName}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div className="py-2 px-4 text-xs text-gray-500 italic">
                                    No Match available!
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="hover:bg-[#FFF6EE] hover:text-primary text-secondary font-medium text-sm px-3 py-2.5 flex items-center cursor-pointer">
              <img src="/subHeader/wp.png" className="w-4 h-4 mr-3" />
              <span>Whatsapp Support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileView;