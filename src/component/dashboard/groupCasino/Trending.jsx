import { useNavigate } from "react-router-dom";


function Trending({ name, data }) {
    const navigate = useNavigate();

    const handleResponseCasino = (product) => {
      navigate(`/iframe-casino-new/${product?.product}/${product?.id}`)
    };


    return (
    <section>
  <div>
    <div className="text-white text-[16px] font-bold leading-none px-3 h-[29px] flex justify-start items-center uppercase bg-[var(--primary)]">
      <h2 className="textAnime tracking-tight">NEW LAUNCH</h2>
    </div>

    <div className="grid grid-cols-3 gap-0.5 py-0.5">


      {data?.sort((a, b) => a.position - b.position).map((item, idx) => (
        <div
          key={idx}
          onClick={() => handleResponseCasino(item)}
          className="relative cursor-pointer"
        >
          <div className="w-full">
            <img
              src={`https://speedcdn.io/${item?.url_thumb}`}
              alt={item?.name}
              className="w-full md:h-[170px] h-[80px]"
            />
            
          </div>
 <p className="text-white py-1 text-[10px] md:text-xs font-semibold truncate  text-center uppercase bottom-0 w-full bg-gradient-to-b from-[var(--primary)] to-[#00FFE6]">
              {item?.name}
            </p>
         
        </div>
      ))}
    </div>
  </div>
</section>

    );
}

export default Trending;