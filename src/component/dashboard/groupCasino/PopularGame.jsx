


import { useNavigate } from "react-router-dom";


function PopularGame({ name, data }) {
    const navigate = useNavigate();

    const handleResponseCasino = (product) => {
           navigate(`/iframe-casino-new/${product?.category_id}/${product?.id}`)
    };



    return (
        <section>
            <div className="pt-1">
                <div className="text-white text-[16px] font-bold leading-none px-3 h-[29px] flex justify-start items-center uppercase bg-[var(--primary)]">
                  <h2 className="textAnime tracking-tight">MY FAVOURITES</h2>
                </div>
                <div className="grid 2xl:grid-cols-6 md:grid-cols-5 grid-cols-3 gap-0.5 py-0.5">
       {data?.sort((a, b) => a.position - b.position)?.map((item, idx) => (
        <div
          key={idx}
          onClick={() => handleResponseCasino(item)}
          className="relative cursor-pointer"
        >
          <div className="w-full ">
            <img
             src={`${item?.image}`}
              alt={item?.name}
              className="w-full md:h-[110px] h-[80px]"
            />
           
          </div>
           <p className="text-white py-1  bottom-0 w-full bg-gradient-to-b from-[var(--primary)] to-[#00FFE6] text-[10px] md:text-xs font-semibold truncate text-center uppercase">
              {item?.name}
            </p>
        </div>
      ))}
    </div>
            </div>
        </section>
    );
}

export default PopularGame;