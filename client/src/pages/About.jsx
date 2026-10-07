import { Link } from 'react-router-dom';

export default function About() {
  const timeline = [
    {
      step: '01',
      title: 'Material Sourcing',
      copy: 'We hand-select aerospace-grade carbon fiber, fiberglass weaves, and plantation wood — nothing enters the lamination room until it passes our raw-material spec sheet.'
    },
    {
      step: '02',
      title: 'Lamination & Pressing',
      copy: 'Layers are hand-laid at precise fiber angles, then heat-pressed under controlled pressure to lock in the bow profile and strike stiffness our engineers design for.'
    },
    {
      step: '03',
      title: 'Pro Testing',
      copy: 'Every prototype gets handed to our sponsored athletes before it gets handed to you. If it flinches on a drag-flick, it goes back to the lab.'
    },
    {
      step: '04',
      title: 'Quality Check',
      copy: '200 drag-flicks, a torque test, and a visual inspection under raking light. One failed check and the stick never leaves the facility.'
    },
    {
      step: '05',
      title: 'Shipped',
      copy: 'Packed, logged, and sent to your door — or your local stockist — ready to be unboxed and used in anger on matchday one.'
    }
  ];

  const team = [
    {
      name: 'Priya Nandakumar',
      role: 'Head of Product Engineering',
      quote: 'We chase the millimeter nobody else bothers to measure.',
      img: 'https://i.pravatar.cc/300?img=47'
    },
    {
      name: 'Marcus Oduya',
      role: 'National-Level Midfielder, Team AMI',
      quote: 'I\u2019ve broken three sticks testing prototypes. Worth it every time.',
      img: 'https://i.pravatar.cc/300?img=12'
    },
    {
      name: 'Elena Castillo',
      role: 'Paddle Rackets Lead Designer',
      quote: 'Padel players feel grip and balance before they feel anything else — we obsess over both.',
      img: 'https://i.pravatar.cc/300?img=32'
    },
    {
      name: 'Dev Kapoor',
      role: 'Lamination Floor Supervisor',
      quote: 'Every stick that leaves this floor has my name on the QC log. That\u2019s not pressure, that\u2019s pride.',
      img: 'https://i.pravatar.cc/300?img=51'
    }
  ];

  return (
    <div className="about-page">
      {/* Compact Page Hero */}
      <section className="hero" style={{ minHeight: '46vh' }}>
        <img
          className="hero-bg"
          src="https://picsum.photos/seed/amifactory1/1600/900"
          alt="AMI factory floor with hockey sticks in production"
        />
        <div className="container">
          <span className="eyebrow">Our Story</span>
          <h1>
            WE DON'T MAKE EQUIPMENT. <span className="gradient-text">WE MAKE</span> WEAPONS OF INTENT.
          </h1>
          <p className="hero-subtitle">
            AMI started on a dusty club turf with one broken stick and a better idea.
          </p>
        </div>
      </section>

      {/* Section 1: Mission Statement */}
      <section className="section animate-in">
        <div className="container container-narrow">
          <div className="section-head">
            <div className="section-divider" style={{ width: '80px', height: '4px', background: 'var(--accent)', margin: '0 auto 24px' }}></div>
            <h2>THE MILLIMETER THAT MATTERS</h2>
          </div>
          <p style={{
            fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)',
            fontWeight: 700,
            textAlign: 'center',
            color: 'var(--text)',
            lineHeight: 1.4,
            maxWidth: '880px',
            margin: '0 auto'
          }}>
            We believe the gap between <em>almost</em> and <em>champion</em> is one millimeter of better
            engineering. We close that gap — in the bow of a stick, the tension of a paddle string bed,
            and the stitch of a kit bag seam.
          </p>
          <div className="grid grid-3" style={{ marginTop: '64px' }}>
            <div className="card">
              <div className="stat-value" style={{ textShadow: '2px 2px 0 var(--accent)' }}>30+</div>
              <div className="stat-label">Years Engineering Sticks</div>
            </div>
            <div className="card">
              <div className="stat-value" style={{ textShadow: '2px 2px 0 var(--accent)' }}>500</div>
              <div className="stat-label">Clubs Equipped Worldwide</div>
            </div>
            <div className="card">
              <div className="stat-value" style={{ textShadow: '2px 2px 0 var(--accent)' }}>200</div>
              <div className="stat-label">Drag-Flicks Per QC Test</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Craftsmanship Process Timeline */}
      <section className="section animate-in" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-divider" style={{ width: '80px', height: '4px', background: 'var(--accent)', margin: '0 auto 24px' }}></div>
            <span className="eyebrow">Craftsmanship Process</span>
            <h2>HOW AN AMI STICK IS BORN</h2>
            <p>Every AMI stick survives 200 drag-flicks before it ever reaches yours.</p>
          </div>
          <div className="grid grid-3">
            {timeline.map((t) => (
              <div className="step card" key={t.step}>
                <div className="step-num">{t.step}</div>
                <h3>{t.title}</h3>
                <p className="muted" style={{ color: 'var(--muted)' }}>{t.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Durability Guarantee */}
      <section className="section animate-in">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <div className="section-divider" style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '24px' }}></div>
              <span className="eyebrow">Durability Guarantee</span>
              <h2>BUILT TO TAKE THE HIT, NOT JUST GIVE IT</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted)', marginTop: '16px' }}>
                Every AMI stick, racket, and kit bag ships with our 12-month Strike Guarantee.
                If a lamination fault or stitching failure shows up under normal match use, we
                replace it — no fine print, no runaround.
              </p>
              <ul style={{ marginTop: '24px', paddingLeft: '20px', color: 'var(--text)', lineHeight: 2 }}>
                <li>12-month manufacturing defect warranty on all sticks & rackets</li>
                <li>Free re-grip service within the first 90 days</li>
                <li>Dedicated gear desk for warranty claims, 9AM–7PM daily</li>
              </ul>
              <div style={{ marginTop: '32px' }}>
                <Link to="/shop" className="btn-primary">Shop The Range</Link>
              </div>
            </div>
            <div className="gallery-item" style={{ height: '420px' }}>
              <img
                src="https://picsum.photos/seed/amidurability1/900/700"
                alt="Close-up of hockey stick striking ball with turf spray"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="gallery-overlay">
                <span>Stress-tested on live turf, every single batch.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Meet The Team / Athletes */}
      <section className="section animate-in" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-divider" style={{ width: '80px', height: '4px', background: 'var(--accent)', margin: '0 auto 24px' }}></div>
            <span className="eyebrow">The Squad Behind The Brand</span>
            <h2>THE SQUAD BEHIND THE BRAND</h2>
            <p>The people who test what we build — before you ever pick it up.</p>
          </div>
          <div className="grid grid-4">
            {team.map((member) => (
              <div className="card" key={member.name} style={{ textAlign: 'center' }}>
                <img
                  className="avatar"
                  src={member.img}
                  alt={`Portrait of ${member.name}, ${member.role}`}
                  width="96"
                  height="96"
                  style={{ margin: '0 auto 16px' }}
                />
                <h3>{member.name}</h3>
                <p className="badge" style={{ display: 'inline-block', margin: '8px 0' }}>{member.role}</p>
                <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>&ldquo;{member.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Sustainability / Community Commitment */}
      <section className="section animate-in">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div className="gallery-item" style={{ height: '380px' }}>
              <img
                src="https://picsum.photos/seed/amigrassroots1/900/700"
                alt="Youth players practicing field hockey on turf"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="gallery-overlay">
                <span>Grassroots turf programs funded by every AMI purchase.</span>
              </div>
            </div>
            <div>
              <div className="section-divider" style={{ width: '80px', height: '4px', background: 'var(--accent)', marginBottom: '24px' }}></div>
              <span className="eyebrow">Giving Back To The Game</span>
              <h2>GIVING BACK TO THE GAME</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted)', marginTop: '16px' }}>
                We reinvest in grassroots turf programs because the next champion is still learning
                to dribble. A portion of every sale funds AMI Academy kits for under-resourced clubs,
                and our offcut carbon is recycled into training aids instead of landfill.
              </p>
              <div className="grid grid-2" style={{ marginTop: '32px' }}>
                <div className="card">
                  <div className="stat-value" style={{ fontSize: '2rem', textShadow: '2px 2px 0 var(--accent)' }}>18</div>
                  <div className="stat-label">Academies Sponsored</div>
                </div>
                <div className="card">
                  <div className="stat-value" style={{ fontSize: '2rem', textShadow: '2px 2px 0 var(--accent)' }}>1,200+</div>
                  <div className="stat-label">Youth Kits Donated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="cta-section animate-in">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>READY TO GEAR UP?</h2>
          <p style={{ marginBottom: '32px' }}>
            From club debutants to national-level attackers — there's an AMI stick, kit piece, or
            paddle racket engineered for your game.
          </p>
          <Link to="/shop" className="btn-primary">Shop The Range</Link>
        </div>
      </section>
    </div>
  );
}