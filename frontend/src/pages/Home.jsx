import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import heroImg from '../assets/palatepro_hero.webp'; // We will place generated image here

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Taste the Magic of <span>PalatePro</span> Delivery
          </h1>
          <p className="hero-subtitle">
            Experience culinary excellence delivered straight to your door in less than 30 minutes.
            Fresh ingredients, master chefs, and a menu designed to delight.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/menu" className="btn btn-primary">
              Order Now <FiArrowRight />
            </Link>
            <Link to="/menu" className="btn btn-outline">
              View Menu
            </Link>
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(5)].map((_, i) => <FiStar key={i} color="#ff8c00" fill="#ff8c00" />)}
            </div>
            <p style={{ margin: 0, fontWeight: 600 }}>10k+ Happy Customers</p>
          </div>
        </div>

        <div className="hero-image-container">
          <img src={heroImg} alt="Delicious palatepro burger floating" className="hero-image" />
        </div>
      </section>

      <section className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Why <span style={{ color: 'var(--primary-color)' }}>PalatePro?</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            We redefine food delivery by bringing restaurant-quality meals to the comfort of your home.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {[
            { title: 'Lightning Fast', desc: 'Hot and delicious in 30 minutes or less.' },
            { title: 'Master Chefs', desc: 'Prepared by culinary experts with years of experience.' },
            { title: 'Fresh Ingredients', desc: 'Sourced locally to ensure maximum freshness.' }
          ].map((feature, idx) => (
            <div key={idx} className="glass" style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 69, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {idx + 1}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container glass" style={{ margin: '80px 5%', padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,69,0,0.1), rgba(15,23,42,0.8))' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Craving Something Special?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>Explore our diverse menu of handcrafted dishes.</p>
        <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Browse Menu</Link>
      </section>
    </>
  );
};

export default Home;
