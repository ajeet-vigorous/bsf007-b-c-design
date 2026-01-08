import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// const CasinoSlider = ({ data }) => {
//     const CustomPrevArrow = ({ onClick }) => (
//         <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white"
//             onClick={onClick}>
//             <FaChevronLeft size={18} />
//         </div>
//     );

//     const CustomNextArrow = ({ onClick }) => (
//         <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white"
//             onClick={onClick}
//         >
//             <FaChevronRight size={18} />
//         </div>
//     );

//     const settings = {
//         // dots: true,
//         autoplay: true,
//         autoplaySpeed: 2500,
//         arrows: true,
//         centerMode: false,
//         slidesToShow: 1,
//         slidesToScroll: 1.5,
//         nextArrow: <CustomNextArrow />,
//         prevArrow: <CustomPrevArrow />,
//         responsive: [
//             {
//                 breakpoint: 2560,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                     autoplay: true,
//                     infinite: true,

//                 }
//             },
//             {
//                 breakpoint: 1440,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                     autoplay: true,
//                     infinite: true,

//                 }
//             },
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                     autoplay: true,
//                     infinite: true,

//                 }
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                     autoplay: true,
//                     initialSlide: 3
//                 }
//             },
//             {
//                 breakpoint: 480,
//                 settings: {
//                     slidesToShow: 1,
//                     autoplay: true,
//                     slidesToScroll: 1
//                 }
//             }
//         ]
//     };

//     return (
//         <>
//             <section className="">
//                 <div className='text-[13px] font-bold text-[--secondary] bg-[--primary] flex items-center px-2 uppercase rounded-t-[4px] h-[32px]'>Featured Games</div>
//                 <Slider {...settings}>
//                     {data?.map((item, index) => (
//                         <div key={index} className="cursor-pointer">
//                             <a
//                                 className='flex gap-4'>
//                                 <img src={item.gameImg} alt={item.gameName} className='px-0 h-[141px] min-h-[141px] object-cover w-full' />
//                             </a>
//                         </div>
//                     ))}
//                 </Slider>
//             </section>
//         </>
//     )
// }
// export default CasinoSlider;



import React from "react";
// import Slider from "react-slick";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

export default function CasinoSlider() {
    const games = [
        {
        title: "Cricket : ICC Women's Cricket World Cup",
        team1: "Australia W",
        team2: "India W",
        status: "Inplay",
        bg: "/images/stadium-bg.jpg", // replace with your background image
        },
        {
        title: "Football : Premier League",
        team1: "Chelsea",
        team2: "Liverpool",
        status: "Upcoming",
        bg: "/images/stadium-bg.jpg",
        },
    ];

    const settings = {
        dots: false,
        autoplay: true,
        autoplaySpeed: 2500,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-[--secondary] hover:text-white">
            <IoChevronBack size={22} />
        </div>
        ),
        nextArrow: (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-[--secondary] hover:text-white">
            <IoChevronForward size={22} />
        </div>
        ),
    };

    return (
        <div className="bg-[--primary] text-white rounded-sm w-full relative">
        <div className="flex justify-between items-center h-[32px] px-3">
            <h3 className="text-[14px] font-semibold uppercase text-[--secondary]">
            Featured Games
            </h3>
            <div className="flex items-center gap-1 text-[12px]">
            <span className="text-[--secondary] font-bold flex gap-2 items-center"><MdKeyboardArrowLeft className='w-[18px] h-[18px] cursor-pointer' />1 / 2 <MdKeyboardArrowRight className='w-[18px] h-[18px] cursor-pointer' /></span>
            </div>
        </div>

        <Slider {...settings}>
            {games.map((game, index) => (
            <div
                key={index}
                className="relative rounded w-full overflow-hidden h-[141px]"
            >
                <img
                // src={game.bg}
                src='/images/zetto/bg2.jpg'
                alt={game.title}
                className="w-full h-full object-cover opacity-60"
                />

                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className='flex justify-between items-start p-2'>
                    <div className='flex flex-col'>
                        <div className="text-[12px] w-[180px] text-wrap font-bold">
                        {game.title}
                        </div>
                        <div className="text-[12px] font-bold">
                            {game.team1}
                        </div>
                    </div>
                    <div className="flex gap-2">
                    <span className="bg-[--primary] text-[--secondary] text-[11px] font-semibold px-2 py-0.5 rounded">
                        {game.status}
                    </span>
                    </div>
                </div>

                <div className="text-[12px] text-gray-300 p-2 font-medium">
                    <div>{game.team1}</div>
                    <div>{game.team2}</div>
                </div>

                <div className="absolute top-[50px] right-[45px] flex gap-1">
                    <button className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    F
                    </button>
                    <button className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    B
                    </button>
                </div>
                </div>
            </div>
            ))}
        </Slider>
        </div>
    );
}
