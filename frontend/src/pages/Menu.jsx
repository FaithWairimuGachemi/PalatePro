import React, { useState, useEffect, useContext } from 'react';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const dummyData = [
  { id: 1, name: 'Nyama Choma', description: 'Roasted goat meat, a quintessential Kenyan delicacy.', price: 350, image_url: '', category_name: 'Main Courses' },
  { id: 2, name: 'Pilau', description: 'Spiced rice cooked with beef, bursting with coastal flavors.', price: 250, image_url: '', category_name: 'Main Courses' },
  { id: 3, name: 'Mutura', description: 'Kenyan sausage filled with spiced minced meat and blood, grilled over charcoal.', price: 80, image_url: '', category_name: 'Street Food' },
  { id: 4, name: 'Chips Mayai', description: 'A legendary street food combining french fries baked inside an omelet.', price: 100, image_url: '', category_name: 'Street Food' },
];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [isTrending, setIsTrending] = useState(false);
  const { addToCart, cart, updateQty, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Attempt fetch from backend, fallback to dummyData on error
    Promise.all([
      fetch('http://localhost:5000/api/foods').then(res => {
        if (!res.ok) throw new Error('Foods fetch failed');
        return res.json();
      }),
      fetch('http://localhost:5000/api/foods/categories/all').then(res => {
        if (!res.ok) throw new Error('Categories fetch failed');
        return res.json();
      })
    ])
      .then(([foodsData, categoriesData]) => {
        setFoods(foodsData.length > 0 ? foodsData : dummyData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend not accessible, using fallback dummy data:', err);
        setFoods(dummyData);
        const dummyCategories = [...new Set(dummyData.map(f => f.category_name))].map((name, i) => ({ id: i + 1, name }));
        setCategories(dummyCategories);
        setLoading(false);
      });

    const fetchRecommendations = async () => {
      try {
        if (user && user.preferences) {
          const res = await fetch('http://localhost:5000/api/foods/recommended', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          setRecommendedFoods(Array.isArray(data) ? data : []);
          setIsTrending(false);
        } else {
          const res = await fetch('http://localhost:5000/api/foods/bestsellers');
          const data = await res.json();
          setRecommendedFoods(Array.isArray(data) ? data : []);
          setIsTrending(true);
        }
      } catch (e) {
        console.error("Failed to fetch recommendations", e);
      }
    };
    fetchRecommendations();
  }, [user]);

  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category_name === selectedCategory);

  const handleAddToCart = (food) => {
    addToCart(food);
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading Menu...</div>;

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Our <span style={{ color: 'var(--primary-color)' }}>Menu</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Handcrafted perfection in every bite.</p>
      </div>

      {recommendedFoods.length > 0 && (
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isTrending ? '🔥 Trending Now' : '✨ Recommended For You'}
          </h2>
          <div className="menu-grid" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '20px', gap: '20px', scrollSnapType: 'x mandatory' }}>
            {recommendedFoods.map(food => {
              const inCart = cart.find(item => item.id === food.id);
              return (
                <div key={food.id} className="food-card glass" style={{ minWidth: '280px', flex: '0 0 auto', scrollSnapAlign: 'start' }}>
                  <div className="food-img-wrapper" style={{ height: '150px' }}>
                    <img src={food.image_url} alt={food.name} className="food-img" style={{ height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 className="food-title" style={{ fontSize: '1.2rem', margin: '10px 0' }}>{food.name}</h3>
                  {food.restaurant_name && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 'bold' }}>
                      👨‍🍳 By {food.restaurant_name}
                    </div>
                  )}
                  <p className="food-desc" style={{ height: '40px', overflow: 'hidden' }}>{food.description}</p>
                  
                  <div className="food-footer" style={{ marginTop: 'auto' }}>
                    <span className="food-price">KSh {parseFloat(food.price).toFixed(2)}</span>
                    {food.is_available === 0 || food.is_available === false ? (
                      <button className="btn btn-outline" disabled style={{ padding: '6px 12px', color: '#ff4d4d', borderColor: '#ff4d4d', cursor: 'not-allowed', fontSize: '0.9rem' }}>
                        Out of Stock
                      </button>
                    ) : inCart ? (
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 8px' }}>
                        <button onClick={() => { if(inCart.qty === 1) removeFromCart(food.id); else updateQty(food.id, -1); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 10px', fontSize: '1.2rem', outline: 'none' }}>-</button>
                        <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{inCart.qty}</span>
                        <button onClick={() => updateQty(food.id, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 10px', fontSize: '1.2rem', outline: 'none' }}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }} onClick={() => handleAddToCart(food)}>
                        <FiPlus /> Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="category-filter" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedCategory('All')}
          style={{ padding: '8px 20px', borderRadius: '25px', textTransform: 'capitalize' }}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`btn ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(cat.name)}
            style={{ padding: '8px 20px', borderRadius: '25px', textTransform: 'capitalize' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredFoods.map(food => {
          const inCart = cart.find(item => item.id === food.id);
          
          return (
            <div key={food.id} className="food-card glass">
              <div className="food-img-wrapper">
                <img src={food.image_url} alt={food.name} className="food-img" />
              </div>
              <h3 className="food-title">{food.name}</h3>
              {food.restaurant_name && (
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 'bold' }}>
                  👨‍🍳 By {food.restaurant_name}
                </div>
              )}
              <p className="food-desc">{food.description}</p>
              
              <div className="food-footer">
                <span className="food-price">KSh {parseFloat(food.price).toFixed(2)}</span>
                
                {food.is_available === 0 || food.is_available === false ? (
                  <button className="btn btn-outline" disabled style={{ padding: '8px 16px', color: '#ff4d4d', borderColor: '#ff4d4d', cursor: 'not-allowed' }}>
                    Out of Stock
                  </button>
                ) : inCart ? (
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 8px' }}>
                    <button onClick={() => { if(inCart.qty === 1) removeFromCart(food.id); else updateQty(food.id, -1); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 10px', fontSize: '1.2rem', outline: 'none' }}>-</button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{inCart.qty}</span>
                    <button onClick={() => updateQty(food.id, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 10px', fontSize: '1.2rem', outline: 'none' }}>+</button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 16px' }}
                    onClick={() => handleAddToCart(food)}
                  >
                    <FiPlus /> Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
