import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBox, FiClock, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [providerFoods, setProviderFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '', category_id: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    if (user.is_restaurant) {
      fetch('http://localhost:5000/api/foods/provider', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        setProviderFoods(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch provider foods', err);
        setLoading(false);
      });
    } else {
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
    }
  }, [user]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(newFood)
      });
      if (res.ok) {
        alert('Food added successfully!');
        setNewFood({ name: '', description: '', price: '', image_url: '', category_id: 1 });
        // Refresh foods
        const updatedFoodsRes = await fetch('http://localhost:5000/api/foods/provider', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const updatedFoods = await updatedFoodsRes.json();
        setProviderFoods(Array.isArray(updatedFoods) ? updatedFoods : []);
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add food');
    }
    setIsSubmitting(false);
  };

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
          <p style={{ color: 'var(--text-muted)' }}>
            {user.is_restaurant ? 'Manage your restaurant menu and offerings.' : 'Manage your orders and account settings.'}
          </p>
        </div>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </div>

      {user.is_restaurant ? (
        <>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Add New Food Item</h2>
          <div className="glass" style={{ padding: '30px', marginBottom: '40px' }}>
            <form onSubmit={handleAddFood} style={{ display: 'grid', gap: '15px' }}>
              <input type="text" placeholder="Food Name" required value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }} />
              <textarea placeholder="Description" required value={newFood.description} onChange={(e) => setNewFood({...newFood, description: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none', height: '100px' }} />
              <input type="number" placeholder="Price (KSh)" required value={newFood.price} onChange={(e) => setNewFood({...newFood, price: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }} />
              <input type="url" placeholder="Image URL (e.g. https://.../image.jpg)" value={newFood.image_url} onChange={(e) => setNewFood({...newFood, image_url: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }} />
              
              <select value={newFood.category_id} onChange={(e) => setNewFood({...newFood, category_id: e.target.value})} style={{ padding: '12px', background: '#1c1c1c', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }}>
                <option value="1">Burgers</option>
                <option value="2">Pizzas</option>
                <option value="3">Drinks</option>
              </select>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Food Item'}
              </button>
            </form>
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Listed Foods</h2>
          {loading ? (
            <p>Loading your foods...</p>
          ) : providerFoods.length === 0 ? (
            <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't listed any foods yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {providerFoods.map(food => (
                <div key={food.id} className="glass" style={{ padding: '20px' }}>
                  {food.image_url && <img src={food.image_url} alt={food.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />}
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{food.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{food.description}</p>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    KSh {parseFloat(food.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
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
      </>
      )}
    </div>
  );
};

export default Dashboard;
