import React from 'react';

const Footer = () => {
  return (
    <div
      className="text-dark p-4 text-center"
      style={{
        position: 'relative',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <img src="/wallet.png" alt="Logo" style={{ height: '30px' }} />
      <h6 style={{ margin: 0 }}>Expense Tracker</h6>
    </div>
  );
};

export default Footer;

