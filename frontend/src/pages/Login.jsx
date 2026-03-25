import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', is_restaurant: false, preferences: [] });

  const handleCheckboxChange = (categoryId) => {
    setFormData(prev => {
      const prefs = prev.preferences.includes(categoryId) 
        ? prev.preferences.filter(id => id !== categoryId) 
        : [...prev.preferences, categoryId];
      return { ...prev, preferences: prefs };
    });
  };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const formattedPhone = '+254' + formData.phone;
    const payload = isLogin 
      ? { phone: formattedPhone, password: formData.password }
      : { ...formData, phone: formattedPhone };
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      login(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container page-container">
      <div className="auth-box glass">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <div style={{ color: '#ff4d4d', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  name="is_restaurant" 
                  checked={formData.is_restaurant} 
                  onChange={(e) => setFormData({...formData, is_restaurant: e.target.checked})} 
                  style={{ width: 'auto', marginBottom: 0 }} 
                />
                <label style={{ margin: 0 }}>Register as a Restaurant Provider</label>
              </div>

              {!formData.is_restaurant && (
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>What are you craving? (Choose your favorites)</label>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.preferences.includes(1)} onChange={() => handleCheckboxChange(1)} style={{ width: 'auto', margin: 0 }} /> 🍔 Burgers
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.preferences.includes(2)} onChange={() => handleCheckboxChange(2)} style={{ width: 'auto', margin: 0 }} /> 🍕 Pizzas
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.preferences.includes(3)} onChange={() => handleCheckboxChange(3)} style={{ width: 'auto', margin: 0 }} /> 🥤 Drinks
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="form-group">
             <label>Phone Number</label>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '1.2rem', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 🇰🇪 +254
               </span>
               <input 
                 type="tel" 
                 name="phone" 
                 value={formData.phone} 
                 onChange={(e) => {
                   const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                   setFormData({ ...formData, phone: val });
                 }}
                 placeholder="712345678" 
                 pattern="\d{9}"
                 title="Enter your 9 digit phone number (e.g. 712345678)"
                 required 
                 style={{ flex: 1 }}
               />
             </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
