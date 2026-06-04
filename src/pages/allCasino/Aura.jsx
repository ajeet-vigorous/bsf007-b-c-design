import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import {SlHeart } from "react-icons/sl";
import { FaHome } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import { MdCasino } from 'react-icons/md';
import { apiCall } from '../../config/HTTP';

const bannerImages = [
    { id: 1, img: "/img/img1.webp", alt: "banner-1" },
    { id: 2, img: "/img/img2.webp", alt: "banner-2" },
    { id: 3, img: "/img/img3.webp", alt: "banner-3" },
    { id: 4, img: "/img/img1.webp", alt: "banner-4" },
];

const Aura = (item) => {
    const [auraGames, setAuraGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    // Selected category sub-tab inside the "Casino" tab.
    const [activeCategory, setActiveCategory] = useState("");
    const navigate = useNavigate()

    const categorySliderRefs = useRef({});

 
    const closeRulesModal = () => setIsRulesOpen({
        isOpen: false,
    });

    const storedBalance = JSON.parse(localStorage.getItem('wallet-balance'));
    useEffect(() => {
        const fetchCasinoList = async () => {
            let reqData = { provider: "AURA" };

            try {
                const response = await apiCall("POST", "website/getCasinoListByProviderName", reqData);
                if (response) {
                    setAuraGames(response?.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCasinoList();
    }, []);

    const groupedByCategory = auraGames.reduce((acc, game) => {
        const cat = game?.category || "Others";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(game);
        return acc;
    }, {});
    const categories = Object.keys(groupedByCategory);

    // Once games load, default the Casino sub-tab to the first category.
    useEffect(() => {
        if (!activeCategory && categories.length) setActiveCategory(categories[0]);
    }, [categories, activeCategory]);

    // The category whose games are shown in the Casino tab.
    const selectedCategory = activeCategory || categories[0];

    // Games whose category is "Crash" — shown in the Originals tab.
    const crashGames = auraGames.filter(
        (g) => (g?.category || "").toLowerCase().includes("crash")
    );

    const tabs = [
        { label: "Home", icon: <FaHome /> },
        { label: "Casino", icon: <MdCasino /> },
        { label: "Originals", icon: <MdCasino /> },
        { label: "Favourite", icon: <SlHeart /> },
    ];

    const openAuraGame = (game) => {
        navigate(`/iframe-casino-new/${game?.providerName}/${game?.gameId}`);
    };

    return (
        // <GlobalLayout>
        <>
            <style>{`
                    .aura-row-slider .slick-track { display: flex; margin-left: 0; }
                    .aura-row-slider .slick-slide { height: auto; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            <div className="bg-black/20 min-h-dvh">


                <div className="">

                    {activeTab === "Home" && (
                        <>
                            <section className="">
                                <Slider
                                    autoplay
                                    autoplaySpeed={3500}
                                    fade={true}
                                    speed={1000}
                                    cssEase="ease-in-out"
                                    arrows={false}
                                    dots={false}
                                    infinite={true}
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    pauseOnHover={false}
                                >
                                    {bannerImages.map((item) => (
                                        <div key={item.id} className="">
                                            <div className="relative">
                                                <img
                                                    src={item.img}
                                                    alt={item.alt}
                                                    className="w-full h-[160px] md:h-[80vh] object-cover object-top rounded"
                                                />
                                                {/* Bottom black gradient so the banner blends
                                                    into the black section below it */}
                                                <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                                                <button
                                                    type="button"
                                                    className="absolute bottom-0 right-0 w-fit md:left-14 md:bottom-40 
                                                    bg-[#FFFFFF]
                                                    text-[#924AAE]
                                                    font-extrabold text-sm md:text-base
                                                    px-4 py-2 md:px-6 md:py-3
                                                    rounded-full shadow-lg
                                                    transition-all duration-300 ease-out
                                                    hover:scale-[1.03]"
                                                >
                                                    Play Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </section>

                            <section className="relative  px-2 pb-6 -mt-0 md:-mt-24">
                                {loading && (
                                    <p className="text-white px-2 py-4">Loading games…</p>
                                )}

                                {!loading && categories.map((category) => (
                                    <div key={category} className="mb-6 xl:ps-6">
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <h2 className="text-white font-bold text-lg md:text-xl uppercase">
                                                {category}
                                            </h2>
                                            <div className="flex gap-2 md:pe-5">

                                                <button
                                                    type="button"
                                                    aria-label="Previous"
                                                    onClick={() => categorySliderRefs.current[category]?.slickPrev()}
                                                    className="w-[30px] h-[30px] flex items-center justify-center rounded-none text-white text-lg leading-none hover:bg-[#FFFFFF1A]"
                                                >
                                                    <SlArrowLeft className='w-[16px] h-[16px] md:w-[28px] md:h-[20px]' />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Next"
                                                    onClick={() => categorySliderRefs.current[category]?.slickNext()}
                                                    className="w-[30px] h-[30px] flex items-center justify-center rounded-none text-white text-lg leading-none hover:bg-[#FFFFFF1A]"
                                                >
                                                    <SlArrowRight className='w-[16px] h-[16px] md:w-[28px] md:h-[20px]' />
                                                </button>
                                            </div>
                                        </div>
                                        <Slider
                                            ref={(el) => { categorySliderRefs.current[category] = el; }}
                                            className="aura-row-slider"
                                            arrows={false}
                                            infinite={false}
                                            speed={400}
                                            slidesToShow={10}
                                            slidesToScroll={3}
                                            responsive={[
                                                { breakpoint: 1440, settings: { slidesToShow: 7, slidesToScroll: 3 } },
                                                { breakpoint: 1280, settings: { slidesToShow: 6, slidesToScroll: 2 } },
                                                { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 2 } },
                                                { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 2 } },
                                                { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                                            ]}
                                        >
                                            {groupedByCategory[category].map((game) => (
                                                <div key={game?._id} className="px-1">
                                                    <div
                                                        onClick={() => openAuraGame(game)}
                                                        className="shadow overflow-hidden border-2 border-[#2e230f] rounded w-full cursor-pointer relative "
                                                    >
                                                        <img
                                                            src={game?.urlThumb}
                                                            alt={game?.gameName}
                                                            className="w-full h-[200px] hover:scale-105 object-cover transition-transform duration-300 rounded-sm"
                                                            loading="lazy"
                                                        />
                                                        <div className='absolute top-0 left-0 z-20 flex gap-1 py-0.5 px-2 rounded-br-lg text-xs  /30'><HiUsers /> <span>{Math.floor(Math.random() * 100) + 1}</span></div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1">
                                                            <p className="text-white text-center text-[11px] md:text-xs font-semibold truncate">
                                                                {game?.gameName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                ))}

                                {!loading && categories.length === 0 && (
                                    <p className="text-white px-2 py-4">No games available.</p>
                                )}
                            </section>
                        </>
                    )}

                    {activeTab === "Casino" && (
                        <section className="px-2 py-3 text-white">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap px-[12px] py-[6px] rounded-full text-sm font-semibold capitalize transition-colors
                                            ${selectedCategory === cat
                                                ? "bg-white text-black"
                                                : " border !border-white/20  text-gray-300"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {loading && (
                                <p className="text-white px-2 py-4">Loading games…</p>
                            )}

                            {!loading && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-8 gap-2">
                                    {(groupedByCategory[selectedCategory] || []).map((game) => (
                                        <div key={game?._id} className="px-1">
                                            <div
                                                onClick={() => openAuraGame(game)}
                                                className="shadow relative overflow-hidden border-2 border-[#2e230f] rounded w-full cursor-pointer"
                                            >
                                                <img
                                                    src={game?.urlThumb}
                                                    alt={game?.gameName}
                                                    className="w-full h-[228px] hover:scale-105 object-cover transition-transform duration-300 rounded-sm"
                                                    loading="lazy"
                                                />
                                                <div className='absolute top-0 left-0 z-20 flex gap-1 py-0.5 px-2 rounded-br-lg text-xs /30'><HiUsers /> <span>{Math.floor(Math.random() * 100) + 1}</span></div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1">
                                                    <p className="text-white text-center text-[11px] md:text-xs font-semibold truncate">
                                                        {game?.gameName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && categories.length === 0 && (
                                <p className="text-white px-2 py-4">No games available.</p>
                            )}
                        </section>
                    )}

                    {activeTab === "Originals" && (
                        <section className="px-2 py-6 text-white">
                            {loading && (
                                <p className="text-white px-2 py-4">Loading games…</p>
                            )}

                            {!loading && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-8 gap-2 w-full lg:max-w-[90%] mx-auto">
                                    {crashGames.map((game) => (
                                        <div key={game?._id} className="px-1">
                                            <div
                                                onClick={() => openAuraGame(game)}
                                                className="shadow relative overflow-hidden border-2 border-[#2e230f] rounded w-full cursor-pointer"
                                            >
                                                <img
                                                    src={game?.urlThumb}
                                                    alt={game?.gameName}
                                                    className="w-full h-[228px] hover:scale-105 object-cover transition-transform duration-300 rounded-sm"
                                                    loading="lazy"
                                                />
                                                <div className='absolute top-0 left-0 z-20 flex gap-1 py-0.5 px-2 rounded-br-lg text-xs /30'><HiUsers /> <span>{Math.floor(Math.random() * 100) + 1}</span></div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1">
                                                    <p className="text-white text-center text-[11px] md:text-xs font-semibold truncate">
                                                        {game?.gameName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && crashGames.length === 0 && (
                                <p className="text-gray-400 text-sm px-2 py-4">No crash games available.</p>
                            )}
                        </section>
                    )}

                    {activeTab === "Favourite" && (
                        <section className="px-2 py-6 text-white flex flex-col justify-center items-center">
                            <img src="/img/favourite.gif" alt="" srcset="" />
                            <span class="text-slate-600 text-lg font-medium">No favorite games added.</span>
                        </section>
                    )}

                </div>



                <>
                    <div
                        onClick={() => setIsMenuOpen(false)}
                        className={`fixed top-[57px] left-0 right-0 bottom-0 /50 z-[10000] transition-opacity duration-300 ${isMenuOpen
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                            }`}
                    />

                    <div
                        className={`fixed top-[57px] right-0 h-[calc(100dvh-57px)] w-[320px]  z-[10001] border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${isMenuOpen
                            ? "translate-x-0"
                            : "translate-x-full"
                            }`}
                    >
                        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-800">
                            <div className="text-white text-[20px] font-bold">
                                Menu
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-white text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        

                        <div className="py-2">
                            <button className="w-full flex items-center gap-4 px-3 py-3 text-white hover:bg-white/10 transition">
                                ⛶
                                <span className="font-semibold">
                                    Fullscreen
                                </span>
                            </button>

                            <button className="w-full flex items-center gap-4 px-3 py-3 text-white hover:bg-white/10 transition">
                                🎫
                                <span className="font-semibold">
                                    Bet History
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            </div>
        </>
        // </GlobalLayout >
    );
};

export default Aura;
