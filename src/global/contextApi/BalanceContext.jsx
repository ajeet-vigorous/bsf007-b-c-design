
import React, { createContext, useState, useEffect, useContext } from 'react';

import { domainName } from '../../config/Auth';
import { getSocket, initSocket } from '../socket/SocketConn';


const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState({
    coins: JSON.parse(localStorage.getItem("wallet-balance")) || "",
    exposure: JSON.parse(localStorage.getItem("wallet-exposure")) || ""
  });


  useEffect(() => {
    
    function updateSocket() {
      let userID = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
      let token_Id = userID?.token;
      let socket = getSocket();

      if (!socket || socket == null) {
        socket = initSocket(token_Id);
 
        const loginData = {
          userId: userID?.data?.userId,
          token: token_Id,
        };
        socket.emit(`login`, loginData);
      }
     
      socket.on("coinUpdate", (data) => {
        localStorage.setItem("wallet-balance", JSON.stringify(data.coins));
        localStorage.setItem("wallet-exposure", JSON.stringify(data.exposure));
        setBalance({
          coins: data.coins,
          exposure: data.exposure,
        });
      });

    }
    updateSocket();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  return useContext(BalanceContext);
};
