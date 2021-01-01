import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Auth = () => {
  const [hasAccount, setHasAccount] = useState(false);

  if(hasAccount) return(
    <div className='Home'>
      <SignIn>
        <Button
          variant='info'
          size='sm'
          onClick={e => setHasAccount(!hasAccount)}
        >Register</Button>
      </SignIn>
    </div>
  );

  return(
    <div className='Home'>
      <SignUp>
        <Button
          variant='info'
          size='sm'
          onClick={e => setHasAccount(!hasAccount)}
        >Already have an account</Button>
      </SignUp>
    </div>
  );
};

export default Auth;
