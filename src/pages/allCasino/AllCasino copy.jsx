import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGroupCasinoList from "../../component/IntGroupCasinoList/IntGroupCasinoList";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { getCasinoListByCateogeory, getCasinoListByProviderName } from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";
import SlotBanner from "../../component/SlotBanner/SlotBanner";
import LoginPopUp from "../../component/LoginPopUp/LoginPopUp"; // 👈 Import your login popup
import Login from "../../component/login/Login";

function AllCasino() {
    const [providerWiseCasinoList, setProviderWiseCasinoList] = useState([]);
    const [isCasinoModal, setIsCasinoModal] = useState(false);
    const [isLoginModal, setIsLoginModal] = useState(false); // 👈 New state for login modal
    const [categories, setCategories] = useState([]);
    const [categoryWiseCasinoList, setCategoryWiseCasinoList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const groupCasinoList = useGroupCasinoList();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const { getCasinoListByProviderNameData, loading, getCasinoListByCateogeoryData } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    // ✅ Modify navigation logic to include login popup
    const handleResponseCasino = (product) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoginModal(true); // 👈 show login popup
            return;
        }

        if (product?.gameId) {
            navigate(`/iframe-casino-new/${product?.providerName}/${product?.gameId}`);
        } else {
            if (!product.shortName || !product.eventId) return;
            navigate(`/${product.shortName}/${product.eventId}`);
        }
    };

    // other useEffects same as before ...
    useEffect(() => {
        if (getCasinoListByProviderNameData && getCasinoListByProviderNameData !== providerWiseCasinoList) {
            setProviderWiseCasinoList(getCasinoListByProviderNameData);
        }
    }, [getCasinoListByProviderNameData, providerWiseCasinoList]);

    useEffect(() => {
        if (getCasinoListByProviderNameData) {
            setProviderWiseCasinoList(getCasinoListByProviderNameData);
            const uniqueCategories = [...new Set(getCasinoListByProviderNameData?.map(item => item.category))];
            console.log(getCasinoListByProviderNameData, "uniqueCategoriesuniqueCategories");
            
            setCategories(uniqueCategories);
        }
    }, [getCasinoListByProviderNameData]);

    useEffect(() => {
        if (selectedCategory) {
            const reqData = { category: selectedCategory };
            dispatch(getCasinoListByCateogeory(reqData));
        }
    }, [dispatch, selectedCategory]);

    useEffect(() => {
        if (getCasinoListByCateogeoryData) {
            setCategoryWiseCasinoList(getCasinoListByCateogeoryData);
        }
    }, [getCasinoListByCateogeoryData]);

    useEffect(() => {
        if (groupCasinoList?.providerList?.length && !selectedProvider) {
            setSelectedProvider("All");
            const firstProvider = groupCasinoList.providerList[0];
            if (firstProvider) {
                dispatch(getCasinoListByProviderName({ provider: firstProvider }));
            }
            setIsCasinoModal(true);
        }
    }, [groupCasinoList, selectedProvider, dispatch]);

    useEffect(() => {
        if (getCasinoListByProviderNameData?.length) {
            const uniqueCategories = [...new Set(getCasinoListByProviderNameData.map(item => item.category))];
            setCategories(uniqueCategories);
            if (!selectedCategory && uniqueCategories.length) {
                setSelectedCategory(uniqueCategories[0]);
            }
        }
    }, [getCasinoListByProviderNameData]);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== "All") {
            dispatch(getCasinoListByCateogeory({ category: selectedCategory }));
        }
    }, [selectedCategory, dispatch]);

    const sortedList = categoryWiseCasinoList?.filter(item => item.priority !== 0)
        .sort((a, b) => b.priority - a.priority);

    const finalList = [
        ...categoryWiseCasinoList?.filter(item => item.priority === 0),
        ...sortedList
    ];

    return (
        <>
            {isLoginModal && <Login onClose={() => setIsLoginModal(false)} />} {/* 👈 show modal */}

            <div className="w-full min-h-screen max-w-4xl mx-auto">
                <SlotBanner />
                <input placeholder="Search Games" className="px-3 block md:hidden focus:outline-none bg-transparent border border-gray-500 w-full my-4 h-[34px] rounded-[5px]" type="text" />

                <div className="my-1">
                    <div className="flex justify-start items-center overflow-x-auto ">
                        {["All", ...(groupCasinoList?.providerList || [])]?.map((item, idx) => {
                            const isSelected = selectedProvider === item;
                            return (
                                <div key={idx} className="!w-auto flex-shrink-0 cursor-pointer" onClick={() => handlProviderCasinoList(item)}>
                                    <div className="text-black text-[14px] flex justify-center items-center">
                                        <div
                                            className={`text-black px-5 rounded-t-[5px] py-1 flex justify-center items-center border-b border-gray-200 hover:bg-[var(--secondary)]  ${isSelected ? 'md:bg-[var(--secondary)] font-[400]' : 'bg-transparent font-[400] !text-black'}`}
                                        >
                                            {item}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    {loading ? <Loader /> :
                        <>
                            <div className="flex">
                                <div className="flex justify-start items-center overflow-x-auto">
                                    {categories?.map((category, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 w-fit h-10 rounded-t-[5px] whitespace-nowrap flex justify-center items-center text-sm uppercase ${selectedCategory === category ? 'bg-[var(--secondary)] text-black' : 'bg-transparent text-black'}`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                <input placeholder="Search Games" className="px-3 hidden md:block focus:outline-none ms-3 bg-transparent border border-gray-500 min-w-[200px] h-[34px] rounded-[5px]" type="text" />
                            </div>

                            {isCasinoModal && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-5 gap-1 md:px-0 px-1 pt-1 pb-4">
                                    {finalList?.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center md:gap-2 relative w-full">
                                            <div
                                                onClick={() => handleResponseCasino(item)} // ✅ Checks token before navigation
                                                className="relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                                            >
                                                <img
                                                    src={item?.urlThumb}
                                                    alt={item?.gameName}
                                                    className="w-full rounded-lg object-cover min-h-[175px] max-h-[175px] md:min-h-[230px] md:max-h-[230px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default AllCasino;
