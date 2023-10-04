import React from 'react';
import ContactList from './ContactList';

function HomePage( {accessToken} ) {
  return (
      <div>
        <ContactList accessToken={accessToken}/>
      </div>
  );
}

export default HomePage;
