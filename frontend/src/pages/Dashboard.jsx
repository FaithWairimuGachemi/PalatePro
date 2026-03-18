import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBox, FiClock, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetch('http://localhost:5000/api/orders/myorders', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend unavailable, using mock orders:', err);
        setOrders([
          { id: 101, total_amount: 450, status: 'PREPARING', created_at: new Date().toISOString() },
          { id: 102, total_amount: 200, status: 'DELIVERED', created_at: new Date(Date.now() - 86400000).toISOString() }
        ]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FiClock color="#ffc107" />;
      case 'PREPARING': return <FiBox color="#17a2b8" />;
      case 'DELIVERED': return <FiCheckCircle color="#28a745" />;
      default: return <FiClock />;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Hello, <span style={{ color: 'var(--primary-color)' }}>{user.name}</span>!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your orders and account settings.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Recent Orders</h2>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} className="glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>
                  Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  {getStatusIcon(order.status)}
                  <span style={{ 
                    color: order.status === 'DELIVERED' ? '#28a745' : 
                          order.status === 'PREPARING' ? '#17a2b8' : '#ffc107' 
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                KSh {parseFloat(order.total_amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
