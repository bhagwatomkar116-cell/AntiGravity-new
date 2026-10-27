/**
 * URBN KULT // BE HUMAN - Seed Data
 * Fusion of Zudio (Fast, trendy, accessible ₹399-₹999) & Being Human (Conscious, street casuals)
 */

const INITIAL_PRODUCTS = [
  {
    id: "prod-01",
    name: "Acid Wash Cyberpunk Oversized Tee",
    category: "tees",
    badge: "🔥 DROP #01",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 324,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Acid Black", hex: "#1f1f1f" },
      { name: "Vintage Grey", hex: "#4a4e69" },
      { name: "Washed Blue", hex: "#2b2d42" }
    ],
    stockCount: 14,
    fit: "Oversized Boxy Fit",
    fabric: "240 GSM 100% Combed Heavy Cotton",
    description: "Signature drop inspired by underground Japanese streetwear. Drop-shoulder cut with acid enzyme wash for that lived-in vintage drape.",
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-02",
    name: "Utility Parachute Multi-Pocket Cargos",
    category: "bottoms",
    badge: "BESTSELLER",
    price: 899,
    originalPrice: 1799,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 512,
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
    fit: "Relaxed Baggy",
    fabric: "Matte Ripstop Cotton Blend",
    description: "6 deep cargo utility pockets, adjustable bungee ankle cuffs, and reinforced stitching for all-day urban movement.",
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-03",
    name: "Heavyweight Boxy Fleece Hoodie",
    category: "hoodies",
    badge: "FEEL GOOD",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 289,
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
    fit: "Boxy Drop-Shoulder",
    fabric: "380 GSM Ultra-Soft Brushed French Terry",
    description: "Thick double-layered hood with no drawstrings for a modern clean look. 10% of proceeds fund youth creative programs.",
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-04",
    name: "Vintage College Varsity Bomber Jacket",
    category: "jackets",
    badge: "LIMITED EDITION",
    price: 1499,
    originalPrice: 2999,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 182,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Classic Navy/Tan", hex: "#1e293b" },
      { name: "All-Black Wool", hex: "#0f172a" }
    ],
    stockCount: 4,
    fit: "Classic Regular Fit",
    fabric: "Wool-blend body with vegan leather sleeves",
    description: "Retro chenille embroidery with ribbed striped collar and snap-button closure. The ultimate layering statement.",
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-05",
    name: "Retro Graphic 'Stay Human' Oversized Tee",
    category: "tees",
    badge: "BEING HUMAN SOUL",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.6,
    reviewCount: 418,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Vintage White", hex: "#f8fafc" },
      { name: "Coffee Brown", hex: "#451a03" },
      { name: "Sage Tint", hex: "#84a98c" }
    ],
    stockCount: 32,
    fit: "Oversized Fit",
    fabric: "100% Sustainable Bio-Washed Cotton",
    description: "High-density puff print typography 'Stay Human, Stay Wild'. Breathable, lightweight yet durable for everyday wear.",
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-06",
    name: "90s Baggy Skater Denim Jeans",
    category: "bottoms",
    badge: "TRENDING NOW",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 376,
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
    fit: "Wide-Leg Skater Cut",
    fabric: "13.5 Oz 100% Rigid Denim",
    description: "Authentic 90s skater silhouette with loose thigh, straight knee, and relaxed pooling over sneakers.",
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-07",
    name: "Monochrome Minimalist Co-ord Set",
    category: "coords",
    badge: "ZUDIO VALUE",
    price: 799,
    originalPrice: 1599,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 165,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Terracotta Earth", hex: "#9a3412" },
      { name: "Pitch Black", hex: "#18181b" },
      { name: "Chalk White", hex: "#f1f5f9" }
    ],
    stockCount: 22,
    fit: "Relaxed Co-ord",
    fabric: "Soft Waffle Knit Cotton",
    description: "Matched boxy polo and relaxed shorts set. High versatility for effortless airport looks and casual brunches.",
    isTrending: false,
    isNewDrop: true
  },
  {
    id: "prod-08",
    name: "Heritage Distressed Denim Trucker Jacket",
    category: "jackets",
    badge: "CLASSIC",
    price: 1299,
    originalPrice: 2599,
    discount: "50% OFF",
    rating: 4.9,
    reviewCount: 442,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Indigo", hex: "#1d4ed8" },
      { name: "Shadow Black", hex: "#0f172a" }
    ],
    stockCount: 6,
    fit: "Regular Western Fit",
    fabric: "Heavyweight 14oz Washed Cotton Denim",
    description: "Custom antiqued copper buttons, subtle distressing, and double chest flap pockets with iconic red accent stitching.",
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-09",
    name: "Sage Pastel Oversized Minimal Hoodie",
    category: "hoodies",
    badge: "UNDER ₹799",
    price: 699,
    originalPrice: 1399,
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage Pastel", hex: "#94d2bd" },
      { name: "Lavender Fog", hex: "#b8bedd" },
      { name: "Sandstone", hex: "#ddbea9" }
    ],
    stockCount: 15,
    fit: "Oversized Fit",
    fabric: "320 GSM Cotton Terry",
    description: "Clean aesthetic with subtle tonal chest branding. Zudio-tier unbeatable price with premium softness.",
    isTrending: true,
    isNewDrop: true
  },
  {
    id: "prod-10",
    name: "Relaxed Resort Collar Textured Shirt",
    category: "tees",
    badge: "VACAY READY",
    price: 599,
    originalPrice: 1199,
    discount: "50% OFF",
    rating: 4.7,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Natural Ivory", hex: "#fef08a" },
      { name: "Olive Tint", hex: "#65a30d" }
    ],
    stockCount: 18,
    fit: "Cuban Camp Collar Relaxed",
    fabric: "Breathable Linen-Cotton Slub",
    description: "Airy textured slub weave, relaxed open Cuban collar, and wooden-finish buttons. Perfect for tropical evenings.",
    isTrending: false,
    isNewDrop: false
  },
  {
    id: "prod-11",
    name: "Chunky Cyber Streetwear Platform Sneakers",
    category: "accessories",
    badge: "HOT PICK",
    price: 1199,
    originalPrice: 2499,
    discount: "52% OFF",
    rating: 4.9,
    reviewCount: 620,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    colors: [
      { name: "Triple White / Ice", hex: "#f8fafc" },
      { name: "Neon Cyber Grey", hex: "#475569" }
    ],
    stockCount: 7,
    fit: "True to Size",
    fabric: "Breathable Mesh + Vegan Suede Overlay",
    description: "Cushioned 2-inch chunky platform sole with anti-slip traction grip and memory foam comfort insole.",
    isTrending: true,
    isNewDrop: false
  },
  {
    id: "prod-12",
    name: "Urban Utility Bucket Hat & Corduroy Cap",
    category: "accessories",
    badge: "UNDER ₹399",
    price: 349,
    originalPrice: 699,
    discount: "50% OFF",
    rating: 4.6,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size Fits All"],
    colors: [
      { name: "Washed Khaki", hex: "#d4a373" },
      { name: "Onyx Black", hex: "#18181b" }
    ],
    stockCount: 25,
    fit: "Adjustable Bungee Cord",
    fabric: "100% Heavy Cotton Twill",
    description: "Reversible streetwear bucket hat with concealed mini side pocket and breathable brass eyelets.",
    isTrending: false,
    isNewDrop: true
  }
];

const PRESET_OUTFITS = [
  {
    id: "look-01",
    title: "The Underground Gen-Z Drip",
    vibe: "Streetwear / College",
    topId: "prod-01",     // Acid Wash Tee
    bottomId: "prod-02",  // Cargo Pants
    accId: "prod-11",     // Chunky Sneakers
    savingsPercent: 15,
    tag: "Most Viral Fit"
  },
  {
    id: "look-02",
    title: "Varsity Legacy & Denim",
    vibe: "Retro Americana",
    topId: "prod-04",     // Varsity Jacket
    bottomId: "prod-06",  // 90s Baggy Denim
    accId: "prod-12",     // Bucket Hat
    savingsPercent: 18,
    tag: "Celebrity Favorite"
  },
  {
    id: "look-03",
    title: "Clean Minimalist Sunday",
    vibe: "Subtle Luxury",
    topId: "prod-09",     // Sage Hoodie
    bottomId: "prod-07",  // Co-ord Set
    accId: "prod-11",     // Sneakers
    savingsPercent: 15,
    tag: "Weekend Essential"
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-98412",
    customer: {
      name: "Aryan Sharma",
      email: "aryan.s@gmail.com",
      phone: "+91 98201 44102",
      address: "Flat 402, Skyline Towers, Andheri West, Mumbai, 400053"
    },
    items: [
      { id: "prod-01", name: "Acid Wash Cyberpunk Oversized Tee", size: "L", color: "Acid Black", price: 499, qty: 2 },
      { id: "prod-02", name: "Utility Parachute Multi-Pocket Cargos", size: "32", color: "Military Olive", price: 899, qty: 1 }
    ],
    subtotal: 1897,
    discountAmount: 189,
    shippingFee: 0,
    total: 1708,
    paymentMethod: "UPI / GPay",
    status: "Delivered",
    date: "2026-10-24 14:32",
    carrier: "Bluedart Express (AWB #BD892187391)",
    trackingSteps: [
      { label: "Order Confirmed", date: "24 Oct, 02:32 PM", completed: true },
      { label: "Packed at Warehouse (Bhiwandi)", date: "24 Oct, 06:15 PM", completed: true },
      { label: "Dispatched & In Transit", date: "25 Oct, 08:30 AM", completed: true },
      { label: "Out for Delivery", date: "26 Oct, 10:15 AM", completed: true },
      { label: "Delivered to Customer", date: "26 Oct, 02:40 PM", completed: true }
    ]
  },
  {
    id: "ORD-98425",
    customer: {
      name: "Pooja Verma",
      email: "pooja.v@outlook.com",
      phone: "+91 98112 39014",
      address: "B-14, Sector 62, Noida, Uttar Pradesh, 201309"
    },
    items: [
      { id: "prod-03", name: "Heavyweight Boxy Fleece Hoodie", size: "M", color: "Charcoal", price: 999, qty: 1 },
      { id: "prod-05", name: "Retro Graphic 'Stay Human' Oversized Tee", size: "M", color: "Vintage White", price: 399, qty: 1 }
    ],
    subtotal: 1398,
    discountAmount: 140,
    shippingFee: 0,
    total: 1258,
    paymentMethod: "Credit Card (HDFC)",
    status: "Shipped",
    date: "2026-10-26 10:15",
    carrier: "Delhivery Air (AWB #DEL3918290)",
    trackingSteps: [
      { label: "Order Confirmed", date: "26 Oct, 10:15 AM", completed: true },
      { label: "Packed at Warehouse", date: "26 Oct, 01:40 PM", completed: true },
      { label: "Dispatched & In Transit", date: "26 Oct, 07:20 PM", completed: true },
      { label: "Out for Delivery", date: "Expected Tomorrow", completed: false },
      { label: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-98439",
    customer: {
      name: "Rohan Kulkarni",
      email: "rohan.k@yahoo.com",
      phone: "+91 99754 11223",
      address: "Bungalow 7, Koregaon Park, Pune, Maharashtra, 411001"
    },
    items: [
      { id: "prod-04", name: "Vintage College Varsity Bomber Jacket", size: "L", color: "Classic Navy/Tan", price: 1499, qty: 1 }
    ],
    subtotal: 1499,
    discountAmount: 0,
    shippingFee: 0,
    total: 1499,
    paymentMethod: "Cash on Delivery",
    status: "Processing",
    date: "2026-10-27 11:20",
    carrier: "Express Surface Logistics",
    trackingSteps: [
      { label: "Order Confirmed", date: "27 Oct, 11:20 AM", completed: true },
      { label: "Packed at Warehouse", date: "27 Oct, 04:00 PM", completed: true },
      { label: "Dispatched", date: "Scheduled", completed: false },
      { label: "Out for Delivery", date: "Pending", completed: false },
      { label: "Delivered", date: "Pending", completed: false }
    ]
  }
];

const INITIAL_COUPONS = [
  { code: "VELOIR10", discountPercent: 10, minSpend: 499, description: "Maison Véloir Atelier: 10% Off on Orders above ₹499" },
  { code: "HAUTE20", discountPercent: 20, minSpend: 1499, description: "Haute Couture Special: 20% Off on Orders above ₹1499" },
  { code: "PRIVEE50", flatDiscount: 50, minSpend: 799, description: "L'Atelier Privé: Flat ₹50 Off Instant Privilege" },
  { code: "FREESHIP", flatDiscount: 99, minSpend: 0, description: "Complimentary White-Glove Express Shipping" },
  { code: "ZUDIO10", discountPercent: 10, minSpend: 499, description: "Flat 10% Off on Orders above ₹499" }
];

const VIBE_QUIZ_DATA = {
  questions: [
    {
      id: "q1",
      title: "What's your daily fashion aesthetic?",
      options: [
        { label: "Baggy Streetwear & Skate Vibes", icon: "🛹", vibeTag: "street" },
        { label: "Clean Minimalist & Coffee Run Looks", icon: "☕", vibeTag: "minimal" },
        { label: "High-Energy Retro & Varsity Cool", icon: "🎸", vibeTag: "retro" },
        { label: "Comfy Loungewear & Co-ords", icon: "☁️", vibeTag: "cozy" }
      ]
    },
    {
      id: "q2",
      title: "Where are you heading this weekend?",
      options: [
        { label: "College fest / Concert / Night out", icon: "🔥", vibeTag: "party" },
        { label: "Cafe hopping & relaxed brunch", icon: "🥐", vibeTag: "chill" },
        { label: "Road trip / Travel / Exploring", icon: "🚗", vibeTag: "travel" },
        { label: "Work from Anywhere / Studio Grind", icon: "💻", vibeTag: "focus" }
      ]
    },
    {
      id: "q3",
      title: "What price point are you shopping for?",
      options: [
        { label: "Zudio Budget Steals (Under ₹599)", icon: "⚡", priceRange: "budget" },
        { label: "Mid-Tier Statement Fits (₹699 - ₹1199)", icon: "✨", priceRange: "mid" },
        { label: "Premium Drops & Heavy Outerwear (₹1299+)", icon: "👑", priceRange: "premium" }
      ]
    }
  ]
};

