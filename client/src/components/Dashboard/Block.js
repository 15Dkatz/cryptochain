import React, { useState } from 'react';
import Transaction from './Transaction';
import { Button } from 'react-bootstrap';

const Block = ({ block }) => {

  const [displayTransaction, setDisplayTransaction] = useState(false);
  const { timestamp, hash, data } = block;
  const hashDisplay = `${hash.substring(0, 15)}...`;
  const stringifiedData = JSON.stringify(data);
  const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;


  if(displayTransaction) return(
    <div className='Block transform transform-active'>
      <p>Hash: {hashDisplay}</p>
      <Button
        size='sm'
        onClick={() => setDisplayTransaction(!displayTransaction)}
      >Timestamp: {new Date(timestamp).toLocaleString()}</Button>
      <div>
        {
          data.map(transaction =>
            <div key={transaction.id}>
              <Transaction transaction={transaction} />
            </div>
          )
        }
      </div>
    </div>
  );

  return(
    <div className='Block transform'>
      <p>Hash: {hashDisplay}</p>
      <Button
        variant='info'
        size='sm'
        onClick={() => setDisplayTransaction(!displayTransaction)}
      >Timestamp: {new Date(timestamp).toLocaleString()}</Button>
      <div>
        <p>Data: {dataDisplay}</p>
      </div>
    </div>
  );
};

export default Block;
