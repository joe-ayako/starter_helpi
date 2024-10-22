import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/">
        <button>Go to Home</button>
      </a>
    </header>
  );
};

export default Header;