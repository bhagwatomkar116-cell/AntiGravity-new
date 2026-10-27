/**
 * VÉLOIR — Main Application Controller
 * Handles storefront interactions, search, hero slider, outfit styling studio, cart, checkout & modals
 */

class AppUI {
  constructor() {
    this.currentCategory = "all";
    this.searchQuery = "";
    this.sortBy = "trending";
    this.maxPrice = 2500;
    
    // Outfit Builder State
    this.outfitState = {
      top: null,
      bottom: null,
      accessory: null
    };

    // Active Product Detail View
    this.activeProduct = null;
    this.selectedSize = null;
    this.selectedColor = null;

    // Hero Slider State
    this.currentHeroSlide = 0;
    this.totalHeroSlides = 3;
    this.heroSlideInterval = null;

    this.init();
  }

  init() {
    this.setupListeners();
    this.initHeroSlider();
    this.initOutfitBuilder();
    this.renderProducts();
    this.updateCartUI();
    this.updateWishlistBadges();
    this.initCountdownTimer();

    // Listen to store events
    window.addEventListener("state:productsUpdated", () => {
      this.renderProducts();
      this.initOutfitBuilder();
    });

    window.addEventListener("state:cartUpdated", () => {
      this.updateCartUI();
    });

    window.addEventListener("state:wishlistUpdated", () => {
      this.updateWishlistBadges();
      this.renderWishlistItems();
      const count = window.store.getWishlist().length;
      document.querySelectorAll(".wishlist-counter").forEach(el => el.textContent = count);
    });
  }

  // --- HERO CAROUSEL SLIDER (Sliding features) ---
  initHeroSlider() {
    const track = document.getElementById("hero-slider-track");
    if (!track) return;

    this.startHeroAutoPlay();

    const container = document.getElementById("hero-slider-container");
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(this.heroSlideInterval));
      container.addEventListener("mouseleave", () => this.startHeroAutoPlay());
    }
  }

  startHeroAutoPlay() {
    clearInterval(this.heroSlideInterval);
    this.heroSlideInterval = setInterval(() => {
      this.nextHeroSlide();
    }, 5500);
  }

  nextHeroSlide() {
    this.goToHeroSlide((this.currentHeroSlide + 1) % this.totalHeroSlides);
  }

  prevHeroSlide() {
    this.goToHeroSlide((this.currentHeroSlide - 1 + this.totalHeroSlides) % this.totalHeroSlides);
  }

  goToHeroSlide(index) {
    this.currentHeroSlide = index;
    const track = document.getElementById("hero-slider-track");
    if (track) {
      track.style.transform = `translateX(-${this.currentHeroSlide * 100}%)`;
    }

    // Update dots
    document.querySelectorAll(".slider-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === this.currentHeroSlide);
      dot.classList.toggle("bg-gray-300", idx !== this.currentHeroSlide);
      dot.classList.toggle("bg-black", idx === this.currentHeroSlide);
    });
  }

  // --- FLASH DROP COUNTDOWN ---
  initCountdownTimer() {
    let secondsLeft = 14 * 3600 + 42 * 60 + 18;
    const timerEl = document.getElementById("drop-countdown");
    if (!timerEl) return;

    setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) secondsLeft = 24 * 3600;
      const h = Math.floor(secondsLeft / 3600).toString().padStart(2, '0');
      const m = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(secondsLeft % 60).toString().padStart(2, '0');
      timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  // --- EVENT LISTENERS ---
  setupListeners() {
    // 1. Search Input & Button
    const searchInput = document.getElementById("global-search");
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (clearBtn) clearBtn.classList.toggle("hidden", val.length === 0);
        this.handleSearchAutocomplete(val);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.executeSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.executeSearch());
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearSearch());
    }

    // Close autocomplete on click outside
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("search-suggestions-dropdown");
      const searchBox = document.getElementById("search-container-box");
      if (dropdown && searchBox && !searchBox.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    // 2. Category filter pills
    document.querySelectorAll(".category-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category || "all";
        this.renderProducts();
      });
    });

    // 3. Sort selector
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // 4. Price range slider
    const priceRange = document.getElementById("price-filter");
    const priceDisplay = document.getElementById("price-filter-val");
    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        this.maxPrice = parseInt(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `₹${this.maxPrice}`;
        this.renderProducts();
      });
    }

    // 5. View toggle: Customer Store vs Admin HQ
    const viewSwitchers = document.querySelectorAll(".toggle-admin-view");
    viewSwitchers.forEach(btn => {
      btn.addEventListener("click", () => {
        this.toggleAdminDashboard();
      });
    });

    // 6. Pincode checker inside modal
    const checkPinBtn = document.getElementById("check-pincode-btn");
    if (checkPinBtn) {
      checkPinBtn.addEventListener("click", () => this.checkDeliveryPincode());
    }

    const pinInput = document.getElementById("pincode-input");
    if (pinInput) {
      pinInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.checkDeliveryPincode();
        }
      });
    }
  }

  // --- SEARCH ENGINE & AUTOCOMPLETE ---
  executeSearch() {
    const input = document.getElementById("global-search");
    if (!input) return;

    this.searchQuery = input.value.toLowerCase().trim();
    this.renderProducts();

    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (dropdown) dropdown.classList.add("hidden");

    // Smooth scroll directly to catalog with zero delay
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (this.searchQuery) {
      this.showToast(`Found drops matching "${this.searchQuery}"`, "info");
    }
  }

  clearSearch() {
    const input = document.getElementById("global-search");
    const clearBtn = document.getElementById("clear-search-btn");
    if (input) input.value = "";
    if (clearBtn) clearBtn.classList.add("hidden");
    
    this.searchQuery = "";
    this.renderProducts();

    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (dropdown) dropdown.classList.add("hidden");
  }

  handleSearchAutocomplete(query) {
    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (!dropdown) return;

    if (!query || query.length < 2) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    const products = window.store.getProducts();
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="p-4 text-center text-xs text-gray-500">
          No matches found for "${query}". Press Enter to view catalog.
        </div>
      `;
      dropdown.classList.remove("hidden");
      return;
    }

    dropdown.innerHTML = `
      <div class="p-2 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <span>SUGGESTED DROPS</span>
        <span>${matches.length} MATCHES</span>
      </div>
      <div class="divide-y divide-gray-100">
        ${matches.map(m => `
          <div 
            onclick="app.selectAutocompleteProduct('${m.id}')" 
            class="flex items-center gap-3 p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <img src="${m.image}" class="w-10 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h5 class="text-xs font-bold text-gray-900 truncate">${m.name}</h5>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs font-mono font-bold text-black">₹${m.price}</span>
                <span class="text-[10px] text-gray-400 uppercase font-mono">${m.category}</span>
              </div>
            </div>
            <span class="text-xs text-gray-400">&rarr;</span>
          </div>
        `).join('')}
      </div>
      <div class="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
        <button onclick="app.executeSearch()" class="text-xs font-bold text-black hover:underline">
          View all results for "${query}" &rarr;
        </button>
      </div>
    `;
    dropdown.classList.remove("hidden");
  }

  selectAutocompleteProduct(productId) {
    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (dropdown) dropdown.classList.add("hidden");
    this.openProductModal(productId);
  }

  // --- TOGGLE BETWEEN STOREFRONT & ADMIN DASHBOARD ---
  toggleAdminDashboard(forceView = null) {
    const storefront = document.getElementById("storefront-view");
    const dashboard = document.getElementById("dashboard-view");
    const isShowingDashboard = forceView ? forceView === "dashboard" : dashboard.classList.contains("hidden");

    if (isShowingDashboard) {
      storefront.classList.add("hidden");
      dashboard.classList.remove("hidden");
      if (window.adminDashboard) window.adminDashboard.refresh();
      this.showToast("Switched to Store Admin Operations HQ", "info");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      dashboard.classList.add("hidden");
      storefront.classList.remove("hidden");
      this.showToast("Returned to Customer Storefront", "info");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- PRODUCT CATALOG RENDERING ---
  renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    let products = window.store.getProducts();

    // Category Filter
    if (this.currentCategory !== "all") {
      products = products.filter(p => p.category === this.currentCategory);
    }

    // Search query
    if (this.searchQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery) ||
        p.description?.toLowerCase().includes(this.searchQuery)
      );
    }

    // Max Price
    products = products.filter(p => (p.price || 0) <= this.maxPrice);

    // Sorting
    if (this.sortBy === "low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "high-low") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      products.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }

    const countEl = document.getElementById("product-count-display");
    if (countEl) countEl.textContent = `Showing ${products.length} Drops`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-200">
          <i class="fa-solid fa-shirt text-5xl mb-3 text-gray-300"></i>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No matching drip found</h3>
          <p class="text-sm text-gray-500">Try resetting your price filter or search query.</p>
          <button onclick="app.resetFilters()" class="mt-4 px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    const wishlist = window.store.getWishlist();

    grid.innerHTML = products.map(product => {
      const isWishlisted = wishlist.includes(product.id);
      const isLowStock = product.stockCount && product.stockCount <= 5;
      const originalPrice = product.originalPrice || Math.round(product.price * 1.8);
      const discount = product.discount || "50% OFF";
      const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];

      return `
        <div class="product-card group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between" data-id="${product.id}">
          <!-- Top Badges -->
          <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
            ${product.badge ? `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-yellow-300 text-black shadow-sm">
                ${product.badge}
              </span>
            ` : ""}
            ${isLowStock ? `
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white animate-pulse shadow-sm">
                Only ${product.stockCount} Left!
              </span>
            ` : ""}
          </div>

          <!-- Wishlist Button -->
          <button onclick="app.toggleWishlist('${product.id}', this)" class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-black/60 shadow-md backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-red-500 hover:scale-110 transition-all border border-gray-200 dark:border-white/10" title="Save to Wishlist">
            <i class="${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-sm"></i>
          </button>

          <!-- Product Media Image -->
          <div class="relative w-full aspect-[4/5] bg-gray-100 dark:bg-zinc-950 overflow-hidden cursor-pointer" onclick="app.openProductModal('${product.id}')">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy" 
              class="img-zoom w-full h-full object-cover object-center"
              id="img-${product.id}"
            />
            
            <!-- Quick Size Selector Bar (Zara/Urbanic Instant 1-Click Addition) -->
            <div class="quick-size-bar absolute bottom-3 inset-x-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-[10px] text-gray-500 dark:text-zinc-400 font-bold px-1 uppercase font-mono">
                <span>1-Click Add Size:</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">Fast Add</span>
              </div>
              <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                ${availableSizes.map(sz => `
                  <button 
                    onclick="event.stopPropagation(); app.quickSelectSizeAndAdd('${product.id}', '${sz}')" 
                    class="flex-1 py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-black hover:text-white dark:bg-zinc-800 dark:hover:bg-white dark:hover:text-black text-gray-900 dark:text-white text-xs font-bold font-mono transition-colors text-center border border-gray-200 dark:border-zinc-700"
                    title="Add ${sz} to Bag"
                  >
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Product Details Section -->
          <div class="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-zinc-900">
            <div>
              <!-- Rating & Social Proof -->
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1.5">
                <div class="flex items-center gap-1 text-amber-500">
                  <i class="fa-solid fa-star text-[11px]"></i>
                  <span class="font-bold text-gray-900 dark:text-white text-xs">${product.rating || '4.8'}</span>
                  <span class="text-gray-400 dark:text-zinc-500 text-[11px]">(${product.reviewCount || 120})</span>
                </div>
                <span class="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span> In High Demand
                </span>
              </div>

              <!-- Title -->
              <h4 onclick="app.openProductModal('${product.id}')" class="font-bold text-sm text-gray-900 dark:text-zinc-100 hover:text-black line-clamp-1 cursor-pointer transition-colors" title="${product.name}">
                ${product.name}
              </h4>
              
              <!-- Fit info -->
              <p class="text-[11px] text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">${product.fit || 'Oversized Street Fit'}</p>
            </div>

            <!-- Color Swatches -->
            ${product.colors && product.colors.length > 0 ? `
              <div class="flex items-center gap-1.5 my-2.5">
                ${product.colors.map((c, i) => `
                  <button 
                    onclick="app.selectProductColorCard('${product.id}', '${c.name}', '${c.hex}')" 
                    class="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20 hover:scale-125 transition-transform" 
                    style="background-color: ${c.hex};" 
                    title="${c.name}"
                  ></button>
                `).join('')}
                <span class="text-[10px] text-gray-500 dark:text-zinc-500 ml-1">+${product.colors.length} shades</span>
              </div>
            ` : '<div class="h-4 my-2.5"></div>'}

            <!-- Pricing Bar -->
            <div class="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-baseline justify-between">
              <div>
                <span class="text-lg font-black text-gray-900 dark:text-white font-mono">₹${product.price}</span>
                <span class="text-xs strikethrough text-gray-400 ml-1.5">₹${originalPrice}</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                ${discount}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  resetFilters() {
    this.currentCategory = "all";
    this.searchQuery = "";
    this.sortBy = "trending";
    this.maxPrice = 2500;

    const searchInput = document.getElementById("global-search");
    if (searchInput) searchInput.value = "";
    
    const priceRange = document.getElementById("price-filter");
    if (priceRange) priceRange.value = 2500;
    
    const priceDisplay = document.getElementById("price-filter-val");
    if (priceDisplay) priceDisplay.textContent = "₹2500";

    document.querySelectorAll(".category-filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.category === "all");
    });

    document.querySelectorAll(".story-circle").forEach(c => {
      c.classList.toggle("active", c.dataset.category === "all");
    });

    this.renderProducts();
    this.showToast("All filters reset", "info");
  }

  filterByStoryCategory(cat) {
    this.currentCategory = cat;
    
    document.querySelectorAll(".story-circle").forEach(el => {
      el.classList.toggle("active", el.dataset.category === cat);
    });

    document.querySelectorAll(".category-filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.category === cat);
    });

    this.renderProducts();
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  selectProductColorCard(productId, colorName, hex) {
    this.showToast(`Selected shade: ${colorName}`, "info");
  }

  // --- WISHLIST INTERACTIONS ---
  toggleWishlist(productId, btnElement = null) {
    const isAdded = window.store.toggleWishlist(productId);
    
    if (btnElement) {
      btnElement.classList.add("heart-pop");
      setTimeout(() => btnElement.classList.remove("heart-pop"), 300);
      const icon = btnElement.querySelector("i");
      if (icon) {
        if (isAdded) {
          icon.className = "fa-solid fa-heart text-red-500 text-sm";
        } else {
          icon.className = "fa-regular fa-heart text-gray-700 text-sm";
        }
      }
    }

    const prod = window.store.getProductById(productId);
    const prodName = prod ? prod.name : "Item";

    if (isAdded) {
      this.showToast(`❤️ Saved ${prodName} to wishlist`, "success");
    } else {
      this.showToast(`Removed from wishlist`, "info");
    }
  }

  updateWishlistBadges() {
    const count = window.store.getWishlist().length;
    document.querySelectorAll(".wishlist-counter").forEach(el => {
      el.textContent = count;
      el.classList.toggle("hidden", count === 0);
    });
  }

  openWishlistDrawer() {
    this.renderWishlistItems();
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) drawer.classList.add("active");
  }

  closeWishlistDrawer() {
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) drawer.classList.remove("active");
  }

  renderWishlistItems() {
    const container = document.getElementById("wishlist-items-container");
    if (!container) return;

    const wishlistIds = window.store.getWishlist();
    const products = wishlistIds.map(id => window.store.getProductById(id)).filter(Boolean);

    if (products.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center text-gray-400">
          <i class="fa-regular fa-heart text-4xl mb-3 text-gray-300"></i>
          <p class="font-bold text-gray-900 text-base">Your wishlist is empty</p>
          <p class="text-xs text-gray-500 mt-1">Tap the heart on any drop to save your favorites.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
        <img src="${p.image}" alt="${p.name}" class="w-16 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h5 class="text-xs font-bold text-gray-900 truncate">${p.name}</h5>
          <p class="text-xs font-mono font-bold text-black mt-0.5">₹${p.price}</p>
          <div class="flex gap-2 mt-2">
            <button onclick="app.quickAddToCart('${p.id}'); app.toggleWishlist('${p.id}');" class="px-2.5 py-1 text-[11px] rounded-lg bg-black text-white font-bold hover:bg-gray-800 transition-colors">
              Move to Bag
            </button>
            <button onclick="app.toggleWishlist('${p.id}')" class="px-2 py-1 text-[11px] rounded-lg text-gray-400 hover:text-red-500 transition-colors">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- PRODUCT DETAIL MODAL ---
  openProductModal(productId) {
    const product = window.store.getProductById(productId);
    if (!product) return;

    this.activeProduct = product;
    this.selectedSize = product.sizes ? product.sizes[0] : "Standard";
    this.selectedColor = product.colors ? product.colors[0]?.name : "Default";

    const modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    document.getElementById("modal-prod-title").textContent = product.name;
    document.getElementById("modal-prod-badge").textContent = product.badge || "FEATURED DROP";
    document.getElementById("modal-prod-price").textContent = `₹${product.price}`;
    document.getElementById("modal-prod-mrp").textContent = `₹${product.originalPrice || Math.round(product.price * 1.8)}`;
    document.getElementById("modal-prod-discount").textContent = product.discount || "50% OFF";
    document.getElementById("modal-prod-rating").textContent = product.rating || "4.8";
    document.getElementById("modal-prod-reviews").textContent = `${product.reviewCount || 310} verified reviews`;
    document.getElementById("modal-prod-fit").textContent = product.fit || "Oversized Fit";
    document.getElementById("modal-prod-fabric").textContent = product.fabric || "100% Bio-Washed Cotton";
    document.getElementById("modal-prod-desc").textContent = product.description || "Designed for daily comfort and high street presence.";
    
    // Main Image
    const mainImg = document.getElementById("modal-prod-main-img");
    mainImg.src = product.image;

    // Thumbnails
    const thumbsContainer = document.getElementById("modal-prod-thumbs");
    const allImages = [product.image, ...(product.additionalImages || [])];
    thumbsContainer.innerHTML = allImages.map(img => `
      <img 
        src="${img}" 
        onclick="document.getElementById('modal-prod-main-img').src = '${img}'" 
        class="w-14 h-16 object-cover rounded-lg border border-gray-200 hover:border-black cursor-pointer transition-all" 
      />
    `).join('');

    // Sizes
    const sizesContainer = document.getElementById("modal-prod-sizes");
    if (sizesContainer) {
      sizesContainer.innerHTML = (product.sizes || ["S", "M", "L", "XL"]).map((sz, idx) => `
        <button 
          onclick="app.selectModalSize('${sz}', this)" 
          class="size-btn px-4 py-2 rounded-lg border text-xs font-semibold ${idx === 0 ? 'active' : 'border-gray-200 text-gray-700 hover:border-black'}"
        >
          ${sz}
        </button>
      `).join('');
    }

    // Colors
    const colorsContainer = document.getElementById("modal-prod-colors");
    if (colorsContainer) {
      colorsContainer.innerHTML = (product.colors || [{ name: "Standard", hex: "#111" }]).map((c, idx) => `
        <button 
          onclick="app.selectModalColor('${c.name}', this)" 
          class="w-7 h-7 rounded-full border-2 ${idx === 0 ? 'border-black scale-110' : 'border-transparent'} hover:scale-110 transition-all flex items-center justify-center p-0.5"
          title="${c.name}"
        >
          <span class="w-full h-full rounded-full border border-gray-300" style="background-color: ${c.hex}"></span>
        </button>
      `).join('');
    }

    // Reset Pincode
    const pinResult = document.getElementById("pincode-result");
    if (pinResult) pinResult.classList.add("hidden");

    modal.classList.add("active");
  }

  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.remove("active");
  }

  selectModalSize(size, btn) {
    this.selectedSize = size;
    document.querySelectorAll("#modal-prod-sizes .size-btn").forEach(b => {
      b.classList.remove("active", "bg-black", "text-white");
      b.classList.add("border-gray-200", "text-gray-700");
    });
    btn.classList.add("active", "bg-black", "text-white");
    btn.classList.remove("border-gray-200", "text-gray-700");
  }

  selectModalColor(colorName, btn) {
    this.selectedColor = colorName;
    document.querySelectorAll("#modal-prod-colors button").forEach(b => {
      b.classList.remove("border-black", "scale-110");
      b.classList.add("border-transparent");
    });
    btn.classList.remove("border-transparent");
    btn.classList.add("border-black", "scale-110");
    this.showToast(`Selected shade: ${colorName}`, "info");
  }

  checkDeliveryPincode() {
    const pinInput = document.getElementById("pincode-input");
    const resultEl = document.getElementById("pincode-result");
    if (!pinInput || !resultEl) return;

    const pin = pinInput.value.trim();
    if (!pin || pin.length < 6 || isNaN(pin)) {
      resultEl.innerHTML = `<span class="text-rose-600 text-xs font-semibold">Please enter a valid 6-digit PIN code (e.g. 400050, 110001).</span>`;
      resultEl.classList.remove("hidden");
      return;
    }

    resultEl.innerHTML = `
      <div class="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
        <i class="fa-solid fa-circle-check text-sm"></i>
        <span>Delivery confirmed to PIN <b>${pin}</b> by <b>2-3 business days</b>! Express Cash On Delivery Available.</span>
      </div>
    `;
    resultEl.classList.remove("hidden");
  }

  addProductModalToCart() {
    if (!this.activeProduct) return;
    window.store.addToCart(this.activeProduct, this.selectedSize, this.selectedColor, 1);
    this.closeProductModal();
    this.openCartDrawer();
    this.showToast(`Added ${this.activeProduct.name} (${this.selectedSize}) to Bag!`, "success");
  }

  buyNowProductModal() {
    if (!this.activeProduct) return;
    window.store.addToCart(this.activeProduct, this.selectedSize, this.selectedColor, 1);
    this.closeProductModal();
    this.openCheckoutModal();
  }

  quickAddToCart(productId) {
    const product = window.store.getProductById(productId);
    if (!product) return;
    window.store.addToCart(product, product.sizes?.[0] || "M", product.colors?.[0]?.name || "Standard", 1);
    this.openCartDrawer();
    this.showToast(`Added ${product.name} to Bag!`, "success");
  }

  quickSelectSizeAndAdd(productId, size) {
    const product = window.store.getProductById(productId);
    if (!product) return;
    window.store.addToCart(product, size, product.colors?.[0]?.name || "Standard", 1);
    this.openCartDrawer();
    this.showToast(`Added ${product.name} (Size: ${size}) to Bag!`, "success");
  }

  // --- "COMPLETE THE LOOK" STYLE STUDIO ---
  initOutfitBuilder() {
    const products = window.store.getProducts();
    const tops = products.filter(p => p.category === "tees" || p.category === "hoodies" || p.category === "jackets");
    const bottoms = products.filter(p => p.category === "bottoms" || p.category === "coords");
    const accessories = products.filter(p => p.category === "accessories");

    this.outfitState.top = tops[0] || products[0];
    this.outfitState.bottom = bottoms[0] || products[1];
    this.outfitState.accessory = accessories[0] || products[products.length - 1];

    this.renderOutfitBuilderStage();
    this.renderOutfitBuilderSelectors(tops, bottoms, accessories);
  }

  renderOutfitBuilderStage() {
    const topSlot = document.getElementById("outfit-top-preview");
    const bottomSlot = document.getElementById("outfit-bottom-preview");
    const accSlot = document.getElementById("outfit-acc-preview");
    
    if (topSlot && this.outfitState.top) {
      topSlot.innerHTML = `
        <img src="${this.outfitState.top.image}" class="w-full h-full object-cover rounded-xl" />
        <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-center">
          <p class="text-[11px] font-bold text-white truncate">${this.outfitState.top.name}</p>
          <p class="text-[10px] text-yellow-300 font-mono font-bold">₹${this.outfitState.top.price}</p>
        </div>
      `;
    }

    if (bottomSlot && this.outfitState.bottom) {
      bottomSlot.innerHTML = `
        <img src="${this.outfitState.bottom.image}" class="w-full h-full object-cover rounded-xl" />
        <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-center">
          <p class="text-[11px] font-bold text-white truncate">${this.outfitState.bottom.name}</p>
          <p class="text-[10px] text-yellow-300 font-mono font-bold">₹${this.outfitState.bottom.price}</p>
        </div>
      `;
    }

    if (accSlot && this.outfitState.accessory) {
      accSlot.innerHTML = `
        <img src="${this.outfitState.accessory.image}" class="w-full h-full object-cover rounded-xl" />
        <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-center">
          <p class="text-[11px] font-bold text-white truncate">${this.outfitState.accessory.name}</p>
          <p class="text-[10px] text-yellow-300 font-mono font-bold">₹${this.outfitState.accessory.price}</p>
        </div>
      `;
    }

    const p1 = this.outfitState.top ? this.outfitState.top.price : 0;
    const p2 = this.outfitState.bottom ? this.outfitState.bottom.price : 0;
    const p3 = this.outfitState.accessory ? this.outfitState.accessory.price : 0;

    const rawComboPrice = p1 + p2 + p3;
    const discountedComboPrice = Math.round(rawComboPrice * 0.85);
    const savings = rawComboPrice - discountedComboPrice;

    const priceEl = document.getElementById("outfit-total-price");
    const mrpEl = document.getElementById("outfit-total-mrp");
    const savingsEl = document.getElementById("outfit-savings-badge");

    if (priceEl) priceEl.textContent = `₹${discountedComboPrice}`;
    if (mrpEl) mrpEl.textContent = `₹${rawComboPrice}`;
    if (savingsEl) savingsEl.textContent = `Bundle Save ₹${savings} (15% OFF)`;
  }

  renderOutfitBuilderSelectors(tops, bottoms, accessories) {
    const topsContainer = document.getElementById("builder-tops-picker");
    const bottomsContainer = document.getElementById("builder-bottoms-picker");
    const accContainer = document.getElementById("builder-acc-picker");

    if (topsContainer) {
      topsContainer.innerHTML = tops.map(item => `
        <div 
          onclick="app.selectOutfitPiece('top', '${item.id}')" 
          class="flex-shrink-0 w-20 cursor-pointer rounded-xl p-1 border transition-all ${this.outfitState.top?.id === item.id ? 'border-black bg-gray-100 shadow-sm' : 'border-gray-200 hover:border-gray-400'}"
        >
          <img src="${item.image}" class="w-full h-20 object-cover rounded-lg bg-gray-100" />
          <p class="text-[10px] font-bold truncate text-gray-900 mt-1">${item.name}</p>
          <p class="text-[9px] text-gray-500 font-mono font-bold">₹${item.price}</p>
        </div>
      `).join('');
    }

    if (bottomsContainer) {
      bottomsContainer.innerHTML = bottoms.map(item => `
        <div 
          onclick="app.selectOutfitPiece('bottom', '${item.id}')" 
          class="flex-shrink-0 w-20 cursor-pointer rounded-xl p-1 border transition-all ${this.outfitState.bottom?.id === item.id ? 'border-black bg-gray-100 shadow-sm' : 'border-gray-200 hover:border-gray-400'}"
        >
          <img src="${item.image}" class="w-full h-20 object-cover rounded-lg bg-gray-100" />
          <p class="text-[10px] font-bold truncate text-gray-900 mt-1">${item.name}</p>
          <p class="text-[9px] text-gray-500 font-mono font-bold">₹${item.price}</p>
        </div>
      `).join('');
    }

    if (accContainer) {
      accContainer.innerHTML = accessories.map(item => `
        <div 
          onclick="app.selectOutfitPiece('accessory', '${item.id}')" 
          class="flex-shrink-0 w-20 cursor-pointer rounded-xl p-1 border transition-all ${this.outfitState.accessory?.id === item.id ? 'border-black bg-gray-100 shadow-sm' : 'border-gray-200 hover:border-gray-400'}"
        >
          <img src="${item.image}" class="w-full h-20 object-cover rounded-lg bg-gray-100" />
          <p class="text-[10px] font-bold truncate text-gray-900 mt-1">${item.name}</p>
          <p class="text-[9px] text-gray-500 font-mono font-bold">₹${item.price}</p>
        </div>
      `).join('');
    }
  }

  selectOutfitPiece(slot, productId) {
    const item = window.store.getProductById(productId);
    if (!item) return;

    this.outfitState[slot] = item;
    this.renderOutfitBuilderStage();
    
    const products = window.store.getProducts();
    const tops = products.filter(p => p.category === "tees" || p.category === "hoodies" || p.category === "jackets");
    const bottoms = products.filter(p => p.category === "bottoms" || p.category === "coords");
    const accessories = products.filter(p => p.category === "accessories");
    this.renderOutfitBuilderSelectors(tops, bottoms, accessories);
  }

  loadPresetOutfit(presetIndex) {
    const preset = PRESET_OUTFITS[presetIndex];
    if (!preset) return;

    this.outfitState.top = window.store.getProductById(preset.topId);
    this.outfitState.bottom = window.store.getProductById(preset.bottomId);
    this.outfitState.accessory = window.store.getProductById(preset.accId);

    this.renderOutfitBuilderStage();
    this.showToast(`Loaded "${preset.title}" look!`, "info");
  }

  scrollPicker(containerId, offset) {
    const el = document.getElementById(containerId);
    if (el) {
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  }

  addCompleteOutfitToCart() {
    const { top, bottom, accessory } = this.outfitState;
    if (!top || !bottom || !accessory) return;

    window.store.addToCart(top, top.sizes?.[0] || "M", top.colors?.[0]?.name || "Default", 1);
    window.store.addToCart(bottom, bottom.sizes?.[0] || "32", bottom.colors?.[0]?.name || "Default", 1);
    window.store.addToCart(accessory, accessory.sizes?.[0] || "One Size", accessory.colors?.[0]?.name || "Default", 1);

    window.store.applyCoupon("VELOIR10");

    this.openCartDrawer();
    this.showToast("🔥 Full Outfit Added to Bag with 15% Bundle Savings!", "success");
  }

  // --- CART DRAWER & CALCULATIONS ---
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.add("active");
    this.updateCartUI();
  }

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.remove("active");
  }

  updateCartUI() {
    const cart = window.store.getCart();
    const totals = window.store.calculateCartTotals();

    document.querySelectorAll(".cart-counter").forEach(el => {
      el.textContent = totals.itemCount;
      el.classList.toggle("hidden", totals.itemCount === 0);
    });

    const itemsContainer = document.getElementById("cart-items-container");
    const emptyState = document.getElementById("cart-empty-state");
    const footer = document.getElementById("cart-footer");

    if (!itemsContainer) return;

    if (cart.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      if (footer) footer.classList.add("hidden");
      itemsContainer.innerHTML = "";
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (footer) footer.classList.remove("hidden");

    // Free Shipping Progress
    const thresholdBar = document.getElementById("free-shipping-progress");
    const shippingMsg = document.getElementById("shipping-threshold-msg");
    if (thresholdBar && shippingMsg) {
      const percent = Math.min(100, Math.round((totals.rawTotal / totals.freeShippingThreshold) * 100));
      thresholdBar.style.width = `${percent}%`;

      if (totals.neededForFreeShipping > 0) {
        shippingMsg.innerHTML = `Add <span class="text-black font-bold">₹${totals.neededForFreeShipping}</span> more for <span class="text-black font-bold">FREE Express Delivery</span>! 🚚`;
      } else {
        shippingMsg.innerHTML = `🎉 <span class="text-emerald-700 font-bold">Unlocked FREE Express Delivery!</span>`;
      }
    }

    itemsContainer.innerHTML = cart.map((item, idx) => `
      <div class="flex gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200">
        <img src="${item.product.image}" alt="${item.product.name}" class="w-18 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0" />
        <div class="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div class="flex items-start justify-between gap-1">
              <h5 class="text-xs font-bold text-gray-900 line-clamp-1">${item.product.name}</h5>
              <button onclick="app.removeCartItem(${idx})" class="text-gray-400 hover:text-red-500 text-xs p-1">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5">Size: <span class="text-black font-bold">${item.size}</span> | ${item.color}</p>
          </div>

          <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button onclick="app.changeItemQty(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-xs font-bold">-</button>
              <span class="w-7 text-center text-xs font-bold text-gray-900">${item.qty}</span>
              <button onclick="app.changeItemQty(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-xs font-bold">+</button>
            </div>
            <div class="text-right font-mono">
              <span class="text-xs font-bold text-gray-950">₹${item.product.price * item.qty}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    document.getElementById("cart-subtotal").textContent = `₹${totals.rawTotal}`;
    document.getElementById("cart-mrp-savings").textContent = `- ₹${totals.catalogDiscount}`;
    
    const couponRow = document.getElementById("cart-coupon-row");
    const couponVal = document.getElementById("cart-coupon-savings");
    if (totals.promoDiscount > 0) {
      if (couponRow) couponRow.classList.remove("hidden");
      if (couponVal) couponVal.textContent = `- ₹${totals.promoDiscount}`;
    } else {
      if (couponRow) couponRow.classList.add("hidden");
    }

    const shippingVal = document.getElementById("cart-shipping-fee");
    if (shippingVal) {
      shippingVal.textContent = totals.shippingFee === 0 ? "FREE" : `₹${totals.shippingFee}`;
      shippingVal.className = totals.shippingFee === 0 ? "text-emerald-700 font-bold" : "text-gray-900 font-mono";
    }

    document.getElementById("cart-final-total").textContent = `₹${totals.finalAmount}`;
  }

  changeItemQty(index, delta) {
    window.store.updateCartQty(index, delta);
  }

  removeCartItem(index) {
    window.store.removeFromCart(index);
    this.showToast("Item removed from bag", "info");
  }

  applyCartCoupon() {
    const input = document.getElementById("cart-coupon-input");
    if (!input) return;
    const res = window.store.applyCoupon(input.value);
    if (res.success) {
      this.showToast(res.message, "success");
      input.value = "";
    } else {
      this.showToast(res.message, "error");
    }
  }

  // --- MULTI-STEP CHECKOUT & ORDER CONFIRMATION ---
  openCheckoutModal() {
    const totals = window.store.calculateCartTotals();
    if (totals.itemCount === 0) {
      this.showToast("Your cart is empty! Add items first.", "error");
      return;
    }

    this.closeCartDrawer();
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    document.getElementById("checkout-order-total").textContent = `₹${totals.finalAmount}`;
    document.getElementById("checkout-items-summary").textContent = `${totals.itemCount} items`;

    this.setCheckoutStep(1);
    modal.classList.add("active");
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.remove("active");
  }

  setCheckoutStep(stepNumber) {
    const step1 = document.getElementById("checkout-step-1");
    const step2 = document.getElementById("checkout-step-2");
    const step3 = document.getElementById("checkout-step-3");
    
    step1.classList.toggle("hidden", stepNumber !== 1);
    step2.classList.toggle("hidden", stepNumber !== 2);
    step3.classList.toggle("hidden", stepNumber !== 3);
  }

  proceedToPayment() {
    const name = document.getElementById("ship-name").value.trim();
    const phone = document.getElementById("ship-phone").value.trim();
    const address = document.getElementById("ship-address").value.trim();
    const pincode = document.getElementById("ship-pincode").value.trim();

    if (!name || !phone || !address || !pincode) {
      this.showToast("Please fill in all shipping details!", "error");
      return;
    }

    this.setCheckoutStep(2);
  }

  selectPaymentTab(type) {
    document.querySelectorAll(".payment-method-card").forEach(el => {
      el.classList.toggle("border-black", el.dataset.method === type);
      el.classList.toggle("border-gray-200", el.dataset.method !== type);
      el.classList.toggle("shadow-md", el.dataset.method === type);
    });

    document.getElementById("upi-payment-panel").classList.toggle("hidden", type !== "upi");
    document.getElementById("card-payment-panel").classList.toggle("hidden", type !== "card");
    document.getElementById("cod-payment-panel").classList.toggle("hidden", type !== "cod");
  }

  confirmAndPlaceOrder() {
    const name = document.getElementById("ship-name").value.trim() || "Omkar Bhagwat";
    const phone = document.getElementById("ship-phone").value.trim() || "+91 98200 12345";
    const address = document.getElementById("ship-address").value.trim() || "Flat 101, Bandra West, Mumbai";
    const pincode = document.getElementById("ship-pincode").value.trim() || "400050";

    const totals = window.store.calculateCartTotals();
    const cart = window.store.getCart();

    let paymentMethod = "UPI / QR Code";
    if (!document.getElementById("card-payment-panel").classList.contains("hidden")) {
      paymentMethod = "Credit / Debit Card";
    } else if (!document.getElementById("cod-payment-panel").classList.contains("hidden")) {
      paymentMethod = "Cash on Delivery";
    }

    const order = window.store.addOrder({
      customer: {
        name,
        phone,
        address: `${address}, PIN: ${pincode}`
      },
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        size: item.size,
        color: item.color,
        price: item.product.price,
        qty: item.qty
      })),
      subtotal: totals.rawTotal,
      discountAmount: totals.promoDiscount + totals.catalogDiscount,
      shippingFee: totals.shippingFee,
      total: totals.finalAmount,
      paymentMethod: paymentMethod
    });

    document.getElementById("placed-order-id").textContent = order.id;
    document.getElementById("placed-order-total").textContent = `₹${order.total}`;
    document.getElementById("placed-order-method").textContent = order.paymentMethod;
    document.getElementById("placed-order-address").textContent = order.customer.address;

    this.setCheckoutStep(3);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    this.showToast(`🎉 Order ${order.id} placed successfully!`, "success");
  }

  // --- ORDER TRACKING MODAL ---
  openOrderTracker(orderId = null) {
    const orders = window.store.getOrders();
    let order = orderId ? orders.find(o => o.id === orderId) : orders[0];
    if (!order) {
      this.showToast("No active orders found to track.", "info");
      return;
    }

    this.closeCheckoutModal();
    const modal = document.getElementById("order-tracking-modal");
    if (!modal) return;

    document.getElementById("track-order-id").textContent = order.id;
    document.getElementById("track-carrier").textContent = order.carrier || "Express Logistics";
    document.getElementById("track-order-status").textContent = order.status;
    const dateEl = document.getElementById("track-order-date");
    if (dateEl) dateEl.textContent = order.date;

    const stepsContainer = document.getElementById("tracking-steps-container");
    if (stepsContainer && order.trackingSteps) {
      stepsContainer.innerHTML = order.trackingSteps.map((step, idx) => `
        <div class="flex items-start gap-4 relative pb-6 last:pb-0">
          ${idx < order.trackingSteps.length - 1 ? `
            <div class="absolute top-4 left-3 w-0.5 h-full ${step.completed ? 'bg-emerald-500' : 'bg-gray-200'}"></div>
          ` : ''}
          <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.completed ? 'bg-emerald-500 text-white font-black' : 'bg-gray-200 text-gray-500'} text-xs">
            ${step.completed ? '✓' : idx + 1}
          </div>
          <div>
            <h5 class="text-sm font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}">${step.label}</h5>
            <p class="text-xs text-gray-500 mt-0.5 font-mono">${step.date}</p>
          </div>
        </div>
      `).join('');
    }

    modal.classList.add("active");
  }

  closeOrderTracker() {
    const modal = document.getElementById("order-tracking-modal");
    if (modal) modal.classList.remove("active");
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-circle-check text-emerald-400";
    if (type === "error") icon = "fa-circle-exclamation text-rose-500";
    if (type === "info") icon = "fa-circle-info text-blue-400";

    toast.innerHTML = `
      <i class="fa-solid ${icon} text-base"></i>
      <span class="font-medium text-xs text-white">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

// Instantiate on DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppUI();
});
