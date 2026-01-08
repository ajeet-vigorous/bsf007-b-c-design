import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/reducers/user_reducer";
import { Carousel } from "antd";

function Banner() {
  let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

  return (
    <>
      <div className={` text-black font-semibold w-full rounded-md mb-2 md:mb-0 `}>

        <div className=" overflow-hidden">
          {domainSetting?.banner?.length > 3 ? (
            <Carousel autoplay speed={200} className="banner-carousel  z-[1]">
              {domainSetting.banner
                ?.sort((a, b) => a.priority - b.priority)
                ?.map((req, index) => (
                  <div key={index} className="border-0 rounded-[8px] h-[150px] md:h-60">
                    {req?.url ? (
                      <a href={req.url}>
                        <img
                          src={req.image}
                          alt={req.name}
                          className="block h-60 w-full rounded-[8px] "
                         
                        />
                      </a>
                    ) : (
                      <img
                        src={req.image}
                        alt={req.name}
                        className="block h-[150px] md:h-60 w-full rounded-[3px]"
                      />
                    )}
                  </div>
                ))}
            </Carousel>
          ) : (
            <Carousel autoplay speed={200} className="banner-carousel  z-[1]">
              <img
                src="/images/zetto/banner1.webp"
                alt=""
                className="md:h-[300px] rounded-[8px] h-36 w-full "
              />
              <img
                src="/images/zetto/banner2.webp"
                alt=""
                className="md:h-[300px] rounded-[8px] h-36 w-full "
              />
            </Carousel>
          )}
        </div>

      </div>
    </>
  );
}

export default Banner;