import { useEffect, useState } from 'react';
import { casinoListJson } from '../../config/global';
import { useNavigate } from 'react-router-dom';

const CasinoList = () => {
    const [casinoList, setCasinoList] = useState([]);
    const navigate = useNavigate();
    const handleResponseCasino = (product) => {
        navigate(`/casino/${product.shortName}/${product.eventId}`)
    }

    useEffect(() => {
    
        setCasinoList(casinoListJson);
    }, []);
    //  useEffect(() => {
    //     const diamondCasinos = casinoListJson.filter(casino => casino.diamondCasino === true);
    //     setCasinoList(diamondCasinos);
    // }, []);

    return (
        <section className='py-0'>
            <div className="w-[100%] grid grid-cols-3 2xl:grid-cols-10 lg:grid-cols-6 p-1 md:grid-cols-4 2xl:gap-y-1.5 2xl:gap-x-[2px] lg:gap-y-2 lg:gap-x-1 gap-y-2 gap-x-1 py-1">
                {casinoList?.map((product, index) => (
                    <div key={index} onClick={() => handleResponseCasino(product)} className="shadow-lg relative shadow-white duration-500 sm:w-full sm:h-[150px] lg:w-full lg:h-[160px] w-full h-[100px] " style={{ backgroundImage: `url(${product.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <span className="block w-full h-full cursor-pointer">
                            <div className="px-2 py-1 rounded-sm  absolute -bottom-1 w-full shadow-lg bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]" >
                                <p className="md:text-xs text-[8px] font-[600] text-white truncate flex items-center justify-center uppercase">{product.title}</p>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CasinoList;
