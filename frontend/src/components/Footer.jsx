import React from 'react';

const Footer = () => {
  return (
    <footer>
      <h3 className="nav-brand" style={{ marginBottom: '15px', display: 'inline-block' }}>PalatePro</h3>
      <p style={{ color: 'var(--text-muted)' }}>Delivering culinary excellence directly to your door.</p>
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} PalatePro. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
