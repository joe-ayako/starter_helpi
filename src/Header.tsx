import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#bd7415', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/">
        <h1> Career Cuisine</h1>
        <button>Go to Home</button>
      </a>
    </header>
  );
};

export default Header;