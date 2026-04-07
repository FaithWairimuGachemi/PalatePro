import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBox, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.is_admin === 0) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  if (!user || user.is_admin === 0) {
    return <Navigate to="/" />;
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FiClock color="#ffc107" />;
      case 'PREPARING': return <FiBox color="#17a2b8" />;
      case 'ON_DELIVERY': return <FiTruck color="#fd7e14" />;
      case 'DELIVERED': return <FiCheckCircle color="#28a745" />;
      default: return <FiClock />;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Admin <span style={{ color: 'var(--primary-color)' }}>Console</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all incoming customer orders.</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>All Platform Orders</h2>
      
      {loading ? (
        <p>Loading platform orders...</p>
      ) : orders.length === 0 ? (
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No orders have been placed yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <div>
                  <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    Order #{order.id} - {order.user_name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {order.delivery_location} | {order.delivery_phone}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    {getStatusIcon(order.status)}
                    <span style={{ 
                      color: order.status === 'DELIVERED' ? '#28a745' : 
                            order.status === 'ON_DELIVERY' ? '#fd7e14' :
                            order.status === 'PREPARING' ? '#17a2b8' : '#ffc107' 
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    KSh {parseFloat(order.total_amount).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {order.status === 'PENDING' && (
                      <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Mark Preparing</button>
                    )}
                    {(order.status === 'PENDING' || order.status === 'PREPARING') && (
                      <button onClick={() => updateOrderStatus(order.id, 'ON_DELIVERY')} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Dispatch Delivery</button>
                    )}
                    {order.status === 'ON_DELIVERY' && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Waiting on Customer...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
