import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="./index">
        <button>Go to Home</button>
      </a>
    </header>
  );
};

export default Header;