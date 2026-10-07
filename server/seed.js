const mongoose = require('mongoose');

// Grab model definitions dynamically to prevent absolute import errors.
// Since the environment is managed, requiring './models/Product' is typical.
// We provide fallback model definitions in case the models aren't instantiated yet,
// or we require them. Assuming standard MERN structure where models are at './models/ModelName'
const Product = require('./models/Product');
const Review = require('./models/Review');
// Stockist model removed — not in generated schema

async function seedDatabase() {
  try {
    console.log('AMI Seed: Checking existing collection counts...');

    // 1. Seed Products
    const productCount = await Product.countDocuments();
    let seededProducts = [];

    if (productCount === 0) {
      console.log('AMI Seed: Seeding products into database...');
      const productsToSeed = [
        {
          name: "AMI VELOCITY X1 CARBON",
          slug: "ami-velocity-x1-carbon",
          category: "Hockey Sticks",
          price: 285.00,
          compareAtPrice: 320.00,
          skillLevel: "pro",
          material: "95% Premium Toray Carbon, 5% Kevlar",
          weight: "525g Light",
          bowType: "Extreme Low Bow",
          colors: ["Pro Green/Teal", "Kinetic Charcoal/Orange"],
          images: [
            "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1606907291416-0a0680f4f039?auto=format&fit=crop&w=800&q=80"
          ],
          description: "Engineered for high-impact drag flicking and lightning fast aerials. Constructed using aerospace grade Toray carbon with high torsional stiffness. It won't flinch under maximum pressure in the D.",
          specs: {
            "Carbon Content": "95% Toray Carbon",
            "Bow Position": "200mm",
            "Bow Height": "24.8mm",
            "Grip Tech": "Aero-Gel Anti-Vibe Cushion Grip",
            "Face Profile": "Aggressive 2mm groove for maximum drag control"
          },
          stock: 45,
          rating: 4.9,
          featured: true
        },
        {
          name: "AMI PRO VORTEX MID-BOW",
          slug: "ami-pro-vortex-mid-bow",
          category: "Hockey Sticks",
          price: 195.00,
          compareAtPrice: 220.00,
          skillLevel: "intermediate",
          material: "75% Carbon, 15% Fiberglass, 10% Aramid",
          weight: "540g Medium",
          bowType: "Standard Mid Bow",
          colors: ["Volt Green/Gloss Black", "Ice White/Slate"],
          images: [
            "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
          ],
          description: "The ultimate midfielder's weapon. Offers balanced play, clean distributions, and elite sweep-hit control. Features our textured surface technology on the head for superior first touch and control.",
          specs: {
            "Carbon Content": "75% Carbon",
            "Bow Position": "300mm",
            "Bow Height": "24.0mm",
            "Grip Tech": "Super-Tack Performance Wrap",
            "Face Profile": "Textured Touch Face"
          },
          stock: 60,
          rating: 4.7,
          featured: true
        },
        {
          name: "AMI STRIKER MATCH JERSEY",
          slug: "ami-striker-match-jersey",
          category: "Match Kit",
          price: 49.00,
          compareAtPrice: null,
          skillLevel: "beginner",
          material: "100% Recycled Aerodry Polyester Mesh",
          weight: "180g Ultra-light",
          bowType: "N/A",
          colors: ["Turf Green", "Kinetic Orange", "Pro Charcoal"],
          images: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
          ],
          description: "Pro-fit match jersey featuring sweat-wicking Aerodry knit. Constructed with flat-lock anti-chafing seams and high-stretch side ventilation panels to optimize movement on match days.",
          specs: {
            "Fabric Blend": "100% Eco-Aerodry Mesh",
            "Fit Profile": "Athletic compression-ready fit",
            "Stitching": "Anti-friction flat-lock standard",
            "Breathability Score": "9.8/10",
            "Eco-Friendly": "Made with 12 recycled plastic bottles"
          },
          stock: 120,
          rating: 4.8,
          featured: true
        },
        {
          name: "AMI OCTANE PADEL RACKET",
          slug: "ami-octane-padel-racket",
          category: "Paddle Rackets",
          price: 215.00,
          compareAtPrice: 245.00,
          skillLevel: "pro",
          material: "12K Carbon Fiber with Soft EVA Core",
          weight: "365g Premium Light",
          bowType: "N/A",
          colors: ["Neon Green/Midnight Matte", "Hot Coral/Carbon Silver"],
          images: [
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616244602907-af117fb6d13c?auto=format&fit=crop&w=800&q=80"
          ],
          description: "Engineered with a diamond shape and a high sweet spot for absolute smash dominance. The 12K carbon fiber face delivers explosive power feedback, coupled with a 3D hexagonal grit surface for massive spin.",
          specs: {
            "Racket Shape": "Diamond Power-Profile",
            "Frame Core": "Density Soft EVA Matrix",
            "Face Weave": "Premium 12K Carbon Filament",
            "Surface Finish": "3D Hexagonal Spin Grit Texture",
            "Balance Point": "270mm High-Head Balance"
          },
          stock: 30,
          rating: 5.0,
          featured: true
        },
        {
          name: "AMI PRO GRIP SHIN GUARDS",
          slug: "ami-pro-grip-shin-guards",
          category: "Accessories",
          price: 32.00,
          compareAtPrice: 38.00,
          skillLevel: "intermediate",
          material: "High Impact Thermoplastic PP Shell, EVA Foam Backing",
          weight: "140g Pair",
          bowType: "N/A",
          colors: ["Slate Green", "Carbon Black"],
          images: [
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
          ],
          description: "Rigid thermoplastic outer shield combined with shock-absorbing EVA foam ensures complete protection in the D. Anatomical left/right fit with optimal airflow ventilation ports.",
          specs: {
            "Impact Class": "Professional CE Certified Shield",
            "Lining Material": "Breathable Moisture-Wicking EVA Cushion",
            "Strapping": "Dual adjustable stretch elastic with velcro",
            "Weight Per Guard": "70 grams"
          },
          stock: 90,
          rating: 4.6,
          featured: false
        },
        {
          name: "AMI ALL-WEATHER KIT BAG XL",
          slug: "ami-all-weather-kit-bag-xl",
          category: "Accessories",
          price: 75.00,
          compareAtPrice: 89.00,
          skillLevel: "beginner",
          material: "1200D Water-Resistant Ripstop Nylon",
          weight: "1.2kg empty",
          bowType: "N/A",
          colors: ["Pitch Black", "Turf Green Elite"],
          images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
          ],
          description: "High-capacity gear and stick bag equipped with independent stick sleeves (holds up to 4 sticks), dynamic ventilated wet clothes pocket, and armored valuables compartment.",
          specs: {
            "Capacity Volume": "72 Liters",
            "Waterproofing": "Hydro-Shield IPX4 Coating",
            "Zippers": "Heavy-duty rustproof YKK tactical zippers",
            "Stick Capacity": "Dedicated slot fitting up to 4 sticks easily"
          },
          stock: 50,
          rating: 4.9,
          featured: true
        }
      ];

      seededProducts = await Product.insertMany(productsToSeed);
      console.log(`AMI Seed: Successfully inserted ${seededProducts.length} premium products.`);
    } else {
      console.log('AMI Seed: Products already exist, bypassing seed.');
      seededProducts = await Product.find({});
    }

    // 2. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && seededProducts.length > 0) {
      console.log('AMI Seed: Seeding reviews for products...');
      const reviewsToSeed = [];

      seededProducts.forEach((prod) => {
        reviewsToSeed.push(
          {
            productId: prod._id,
            reviewerName: "Alex McArthur (National Midfielder)",
            rating: 5,
            comment: `The material of this ${prod.name} is incredible. It gave me the precision of a surgeon in the scoring circle. Best balance I have felt in years.`,
            verifiedBuyer: true,
            createdAt: new Date()
          },
          {
            productId: prod._id,
            reviewerName: "Sarah Thorne (HC Amsterdam Coach)",
            rating: 4,
            comment: `We supplied our entire first team division with the ${prod.name}. The durability is incredible under heavy daily drag-flicks. Extreme value.`,
            verifiedBuyer: true,
            createdAt: new Date()
          }
        );
      });

      await Review.insertMany(reviewsToSeed);
      console.log('AMI Seed: Successfully inserted product reviews.');
    } else {
      console.log('AMI Seed: Reviews already exist or no products available.');
    }

    console.log('AMI Seed Process Completed Successfully.');
  } catch (error) {
    console.error('AMI Seed: Error running seed process:', error);
  }
}

// Run immediately as an async self-contained flow.
// No connection lifecycle is handled here because the parent server manages it.
(async () => {
  await seedDatabase();
})();

module.exports = seedDatabase;