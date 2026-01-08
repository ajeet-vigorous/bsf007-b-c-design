import React, { useState, useEffect } from 'react';
const BlinkingComponent = ({ price, size, color, hoverColor }) => {
    const [blink, setBlink] = useState(false);

    const [prevPrice, setPrevPrice] = useState(price);
    const [prevSize, setPrevSize] = useState(size);

    useEffect(() => {
        if (price !== prevPrice || size !== prevSize) {
            setBlink(true);
            const timeout = setTimeout(() => {
                setBlink(false);
                setPrevPrice(price);
                setPrevSize(size);
                setBlink(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [price, prevPrice, prevSize, color, hoverColor]);
    return (

        <div className={`border-x h-[40px] lg:h-[33px] rounded-[4px] border-gray-300 py-1 px-2 flex justify-center items-center ${blink ? `bg-[var(--blink-color)]` : `${color}`}`}>
            <div className='text-center h-full flex flex-col justify-center items-center leading-tight'>
                <span className="text-[15px] text-gray-800 font-bold">{price ? price : "-"}</span>
                <span className="text-[9px] text-gray-900">{size ? size : null}</span>
            </div>
        </div>
    );
};

export default BlinkingComponent;