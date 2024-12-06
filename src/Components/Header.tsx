import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#bd7415', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/">
      <h1 style={{ fontSize: '48px', color: '#61dafb' }}>The Very Cool Career Quiz</h1>
        <button>Go to Home</button>
      </a>
    </header>
  );
};

export default Header;
