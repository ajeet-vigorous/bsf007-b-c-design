


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGroupCasinoList from "../../component/IntGroupCasinoList/IntGroupCasinoList";
import { useDispatch, useSelector } from "react-redux";
import {
  getCasinoListByCateogeory,
  getCasinoListByProviderName,
} from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";
import SlotBanner from "../../component/SlotBanner/SlotBanner";
import LoginPopUp from "../../component/LoginPopUp/LoginPopUp";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Login from "../../component/login/Login";

function AllCasino() {
  const [providerWiseCasinoList, setProviderWiseCasinoList] = useState([]);
  const [isCasinoModal, setIsCasinoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryWiseCasinoList, setCategoryWiseCasinoList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const groupCasinoList = useGroupCasinoList();
  const [selectedProvider, setSelectedProvider] = useState("All");
  const { getCasinoListByProviderNameData, loading, getCasinoListByCateogeoryData } =
    useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sliderRefs = useRef([]); // ✅ useRef array for all sliders

  const handleResponseCasino = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginModal(true);
      return;
    }
    if (product?.gameId) {
      navigate(`/iframe-casino-new/${product?.providerName}/${product?.gameId}`);
    }
  };

  const handlProviderCasinoList = (value) => {
    setSelectedProvider(value);
    setIsCasinoModal(true);
    if (value === "All") {
      const firstProvider = groupCasinoList?.providerList?.[0];
      if (firstProvider) {
        dispatch(getCasinoListByProviderName({ provider: firstProvider }));
      }
    } else {
      dispatch(getCasinoListByProviderName({ provider: value }));
    }
  };

  useEffect(() => {
    if (
      getCasinoListByProviderNameData &&
      getCasinoListByProviderNameData !== providerWiseCasinoList
    ) {
      setProviderWiseCasinoList(getCasinoListByProviderNameData);
    }
  }, [getCasinoListByProviderNameData, providerWiseCasinoList]);

  // ✅ Category निकालना (नाम + icon)
  useEffect(() => {
    if (getCasinoListByProviderNameData?.length) {
      const categoryMap = {};
      getCasinoListByProviderNameData.forEach((item) => {
        const cat = item.category;
        if (cat && !categoryMap[cat]) {
          categoryMap[cat] = {
            name: cat,
            icon: item.categoryIcon || item.urlThumb || null,
          };
        }
      });
      const uniqueCategories = Object.values(categoryMap);
      setCategories(uniqueCategories);
    }
  }, [getCasinoListByProviderNameData]);

  // ✅ Category click → fetch data
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      const reqData = { category: selectedCategory };
      dispatch(getCasinoListByCateogeory(reqData));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    if (getCasinoListByCateogeoryData) {
      setCategoryWiseCasinoList(getCasinoListByCateogeoryData);
    }
  }, [getCasinoListByCateogeoryData]);

  // ✅ Default load
  useEffect(() => {
    if (groupCasinoList?.providerList?.length && !providerWiseCasinoList.length) {
      const firstProvider = groupCasinoList.providerList[0];
      if (firstProvider) {
        dispatch(getCasinoListByProviderName({ provider: firstProvider }));
      }
      setIsCasinoModal(true);
    }
  }, [groupCasinoList, providerWiseCasinoList, dispatch]);

  // ✅ Search Filter
  const filteredList = providerWiseCasinoList?.filter((item) =>
    item?.gameName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  // 🔹 Horizontal scroll function
  const scroll = (index, direction) => {
    const ref = sliderRefs.current[index];
    if (ref) {
      const scrollAmount = direction === "left" ? -400 : 400;
      ref.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>
      {isLoginModal && <Login onClose={() => setIsLoginModal(false)} />}

      <div className="w-full min-h-screen max-w-6xl mx-auto px-2 md:px-4">
        <SlotBanner />
         <div className="relative block md:hidden my-4">
          {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
          <input
            type="text"
            placeholder="Search Games"
            className="pl-4 pr-3 py-2 border border-gray-400 bg-transparent rounded-md w-full text-sm text-black focus:outline-none"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 🔍 Provider Tabs + Search */}
        <div className="flex justify-between items-center my-3">
          <div className="flex overflow-x-auto gap-2 border-b border-gray-300 text-[12px]">
            {["All", ...(groupCasinoList?.providerList || [])]?.map((item, idx) => {
              const isSelected = selectedProvider === item;
              return (
                <div
                  key={idx}
                  className="!w-auto flex-shrink-0 cursor-pointer"
                  onClick={() => handlProviderCasinoList(item)}
                >
                  <div
                    className={`px-5 py-1 rounded-t border ${
                      isSelected
                        ? "bg-[var(--primary)] text-white"
                        : "text-black"
                    }`}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>

          
        </div>

        {/* 🔹 Category Tabs */}
        <div className="flex text-[12px] justify-between border-b border-gray-300 items-center">
                <div className="flex md:w-[80%] justify-start items-center  overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-1  rounded-t  whitespace-nowrap flex justify-center items-center text-[12px] ${
              selectedCategory === "All"
                ? "bg-[var(--primary)] text-white"
                : "bg-transparent text-black"
            }`}
          >
            All
          </button>

          {categories?.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 rounded-t-[5px]  whitespace-nowrap flex justify-center items-center uppercase ${
                selectedCategory === cat.name
                  ? "bg-[var(--primary)] text-white"
                  : "bg-transparent text-black"
              }`}
            >
              {cat.icon && (
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-7 h-7 mr-2 rounded-full object-contain"
                />
              )}
              {cat.name}
            </button>
          ))}
          </div>

 <div className="relative hidden md:block">
                  {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
                  <input
                    type="text"
                    placeholder="Search Games"
                    className="pl-4 py-1 ms-3 border border-gray-400 bg-transparent rounded min-w-[200px] text-sm text-black focus:outline-none"
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
         
        </div>

        {/* 🔹 Main Content */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* ✅ All Categories as Sliders */}
            {selectedCategory === "All" ? (
              <>
                {categories?.map((cat, cidx) => {
                  const catGames = filteredList?.filter(
                    (g) => g.category === cat.name
                  );
                  if (!catGames?.length) return null;
                  return (
                    <div key={cidx} className="my-3 relative">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-2 px-1">
                        <h2 className="text-[15px] font-semibold text-black tracking-wide flex items-center gap-2">
                          {/* {cat.icon && (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="w-6 h-6 object-contain rounded-sm"
                            />
                          )} */}
                          {cat.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCategory(cat.name)}
                            className="text-[12px] text-[var(--secondary)] bg-[var(--primary)] py-0.5 leading-0 px-2 rounded hover:underline"
                          >
                            View All
                          </button>
                          <div className="flex gap-1">
                            <button
                              onClick={() => scroll(cidx, "left")}
                              className="p-1 !bg-[var(--primary)] rounded text-white hover:bg-gray-300"
                            >
                              <FaChevronLeft size={14} />
                            </button>
                            <button
                              onClick={() => scroll(cidx, "right")}
                              className="p-1 !bg-[var(--primary)]  rounded text-white hover:bg-gray-300"
                            >
                              <FaChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Slider */}
                      <div
                        ref={(el) => (sliderRefs.current[cidx] = el)}
                        className="flex md:gap-2 gap-1 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
                      >
                        {catGames.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex-shrink-0 w-[120px] md:w-[180px] cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => handleResponseCasino(item)}
                          >
                            

                            <div className="relative w-full md:h-[230px] h-[175px]">
  <img
    src={item?.urlThumb}
    alt={item?.gameName}
    className="w-full h-full object-cover rounded-md"
  />
</div>

                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              /* ✅ Category specific grid view */
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-5 gap-1 md:px-0 px-1 pt-1 pb-4">
                {categoryWiseCasinoList?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center md:gap-2 relative w-full"
                  >
                    <div
                      onClick={() => handleResponseCasino(item)}
                      className="relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                    >
                                                  <div className="relative w-full md:h-[230px] h-[175px]">
  <img
    src={item?.urlThumb}
    alt={item?.gameName}
    className="w-full h-full object-cover rounded-md"
  />
</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AllCasino;