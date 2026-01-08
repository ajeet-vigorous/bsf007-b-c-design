import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCasinoListByCateogeory } from "../../../redux/reducers/user_reducer";

function LiveCasino({ name, data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryWiseCasinoList, setCategoryWiseCasinoList] = useState([]);
    const { getCasinoListByCateogeoryData, loading } = useSelector((state) => state.user);
    const handleResponseCasino = (product) => {
        
        if (product?.gameId) {
            localStorage.getItem("token")
                ? navigate(`/iframe-casino-new/${product?.providerName}/${product?.gameId}`)
                : localStorage.setItem("unauthorized", true);

        } else {
            if (!product.shortName || !product.eventId) return;
            localStorage.getItem("token")
                ? navigate(`/${product.shortName}/${product.eventId}`)
                : localStorage.setItem("unauthorized", true);
        }
    };



    useEffect(() => {
        const reqData = { category: "Live casino" };
        dispatch(getCasinoListByCateogeory(reqData));
    }, [dispatch]);

  
    useEffect(() => {
        if (getCasinoListByCateogeoryData) {
            setCategoryWiseCasinoList(getCasinoListByCateogeoryData);
        }
    }, [getCasinoListByCateogeoryData]);

//     const sortedList = data?.filter(item => item.priority !== 0)
//     .sort((a, b) => b.priority - a.priority);

// const finalList = [
//     ...data?.filter(item => item.priority === 0),
//     ...sortedList
// ];
    

    return (
        <div>
            <div className="rounded-md my-4 pb-2 border border-secondary">
                <div className="flex bg-secondary justify-between items-center mb-2 px-3 py-1">
                    <h2 className="text-black md:text-[14px] text-[12px] font-bold">{name}</h2>
                </div>

                <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    loop={true}
                    grabCursor={true}
                    className="px-2 "
                >
                    {data?.map((item, idx) => {
                        return (
                            <SwiperSlide key={idx} className="!w-auto">
                                <img
                                    onClick={() => handleResponseCasino(item)}
                                    src={item?.urlThumb}
                                    alt={item.gameName}
                                    className="md:w-32 w-24 md:h-32 h-24 object-cover rounded-lg"
                                />
                            </SwiperSlide>

                        )
                    })}
                </Swiper>
            </div>
        </div>
    );
}

export default LiveCasino;