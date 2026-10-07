import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner, toast } from '../components/ui';

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(1000); // Max cap matching our items

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        setProducts(res.data || []);
        setError('');
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Could not retrieve AMI performance gear. Please verify connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Quick Add function
  const handleQuickAdd = async (product, e) => {
    e.stopPropagation(); // Prevent navigating to detail page
    try {
      const sessionId = localStorage.getItem('ami_session_id') || 'guest_session';
      await axios.post('/api/cartitems', {
        sessionId,
        productId: product._id,
        variant: 'Standard / Core Fit',
        quantity: 1
      });
      // Fire cart update event for header count synchronization
      window.dispatchEvent(new Event('cart-updated'));
      toast.success(`${product.name} added to your bag.`);
    } catch (err) {
      console.error('Error adding to bag:', err);
      toast.error('Failed to add equipment to your bag. Try again.');
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSkill = selectedSkill === 'all' || p.skillLevel?.toLowerCase() === selectedSkill.toLowerCase();
    const matchesMaterial = selectedMaterial === 'all' || p.material?.toLowerCase().includes(selectedMaterial.toLowerCase());
    const matchesPrice = Number(p.price) <= priceRange;
    return matchesCategory && matchesSkill && matchesMaterial && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default order
  });

  // Paginated chunk
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSkill, selectedMaterial, priceRange, sortBy]);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      
      {/* 1. Shop Header Section */}
      <section className="section" style={{ paddingBottom: '40px', paddingTop: '60px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--surface-2) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--primary)' }}>AMI ARSENAL</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)', lineHeight: '1.05', margin: '8px 0 16px 0', textTransform: 'uppercase' }}>
                THE FULL <span style={{ color: 'var(--primary)' }}>ARSENAL</span>
              </h1>
              <p style={{ maxWidth: '600px', fontSize: '1.125rem', color: 'var(--muted)', margin: 0 }}>
                Every stick, every racket, every precision-molded layer of carbon. Programmed to strike first. Match-day validated.
              </p>
            </div>
            
            {/* Quick Stats Badge on Header */}
            <div style={{ display: 'flex', gap: '16px', background: 'var(--surface)', padding: '16px 24px', border: '1px solid var(--border)', transform: 'skew(-4deg)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>Available Weapons</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--primary)' }}>{filteredProducts.length} Items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Filter & Grid Layout */}
      <section className="section" style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          
          {/* Top filter horizontal bar */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '32px', 
            background: 'var(--surface)', 
            padding: '16px 24px', 
            border: '1px solid var(--border)' 
          }}>
            {/* Categories Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'stick', 'paddle', 'kit'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text)',
                    border: '1px solid ' + (selectedCategory === cat ? 'var(--primary)' : 'var(--border)'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'all' ? 'All Disciplines' : cat + 's'}
                </button>
              ))}
            </div>

            {/* Sorting Choice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '8px 16px', 
                  fontFamily: 'var(--font-body)', 
                  border: '1px solid var(--border)', 
                  backgroundColor: 'var(--surface)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="default">Featured & High Bow</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
            
            {/* Left Filter Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Filter Headline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ height: '4px', width: '40px', backgroundColor: 'var(--accent)', display: 'block' }}></span>
                <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.15rem' }}>Dial It In</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)' }}>Refine your performance standards</p>
              </div>

              {/* Skill Level Selection */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--text)' }}>Skill Tier</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['all', 'pro', 'intermediate', 'beginner'].map((lvl) => (
                    <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.925rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="skill" 
                        checked={selectedSkill === lvl} 
                        onChange={() => setSelectedSkill(lvl)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{lvl === 'all' ? 'All Skill Levels' : lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Carbon / Material Filter */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--text)' }}>Material Construction</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['all', 'Carbon', 'Composite', 'Wood'].map((mat) => (
                    <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.925rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="material" 
                        checked={selectedMaterial === mat.toLowerCase()} 
                        onChange={() => setSelectedMaterial(mat.toLowerCase())}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <span>{mat === 'all' ? 'Any Composition' : mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', margin: 0 }}>Max Budget</h4>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--primary)' }}>${priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="1000" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                  <span>$30</span>
                  <span>$1000</span>
                </div>
              </div>

              {/* Reset button */}
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSkill('all');
                  setSelectedMaterial('all');
                  setPriceRange(1000);
                  setSortBy('default');
                }}
                className="btn-ghost" 
                style={{ width: '100%', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', padding: '12px 16px' }}
              >
                Reset Filters
              </button>
            </aside>

            {/* Right Product Grid Column */}
            <div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
                  <Spinner size="lg" color="primary" />
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Assembling Premium Gear Array...</p>
                </div>
              ) : error ? (
                <div className="alert alert-error" style={{ margin: '40px 0' }}>
                  <p>{error}</p>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px' }}>🛡️</span>
                  <h3 style={{ textTransform: 'uppercase', margin: '0 0 8px 0' }}>No Match-deciders Found</h3>
                  <p style={{ color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
                    We don't stock equipment with those exact stats. Adjust your skill tier or price settings to load next wave of stock.
                  </p>
                  <Button variant="primary" onClick={() => { setSelectedCategory('all'); setSelectedSkill('all'); setSelectedMaterial('all'); setPriceRange(1000); }}>
                    Clear Search Scope
                  </Button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {displayedProducts.map((p) => (
                      <div 
                        key={p._id}
                        onClick={() => navigate(`/product/${p.slug}`)}
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.boxShadow = '0 20px 40px -20px rgba(16,26,16,.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Kinetic badges on corner */}
                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--text)',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            padding: '4px 8px',
                            transform: 'skew(-6deg)',
                            letterSpacing: '0.04em'
                          }}>
                            {p.category}
                          </span>
                          {p.skillLevel && (
                            <span style={{
                              backgroundColor: 'var(--text)',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              letterSpacing: '0.04em',
                              alignSelf: 'flex-start'
                            }}>
                              {p.skillLevel}
                            </span>
                          )}
                        </div>

                        {/* Product Photo Canvas */}
                        <div style={{ aspectRatio: '1/1', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
                          <img 
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1601646761285-65bfa67cd7a3?q=80&w=600&auto=format&fit=crop'} 
                            alt={p.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
                            className="product-image-hover"
                          />
                        </div>

                        {/* Product Core Details */}
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', textTransform: 'uppercase', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                              {p.name}
                            </h4>
                            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.description || 'Raw speed and precision profile structured for high rebound dynamic environments.'}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {p.compareAtPrice > p.price && (
                                <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--muted)' }}>
                                  ${p.compareAtPrice}
                                </span>
                              )}
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text)' }}>
                                ${p.price}
                              </span>
                            </div>

                            <button 
                              onClick={(e) => handleQuickAdd(p, e)}
                              style={{
                                border: '1px solid var(--primary)',
                                background: 'transparent',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'var(--primary)';
                                e.target.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--primary)';
                              }}
                            >
                              Add To Bag
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination control */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="btn-ghost"
                        style={{ padding: '8px 16px', fontSize: '0.8125rem', textTransform: 'uppercase' }}
                      >
                        Prev
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid var(--border)',
                            backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--surface)',
                            color: currentPage === i + 1 ? '#ffffff' : 'var(--text)',
                            fontFamily: 'var(--font-display)',
                            cursor: 'pointer'
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="btn-ghost"
                        style={{ padding: '8px 16px', fontSize: '0.8125rem', textTransform: 'uppercase' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Starter Bundle Promo Banner (Substantial Middle Grid Section) */}
      <section className="section" style={{ backgroundColor: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Visual Column */}
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=800&auto=format&fit=crop" 
                alt="AMI Starter kit components flat lay" 
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', backgroundColor: 'var(--accent)', color: 'var(--text)', padding: '12px 20px', transform: 'skew(-6deg)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', display: 'block' }}>Save 15%</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Team Package Discount</span>
              </div>
            </div>

            {/* Text & Dynamic Bundle Trigger */}
            <div>
              <span className="eyebrow" style={{ color: 'var(--secondary)' }}>BUNDLE & CONQUER</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textTransform: 'uppercase', margin: '8px 0 16px 0', lineHeight: '1.1' }}>
                STARTER BUNDLE: <br />EVERYTHING BUT THE SWEAT
              </h2>
              <p style={{ color: 'var(--muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Step onto the pitch with absolute technical security. Get any premier composite stick, heavy-duty padded stick bag, and our high-impact sweat-wicking match grip for one optimized combo.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>1. Select Your Stick</h4>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Any model up to $250 value</span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>2. Carry Solution</h4>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Heavy duty waterproof canvas</span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  // Pre-add core stick to showcase bundle actions
                  const mainStick = products.find(p => p.category === 'stick') || products[0];
                  if (mainStick) {
                    try {
                      const sessionId = localStorage.getItem('ami_session_id') || 'guest_session';
                      await axios.post('/api/cartitems', {
                        sessionId,
                        productId: mainStick._id,
                        variant: 'Standard / Bundle Promo',
                        quantity: 1
                      });
                      window.dispatchEvent(new Event('cart-updated'));
                      toast.success('Core bundle stick placed in bag!');
                      navigate('/cart');
                    } catch (e) {
                      toast.error('Unable to initiate bundle right now.');
                    }
                  } else {
                    toast.info('Browse below to choose a product for your customized kit.');
                  }
                }}
                className="btn-primary" 
                style={{ 
                  textTransform: 'uppercase', 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 700, 
                  letterSpacing: '0.04em',
                  padding: '16px 32px',
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  transform: 'skew(-4deg)',
                  boxShadow: '0 8px 0 0 var(--primary-hover)'
                }}
              >
                Assemble Bundle Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Support Callout Section */}
      <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>✈️</span>
              <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase' }}>Next-day Dispatch</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                Order before 2PM GMT and your stick is shipped that afternoon, precision-balanced and packed securely.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>🛡️</span>
              <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase' }}>1 Year Warranty</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                We engineer carbon to survive. If your weapon splinters on standard turf impact, we replace it. No runarounds.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>💪</span>
              <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase' }}>Club Partners</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                Supplying over 40 clubs worldwide. Team discounts on apparel and composite batches starting at 10 units.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}