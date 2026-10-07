import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load products. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featured = (products || []).filter(p => p.featured).slice(0, 8);
  const displayProducts = featured.length ? featured : (products || []).slice(0, 8);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubError('');
    if (!email || !email.includes('@')) {
      setSubError('Please enter a valid email address.');
      return;
    }
    setSubLoading(true);
    try {
      await axios.post('/api/newslettersubscribers', { email, subscribedAt: new Date().toISOString() });
      setSubSuccess(true);
      setEmail('');
    } catch (e) {
      setSubError(e.response?.data?.error || 'Could not subscribe right now. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <img className="hero-bg" src="https://picsum.photos/seed/hero1/1600/900" alt="Field hockey player mid-swing on astroturf" width="1600" height="900" />
        <div className="container">
          <span className="eyebrow hero-eyebrow">AMI PERFORMANCE GEAR</span>
          <h1>STRIKE <span className="gradient-text">FIRST.</span></h1>
          <p className="hero-subtitle">Every champion needs a weapon that doesn't flinch under pressure. AMI engineers field hockey sticks, match-day kit, and paddle rackets for players who treat every rebound, drag-flick, and smash like it's the final second of the final.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary">Shop The Range</Link>
            <Link to="/about" className="btn-secondary">Our Story</Link>
          </div>
        </div>
      </section>

      {/* CATEGORY NAV CARDS */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">THREE DISCIPLINES. ONE OBSESSION.</span>
            <h2>PICK YOUR WEAPON</h2>
            <p>Three disciplines. One obsession with winning.</p>
          </div>
          <div className="grid grid-3">
            <Link to="/shop?category=stick" className="card category-tile animate-in">
              <div className="category-tile-img">
                <img src="https://picsum.photos/seed/stick-cat1/700/900" alt="Field hockey stick on turf" width="700" height="900" />
              </div>
              <div className="category-tile-body">
                <span className="badge-tag">01</span>
                <h3>Field Hockey Sticks</h3>
                <p>Carbon, composite, and wood builds tuned for drag-flicks, slaps, and first touch.</p>
                <span className="tile-link">Shop Sticks →</span>
              </div>
            </Link>
            <Link to="/shop?category=paddle" className="card category-tile animate-in animate-in-delay-1">
              <div className="category-tile-img">
                <img src="https://picsum.photos/seed/paddle-cat2/700/900" alt="Paddle racket match in play on outdoor court" width="700" height="900" />
              </div>
              <div className="category-tile-body">
                <span className="badge-tag">02</span>
                <h3>Paddle Rackets</h3>
                <p>Court-ready rackets built for power smashes and precision at the net.</p>
                <span className="tile-link">Shop Paddle →</span>
              </div>
            </Link>
            <Link to="/shop?category=kit" className="card category-tile animate-in animate-in-delay-2">
              <div className="category-tile-img">
                <img src="https://picsum.photos/seed/kit-cat3/700/900" alt="Kit bag with gloves, shin guards, and jersey laid out flat" width="700" height="900" />
              </div>
              <div className="category-tile-body">
                <span className="badge-tag">03</span>
                <h3>Match Kit</h3>
                <p>Jerseys, guards, gloves and bags engineered to survive the full 60 minutes.</p>
                <span className="tile-link">Shop Kit →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PERFORMANCE PILLARS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">THE AMI DIFFERENCE</span>
            <h2>WHY PLAYERS TRUST AMI</h2>
            <p>We don't design for the shelf. We design for the 4th quarter.</p>
          </div>
          <div className="grid grid-4">
            <div className="feature-card animate-in">
              <div className="feature-icon">🏒</div>
              <h3>Carbon Construction</h3>
              <p>Low-bow carbon layups engineered for maximum whip without sacrificing control.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-1">
              <div className="feature-icon">✅</div>
              <h3>Pro-Tested Designs</h3>
              <p>Every prototype is drag-flicked, smashed, and slapped by national-level players first.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-2">
              <div className="feature-icon">🤝</div>
              <h3>Grip Technology</h3>
              <p>Tacky, sweat-resistant grips dialed in for wet turf and championship-stage nerves.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-3">
              <div className="feature-icon">🛡️</div>
              <h3>Durability Guarantee</h3>
              <p>Survives 200 drag-flicks in testing before it ever reaches your bag. Guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="section stats-band">
        <div className="container">
          <div className="grid grid-4">
            <div className="stat-block animate-in">
              <div className="stat-value">30+</div>
              <div className="stat-label">Years Of Craft</div>
            </div>
            <div className="stat-block animate-in animate-in-delay-1">
              <div className="stat-value">500+</div>
              <div className="stat-label">Clubs Equipped</div>
            </div>
            <div className="stat-block animate-in animate-in-delay-2">
              <div className="stat-value">40+</div>
              <div className="stat-label">National Clubs</div>
            </div>
            <div className="stat-block animate-in animate-in-delay-3">
              <div className="stat-value">200</div>
              <div className="stat-label">Drag-Flick Test Cycles</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT CAROUSEL */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">BESTSELLERS</span>
            <h2>FAN FAVORITES</h2>
            <p>The gear our top players refuse to play without.</p>
          </div>

          {loading && (
            <div className="carousel-loading">
              <div className="spinner-inline" style={{ width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
              <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 16 }}>Loading bestsellers…</p>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-error">{error}</div>
          )}

          {!loading && !error && displayProducts.length === 0 && (
            <div className="alert alert-info">No products available yet. Check back soon — new drops incoming.</div>
          )}

          {!loading && !error && displayProducts.length > 0 && (
            <div className="product-carousel">
              {displayProducts.map((p, i) => (
                <Link to={`/product/${p.slug || p._id}`} key={p._id || i} className="card product-card-mini animate-in">
                  <div className="product-card-img">
                    <img
                      src={(p.images && p.images[0]) || `https://picsum.photos/seed/prod${i}/600/700`}
                      alt={p.name || 'AMI product'}
                      width="600"
                      height="700"
                    />
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <span className="price-badge-skew">SALE</span>
                    )}
                  </div>
                  <div className="product-card-body">
                    <span className="category-pill">{(p.category || 'gear').toUpperCase()}</span>
                    <h3>{p.name || 'AMI Product'}</h3>
                    <div className="product-price-row">
                      <span className="product-price">${(p.price ?? 0).toFixed ? p.price.toFixed(2) : p.price}</span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="product-price-compare">${p.compareAtPrice}</span>
                      )}
                    </div>
                    <span className="btn-ghost btn-small-block">Quick View</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY / SHOWCASE */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">ON THE PITCH</span>
            <h2>BUILT ON THE D. TESTED IN IT.</h2>
            <p>Precision isn't given. It's carved into carbon, then proven on real turf.</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery1/700/525" alt="Close-up of hockey stick striking ball with turf spray" width="700" height="525" />
              <div className="gallery-overlay"><span>The strike that ends arguments</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery2/700/525" alt="Field hockey player mid-swing on astroturf" width="700" height="525" />
              <div className="gallery-overlay"><span>Full commitment, every rep</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery3/700/525" alt="Paddle racket match in play on outdoor padel court" width="700" height="525" />
              <div className="gallery-overlay"><span>Court-side precision</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery4/700/525" alt="Kit bag with gloves, shin guards, and jersey laid out flat" width="700" height="525" />
              <div className="gallery-overlay"><span>Matchday-ready, every time</span></div>
            </div>
          </div>
          <div className="video-embed" style={{ marginTop: 48 }}>
            <iframe
              src="https://www.youtube.com/embed/2g811Eo7K8U"
              title="AMI Field Hockey Performance"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / ATHLETE PROOF */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">TEAM & ATHLETE PROOF</span>
            <h2>ON THE TURF, IN THE SQUAD</h2>
            <p>Trusted by the players who can't afford to lose.</p>
          </div>
          <div className="grid grid-3">
            <div className="testimonial animate-in">
              <img src="https://i.pravatar.cc/300?img=12" alt="Headshot of club captain" className="avatar" width="64" height="64" />
              <p className="testimonial-text">"We switched our entire senior squad to AMI composite sticks last season. The drag-flick consistency alone won us two penalty corners in the final."</p>
              <div className="testimonial-author">Marcus Webb</div>
              <div className="testimonial-role">Captain, Riverside HC</div>
            </div>
            <div className="testimonial animate-in animate-in-delay-1">
              <img src="https://i.pravatar.cc/300?img=47" alt="Headshot of national-level player" className="avatar" width="64" height="64" />
              <p className="testimonial-text">"The grip tech is unreal in wet conditions. I haven't had a stick slip on a reverse hit since switching to the Velocity line."</p>
              <div className="testimonial-author">Priya Nandan</div>
              <div className="testimonial-role">National-Level Forward</div>
            </div>
            <div className="testimonial animate-in animate-in-delay-2">
              <img src="https://i.pravatar.cc/300?img=33" alt="Headshot of paddle racket club coach" className="avatar" width="64" height="64" />
              <p className="testimonial-text">"Our academy outfitted 40 juniors with AMI paddle rackets this year. Zero returns, zero complaints — just better scores."</p>
              <div className="testimonial-author">Diego Alarcon</div>
              <div className="testimonial-role">Head Coach, Coastal Padel Academy</div>
            </div>
          </div>
          <div className="trust-strip animate-in">
            <span className="trust-stat">Used by <strong>40+</strong> national-level clubs</span>
            <span className="trust-divider">•</span>
            <span className="trust-stat">Shipped to <strong>500+</strong> clubs worldwide</span>
            <span className="trust-divider">•</span>
            <span className="trust-stat">Rated <strong>4.8/5</strong> by verified buyers</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / CRAFTSMANSHIP TEASER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">THE PROCESS</span>
            <h2>HOW AN AMI STICK IS BORN</h2>
            <p>Every AMI stick survives 200 drag-flicks before it ever reaches yours.</p>
          </div>
          <div className="grid grid-4 steps-row">
            <div className="step animate-in">
              <div className="step-num">01</div>
              <h3>Material Sourcing</h3>
              <p>Hand-selected carbon fiber, fiberglass, and premium wood cores.</p>
            </div>
            <div className="step animate-in animate-in-delay-1">
              <div className="step-num">02</div>
              <h3>Lamination & Pressing</h3>
              <p>Layered under heat and pressure to lock in the low-bow profile.</p>
            </div>
            <div className="step animate-in animate-in-delay-2">
              <div className="step-num">03</div>
              <h3>Pro Testing</h3>
              <p>National-level players drag-flick, slap, and stress-test every prototype.</p>
            </div>
            <div className="step animate-in animate-in-delay-3">
              <div className="step-num">04</div>
              <h3>Quality Check & Ship</h3>
              <p>Final inspection, weight-matched, and shipped to your door or club.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/about" className="btn-secondary">Read Our Full Story</Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER / EMAIL CAPTURE */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="cta-section animate-in">
            <span className="eyebrow">JOIN THE SQUAD</span>
            <h2>NEVER MISS A DROP</h2>
            <p>Join the squad. Get 10% off your first strike — plus early access to new stick drops and limited kit runs.</p>

            {subSuccess ? (
              <div className="alert alert-success" style={{ maxWidth: 480, margin: '24px auto 0' }}>
                ✓ You're in! Check your inbox for your 10% code.
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" disabled={subLoading}>
                  {subLoading ? 'Submitting…' : 'Get 10% Off'}
                </button>
              </form>
            )}
            {subError && <div className="alert alert-error" style={{ maxWidth: 480, margin: '16px auto 0' }}>{subError}</div>}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="scoreboard-bar"></div>
            <span className="eyebrow">QUICK ANSWERS</span>
            <h2>BEFORE YOU STRIKE</h2>
            <p>Answers faster than your fastest drag-flick.</p>
          </div>
          <div className="grid grid-2">
            <div className="card animate-in">
              <h3>What skill levels do you design for?</h3>
              <p>Every stick, racket, and kit piece is tagged Beginner, Intermediate, or Pro so you can match gear to your actual game, not your ego.</p>
            </div>
            <div className="card animate-in animate-in-delay-1">
              <h3>How fast is shipping?</h3>
              <p>Most orders ship within 2 business days, with tracked delivery across all major regions. Bulk team orders are quoted on request.</p>
            </div>
            <div className="card animate-in animate-in-delay-2">
              <h3>Do you offer a durability guarantee?</h3>
              <p>Yes — every stick is engineered and tested to survive 200 drag-flick cycles before release, backed by our standard warranty.</p>
            </div>
            <div className="card animate-in animate-in-delay-3">
              <h3>Can I outfit my whole club?</h3>
              <p>Absolutely. Head to our Contact page and use the "Gearing Up A Team?" banner for custom team pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-section final-cta animate-in">
            <span className="eyebrow">YOUR GAME HAS AN EDGE</span>
            <h2>SO SHOULD YOUR GEAR.</h2>
            <p>From the turf to the podium — browse the full AMI arsenal and find the stick, kit, or racket built for your next match.</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/shop" className="btn-primary">Shop The Range</Link>
              <Link to="/contact" className="btn-ghost">Talk To The Team</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .scoreboard-bar {
          width: 80px;
          height: 4px;
          background: var(--accent);
          margin-bottom: 16px;
        }

        .section-alt {
          background: var(--surface-2);
        }

        .category-tile {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--text);
          overflow: hidden;
          padding: 0;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        .category-tile:hover {
          transform: translateY(-6px);
          border: 2px solid var(--primary);
          box-shadow: 0 20px 40px -20px rgba(16,26,16,.25);
        }
        .category-tile-img {
          overflow: hidden;
          height: 340px;
        }
        .category-tile-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 400ms ease;
        }
        .category-tile:hover .category-tile-img img {
          transform: scale(1.08);
        }
        .category-tile-body {
          padding: 32px;
        }
        .badge-tag {
          display: inline-block;
          background: var(--accent);
          color: var(--text);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          transform: skew(-6deg);
          margin-bottom: 16px;
        }
        .tile-link {
          display: inline-block;
          margin-top: 16px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 0.875rem;
        }

        .stats-band {
          background: var(--text);
        }
        .stat-block {
          text-align: center;
        }
        .stat-value {
          font-family: var(--font-display, "Archivo Black");
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #fff;
          text-shadow: 2px 2px 0 var(--accent);
          line-height: 1;
        }
        .stat-label {
          margin-top: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .product-carousel {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(260px, 1fr);
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 16px;
          scroll-snap-type: x mandatory;
        }
        .product-card-mini {
          scroll-snap-align: start;
          text-decoration: none;
          color: var(--text);
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        .product-card-mini:hover {
          transform: translateY(-6px);
          border: 2px solid var(--primary);
          box-shadow: 0 20px 40px -20px rgba(16,26,16,.25);
        }
        .product-card-img {
          position: relative;
          height: 280px;
          overflow: hidden;
        }
        .product-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .price-badge-skew {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--secondary);
          color: #fff;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          padding: 6px 14px;
          transform: skew(-6deg);
          text-transform: uppercase;
        }
        .product-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .category-pill {
          display: inline-block;
          background: var(--accent);
          color: var(--text);
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          width: fit-content;
          transform: skew(-6deg);
        }
        .product-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-top: 4px;
        }
        .product-price {
          font-family: var(--font-display, "Archivo Black");
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary);
        }
        .product-price-compare {
          text-decoration: line-through;
          color: var(--muted);
          font-size: 0.9rem;
        }
        .btn-small-block {
          margin-top: 12px;
          text-align: center;
          display: block;
        }

        .trust-strip {
          margin-top: 64px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: var(--surface-2);
          border: 1px solid var(--border);
        }
        .trust-stat {
          font-size: 0.9rem;
          color: var(--muted);
        }
        .trust-stat strong {
          color: var(--primary);
          font-family: var(--font-display, "Archivo Black");
        }
        .trust-divider {
          color: var(--border);
        }

        .steps-row .step {
          text-align: left;
        }

        .newsletter-section .cta-section {
          text-align: center;
        }
        .newsletter-form {
          display: flex;
          gap: 12px;
          max-width: 480px;
          margin: 24px auto 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        .newsletter-form input {
          flex: 1;
          min-width: 220px;
        }

        .final-cta {
          text-align: center;
        }

        @media (max-width: 720px) {
          .product-carousel {
            grid-auto-columns: minmax(220px, 1fr);
          }
        }
      `}</style>
    </div>
  );
}