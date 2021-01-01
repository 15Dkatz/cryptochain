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
    <div className='Block'>
      <p>Hash: {hashDisplay}</p>
      <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
      <div>
        {
          data.map(transaction =>
            <div key={transaction.id}>
              <Transaction transaction={transaction} />
            </div>
          )
        }
        <Button
          size='sm'
          onClick={() => setDisplayTransaction(!displayTransaction)}
        >Show less</Button>
      </div>
    </div>
  );

  return(
    <div className='Block'>
      <p>Hash: {hashDisplay}</p>
      <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
      <div>
        <p>Data: {dataDisplay}</p>
        <Button
          variant='info'
          size='sm'
          onClick={() => setDisplayTransaction(!displayTransaction)}
        >Show more</Button>
      </div>
    </div>
  );
};

export default Block;
