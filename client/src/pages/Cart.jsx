import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner, Alert, Badge } from '../components/ui';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const sessionId = localStorage.getItem('ami_session_id') || 'guest_session';

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/cartitems?sessionId=${sessionId}`);
      const items = Array.isArray(res.data) ? res.data : [];
      setCartItems(items);

      const productMap = {};
      await Promise.all(
        items.map(async (item) => {
          try {
            const pid = item.productId;
            if (!pid || productMap[pid]) return;
            const pres = await axios.get(`/api/products/${pid}`);
            productMap[pid] = pres.data;
          } catch {
            // skip missing products
          }
        })
      );
      setProducts(productMap);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load your bag. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      setUpdating(item._id);
      await axios.put(`/api/cartitems/${item._id}`, { quantity: newQty });
      setCartItems((prev) =>
        prev.map((ci) => (ci._id === item._id ? { ...ci, quantity: newQty } : ci))
      );
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update quantity.');
    } finally {
      setUpdating('');
    }
  };

  const handleRemove = async (item) => {
    try {
      setUpdating(item._id);
      await axios.delete(`/api/cartitems/${item._id}`);
      setCartItems((prev) => prev.filter((ci) => ci._id !== item._id));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to remove item.');
    } finally {
      setUpdating('');
    }
  };

  const getPrice = (item) => {
    const p = products[item.productId];
    return p?.price ?? 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getPrice(item) * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? (subtotal > 150 ? 0 : 12) : 0;
  const total = subtotal + shipping;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) {
      setCheckoutError('Please fill in your name, email, and shipping address.');
      return;
    }
    try {
      setCheckoutLoading(true);
      setCheckoutError('');
      await axios.post('/api/orders', {
        guestEmail: email,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variant: item.variant,
          quantity: item.quantity,
          price: getPrice(item)
        })),
        totalAmount: total,
        shippingAddress: { name, address },
        status: 'pending'
      });

      await Promise.all(cartItems.map((item) => axios.delete(`/api/cartitems/${item._id}`)));
      window.dispatchEvent(new Event('cart-updated'));

      setCheckoutSuccess(true);
      setCartItems([]);
      setName('');
      setEmail('');
      setAddress('');
    } catch (e) {
      setCheckoutError(e.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div>
      <section className="hero" style={{ minHeight: '34vh', clipPath: 'none' }}>
        <div className="container animate-in">
          <span className="eyebrow">YOUR BAG</span>
          <h1>READY TO <span className="gradient-text">STRIKE</span>?</h1>
          <p className="hero-subtitle">Review your gear, lock in your quantities, and check out in seconds.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && (
            <Alert variant="error" dismissible>
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '96px 0', gap: '24px' }}>
              <Spinner size="lg" color="primary" />
              <p className="muted">Loading your bag…</p>
            </div>
          ) : checkoutSuccess ? (
            <div className="alert alert-success animate-in" style={{ padding: '48px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '16px' }}>✓ ORDER CONFIRMED</h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
                Your gear is locked in. We've sent a confirmation to your email — your order is being prepped for shipping.
              </p>
              <Link to="/shop">
                <Button variant="primary" size="lg">Keep Shopping</Button>
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '64px 32px' }}>
              <h3 style={{ marginBottom: '16px' }}>YOUR BAG IS EMPTY</h3>
              <p className="muted" style={{ marginBottom: '32px' }}>
                No sticks, no kit, no paddles — yet. Time to fix that.
              </p>
              <Link to="/shop">
                <Button variant="primary" size="lg">Shop The Range</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-2" style={{ alignItems: 'start', gap: '48px' }}>
              <div>
                <div className="section-head" style={{ textAlign: 'left', marginBottom: '32px' }}>
                  <div style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '16px' }}></div>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>IN YOUR BAG ({cartItems.length})</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {cartItems.map((item) => {
                    const product = products[item.productId];
                    const img = (product?.images && product.images[0]) || `https://picsum.photos/seed/cart${item._id}/600/600`;
                    const variantLabel = (() => {
                      try {
                        const v = typeof item.variant === 'string' ? JSON.parse(item.variant) : item.variant;
                        if (!v) return null;
                        return [v.color, v.size].filter(Boolean).join(' / ');
                      } catch {
                        return null;
                      }
                    })();
                    return (
                      <div className="card" key={item._id} style={{ display: 'flex', gap: '24px', padding: '24px' }}>
                        <img
                          src={img}
                          alt={product?.name || 'AMI product'}
                          width="140"
                          height="140"
                          className="img-cover"
                          style={{ width: '140px', height: '140px', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <div>
                              <Badge variant="neutral" size="sm">{(product?.category || 'gear').toUpperCase()}</Badge>
                              <h3 style={{ marginTop: '8px', marginBottom: '4px' }}>
                                {product?.name || 'Product unavailable'}
                              </h3>
                              {variantLabel && <p className="muted" style={{ fontSize: '0.875rem' }}>{variantLabel}</p>}
                            </div>
                            <strong style={{ fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                              ${(getPrice(item) * (item.quantity || 1)).toFixed(2)}
                            </strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={updating === item._id || (item.quantity || 1) <= 1}
                                onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                              >
                                −
                              </Button>
                              <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>
                                {item.quantity || 1}
                              </span>
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={updating === item._id}
                                onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updating === item._id}
                              onClick={() => handleRemove(item)}
                            >
                              {updating === item._id ? 'Removing…' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card card-elevated" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
                <div className="section-head" style={{ textAlign: 'left', marginBottom: '24px' }}>
                  <div style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '16px' }}></div>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>SUMMARY</h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="muted">Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="muted">Shipping</span>
                  <strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong>
                </div>
                {subtotal > 0 && subtotal < 150 && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '12px' }}>
                    Add ${(150 - subtotal).toFixed(2)} more for free shipping.
                  </p>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px',
                    marginTop: '8px',
                    marginBottom: '24px'
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                    ${total.toFixed(2)}
                  </strong>
                </div>

                <form onSubmit={handleCheckout}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', color: 'var(--muted)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jordan Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', color: 'var(--muted)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', color: 'var(--muted)' }}>
                      Shipping Address
                    </label>
                    <textarea
                      placeholder="123 Turf Lane, Match City, MC 10101"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  {checkoutError && (
                    <Alert variant="error" dismissible>
                      {checkoutError}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={checkoutLoading}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Submitting…' : 'Checkout Now'}
                  </Button>
                </form>

                <p className="muted" style={{ fontSize: '0.8125rem', textAlign: 'center', marginTop: '16px' }}>
                  Secure checkout. Free returns within 30 days.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div style={{ width: '80px', height: '4px', background: 'var(--accent)', margin: '0 auto 16px' }}></div>
            <span className="eyebrow">WHY SHOP AMI</span>
            <h2>PLAY WITH CONFIDENCE</h2>
            <p>Every order is backed by the same standard we hold our gear to on match day.</p>
          </div>
          <div className="grid grid-3">
            <div className="feature-card animate-in">
              <div className="feature-icon">🚚</div>
              <h3>Fast Dispatch</h3>
              <p className="muted">Orders placed before 2PM ship same day. Free shipping on orders over $150.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-1">
              <div className="feature-icon">🔁</div>
              <h3>30-Day Returns</h3>
              <p className="muted">Not feeling the flex or the grip? Send it back within 30 days, no questions asked.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-2">
              <div className="feature-icon">🛡️</div>
              <h3>Durability Guarantee</h3>
              <p className="muted">Every stick is pressure-tested to survive 200 drag-flicks before it ships to you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-section">
            <h2>NOT DONE GEARING UP?</h2>
            <p>Browse the full arsenal — sticks, kit, and paddle rackets built for the final second of the final.</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <Link to="/shop" className="btn-primary">Shop The Range</Link>
              <Link to="/about" className="btn-secondary">Our Story</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}