import React, { useEffect, useState } from 'react';

const BetPlaceCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 100) {
          clearInterval(interval);
          return prevCount;
        }
        return prevCount + 1;
      });
    }, 500);

    return () => clearInterval(interval); 
  }, []);

  return (<h1 className='font-bold text-[32px] text-[--primary] '>{count}</h1>);
};

export default BetPlaceCounter;