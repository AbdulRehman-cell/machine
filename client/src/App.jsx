import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Admin from './pages/Admin.jsx'

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // Function to fetch and update current cart quantity count
  const fetchCartCount = async () => {
    try {
      const sessionId = localStorage.getItem('ami_session_id') || 'guest_session';
      if (!localStorage.getItem('ami_session_id')) {
        localStorage.setItem('ami_session_id', 'guest_session');
      }
      const res = await axios.get(`/api/cartitems?sessionId=${sessionId}`);
      const total = res.data.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  // Re-fetch on location changes to keep badge updated
  useEffect(() => {
    fetchCartCount();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Listen for custom events to update cart count instantly on product additions
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Dynamic Header with Backdrop Blur and Solid-to-Translucent Effect */}
      <header className="nav-minimal" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontFamily: 'var(--font-display, "Archivo Black")', 
              fontSize: '1.8rem', 
              fontWeight: 900, 
              color: 'var(--text)', 
              letterSpacing: '-0.02em' 
            }}>
              AMI<span style={{ color: 'var(--primary)' }}>.</span>
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""} 
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body, "Inter")',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isActive ? 'var(--primary)' : 'var(--text)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/shop" 
              className={({ isActive }) => isActive ? "active" : ""}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body, "Inter")',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isActive ? 'var(--primary)' : 'var(--text)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              })}
            >
              The Arsenal
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? "active" : ""}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body, "Inter")',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isActive ? 'var(--primary)' : 'var(--text)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              })}
            >
              Our Story
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              to="/cart" 
              className="btn-secondary" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Bag</span>
              <span className="badge" style={{ 
                background: 'var(--accent)', 
                color: 'var(--text)', 
                padding: '2px 8px', 
                fontSize: '0.75rem',
                fontWeight: 900,
                borderRadius: '0'
              }}>
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
      </Routes>
      </main>

      {/* Premium Athletic Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--text)', color: 'var(--bg)', padding: '80px 0' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
            <div>
              <span style={{ 
                fontFamily: 'var(--font-display, "Archivo Black")', 
                fontSize: '2.5rem', 
                fontWeight: 900, 
                color: 'var(--bg)',
                letterSpacing: '-0.02em',
                display: 'block',
                marginBottom: '16px'
              }}>
                AMI<span style={{ color: 'var(--primary)' }}>.</span>
              </span>
              <p style={{ color: 'var(--border)', fontSize: '0.925rem', lineHeight: 1.6, maxWidth: '280px' }}>
                We engineer weapons of absolute intent. Designed on the turf, refined in the D, built for those who strike first.
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display, "Archivo Black")', fontSize: '1rem', color: 'var(--accent)', marginBottom: '24px', letterSpacing: '0.05em' }}>
                THE ARSENAL
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/shop?category=stick" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Field Hockey Sticks</Link></li>
                <li><Link to="/shop?category=paddle" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Paddle Rackets</Link></li>
                <li><Link to="/shop?category=kit" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Match Kit & Apparel</Link></li>
                <li><Link to="/shop" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>All Hardware</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display, "Archivo Black")', fontSize: '1rem', color: 'var(--accent)', marginBottom: '24px', letterSpacing: '0.05em' }}>
                RESOURCES
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/about" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Our Craftsmanship</Link></li>
                <li><a href="#size-guide" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Stick Sizing Guide</a></li>
                <li><a href="#store-locator" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Partner Stockists</a></li>
                <li><a href="#warranty" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.875rem' }}>Lifetime Carbon Warranty</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display, "Archivo Black")', fontSize: '1rem', color: 'var(--accent)', marginBottom: '24px', letterSpacing: '0.05em' }}>
                SQUAD HEADQUARTERS
              </h4>
              <p style={{ color: 'var(--border)', fontSize: '0.875rem', marginBottom: '12px' }}>
                AMI Sports Head Office<br />
                Arena Way, Suite 100<br />
                support@amisports.com
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <a href="#instagram" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>[IG]</a>
                <a href="#youtube" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>[YT]</a>
                <a href="#strava" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>[STRAVA]</a>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(220,229,214,0.1)', paddingTop: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ color: 'var(--border)', fontSize: '0.8125rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} AMI Sports. All rights reserved. Precision crafted under heavy drag-flicks.
            </p>
            <p style={{ color: 'var(--border)', fontSize: '0.8125rem', margin: 0 }}>
              Made For Champions. Designed For The 4th Quarter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}