import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ ...props }) => {
  return(
    <div id='wrapper'>
      <Header isLogged={props.isLogged}/>
        <Jumbotron id='main'>
          { props.children }
        </Jumbotron>
      <Footer />
    </div>
  );
}

export default Layout;
