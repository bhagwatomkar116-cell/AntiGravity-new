/**
 * VÉLOIR — State Management & Reactive Store
 * Persistent reactive store backed by localStorage with Men/Women Collections & Reviews
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      PRODUCTS: "veloir_products_v4",
      CART: "veloir_cart_v3",
      WISHLIST: "veloir_wishlist_v3",
      ORDERS: "veloir_orders_v3",
      COUPON: "veloir_applied_coupon_v3",
      GENDER: "veloir_active_gender_v3"
    };

    this.initStore();
  }

  initStore() {
    // 1. Initialize Products (Clean Seed with new inventory)
    const savedProducts = localStorage.getItem(this.STORAGE_KEYS.PRODUCTS);
    if (!savedProducts || JSON.parse(savedProducts).length < 20) {
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Initialize Cart
    if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    }

    // 3. Initialize Wishlist
    if (!localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(["prod-m01", "prod-w01"]));
    }

    // 4. Initialize Orders
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
  }

  emit(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // --- PRODUCTS ---
  getProducts(genderFilter = null) {
    try {
      let list = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) || INITIAL_PRODUCTS;
      if (genderFilter && genderFilter !== "all") {
        list = list.filter(p => p.gender === genderFilter);
      }
      return list;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  saveProducts(products) {
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit("state:productsUpdated", { products });
  }

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod-" + Date.now().toString(36),
      rating: 5.0,
      reviewCount: 1,
      isTrending: true,
      isNewDrop: true,
      reviews: [],
      ...productData
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts().map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    this.saveProducts(products);
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  restockProduct(id, amount = 25) {
    const products = this.getProducts().map(p => {
      if (p.id === id) {
        return { ...p, stockCount: (p.stockCount || 0) + amount };
      }
      return p;
    });
    this.saveProducts(products);
  }

  // --- REVIEWS ---
  addReview(productId, reviewData) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    if (!product.reviews) product.reviews = [];

    const newRev = {
      id: "rev-" + Date.now().toString(36),
      author: reviewData.author || "Anonymous Customer",
      rating: Number(reviewData.rating) || 5,
      date: "Today",
      title: reviewData.title || "Excellent Quality!",
      comment: reviewData.comment || "Very satisfied with this purchase.",
      verified: true,
      helpful: 1
    };

    product.reviews.unshift(newRev);
    product.reviewCount = (product.reviewCount || 0) + 1;

    // Recalculate average rating
    const sum = product.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));

    this.saveProducts(products);
    this.emit("state:reviewAdded", { productId, review: newRev, product });
    return newRev;
  }

  // --- CART ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.emit("state:cartUpdated", { cart, totals: this.calculateCartTotals() });
  }

  addToCart(product, size = null, color = null, qty = 1) {
    const cart = this.getCart();
    const chosenSize = size || (product.sizes && product.sizes[0]) || "Standard";
    const chosenColor = color || (product.colors && product.colors[0]?.name) || "Default";

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.size === chosenSize && item.color === chosenColor
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        product,
        size: chosenSize,
        color: chosenColor,
        qty: qty,
        addedAt: Date.now()
      });
    }

    this.saveCart(cart);
  }

  updateCartQty(index, delta) {
    const cart = this.getCart();
    if (cart[index]) {
      cart[index].qty += delta;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
      this.saveCart(cart);
    }
  }

  removeFromCart(index) {
    const cart = this.getCart();
    if (cart[index]) {
      cart.splice(index, 1);
      this.saveCart(cart);
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  // --- COUPON ---
  getAppliedCoupon() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.COUPON)) || null;
    } catch (e) {
      return null;
    }
  }

  applyCoupon(couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    const found = INITIAL_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: "Invalid promo code! Try VELOIR10, GIRLY20, or STREET20" };
    }

    const { rawTotal } = this.calculateCartTotals(false);
    if (found.minSpend && rawTotal < found.minSpend) {
      return {
        success: false,
        message: `Add ₹${found.minSpend - rawTotal} more to apply code ${found.code}!`
      };
    }

    localStorage.setItem(this.STORAGE_KEYS.COUPON, JSON.stringify(found));
    this.emit("state:cartUpdated", { cart: this.getCart(), totals: this.calculateCartTotals() });
    return { success: true, message: `Coupon ${found.code} applied successfully!`, coupon: found };
  }

  removeCoupon() {
    localStorage.removeItem(this.STORAGE_KEYS.COUPON);
    this.emit("state:cartUpdated", { cart: this.getCart(), totals: this.calculateCartTotals() });
  }

  // --- CART TOTALS ---
  calculateCartTotals(useCoupon = true) {
    const cart = this.getCart();
    let rawTotal = 0;
    let mrpTotal = 0;

    cart.forEach(item => {
      rawTotal += (item.product.price || 0) * item.qty;
      mrpTotal += (item.product.originalPrice || Math.round(item.product.price * 1.8)) * item.qty;
    });

    const catalogDiscount = Math.max(0, mrpTotal - rawTotal);
    let promoDiscount = 0;

    const coupon = useCoupon ? this.getAppliedCoupon() : null;
    if (coupon) {
      if (coupon.discountPercent) {
        promoDiscount = Math.round((rawTotal * coupon.discountPercent) / 100);
      } else if (coupon.flatDiscount) {
        promoDiscount = Math.min(coupon.flatDiscount, rawTotal);
      }
    }

    // Free shipping threshold: ₹999
    const shippingFee = (rawTotal > 999 || (coupon && coupon.code === "FREESHIP") || cart.length === 0) ? 0 : 99;
    const finalAmount = Math.max(0, rawTotal - promoDiscount + shippingFee);

    return {
      itemCount: this.getCartCount(),
      mrpTotal,
      rawTotal,
      catalogDiscount,
      promoDiscount,
      coupon,
      shippingFee,
      freeShippingThreshold: 999,
      neededForFreeShipping: Math.max(0, 999 - rawTotal),
      finalAmount
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) || [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
      wishlist.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.push(productId);
      isAdded = true;
    }

    localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    this.emit("state:wishlistUpdated", { wishlist, productId, isAdded });
    return isAdded;
  }

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }

  // --- ORDERS ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS)) || INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  }

  saveOrders(orders) {
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit("state:ordersUpdated", { orders });
  }

  addOrder(orderDetails) {
    const orders = this.getOrders();
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const newOrder = {
      id: orderId,
      date: dateStr,
      status: "Processing",
      carrier: "Express Courier Logistics (AWB #EX" + Math.floor(1000000 + Math.random() * 9000000) + ")",
      trackingSteps: [
        { label: "Order Confirmed", date: "Just now", completed: true },
        { label: "Packed at Warehouse (Mumbai Hub)", date: "Estimated today", completed: false },
        { label: "Dispatched & In Transit", date: "Tomorrow", completed: false },
        { label: "Out for Delivery", date: "2-3 Days", completed: false },
        { label: "Delivered", date: "3 Days", completed: false }
      ],
      ...orderDetails
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    this.clearCart();
    this.removeCoupon();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders().map(order => {
      if (order.id === orderId) {
        const updatedSteps = order.trackingSteps.map((step, idx) => {
          if (newStatus === "Delivered") return { ...step, completed: true };
          if (newStatus === "Shipped" && idx <= 2) return { ...step, completed: true };
          if (newStatus === "Processing" && idx <= 1) return { ...step, completed: true };
          return step;
        });

        return {
          ...order,
          status: newStatus,
          trackingSteps: updatedSteps
        };
      }
      return order;
    });

    this.saveOrders(orders);
  }

  // --- ANALYTICS SUMMARY (For Dashboard) ---
  getAnalyticsSummary() {
    const orders = this.getOrders();
    const products = this.getProducts();

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === "Delivered").length;
    const pendingOrders = orders.filter(o => o.status === "Processing" || o.status === "Pending").length;
    const shippedOrders = orders.filter(o => o.status === "Shipped").length;
    const aov = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    const lowStockItems = products.filter(p => (p.stockCount || 0) < 10);

    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      shippedOrders,
      aov,
      catalogSize: products.length,
      lowStockItems,
      categoryCounts
    };
  }
}

// Global Store Instance
window.store = new AppStore();
