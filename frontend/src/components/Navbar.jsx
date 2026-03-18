import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">PalatePro</Link>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        
        <Link to="/cart" className="cart-icon-wrapper">
          <FiShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to={user.is_admin ? "/admin" : "/dashboard"} className="cart-icon-wrapper" title="Dashboard">
              <FiUser />
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.95rem' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
