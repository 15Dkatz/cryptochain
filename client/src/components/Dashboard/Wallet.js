import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { walletAPI } from '../../services';

const Wallet = () => {
  const [walletInfo, setWalletInfo] = useState({});
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if(mounted.current) walletAPI.fetchWalletInfo().then(json => setWalletInfo(json));

    return () => {
      mounted.current = false;
    };
  }, [walletInfo.balance]);

  return (
    <div className='Wallet'>
      <p>Address : {walletInfo.address}</p>
      <p>Balance : {walletInfo.balance}</p>
    </div>
  );
};

export default Wallet;
