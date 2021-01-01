import React, { useState } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { openWallet } from '../../redux/features/wallet/walletSlice';

const CreateWallet = () => {

  const dispatch = useDispatch();
  const [hasPrivateKey, setHasPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState('');

  if(!hasPrivateKey) return (
    <div className='CreateWallet'>
      <Button
        variant='info'
        size='sm'
        onClick={() => setHasPrivateKey(true)}
      >I have a private key</Button>
      <Button
        variant='danger'
        size='sm'
        onClick={() => dispatch(openWallet({}))}
      >Go</Button>
    </div>
  );

  return(
    <div className='CreateWallet'>
      <Form>
        <FormLabel>Private Key</FormLabel>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='provide key to regenerate wallet'
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
          />
        </FormGroup>
        <Button
          variant='info'
          size='sm'
          onClick={() => setHasPrivateKey(false)}
        >I haven't got private key</Button>
        <Button
          variant='danger'
          size='sm'
          onClick={() => dispatch(openWallet({ privateKey }))}
        >Go</Button>
      </Form>
    </div>
  );
};

export default CreateWallet;
