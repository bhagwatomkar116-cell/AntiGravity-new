/**
 * VÉLOIR — Luxury Streetwear & Modern Casuals (Atelier Data Seed)
 * Curated High-Fashion Collections for Men & Women
 */

const INITIAL_PRODUCTS = [
  // =========================================================================
  // MEN'S COLLECTION (URBAN STREETWEAR & HAUTE STREET)
  // =========================================================================
  {
    id: "prod-m01",
    name: "Acid Wash Cyberpunk Oversized Heavy Tee",
    gender: "men",
    category: "tees",
    badge: "DROP 01",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Acid Black", hex: "#1f1f1f" },
      { name: "Vintage Charcoal", hex: "#3f3f46" },
      { name: "Washed Indigo", hex: "#1e293b" }
    ],
    stockCount: 14,
    fit: "Oversized Boxy Silhouette",
    fabric: "240 GSM 100% Combed Bio-Washed Cotton",
    description: "Signature drop inspired by underground Tokyo streetwear. Drop-shoulder cut with custom acid enzyme wash for that lived-in vintage drape and heavy feel.",
    highlights: [
      "Heavyweight 240 GSM combed cotton fabric",
      "Reinforced rib-knit collar that will never sag",
      "Signature distressed hem detail",
      "Zero shrinkage & zero color bleed guarantee"
    ],
    reviews: [
      {
        id: "rev-m01-1",
        author: "Devansh Mehra",
        rating: 5,
        date: "24 Oct 2026",
        title: "The drape and weight is unreal for ₹499",
        comment: "This feels like a ₹3,000 streetwear tee from high-end brands. The 240 GSM cotton sits boxy and doesn't cling to the body at all. Already ordered in another color.",
        verified: true,
        helpful: 48
      },
      {
        id: "rev-m01-2",
        author: "Kabir S.",
        rating: 5,
        date: "20 Oct 2026",
        title: "Perfection in oversized styling",
        comment: "If you want true drop shoulders, stick to your regular size. If you want ultra baggy go one size up. The acid wash is subtle and premium.",
        verified: true,
        helpful: 29
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-m02",
    name: "Utility Parachute Multi-Pocket Cargos",
    gender: "men",
    category: "bottoms",
    badge: "BESTSELLER",
    price: 899,
    originalPrice: 1799,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 528,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Military Olive", hex: "#4a5335" },
      { name: "Stealth Black", hex: "#18181b" },
      { name: "Desert Sand", hex: "#bfa588" }
    ],
    stockCount: 8,
    fit: "Relaxed Baggy with Bungee Cuffs",
    fabric: "Matte Ripstop Cotton Blend",
    description: "6 deep cargo utility pockets, adjustable bungee ankle cuffs, and reinforced stitching engineered for effortless urban agility and sneaker matching.",
    highlights: [
      "6 ergonomic utility cargo compartments",
      "Adjustable toggles at hem for straight or tapered fit",
      "Reinforced knee gussets for durability",
      "Water-repellent matte finish"
    ],
    reviews: [
      {
        id: "rev-m02-1",
        author: "Aman Singhania",
        rating: 5,
        date: "25 Oct 2026",
        title: "Best cargos on the market right now",
        comment: "Stacking over high-top sneakers looks so clean. Pockets are actually functional and fit iPhone 15 Pro Max easily with room to spare.",
        verified: true,
        helpful: 67
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-m03",
    name: "Heavyweight Boxy Fleece Hoodie",
    gender: "men",
    category: "hoodies",
    badge: "FEEL GOOD",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#27272a" },
      { name: "Cream Oatmeal", hex: "#e5e5e5" },
      { name: "Forest Green", hex: "#1c3d2b" }
    ],
    stockCount: 19,
    fit: "Boxy Drop-Shoulder Relaxed",
    fabric: "380 GSM Brushed Terry Cotton",
    description: "Heavyweight thermal warmth without stiffness. Double-layered crossover hood with no eyelets for a clean minimalist architectural look.",
    highlights: [
      "Double-lined hood holds structured shape without drawstring",
      "Ribbed 2x2 cuffs and waistband",
      "Ultra-soft brushed fleece inner lining",
      "Kangaroo pocket with hidden headphone routing"
    ],
    reviews: [
      {
        id: "rev-m03-1",
        author: "Karan Johar B.",
        rating: 5,
        date: "18 Oct 2026",
        title: "380 GSM is super cozy!",
        comment: "The hood stands up perfectly like Yeezy / Fear of God hoodies. Incredible quality for this price.",
        verified: true,
        helpful: 35
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-m04",
    name: "Vintage College Varsity Bomber Jacket",
    gender: "men",
    category: "jackets",
    badge: "STATEMENT PIECE",
    price: 1499,
    originalPrice: 2999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Classic Navy/Tan", hex: "#1e293b" },
      { name: "All-Black Wool", hex: "#0f172a" }
    ],
    stockCount: 6,
    fit: "Relaxed Bomber Silhouette",
    fabric: "Wool-blend body with Vegan Leather Sleeves",
    description: "Varsity aesthetic inspired by vintage Ivy League athletics. Features custom felt chenille patches, striped ribbing, and diamond quilted lining.",
    highlights: [
      "High-density wool blend body",
      "Supple vegan leather sleeves",
      "Interior concealed chest pocket",
      "Diamond quilted insulating satin lining"
    ],
    reviews: [
      {
        id: "rev-m04-1",
        author: "Rohan Kulkarni",
        rating: 5,
        date: "26 Oct 2026",
        title: "Heavy & high street look",
        comment: "Gets compliments every time I wear it to college or parties. Looks way more expensive than it is.",
        verified: true,
        helpful: 52
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-m05",
    name: "Retro Graphic 'Stay Human' Oversized Tee",
    gender: "men",
    category: "tees",
    badge: "CONSCIOUS DROP",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 298,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vintage White", hex: "#f8fafc" },
      { name: "Coffee Brown", hex: "#451a03" },
      { name: "Sage Tint", hex: "#84a98c" }
    ],
    stockCount: 22,
    fit: "Relaxed Boxy Street Cut",
    fabric: "100% Organic Fair-Trade Bio-Washed Cotton",
    description: "Every purchase directly funds street youth art scholarships. High-definition puff-print graphic that never cracks or peels after washing.",
    highlights: [
      "High density puff print artwork",
      "100% Organic GOTS-certified cotton",
      "Supports conscious fashion initiatives"
    ],
    reviews: [
      {
        id: "rev-m05-1",
        author: "Tushar G.",
        rating: 5,
        date: "22 Oct 2026",
        title: "Print quality is insane",
        comment: "Soft fabric, nice puff text print, great cause. Definitely worth grabbing under ₹400.",
        verified: true,
        helpful: 21
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-m06",
    name: "90s Baggy Skater Denim Jeans",
    gender: "men",
    category: "bottoms",
    badge: "VIRAL FIT",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 388,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Vintage Mid Blue", hex: "#3b82f6" },
      { name: "Faded Grey", hex: "#6b7280" }
    ],
    stockCount: 11,
    fit: "Wide Leg 90s Vintage Drape",
    fabric: "13.5 Oz 100% Cotton Denim",
    description: "Authentic non-stretch raw drape denim engineered for the classic 90s skater stack over chunky sneakers and boots.",
    highlights: [
      "Heavyweight 13.5 oz denim",
      "Classic 5-pocket construction with antique brass rivets",
      "Loose thigh through hem profile"
    ],
    reviews: [
      {
        id: "rev-m06-1",
        author: "Sahil K.",
        rating: 5,
        date: "21 Oct 2026",
        title: "Finally real baggy jeans without looking sloppy",
        comment: "The waist fits true to size and the leg falls cleanly over my sneakers. Real 13.5 oz cotton denim.",
        verified: true,
        helpful: 39
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-m07",
    name: "Relaxed Resort Collar Textured Linen Shirt",
    gender: "men",
    category: "tees",
    badge: "SUMMER ESSENTIAL",
    price: 699,
    originalPrice: 1399,
    discount: "50% OFF",
    rating: 4.6,
    reviewCount: 172,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Natural Ivory", hex: "#fef08a" },
      { name: "Olive Tint", hex: "#65a30d" },
      { name: "Navy Ink", hex: "#1e3a8a" }
    ],
    stockCount: 15,
    fit: "Relaxed Camp Collar",
    fabric: "Slub Linen-Cotton Blend",
    description: "Textured waffle slub weave with open Cuban camp collar. Breezy, lightweight luxury ideal for cafe dates, vacations, and relaxed city evenings.",
    highlights: [
      "Textured slub linen blend for maximum breathability",
      "Cuban camp collar with clean French placket",
      "Real coconut shell buttons"
    ],
    reviews: [
      {
        id: "rev-m07-1",
        author: "Nikhil Joshi",
        rating: 5,
        date: "14 Oct 2026",
        title: "Super breathable and classy",
        comment: "Wore it on a Goa trip, super airy and photographs so well. Love the coconut buttons.",
        verified: true,
        helpful: 19
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-m08",
    name: "Heritage Distressed Denim Trucker Jacket",
    gender: "men",
    category: "jackets",
    badge: "TIMELESS",
    price: 1299,
    originalPrice: 2499,
    discount: "48% OFF",
    rating: 4.9,
    reviewCount: 241,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Washed Indigo", hex: "#1d4ed8" },
      { name: "Shadow Black", hex: "#0f172a" }
    ],
    stockCount: 7,
    fit: "Boxy Trucker Silhouette",
    fabric: "14 Oz Rigid Selvedge-Look Denim",
    description: "Stone-washed rugged trucker jacket with hand-distressed collars and seam abrasion. Built to age gracefully over decades of daily wear.",
    highlights: [
      "Heavy 14 oz rigid denim",
      "Hand-finished whiskering and fading",
      "Dual chest flap pockets and deep welt side pockets"
    ],
    reviews: [
      {
        id: "rev-m08-1",
        author: "Aditya Roy",
        rating: 5,
        date: "23 Oct 2026",
        title: "Heft and wash is top notch",
        comment: "This jacket has serious weight to it. The metal buttons feel sturdy. Perfect for layering over hoodies.",
        verified: true,
        helpful: 41
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-m09",
    name: "Cyber Neon Stealth Runner Sneakers",
    gender: "men",
    category: "shoes",
    badge: "KICKS DROP",
    price: 1399,
    originalPrice: 2799,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 462,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: [
      { name: "Triple White / Ice", hex: "#f8fafc" },
      { name: "Neon Cyber Grey", hex: "#475569" },
      { name: "Stealth Onyx", hex: "#18181b" }
    ],
    stockCount: 9,
    fit: "Cushioned Chunky Platform",
    fabric: "Breathable Tech Mesh & Vegan Microfiber",
    description: "Multi-layered cyber runner midsole with cloud bounce cushioning. Shock-absorbing heel bubble for 12+ hours of fatigue-free city walking.",
    highlights: [
      "Dual-density high-rebound EVA foam sole",
      "Reflective 3M night safety accents",
      "Memory foam orthotic insole included"
    ],
    reviews: [
      {
        id: "rev-m09-1",
        author: "Varun Bajaj",
        rating: 5,
        date: "25 Oct 2026",
        title: "Like walking on clouds",
        comment: "Wore these for 10 hours at a music festival. Zero heel pain and looks insane with baggy cargos.",
        verified: true,
        helpful: 88
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-m10",
    name: "Chelsea Combat Boots in Suede Leather",
    gender: "men",
    category: "shoes",
    badge: "LUXURY BOOT",
    price: 1799,
    originalPrice: 3599,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 164,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    colors: [
      { name: "Mocha Brown", hex: "#78350f" },
      { name: "Matte Black", hex: "#18181b" }
    ],
    stockCount: 5,
    fit: "Snug Ankle with Elastic Gusset",
    fabric: "Premium Waxed Micro-Suede Leather",
    description: "Rugged lugged commando outsole paired with sleek Italian chelsea silhouette. Pull tabs on front and back for easy slip-on wear.",
    highlights: [
      "Water-resistant waxed suede upper",
      "Chunky anti-slip rubber lug sole",
      "Cushioned leather lining"
    ],
    reviews: [
      {
        id: "rev-m10-1",
        author: "Sameer N.",
        rating: 5,
        date: "19 Oct 2026",
        title: "Sharp & elevated look",
        comment: "Pairs effortlessly with black jeans and bombers. Incredible finish for under ₹2k.",
        verified: true,
        helpful: 27
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-m11",
    name: "Heavy Cuban Link Sterling Silver Chain",
    gender: "men",
    category: "accessories",
    badge: "DRIP ESSENTIAL",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 319,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["20 Inch", "24 Inch"],
    colors: [
      { name: "Sterling Silver", hex: "#e2e8f0" },
      { name: "Dark Gunmetal", hex: "#334155" }
    ],
    stockCount: 26,
    fit: "Standard 8mm Curb Link",
    fabric: "Solid 316L Stainless Steel with Rhodium Plate",
    description: "Hypoallergenic, sweatproof, and waterproof. Will never rust, tarnish, or turn your skin green. Heavy diamond-cut beveled edges.",
    highlights: [
      "Guaranteed anti-tarnish & waterproof",
      "Heavyweight 8mm diamond-cut curb links",
      "Reinforced lobster claw lock"
    ],
    reviews: [
      {
        id: "rev-m11-1",
        author: "Pranav M.",
        rating: 5,
        date: "26 Oct 2026",
        title: "Shower with it every day - no fade",
        comment: "Tested it at the gym and swimming pool, looks brand new after 3 weeks. Solid weight.",
        verified: true,
        helpful: 45
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-m12",
    name: "Techwear Waterproof Crossbody Sling Bag",
    gender: "men",
    category: "accessories",
    badge: "EVERYDAY CARRY",
    price: 599,
    originalPrice: 1199,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size (4L)"],
    colors: [
      { name: "Matte Obsidian", hex: "#0f172a" },
      { name: "Cyber Khaki", hex: "#78716c" }
    ],
    stockCount: 16,
    fit: "Adjustable Quick-Release Strap",
    fabric: "Cordura Ballistic Waterproof Nylon",
    description: "Equipped with magnetic Fidlock-style buckle, waterproof YKK taped zippers, and dedicated padded pocket for iPad mini / Nintendo Switch.",
    highlights: [
      "Ballistic tear-resistant Cordura fabric",
      "Waterproof heat-sealed zippers",
      "Quick magnetic release buckle"
    ],
    reviews: [
      {
        id: "rev-m12-1",
        author: "Gaurav S.",
        rating: 5,
        date: "17 Oct 2026",
        title: "Fits all EDC essentials cleanly",
        comment: "Wallet, keys, power bank, sunglasses case all fit with zero bulk. Looks sleek.",
        verified: true,
        helpful: 33
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-m13",
    name: "Washed Corduroy Minimalist Skate Cap",
    gender: "men",
    category: "accessories",
    badge: "ACCESSIBLE STEAL",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.6,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Adjustable Strap"],
    colors: [
      { name: "Washed Khaki", hex: "#d4a373" },
      { name: "Onyx Black", hex: "#18181b" },
      { name: "Forest Green", hex: "#166534" }
    ],
    stockCount: 18,
    fit: "Unstructured Low-Profile 6-Panel",
    fabric: "8-Wale 100% Pure Cotton Corduroy",
    description: "Buttery soft corduroy ribbed texture with antique brass buckle adjuster. Subtle tonal VÉLOIR embroidery on back panel.",
    highlights: [
      "100% cotton soft ribbed corduroy",
      "Antique brass sizing slider",
      "Curved vintage bill"
    ],
    reviews: [
      {
        id: "rev-m13-1",
        author: "Raghav T.",
        rating: 5,
        date: "20 Oct 2026",
        title: "Perfect low profile fit",
        comment: "Doesn't look giant on small or medium heads. The corduroy texture is very rich.",
        verified: true,
        helpful: 16
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-m14",
    name: "Oversized Thermal Waffle Texture Henley",
    gender: "men",
    category: "tees",
    badge: "COZY DROP",
    price: 599,
    originalPrice: 1199,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 196,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Raw Oatmeal", hex: "#e7e5e4" },
      { name: "Dark Walnut", hex: "#44403c" },
      { name: "Vintage Slate", hex: "#475569" }
    ],
    stockCount: 12,
    fit: "Boxy Dropped Shoulder",
    fabric: "280 GSM Honeycomb Waffle Cotton",
    description: "Deep 3-button placket with heavy thermal honeycomb waffle weave. Keeps heat regulated indoors while looking effortlessly stylish outdoors.",
    highlights: [
      "Honeycomb knit retains shape after washing",
      "Horn-style buttons",
      "Thumbhole cuffs for winter layering"
    ],
    reviews: [
      {
        id: "rev-m14-1",
        author: "Ishaan P.",
        rating: 5,
        date: "26 Oct 2026",
        title: "Thermal texture is incredible",
        comment: "Heavy, warm, and drapes cleanly. Very cozy for autumn and winter.",
        verified: true,
        helpful: 24
      }
    ],
    isTrending: false,
    isNewDrop: true
  },

  // =========================================================================
  // WOMEN'S COLLECTION (GIRLY, CHIC, PARISIAN & AESTHETIC ATELIER)
  // =========================================================================
  {
    id: "prod-w01",
    name: "Parisian Rose Silk Slip Midi Dress",
    gender: "women",
    category: "dresses",
    badge: "ATELIER COUTURE",
    price: 899,
    originalPrice: 1799,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 478,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Blush Rose", hex: "#f472b6" },
      { name: "Champagne Gold", hex: "#fde047" },
      { name: "Midnight Noir", hex: "#0f172a" }
    ],
    stockCount: 9,
    fit: "Bias-Cut Fluid Feminine Drape",
    fabric: "Luxe Heavy Mulberry Satin Silk (Non-Sheer)",
    description: "Flattering bias cut that hugs curves gently without clinging. Adjustable delicate spaghetti straps, side slit detail, and opulent glossy sheen that radiates effortless Parisian charm.",
    highlights: [
      "Premium heavyweight satin silk that does not wrinkle easily",
      "Bias-cut construction for liquid-like body drape",
      "Concealed side zipper with French seams",
      "Lined bust panel for zero transparency"
    ],
    reviews: [
      {
        id: "rev-w01-1",
        author: "Ananya Deshmukh",
        rating: 5,
        date: "25 Oct 2026",
        title: "Got SO many compliments on date night!",
        comment: "The blush rose color is breathtaking in real life. It fits like a glove and the silk quality looks like an international designer piece. 1000% recommend!",
        verified: true,
        helpful: 92
      },
      {
        id: "rev-w01-2",
        author: "Simran Kapoor",
        rating: 5,
        date: "21 Oct 2026",
        title: "Liquid perfection",
        comment: "The side slit is so flattering and the satin has a nice weighty drape. Doesn't feel cheap or flimsy at all.",
        verified: true,
        helpful: 41
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-w02",
    name: "Soft Cloud Cropped Boxy Pastel Hoodie",
    gender: "women",
    category: "hoodies",
    badge: "COZY LUXE",
    price: 799,
    originalPrice: 1599,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 389,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Baby Pink", hex: "#f9a8d4" },
      { name: "Lavender Mist", hex: "#d8b4fe" },
      { name: "Vanilla Cream", hex: "#fef3c7" }
    ],
    stockCount: 14,
    fit: "Cropped Boxy with Cinch Hem",
    fabric: "340 GSM Cloud Terry Fleece",
    description: "Cute cropped length that hits right at the high-waist band. Cloud-soft marshmallow fleece lining, subtle heart tonal embroidery on wrist, and plush aesthetic hood.",
    highlights: [
      "Marshmallow fleece interior that stays soft after multiple washes",
      "Raw cinch hem with elastic toggle adjustment",
      "Subtle aesthetic embroidery on left cuff"
    ],
    reviews: [
      {
        id: "rev-w02-1",
        author: "Rhea Sen",
        rating: 5,
        date: "23 Oct 2026",
        title: "Cutest hoodie I own!",
        comment: "The baby pink shade is so dreamy. The sleeves are nice and baggy and the crop length pairs perfectly with high-waist cargos.",
        verified: true,
        helpful: 54
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-w03",
    name: "Ribbed Knit Contour Seamless Crop Top",
    gender: "women",
    category: "tees",
    badge: "VIRAL ESSENTIAL",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 512,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Blush Pink", hex: "#f472b6" },
      { name: "Sage Mint", hex: "#a7f3d0" },
      { name: "Pearl White", hex: "#fdf4ff" }
    ],
    stockCount: 28,
    fit: "Sculpting Bodycon Silhouette",
    fabric: "Double-Knit High Elastic Micro-Rib",
    description: "Seamless sculpting knit that shapes without restricting movement. Built-in shelf support so you can wear it braless with complete confidence.",
    highlights: [
      "Double-layered zero transparency fabric",
      "Sculpting contour compression",
      "Anti-roll square neckline"
    ],
    reviews: [
      {
        id: "rev-w03-1",
        author: "Tanvi Mathur",
        rating: 5,
        date: "24 Oct 2026",
        title: "Braless perfection under ₹400",
        comment: "It holds everything so neatly and the ribbed fabric is thick and double lined. Getting every color!",
        verified: true,
        helpful: 63
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-w04",
    name: "High-Waist Parachute Cargo Pants",
    gender: "women",
    category: "bottoms",
    badge: "Y2K STREETWEAR",
    price: 849,
    originalPrice: 1699,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 421,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["26", "28", "30", "32"],
    colors: [
      { name: "Soft Lilac", hex: "#e9d5ff" },
      { name: "Dusty Rose", hex: "#f43f5e" },
      { name: "Ivory Cream", hex: "#fef9c3" }
    ],
    stockCount: 11,
    fit: "Baggy Relaxed with Adjustable Bungee Waist",
    fabric: "Featherweight Crinkle Nylon",
    description: "Ultra-flattering high waist with bungee cord toggles. Balloon leg drape that swooshes effortlessly while pairing with platform sneakers or dainty heels.",
    highlights: [
      "Featherweight breathable crinkle nylon",
      "Bungee cinching at waist and ankles",
      "4 aesthetic utility flap pockets"
    ],
    reviews: [
      {
        id: "rev-w04-1",
        author: "Kavya S.",
        rating: 5,
        date: "25 Oct 2026",
        title: "The lilac color is EVERYTHING!",
        comment: "Super lightweight, doesn't feel hot at all. Waist cord cinches down nicely to give that hourglass silhouette.",
        verified: true,
        helpful: 47
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-w05",
    name: "Pleated Preppy Y2K Tennis Mini Skirt",
    gender: "women",
    category: "bottoms",
    badge: "PREPPY CHIC",
    price: 549,
    originalPrice: 1099,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 290,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Ballet Pink", hex: "#fbcfe8" },
      { name: "Cloud White", hex: "#ffffff" },
      { name: "Baby Blue", hex: "#bae6fd" }
    ],
    stockCount: 17,
    fit: "A-Line High-Waist Knife Pleats",
    fabric: "Structured Twill with Built-in Safety Shorts",
    description: "Crisp knife pleats that retain their razor-sharp fold wash after wash. Features stretchy built-in inner shorts for total peace of mind.",
    highlights: [
      "Permanent heat-set pleating",
      "Stretchy built-in modal inner safety shorts",
      "Side invisible zipper"
    ],
    reviews: [
      {
        id: "rev-w05-1",
        author: "Tara Bhatia",
        rating: 5,
        date: "19 Oct 2026",
        title: "Built-in shorts make it so easy to wear!",
        comment: "The pleats are super sharp and don't collapse. Perfect for college festivals and cafe photos.",
        verified: true,
        helpful: 36
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-w06",
    name: "Oversized Tailored Boyfriend Blazer",
    gender: "women",
    category: "jackets",
    badge: "PARISIAN GLAM",
    price: 1399,
    originalPrice: 2799,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Blush Peach", hex: "#fecdd3" },
      { name: "Cream Latte", hex: "#fef08a" },
      { name: "Dusty Mauve", hex: "#cbd5e1" }
    ],
    stockCount: 6,
    fit: "Oversized Power Shoulder Boxy",
    fabric: "Matte Wool-Blend Crepe with Satin Lining",
    description: "Chic power tailoring with subtle shoulder pads, tortoise buttons, and silky satin inner lining. Layer over dresses or cropped tees for an effortless model-off-duty vibe.",
    highlights: [
      "Structured lightweight shoulder pads",
      "Silky champagne satin interior lining",
      "Dual front flap pockets and welt breast pocket"
    ],
    reviews: [
      {
        id: "rev-w06-1",
        author: "Meera Singhal",
        rating: 5,
        date: "22 Oct 2026",
        title: "Looks straight out of Zara or Mango luxury line",
        comment: "The cut is immaculate. The shoulders give that high-fashion drape without looking boxy. Love the blush peach shade.",
        verified: true,
        helpful: 51
      }
    ],
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-w07",
    name: "Cottagecore Floral Tiered Ruffle Sundress",
    gender: "women",
    category: "dresses",
    badge: "SUMMER SILK",
    price: 899,
    originalPrice: 1799,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Petal Pink Floral", hex: "#fbcfe8" },
      { name: "Daisy Meadow", hex: "#fef08a" }
    ],
    stockCount: 8,
    fit: "Smocked Bodice with Flowing Tiered Ruffles",
    fabric: "100% Breathable Georgette with Pure Cotton Lining",
    description: "Romantic smocked stretchy bust that fits all body types comfortably. Flutter ruffle cap sleeves that can be worn on or off the shoulders.",
    highlights: [
      "Super stretchy smocked bodice for custom fit",
      "Dual side hidden pockets",
      "Full breathable cotton inner lining"
    ],
    reviews: [
      {
        id: "rev-w07-1",
        author: "Disha Varma",
        rating: 5,
        date: "16 Oct 2026",
        title: "Most comfortable and flattering dress!",
        comment: "It has pockets! The smocking is so gentle and doesn't dig in. Perfect for brunch or vacation.",
        verified: true,
        helpful: 29
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-w08",
    name: "Aesthetic Marshmallow Chunky Platform Sneakers",
    gender: "women",
    category: "shoes",
    badge: "PASTEL PLATFORM",
    price: 1299,
    originalPrice: 2599,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 367,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7"],
    colors: [
      { name: "Pink Marshmallow", hex: "#f472b6" },
      { name: "Holographic White", hex: "#ffffff" },
      { name: "Lavender Glow", hex: "#c084fc" }
    ],
    stockCount: 13,
    fit: "2.5-Inch Elevated Platform",
    fabric: "Vegan Leather with Soft Foam Padded Collar",
    description: "Gives an instant 2.5-inch height boost with zero foot strain. Super lightweight marshmallow sole with pastel color-blocked accents.",
    highlights: [
      "Ultra-cushioned 2.5-inch platform sole",
      "Breathable perforated toe box",
      "Stain-resistant easy-wipe vegan leather"
    ],
    reviews: [
      {
        id: "rev-w08-1",
        author: "Suhani Mehta",
        rating: 5,
        date: "24 Oct 2026",
        title: "So comfortable and adds height!",
        comment: "I was scared they would be heavy, but they feel like feathers on feet. The pastel pink details are so cute.",
        verified: true,
        helpful: 61
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-w09",
    name: "Strappy Square-Toe Block Party Heels",
    gender: "women",
    category: "shoes",
    badge: "PARTY GLAM",
    price: 1199,
    originalPrice: 2399,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7"],
    colors: [
      { name: "Rose Gold Metallic", hex: "#fb7185" },
      { name: "Nude Blush", hex: "#fed7aa" },
      { name: "Champagne Shimmer", hex: "#fde047" }
    ],
    stockCount: 7,
    fit: "2.8-Inch Stable Block Heel",
    fabric: "Metallic Vegan Leather with Latex Insole Cushioning",
    description: "Designed for all-night dancing. Modern minimalist strappy square toe paired with a sturdy block heel and memory latex ball-of-foot padding.",
    highlights: [
      "Anti-blister padded straps",
      "Latex arch cushion for maximum comfort",
      "Slip-resistant textured rubber heel cap"
    ],
    reviews: [
      {
        id: "rev-w09-1",
        author: "Zoya Siddiqui",
        rating: 5,
        date: "18 Oct 2026",
        title: "Danced for 4 hours without taking them off!",
        comment: "The block heel makes them super steady. The rose gold shine catches the light gorgeously in clubs and weddings.",
        verified: true,
        helpful: 38
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-w10",
    name: "Quilted Blush Leather Mini Crossbody Bag",
    gender: "women",
    category: "accessories",
    badge: "SIGNATURE BAG",
    price: 699,
    originalPrice: 1399,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 380,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Cotton Candy Pink", hex: "#f472b6" },
      { name: "Pearl Ivory", hex: "#f8fafc" },
      { name: "Rose Noir", hex: "#18181b" }
    ],
    stockCount: 15,
    fit: "Compact Crossbody / Shoulder Bag",
    fabric: "Quilted Napa Vegan Leather with Gold Chain",
    description: "Classic French diamond quilt stitch paired with a gleaming 18K gold-tone woven leather chain. Fits iPhone, lipstick, cardholder, and keys.",
    highlights: [
      "Diamond pattern quilted stitching",
      "Turn-lock gold closure mechanism",
      "Inner zippered security card pocket"
    ],
    reviews: [
      {
        id: "rev-w10-1",
        author: "Nisha Patel",
        rating: 5,
        date: "25 Oct 2026",
        title: "Feels like Chanel at a fraction of the cost",
        comment: "The chain has good weight to it and the leather feels buttery smooth. Truly an everyday favorite.",
        verified: true,
        helpful: 75
      }
    ],
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-w11",
    name: "Dainty Layered Butterfly 18K Rose Gold Necklace",
    gender: "women",
    category: "accessories",
    badge: "ROSE GOLD ATELIER",
    price: 449,
    originalPrice: 899,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 265,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Adjustable 16-18 Inch"],
    colors: [
      { name: "18K Rose Gold", hex: "#fb7185" },
      { name: "Shimmer Silver", hex: "#e2e8f0" }
    ],
    stockCount: 20,
    fit: "Double Layer Clavicle Choker",
    fabric: "Anti-Tarnish Surgical Steel with 18K Rose Gold Dip",
    description: "Two cascading delicate chains with a micro-pavé cubic zirconia butterfly pendant. 100% waterproof and hypoallergenic.",
    highlights: [
      "Anti-tarnish PVD gold coating",
      "Sparkling AAA cubic zirconia crystals",
      "Adjustable extension chain"
    ],
    reviews: [
      {
        id: "rev-w11-1",
        author: "Alia Fernandes",
        rating: 5,
        date: "21 Oct 2026",
        title: "So delicate and pretty!",
        comment: "Looks gorgeous on collarbones. The butterfly sparkles subtly. Doesn't tangle easily.",
        verified: true,
        helpful: 34
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-w12",
    name: "Y2K Frameless Tinted Sunset Sunglasses",
    gender: "women",
    category: "accessories",
    badge: "AESTHETIC VIBE",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 182,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Universal Fit"],
    colors: [
      { name: "Rose Sunset Tint", hex: "#f472b6" },
      { name: "Golden Amber", hex: "#f59e0b" }
    ],
    stockCount: 24,
    fit: "Frameless Lightweight Oval",
    fabric: "UV400 Polycarbonate Lens with Metal Temples",
    description: "Iconic Y2K celebrity street style shades. Rimless gradient tinted lenses with sparkling rhinestone temple hinges and complete UV400 sun protection.",
    highlights: [
      "Full UV400 UVA & UVB protection",
      "Ultra-lightweight frameless design",
      "Silicone soft nose pads"
    ],
    reviews: [
      {
        id: "rev-w12-1",
        author: "Sanika R.",
        rating: 5,
        date: "19 Oct 2026",
        title: "Instant cool girl energy",
        comment: "They don't leave red marks on my nose and the gradient rose tint makes everything look aesthetic.",
        verified: true,
        helpful: 28
      }
    ],
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-w13",
    name: "Vintage Sweetheart Ruched Milkmaid Top",
    gender: "women",
    category: "tees",
    badge: "PARISIAN FAVORITE",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 320,
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Ivory Daisy", hex: "#fef9c3" },
      { name: "Pastel Pink", hex: "#fbcfe8" },
      { name: "Sky Blue", hex: "#bae6fd" }
    ],
    stockCount: 16,
    fit: "Sweetheart Bust with Puff Cap Sleeves",
    fabric: "100% Breathable Poplin Cotton",
    description: "Milkmaid bustier silhouette with tie-front bow ribbon and smocked elastic back panel for total flexibility and comfort.",
    highlights: [
      "Adjustable front tie ribbon",
      "Smocked back allows 3-4 inches of stretch",
      "Elasticated puff sleeves can be worn on or off-shoulder"
    ],
    reviews: [
      {
        id: "rev-w13-1",
        author: "Isha Nair",
        rating: 5,
        date: "23 Oct 2026",
        title: "Fits like a dream",
        comment: "The smocked back makes it so forgiving if your chest size fluctuates. Looks stunning with high-waist denim.",
        verified: true,
        helpful: 42
      }
    ],
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-w14",
    name: "Cozy Pastel Knit Cardigan & Cami Twin Set",
    gender: "women",
    category: "hoodies",
    badge: "CASHMERE TOUCH",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 274,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS/S", "M/L"],
    colors: [
      { name: "Strawberry Milk", hex: "#f472b6" },
      { name: "Mint Pistachio", hex: "#a7f3d0" },
      { name: "Cloud Grey", hex: "#cbd5e1" }
    ],
    stockCount: 10,
    fit: "Relaxed Cropped 2-Piece Twinset",
    fabric: "Cashmere-Feel Fluffy Brushed Chenille",
    description: "Includes matching spaghetti camisole top and cropped chunky knit cardigan with pearlescent buttons. Softest texture imaginable with zero itchiness.",
    highlights: [
      "Includes both cami and matching cardigan",
      "Feather-soft non-itchy chenille yarn",
      "Vintage pearlescent floral buttons"
    ],
    reviews: [
      {
        id: "rev-w14-1",
        author: "Pranali Joshi",
        rating: 5,
        date: "26 Oct 2026",
        title: "Obsessed with this set!",
        comment: "The strawberry milk color is so pretty and the fabric is unbelievably soft. Can be styled together or separately.",
        verified: true,
        helpful: 49
      }
    ],
    isTrending: true,
    isNewDrop: true
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-94821",
    customer: {
      name: "Aryan Sharma",
      email: "aryan.sharma@example.com",
      phone: "+91 98201 12345",
      address: "B-402, High Street Heights, Bandra West",
      city: "Mumbai",
      pincode: "400050"
    },
    items: [
      { id: "prod-m01", name: "Acid Wash Cyberpunk Oversized Heavy Tee", size: "L", color: "Acid Black", price: 499, qty: 2 },
      { id: "prod-m02", name: "Utility Parachute Multi-Pocket Cargos", size: "32", color: "Military Olive", price: 899, qty: 1 }
    ],
    subtotal: 1897,
    discountAmount: 189,
    shippingFee: 0,
    total: 1708,
    paymentMethod: "UPI (Google Pay)",
    status: "Delivered",
    date: "2026-10-26 14:32",
    carrier: "Express Courier Logistics (AWB #EX98214)",
    trackingSteps: [
      { label: "Order Confirmed", date: "26 Oct, 02:32 PM", completed: true },
      { label: "Packed at Warehouse (Bhiwandi Hub)", date: "26 Oct, 05:00 PM", completed: true },
      { label: "Dispatched & In Transit", date: "26 Oct, 09:30 PM", completed: true },
      { label: "Out for Delivery", date: "27 Oct, 09:15 AM", completed: true },
      { label: "Delivered", date: "27 Oct, 01:20 PM", completed: true }
    ]
  },
  {
    id: "prod-w01-ord",
    customer: {
      name: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      phone: "+91 98199 44321",
      address: "Flat 12A, Rosewood Towers, Indiranagar",
      city: "Bengaluru",
      pincode: "560038"
    },
    items: [
      { id: "prod-w01", name: "Parisian Rose Silk Slip Midi Dress", size: "S", color: "Blush Rose", price: 899, qty: 1 },
      { id: "prod-w10", name: "Quilted Blush Leather Mini Crossbody Bag", size: "One Size", color: "Cotton Candy Pink", price: 699, qty: 1 }
    ],
    subtotal: 1598,
    discountAmount: 160,
    shippingFee: 0,
    total: 1438,
    paymentMethod: "Credit Card (HDFC)",
    status: "Shipped",
    date: "2026-10-27 09:45",
    carrier: "Bluedart Air Express (AWB #BD48291)",
    trackingSteps: [
      { label: "Order Confirmed", date: "27 Oct, 09:45 AM", completed: true },
      { label: "Packed at Mumbai Atelier", date: "27 Oct, 12:30 PM", completed: true },
      { label: "In Flight to Bengaluru", date: "27 Oct, 06:10 PM", completed: true },
      { label: "Out for Delivery", date: "Tomorrow by 11 AM", completed: false },
      { label: "Delivered", date: "Pending", completed: false }
    ]
  }
];

const INITIAL_COUPONS = [
  { code: "VELOIR10", discountPercent: 10, minSpend: 499, description: "Maison VÉLOIR Atelier: 10% Off on Orders above ₹499" },
  { code: "GIRLY20", discountPercent: 20, minSpend: 999, description: "Women's Chic Glam Special: 20% Off on Orders above ₹999" },
  { code: "STREET20", discountPercent: 20, minSpend: 999, description: "Men's Streetwear Special: 20% Off on Orders above ₹999" },
  { code: "FREESHIP", flatDiscount: 99, minSpend: 0, description: "Complimentary Express Courier Shipping" },
  { code: "AMAZON50", flatDiscount: 50, minSpend: 499, description: "Instant Flat ₹50 Privilege Discount" }
];
