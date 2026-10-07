import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Badge, Alert, Spinner, Textarea, Input } from '../components/ui';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  const [addStatus, setAddStatus] = useState('');

  const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/products');
        const all = Array.isArray(res.data) ? res.data : [];
        const found = all.find((p) => p.slug === slug) || all.find((p) => p._id === slug);
        if (!found) {
          if (!cancelled) {
            setError('Product not found. It may have been removed from the range.');
            setProduct(null);
          }
        } else {
          if (!cancelled) {
            setProduct(found);
            const colorList = (found.colors || '').split(',').map((c) => c.trim()).filter(Boolean);
            setSelectedColor(colorList[0] || '');
            const related = all.filter((p) => p._id !== found._id && p.category === found.category).slice(0, 4);
            setRelatedProducts(related.length ? related : all.filter((p) => p._id !== found._id).slice(0, 4));
          }
        }

        try {
          const revRes = await axios.get('/api/reviews');
          if (!cancelled) {
            const list = Array.isArray(revRes.data) ? revRes.data : [];
            setReviews(list.filter((r) => r.productId === (found ? found._id : '___none')));
          }
        } catch (e) {
          if (!cancelled) setReviews([]);
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || 'Failed to load product. Please check your connection.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const imageList = (() => {
    if (!product) return [];
    const imgs = (product.images || '').split(',').map((i) => i.trim()).filter(Boolean);
    return imgs.length ? imgs : [`https://picsum.photos/seed/product-${product._id || 'x'}/1200/1200`];
  })();

  const colorList = (product?.colors || '').split(',').map((c) => c.trim()).filter(Boolean);

  const categoryLabel = (cat) => {
    if (cat === 'stick') return 'Field Hockey Stick';
    if (cat === 'kit') return 'Match Kit';
    if (cat === 'paddle') return 'Paddle Racket';
    return cat || 'Gear';
  };

  const handleAddToBag = async (redirectToCart) => {
    if (!product) return;
    setAddStatus('adding');
    try {
      const sessionId = localStorage.getItem('ami_session_id') || 'guest_session';
      if (!localStorage.getItem('ami_session_id')) localStorage.setItem('ami_session_id', 'guest_session');
      await axios.post('/api/cartitems', {
        sessionId,
        productId: product._id,
        variant: JSON.stringify({ color: selectedColor }),
        quantity: Number(quantity) || 1
      });
      window.dispatchEvent(new Event('cart-updated'));
      setAddStatus('added');
      setTimeout(() => setAddStatus(''), 2500);
      if (redirectToCart) navigate('/cart');
    } catch (e) {
      setAddStatus('error');
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((f) => ({ ...f, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.reviewerName.trim() || !reviewForm.comment.trim()) {
      setReviewError('Please fill in your name and a comment before submitting.');
      return;
    }
    setReviewLoading(true);
    try {
      await axios.post('/api/reviews', {
        productId: product._id,
        reviewerName: reviewForm.reviewerName,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        verifiedBuyer: false,
        createdAt: new Date().toISOString()
      });
      setReviewSuccess(true);
      setReviewForm({ reviewerName: '', rating: 5, comment: '' });
      try {
        const revRes = await axios.get('/api/reviews');
        const list = Array.isArray(revRes.data) ? revRes.data : [];
        setReviews(list.filter((r) => r.productId === product._id));
      } catch (e) { /* ignore refresh error */ }
    } catch (e) {
      setReviewError(e.response?.data?.error || 'Failed to submit your review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '120px', textAlign: 'center' }}>
        <Spinner size="lg" color="primary" />
        <p style={{ color: 'var(--muted)', marginTop: '16px' }}>Loading product details…</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <Alert variant="error" title="Product not found">{error}</Alert>
        <div style={{ marginTop: '24px' }}>
          <Link to="/shop"><Button variant="primary">Back To Shop</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">

      <section className="section-head" style={{ paddingTop: '48px', paddingBottom: '0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '24px' }}>
            <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span>/</span>
            <Link to="/shop" style={{ color: 'var(--muted)' }}>Shop</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{categoryLabel(product?.category)}</span>
          </div>
        </div>
      </section>

      {/* SECTION 1: Gallery + Core Info */}
      <section className="section animate-in" style={{ paddingTop: '16px' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>

            <div className="pd-gallery">
              <div style={{ border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface-2)' }}>
                <img
                  src={imageList[activeImage] || imageList[0]}
                  alt={product?.name || 'Product image'}
                  width="1200"
                  height="1200"
                  className="img-cover"
                  style={{ width: '100%', aspectRatio: '1 / 1', display: 'block' }}
                />
              </div>
              {imageList.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {imageList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width: '84px', height: '84px', padding: 0, cursor: 'pointer',
                        border: i === activeImage ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: 'none', overflow: 'hidden'
                      }}
                    >
                      <img src={img} alt={`${product?.name || 'Product'} thumbnail ${i + 1}`} width="84" height="84" className="img-cover" style={{ width: '100%', height: '100%' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-info">
              <span className="badge" style={{ background: 'var(--accent)', color: 'var(--text)', borderRadius: 0, transform: 'skew(-6deg)', display: 'inline-block', padding: '6px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                {categoryLabel(product?.category)}
              </span>

              <h1 style={{ marginBottom: '12px' }}>{product?.name || 'Unnamed Product'}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                {avgRating && (
                  <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                  </span>
                )}
                {product?.skillLevel && <Badge variant="primary">{product.skillLevel}</Badge>}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 900, color: 'var(--text)' }}>
                  ${Number(product?.price || 0).toFixed(2)}
                </span>
                {product?.compareAtPrice > product?.price && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: '1.25rem' }}>
                    ${Number(product.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="body" style={{ color: 'var(--muted)', marginBottom: '32px' }}>
                {product?.description || 'The stick that doesn\u2019t wait for permission to strike. Built for players who treat every rebound and drag-flick like it\u2019s the final second of the final.'}
              </p>

              {colorList.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="label" style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', color: 'var(--text)' }}>Color: {selectedColor}</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {colorList.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        style={{
                          padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                          border: c === selectedColor ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: c === selectedColor ? 'var(--surface-2)' : 'var(--surface)',
                          color: 'var(--text)'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '28px' }}>
                <div className="label" style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', color: 'var(--text)' }}>Quantity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: '40px', height: '40px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>−</button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} style={{ width: '40px', height: '40px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>+</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Button variant="primary" size="lg" onClick={() => handleAddToBag(false)} loading={addStatus === 'adding'}>
                  Add To Bag
                </Button>
                <Button variant="secondary" size="lg" onClick={() => handleAddToBag(true)}>
                  Buy Now
                </Button>
              </div>

              {addStatus === 'added' && <Alert variant="success">✓ Added to your bag — gear up and go.</Alert>}
              {addStatus === 'error' && <Alert variant="error">Couldn't add this to your bag. Please try again.</Alert>}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Spec Sheet */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '20px' }}></div>
            <h2>THE BUILD</h2>
            <p style={{ color: 'var(--muted)' }}>Numbers don't lie. Neither does this stick.</p>
          </div>

          <div className="filter-bar" style={{ marginBottom: '24px' }}>
            <button className={activeTab === 'specs' ? 'active' : ''} onClick={() => setActiveTab('specs')}>Spec Sheet</button>
            <button className={activeTab === 'story' ? 'active' : ''} onClick={() => setActiveTab('story')}>Performance Story</button>
          </div>

          {activeTab === 'specs' && (
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Material', product?.material || 'Pro-grade Composite Carbon'],
                    ['Weight', product?.weight || '530–560g'],
                    ['Bow Type', product?.bowType || 'Low Bow'],
                    ['Category', categoryLabel(product?.category)],
                    ['Skill Level', product?.skillLevel || 'Intermediate'],
                    ['Country of Origin', 'Pakistan']
                  ].map(([label, value], i) => (
                    <tr key={label} style={{ borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '18px 32px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.06em', width: '220px' }}>{label}</td>
                      <td style={{ padding: '18px 32px', color: 'var(--muted)' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="grid grid-2" style={{ alignItems: 'center', gap: '48px' }}>
              <div>
                <h3 style={{ marginBottom: '16px' }}>ENGINEERED TO ATTACK</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
                  Low-bow carbon profile built for the drag-flick that ends arguments. Every layer of carbon is pressed under pro-spec tension to deliver whip-fast release without sacrificing control on the receive.
                </p>
                <p style={{ color: 'var(--muted)' }}>
                  This isn't a shelf stick. It's tested on real turf, under real pressure, by players who don't get a second chance at the final whistle.
                </p>
              </div>
              <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
                <img src="https://picsum.photos/seed/carbon-macro1/900/700" alt="Macro detail of carbon fiber hockey stick construction" width="900" height="700" className="img-cover" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Reviews & Ratings */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '20px' }}></div>
            <h2>PROVEN ON THE PITCH</h2>
            <p style={{ color: 'var(--muted)' }}>Real players. Real rebounds. Real opinions.</p>
          </div>

          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
            <div>
              {reviews.length === 0 && (
                <p style={{ color: 'var(--muted)' }}>No reviews yet — be the first player on the pitch to rate this gear.</p>
              )}
              {reviews.map((r) => (
                <div key={r._id} className="testimonial" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: 'var(--text)' }}>{r.reviewerName || 'Anonymous Player'}</strong>
                    {r.verifiedBuyer && <Badge variant="success" size="sm">Verified Buyer</Badge>}
                  </div>
                  <div style={{ color: 'var(--secondary)', marginBottom: '8px' }}>
                    {'★'.repeat(Number(r.rating) || 0)}{'☆'.repeat(5 - (Number(r.rating) || 0))}
                  </div>
                  <p className="testimonial-text">{r.comment}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Leave A Review</h3>
              {reviewSuccess ? (
                <Alert variant="success" title="Thanks for the feedback!">
                  ✓ Your review was received and will appear once published.
                </Alert>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  <Input label="Your Name" name="reviewerName" value={reviewForm.reviewerName} onChange={handleReviewChange} placeholder="e.g. Sarah K." />
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', color: 'var(--text)' }}>Rating</label>
                    <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <Textarea label="Comment" name="comment" value={reviewForm.comment} onChange={handleReviewChange} rows={4} placeholder="How did it perform on the turf?" />
                  {reviewError && <Alert variant="error">{reviewError}</Alert>}
                  <Button type="submit" variant="primary" loading={reviewLoading} fullWidth>
                    {reviewLoading ? 'Submitting…' : 'Submit Review'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: You Might Also Need */}
      {relatedProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head" style={{ textAlign: 'left', marginBottom: '40px' }}>
              <div style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '20px' }}></div>
              <h2>ROUND OUT YOUR KIT</h2>
              <p style={{ color: 'var(--muted)' }}>Complete the kit. Finish the job.</p>
            </div>

            <div className="grid grid-4">
              {relatedProducts.map((p) => {
                const img = (p.images || '').split(',')[0] || `https://picsum.photos/seed/related-${p._id}/600/600`;
                return (
                  <Link key={p._id} to={`/product/${p.slug || p._id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: 0, border: '1px solid var(--border)' }}>
                    <div style={{ overflow: 'hidden', aspectRatio: '1 / 1' }}>
                      <img src={img} alt={p.name || 'Related product'} width="600" height="600" className="img-cover" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <span className="badge" style={{ background: 'var(--accent)', color: 'var(--text)', borderRadius: 0, transform: 'skew(-6deg)', display: 'inline-block', padding: '4px 10px', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        {categoryLabel(p.category)}
                      </span>
                      <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{p.name || 'Unnamed Product'}</h3>
                      <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>${Number(p.price || 0).toFixed(2)}</strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>UNSURE WHICH STICK FITS YOUR GAME?</h2>
          <p style={{ marginBottom: '32px' }}>Talk to the AMI gear desk — we'll help you dial in the right weight, bow, and grip before you buy.</p>
          <Link to="/contact"><Button variant="secondary" size="lg">Talk To The Team</Button></Link>
        </div>
      </div>

    </div>
  );
}