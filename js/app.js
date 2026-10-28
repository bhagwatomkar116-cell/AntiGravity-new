/**
 * VÉLOIR — Luxury Retail & Haute Streetwear Controller
 * Clean Modern Sans Typography, Amazon/Flipkart 3-Dash Menu, Dedicated Pages,
 * Fully Working Dark/Light Mode, Zero-Notification Gender Switching, No Emojis.
 */

class AppUI {
  constructor() {
    this.currentGender = "all"; // "all" | "men" | "women"
    this.currentCategory = "all";
    this.searchQuery = "";
    this.sortBy = "trending";
    this.maxPrice = 2500;

    // Active Product State (Amazon PDP)
    this.activeProduct = null;
    this.selectedSize = null;
    this.selectedColor = null;
    this.selectedQty = 1;
    this.selectedReviewRating = 5;

    // Active Page View
    this.currentPage = "catalog-view";

    // Outfit Builder State
    this.outfitState = {
      top: null,
      bottom: null,
      accessory: null
    };

    // Hero Slider State
    this.currentHeroSlide = 0;
    this.totalHeroSlides = 3;
    this.heroSlideInterval = null;

    this.init();
  }

  init() {
    this.initTheme();
    this.setupListeners();
    this.initHeroSlider();
    this.initCountdownTimer();
    this.renderProducts();
    this.initOutfitBuilder();
    this.updateCartUI();
    this.updateWishlistBadges();
    this.handleRouting();

    // Store Event Subscriptions
    window.addEventListener("state:productsUpdated", () => {
      this.renderProducts();
      if (this.currentPage === "wishlist-view") this.renderWishlistPage();
      if (this.activeProduct) {
        const fresh = window.store.getProductById(this.activeProduct.id);
        if (fresh) {
          this.activeProduct = fresh;
          this.renderPdpReviews();
        }
      }
    });

    window.addEventListener("state:cartUpdated", () => {
      this.updateCartUI();
    });

    window.addEventListener("state:wishlistUpdated", () => {
      this.updateWishlistBadges();
      if (this.currentPage === "wishlist-view") this.renderWishlistPage();
      const count = window.store.getWishlist().length;
      document.querySelectorAll(".wishlist-counter").forEach(el => {
        el.textContent = count;
        el.classList.toggle("hidden", count === 0);
      });
    });

    // Hash change routing for browser Back/Forward buttons
    window.addEventListener("hashchange", () => {
      this.handleRouting();
    });
  }

  // --- THEME MANAGEMENT (Working Dark / Light Mode with Persistence) ---
  initTheme() {
    const saved = localStorage.getItem("veloir_theme_mode") || "light";
    if (saved === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    this.updateThemeIcons(saved === "dark");
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("veloir_theme_mode", isDark ? "dark" : "light");
    this.updateThemeIcons(isDark);
    this.showToast(isDark ? "Switched to Dark Mode" : "Switched to Light Mode", "info");
  }

  updateThemeIcons(isDark) {
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.innerHTML = isDark 
        ? `<i class="fa-solid fa-sun text-yellow-400 text-sm"></i>` 
        : `<i class="fa-solid fa-moon text-gray-700 text-sm"></i>`;
      btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    });
  }

  // --- HASH ROUTING (Dedicated Pages & PDP) ---
  handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith("#product-")) {
      const prodId = hash.replace("#product-", "");
      this.renderProductPage(prodId, false);
    } else if (hash === "#orders") {
      this.showPage("orders-view");
    } else if (hash === "#track" || hash.startsWith("#track-")) {
      const orderId = hash.startsWith("#track-") ? hash.replace("#track-", "") : null;
      this.showPage("track-view", orderId);
    } else if (hash === "#wishlist") {
      this.showPage("wishlist-view");
    } else if (hash === "#support") {
      this.showPage("support-view");
    } else if (hash === "#men") {
      this.setGender("men", false);
      this.showPage("catalog-view");
    } else if (hash === "#women") {
      this.setGender("women", false);
      this.showPage("catalog-view");
    } else {
      this.showPage("catalog-view");
    }
  }

  // --- PAGE VIEW SWITCHER ---
  showPage(pageId, param = null) {
    this.currentPage = pageId;
    this.closeSideMenu();

    const pages = [
      "catalog-view",
      "product-page-view",
      "orders-view",
      "track-view",
      "wishlist-view",
      "support-view"
    ];

    pages.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === pageId) {
          el.classList.remove("hidden");
          if (window.gsap) {
            gsap.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
          }
        } else {
          el.classList.add("hidden");
        }
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Render page content
    if (pageId === "orders-view") this.renderOrdersPage();
    if (pageId === "track-view") this.renderTrackPage(param);
    if (pageId === "wishlist-view") this.renderWishlistPage();
    if (pageId === "catalog-view") this.renderProducts(true);

    // Notify animation system of page change (Motion One page morph)
    window.VeloirAnimations?.onPageChange(pageId);
  }

  // --- THREE-DASH SIDE MENU (Amazon / Flipkart Style) ---
  openSideMenu() {
    const drawer = document.getElementById("side-menu-drawer");
    if (drawer) {
      drawer.classList.add("active");
    }
  }

  closeSideMenu() {
    const drawer = document.getElementById("side-menu-drawer");
    if (drawer) {
      drawer.classList.remove("active");
    }
  }

  // --- GENDER / THEME SWITCHER (Silent & Clean, No Toast Notification, Modern Font) ---
  setGender(gender, updateHash = true) {
    this.currentGender = gender;

    // Body Theme Classes
    document.body.classList.remove("theme-women", "theme-men");
    if (gender === "women") {
      document.body.classList.add("theme-women");
    } else if (gender === "men") {
      document.body.classList.add("theme-men");
    }

    // Update Segmented Tab Pills in UI
    document.querySelectorAll(".gender-tab-btn").forEach(btn => {
      const targetGender = btn.getAttribute("data-gender");
      if (targetGender === gender) {
        btn.classList.add("active", "bg-black", "text-white", "shadow-sm");
        btn.classList.remove("text-gray-600", "hover:text-black", "bg-transparent");
        if (gender === "women") {
          btn.classList.add("bg-gradient-to-r", "from-pink-500", "via-rose-500", "to-pink-600");
        }
      } else {
        btn.classList.remove("active", "bg-black", "text-white", "shadow-sm", "bg-gradient-to-r", "from-pink-500", "via-rose-500", "to-pink-600");
        btn.classList.add("text-gray-600", "hover:text-black", "bg-transparent");
      }
    });

    // Update Hero Content & Modern Typography dynamically
    this.updateHeroVibe(gender);

    // Filter and Re-render Products with smooth GSAP transition
    this.renderProducts(true);

    // Update URL hash without annoying notification
    if (updateHash) {
      if (gender === "women") window.location.hash = "#women";
      else if (gender === "men") window.location.hash = "#men";
      else window.location.hash = "#catalog";
    }
  }

  updateHeroVibe(gender) {
    const heroTitle = document.getElementById("hero-dynamic-title");
    const heroSubtitle = document.getElementById("hero-dynamic-subtitle");
    const heroBadge = document.getElementById("hero-dynamic-badge");
    const heroImg = document.getElementById("hero-dynamic-img");
    const heroCardTitle = document.getElementById("hero-dynamic-card-title");
    const heroCardSub = document.getElementById("hero-dynamic-card-sub");

    if (!heroTitle) return;

    if (gender === "women") {
      heroBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-pink-500 pulse-dot"></span><span class="font-mono uppercase tracking-wider text-[11px] font-bold text-pink-700">WOMEN'S ATELIER • PARISIAN SILK & COTTON</span>`;
      heroTitle.innerHTML = `PARISIAN CHIC.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">LIQUID SILK & SATIN.</span><br/>MODERN TAILORING.`;
      heroSubtitle.textContent = "Discover our refined women's atelier. Feather-soft mulberry silk slip dresses, cropped cloud fleeces, and sculpted rib-knit sets starting at ₹399.";
      if (heroImg) heroImg.src = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";
      if (heroCardTitle) heroCardTitle.textContent = "Parisian Rose Silk Slip";
      if (heroCardSub) heroCardSub.textContent = "Atelier Collection Drop";
    } else if (gender === "men") {
      heroBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span><span class="font-mono uppercase tracking-wider text-[11px] font-bold text-gray-800">MEN'S STREETWEAR • HEAVYWEIGHT DROPS</span>`;
      heroTitle.innerHTML = `HEAVYWEIGHT CUTS.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500">TAILORED DRAPE.</span><br/>RAW STREET LUXURY.`;
      heroSubtitle.textContent = "240+ GSM bio-washed heavyweight French terry, utility parachute cargos with 6 deep compartments, and vintage varsity jackets from ₹499 to ₹1,499.";
      if (heroImg) heroImg.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
      if (heroCardTitle) heroCardTitle.textContent = "Acid Wash Cyberpunk Tee";
      if (heroCardSub) heroCardSub.textContent = "Heavy Street Drop 01";
    } else {
      heroBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 pulse-dot"></span><span class="font-mono uppercase tracking-wider text-[11px] font-bold text-gray-800">MAISON VÉLOIR • MEN & WOMEN COLLECTIONS</span>`;
      heroTitle.innerHTML = `ELEVATED STREETWEAR.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-pink-700 to-amber-600">MEN & WOMEN DROPS.</span><br/>MODERN CASUALS.`;
      heroSubtitle.textContent = "India's highest-tier fashion atelier. Accessible pricing inspired by Zudio, conscious heart inspired by Being Human, and modern architectural drapes.";
      if (heroImg) heroImg.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
      if (heroCardTitle) heroCardTitle.textContent = "Explore Men & Women Fits";
      if (heroCardSub) heroCardSub.textContent = "Full 2026 Lookbook";
    }

    if (window.gsap) {
      gsap.fromTo(heroTitle, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
      if (heroImg) gsap.fromTo(heroImg, { scale: 0.97 }, { scale: 1, duration: 0.4 });
    }
  }

  // --- HERO SLIDER ---
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
    }, 6000);
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

    document.querySelectorAll(".slider-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === this.currentHeroSlide);
      dot.classList.toggle("bg-gray-300", idx !== this.currentHeroSlide);
    });
  }

  // --- COUNTDOWN TIMER ---
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

  // --- SETUP EVENT LISTENERS ---
  setupListeners() {
    // 1. Search Box
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
      const searchBox = document.getElementById("search-container-box");
      const dropdown = document.getElementById("search-suggestions-dropdown");
      if (dropdown && searchBox && !searchBox.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    // 2. Sort Dropdown
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderProducts(true);
      });
    }

    // 3. Price Filter Slider
    const priceFilter = document.getElementById("price-filter");
    const priceDisplay = document.getElementById("price-filter-display");
    if (priceFilter) {
      priceFilter.addEventListener("input", (e) => {
        this.maxPrice = Number(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `₹${this.maxPrice}`;
        this.renderProducts(false);
      });
    }

    // 4. Admin Toggle Buttons
    document.querySelectorAll(".toggle-admin-view").forEach(btn => {
      btn.addEventListener("click", () => this.toggleAdminDashboard());
    });
  }

  // --- SEARCH EXECUTION ---
  executeSearch() {
    const input = document.getElementById("global-search");
    if (!input) return;

    this.searchQuery = input.value.trim().toLowerCase();
    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (dropdown) dropdown.classList.add("hidden");

    this.showPage("catalog-view");
    this.renderProducts(true);

    const catalogSection = document.getElementById("catalog");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  clearSearch() {
    const input = document.getElementById("global-search");
    const clearBtn = document.getElementById("clear-search-btn");
    const dropdown = document.getElementById("search-suggestions-dropdown");

    if (input) input.value = "";
    if (clearBtn) clearBtn.classList.add("hidden");
    if (dropdown) dropdown.classList.add("hidden");

    this.searchQuery = "";
    this.renderProducts(true);
  }

  handleSearchAutocomplete(query) {
    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (!dropdown) return;

    if (!query || query.length < 2) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    const products = window.store.getProducts(this.currentGender);
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="p-4 text-center text-xs text-gray-500">
          <i class="fa-solid fa-magnifying-glass text-gray-400 mb-1"></i>
          <p>No matching apparel found for "${query}"</p>
        </div>
      `;
      dropdown.classList.remove("hidden");
      return;
    }

    dropdown.innerHTML = `
      <div class="p-2 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase px-3">
        <span>Suggested Drops (${matches.length})</span>
        <span class="text-emerald-600 font-mono">Instant Match</span>
      </div>
      <div class="divide-y divide-gray-100 dark:divide-zinc-800">
        ${matches.map(p => `
          <div onclick="app.selectAutocompleteProduct('${p.id}')" class="p-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
            <img src="${p.image}" alt="${p.name}" class="w-10 h-12 object-cover rounded-md border border-gray-200 dark:border-zinc-700 group-hover:scale-105 transition-transform" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-black dark:group-hover:text-white">${p.name}</p>
              <div class="flex items-center gap-2 text-[10px] text-gray-500">
                <span class="font-mono text-black dark:text-white font-extrabold">₹${p.price}</span>
                <span class="line-through">₹${p.originalPrice || Math.round(p.price * 1.8)}</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] font-bold ${p.gender === 'women' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-800'}">${p.gender === 'women' ? 'Women' : 'Men'}</span>
              </div>
            </div>
            <i class="fa-solid fa-arrow-right text-xs text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all mr-2"></i>
          </div>
        `).join('')}
      </div>
    `;

    dropdown.classList.remove("hidden");
  }

  selectAutocompleteProduct(productId) {
    const dropdown = document.getElementById("search-suggestions-dropdown");
    if (dropdown) dropdown.classList.add("hidden");
    this.navigateToProduct(productId);
  }

  // --- CATALOG RENDERING ---
  renderProducts(animate = false) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    let products = window.store.getProducts(this.currentGender);

    // Category filter
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
    if (countEl) {
      const label = this.currentGender === "women" ? "Women's" : this.currentGender === "men" ? "Men's" : "Total";
      countEl.textContent = `Showing ${products.length} ${label} Drops`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-20 text-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            <i class="fa-solid fa-shirt text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No drops match your filters</h3>
          <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">Try relaxing your price slider or checking the other department.</p>
          <button onclick="app.resetFilters()" class="px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    const wishlist = window.store.getWishlist();

    grid.innerHTML = products.map(product => {
      const isWishlisted = wishlist.includes(product.id);
      const isLowStock = product.stockCount && product.stockCount <= 6;
      const originalPrice = product.originalPrice || Math.round(product.price * 1.8);
      const discount = product.discount || "50% OFF";
      const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
      const isWomen = product.gender === "women";

      return `
        <div 
          class="product-card group relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border ${isWomen ? 'border-pink-200/80 hover:border-pink-400' : 'border-gray-200/90 dark:border-zinc-800 hover:border-black'} shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer" 
          onclick="app.navigateToProduct('${product.id}')"
          data-id="${product.id}"
        >
          <!-- Top Badges (No Emojis) -->
          <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
            ${product.badge ? `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${isWomen ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-gray-100 text-gray-900 border border-gray-300'} shadow-sm font-mono">
                ${product.badge}
              </span>
            ` : ""}
            ${isLowStock ? `
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white animate-pulse shadow-sm">
                Only ${product.stockCount} Left!
              </span>
            ` : ""}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            onclick="event.stopPropagation(); app.toggleWishlist('${product.id}', this)" 
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-black/60 shadow-md backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-red-500 hover:scale-110 transition-all border border-gray-200 dark:border-white/10" 
            title="Save to Wishlist"
          >
            <i class="${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-sm"></i>
          </button>

          <!-- Product Media Image -->
          <div class="relative w-full aspect-[4/5] bg-gray-100 dark:bg-zinc-950 overflow-hidden rounded-t-2xl">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy" 
              class="img-zoom w-full h-full object-cover object-center"
            />
            
            <!-- Quick 1-Click Size Bar -->
            <div class="quick-size-bar absolute bottom-3 inset-x-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-xl flex flex-col gap-1">
              <div class="flex items-center justify-between text-[10px] text-gray-500 font-bold px-1 uppercase font-mono">
                <span>Quick Add Size:</span>
                <span class="${isWomen ? 'text-pink-600' : 'text-emerald-600'} font-bold">Fast Bag</span>
              </div>
              <div class="flex items-center gap-1 overflow-x-auto scrollbar-none">
                ${availableSizes.map(sz => `
                  <button 
                    onclick="event.stopPropagation(); app.quickSelectSizeAndAdd('${product.id}', '${sz}')" 
                    class="flex-1 py-1 px-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white dark:bg-zinc-800 dark:hover:bg-white dark:hover:text-black text-gray-900 dark:text-white text-[11px] font-bold font-mono transition-colors text-center border border-gray-200 dark:border-zinc-700"
                    title="Add ${sz}"
                  >
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Product Details Section -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <div class="flex items-center gap-1 text-amber-500">
                  <i class="fa-solid fa-star text-[11px]"></i>
                  <span class="font-bold text-gray-900 dark:text-white font-mono">${product.rating || '4.8'}</span>
                  <span class="text-[10px] text-gray-400">(${product.reviewCount || 120})</span>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider ${isWomen ? 'text-pink-600' : 'text-gray-400'} font-mono">
                  ${isWomen ? 'FEMME' : 'HOMME'}
                </span>
              </div>

              <h4 class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors mb-1">
                ${product.name}
              </h4>
              <p class="text-[11px] text-gray-500 line-clamp-1 mb-3">
                ${product.fit || 'Regular Fit'} • ${product.fabric?.split(' ')[0] || 'Cotton'}
              </p>
            </div>

            <div class="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-lg font-black text-gray-950 dark:text-white font-mono">₹${product.price}</span>
                  <span class="text-xs text-gray-400 line-through font-mono">₹${originalPrice}</span>
                </div>
                <span class="text-[10px] font-extrabold ${isWomen ? 'text-pink-600' : 'text-emerald-600'} uppercase tracking-tight font-mono">
                  Save ${discount}
                </span>
              </div>

              <button 
                onclick="event.stopPropagation(); app.navigateToProduct('${product.id}')"
                class="px-3.5 py-2 rounded-xl ${isWomen ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white' : 'bg-black hover:bg-gray-800 text-white'} text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>View</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // GSAP Stagger Entrance Animation
    if (animate && window.gsap) {
      gsap.fromTo(".product-card", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.035, duration: 0.35, ease: "power2.out" }
      );
    }

    // Notify animation system — AOS patch + Anime.js stagger
    window.VeloirAnimations?.refreshAOS();
    window.VeloirAnimations?.animateGridFilter();
  }

  resetFilters() {
    this.currentCategory = "all";
    this.searchQuery = "";
    this.maxPrice = 2500;
    this.sortBy = "trending";

    const searchInput = document.getElementById("global-search");
    if (searchInput) searchInput.value = "";

    const priceFilter = document.getElementById("price-filter");
    const priceDisplay = document.getElementById("price-filter-display");
    if (priceFilter) priceFilter.value = 2500;
    if (priceDisplay) priceDisplay.textContent = "₹2500";

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "trending";

    document.querySelectorAll(".category-filter-btn").forEach(el => {
      el.classList.remove("active");
    });
    const allCat = document.querySelector('[data-category="all"]');
    if (allCat) allCat.classList.add("active");

    this.renderProducts(true);
    this.showToast("All filters reset", "info");
  }

  filterByStoryCategory(cat) {
    this.currentCategory = cat;

    document.querySelectorAll(".category-filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-category") === cat);
    });

    this.showPage("catalog-view");
    this.renderProducts(true);

    const catalogSection = document.getElementById("catalog");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // --- AMAZON-STYLE DEDICATED PRODUCT DETAIL PAGE (PDP) ---
  navigateToProduct(productId) {
    window.location.hash = `#product-${productId}`;
  }

  renderProductPage(productId, animate = true) {
    const product = window.store.getProductById(productId);
    if (!product) {
      this.showToast("Product not found", "error");
      this.showPage("catalog-view");
      return;
    }

    this.activeProduct = product;
    this.selectedSize = product.sizes ? product.sizes[0] : "M";
    this.selectedColor = product.colors ? product.colors[0]?.name : "Standard";
    this.selectedQty = 1;
    this.selectedPdpImgIndex = 0;

    // Apply gender theme to match product automatically
    if (product.gender === "women") {
      document.body.classList.add("theme-women");
      document.body.classList.remove("theme-men");
    } else if (product.gender === "men") {
      document.body.classList.add("theme-men");
      document.body.classList.remove("theme-women");
    }

    // Populate Breadcrumbs
    const genderLabel = product.gender === "women" ? "Women's Collection" : "Men's Collection";
    document.getElementById("pdp-breadcrumb-gender").textContent = genderLabel;
    document.getElementById("pdp-breadcrumb-gender").onclick = () => this.setGender(product.gender);
    document.getElementById("pdp-breadcrumb-cat").textContent = product.category.toUpperCase();
    document.getElementById("pdp-breadcrumb-title").textContent = product.name;

    // Gallery Images
    const allImages = [product.image, ...(product.additionalImages || [])];
    const mainImg = document.getElementById("pdp-main-image");
    if (mainImg) mainImg.src = allImages[0];

    const thumbsContainer = document.getElementById("pdp-thumbnails");
    if (thumbsContainer) {
      thumbsContainer.innerHTML = allImages.map((img, idx) => `
        <div 
          onclick="app.selectPdpImage('${img}', this, ${idx})" 
          class="thumb-item w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${idx === 0 ? 'active' : 'border-transparent'} bg-gray-100"
        >
          <img src="${img}" alt="${product.name} view" class="w-full h-full object-cover" />
        </div>
      `).join('');
    }

    // Product Header Info
    document.getElementById("pdp-title").textContent = product.name;
    document.getElementById("pdp-brand-link").textContent = product.gender === "women" ? "VÉLOIR Atelier Femme" : "VÉLOIR Homme Street Studio";
    document.getElementById("pdp-rating-num").textContent = product.rating || "4.8";
    document.getElementById("pdp-rating-count").textContent = `${product.reviewCount || 180} ratings`;

    // Pricing
    const origPrice = product.originalPrice || Math.round(product.price * 1.8);
    const savings = origPrice - product.price;
    document.getElementById("pdp-price").textContent = `₹${product.price}`;
    document.getElementById("pdp-mrp").textContent = `₹${origPrice}`;
    document.getElementById("pdp-discount").textContent = product.discount || "50% OFF";
    document.getElementById("pdp-savings").textContent = `You save ₹${savings} (${product.discount || '50%'})`;

    // Buy Box Price & Stock
    document.getElementById("pdp-buybox-price").textContent = `₹${product.price}`;
    const stockEl = document.getElementById("pdp-stock-status");
    if (stockEl) {
      if (product.stockCount <= 5) {
        stockEl.innerHTML = `<span class="text-rose-600 font-bold">Only ${product.stockCount} left in stock - order soon.</span>`;
      } else {
        stockEl.innerHTML = `<span class="text-emerald-700 dark:text-emerald-400 font-bold">In Stock.</span> Ships from VÉLOIR Mumbai Hub.`;
      }
    }

    // Colors
    const colorLabel = document.getElementById("pdp-selected-color-label");
    if (colorLabel) colorLabel.textContent = this.selectedColor;

    const colorsContainer = document.getElementById("pdp-color-swatches");
    if (colorsContainer) {
      colorsContainer.innerHTML = (product.colors || [{ name: "Standard", hex: "#111" }]).map((c, idx) => `
        <button 
          onclick="app.selectPdpColor('${c.name}', this)" 
          class="pdp-color-btn flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${idx === 0 ? 'active border-black bg-gray-50 dark:border-white dark:bg-zinc-800' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400'}"
          title="${c.name}"
        >
          <span class="w-4 h-4 rounded-full border border-gray-300 shadow-inner" style="background-color: ${c.hex}"></span>
          <span>${c.name}</span>
        </button>
      `).join('');
    }

    // Sizes
    const sizesContainer = document.getElementById("pdp-sizes-container");
    if (sizesContainer) {
      sizesContainer.innerHTML = (product.sizes || ["S", "M", "L", "XL"]).map((sz, idx) => `
        <button 
          onclick="app.selectPdpSize('${sz}', this)" 
          class="pdp-size-btn px-4 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${idx === 0 ? 'active bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-black'}"
        >
          ${sz}
        </button>
      `).join('');
    }

    // Specs Table
    document.getElementById("pdp-spec-fit").textContent = product.fit || "Standard Fit";
    document.getElementById("pdp-spec-fabric").textContent = product.fabric || "100% Combed Heavy Cotton";
    document.getElementById("pdp-desc").textContent = product.description || "Designed for ultimate drape and everyday luxury.";

    // Highlights Bullets
    const highlightsContainer = document.getElementById("pdp-highlights-list");
    if (highlightsContainer) {
      const highlights = product.highlights || [
        "Heavyweight premium fabric that maintains structured silhouette",
        "Reinforced collars and hems for maximum longevity",
        "Zero color bleeding and zero post-wash shrinkage"
      ];
      highlightsContainer.innerHTML = highlights.map(h => `
        <li class="flex items-start gap-2.5 text-xs text-gray-600 dark:text-zinc-400">
          <i class="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-sm"></i>
          <span>${h}</span>
        </li>
      `).join('');
    }

    // Wishlist Button state in Buy Box
    const isWishlisted = window.store.isInWishlist(product.id);
    const wishlistBtn = document.getElementById("pdp-wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.innerHTML = `
        <i class="${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-sm"></i>
        <span>${isWishlisted ? 'Saved in Wishlist' : 'Add to Wish List'}</span>
      `;
    }

    // Quantity Reset
    const qtyDisplay = document.getElementById("pdp-qty-display");
    if (qtyDisplay) qtyDisplay.textContent = "1";

    // Reviews Section
    this.renderPdpReviews();

    // Related Recommendations
    this.renderPdpRelated(product);

    // Switch view
    this.showPage("product-page-view");
  }

  selectPdpImage(url, el, idx) {
    const mainImg = document.getElementById("pdp-main-image");
    if (mainImg) {
      if (window.gsap) {
        gsap.to(mainImg, {
          opacity: 0.3,
          duration: 0.15,
          onComplete: () => {
            mainImg.src = url;
            gsap.to(mainImg, { opacity: 1, duration: 0.25 });
          }
        });
      } else {
        mainImg.src = url;
      }
    }

    document.querySelectorAll("#pdp-thumbnails .thumb-item").forEach(t => {
      t.classList.remove("active", "border-black", "border-pink-500");
      t.classList.add("border-transparent");
    });
    el.classList.add("active");
  }

  selectPdpSize(size, el) {
    this.selectedSize = size;
    document.querySelectorAll(".pdp-size-btn").forEach(b => {
      b.classList.remove("active", "bg-black", "text-white", "border-black", "dark:bg-white", "dark:text-black", "dark:border-white");
      b.classList.add("border-gray-200", "text-gray-700", "dark:border-zinc-700", "dark:text-zinc-300");
    });
    el.classList.add("active", "bg-black", "text-white", "border-black", "dark:bg-white", "dark:text-black", "dark:border-white");
    el.classList.remove("border-gray-200", "text-gray-700", "dark:border-zinc-700", "dark:text-zinc-300");
  }

  selectPdpColor(colorName, el) {
    this.selectedColor = colorName;
    const label = document.getElementById("pdp-selected-color-label");
    if (label) label.textContent = colorName;

    document.querySelectorAll(".pdp-color-btn").forEach(b => {
      b.classList.remove("active", "border-black", "border-pink-500", "bg-gray-50", "bg-pink-50", "dark:border-white", "dark:bg-zinc-800");
      b.classList.add("border-gray-200", "dark:border-zinc-700");
    });
    el.classList.add("active", "border-black", "bg-gray-50", "dark:border-white", "dark:bg-zinc-800");
  }

  updatePdpQty(delta) {
    this.selectedQty = Math.max(1, Math.min(10, this.selectedQty + delta));
    const qtyDisplay = document.getElementById("pdp-qty-display");
    if (qtyDisplay) qtyDisplay.textContent = this.selectedQty;
  }

  checkPdpPincode() {
    const input = document.getElementById("pdp-pincode-input");
    const result = document.getElementById("pdp-pincode-result");
    if (!input || !result) return;

    const pin = input.value.trim();
    if (!pin || pin.length < 6) {
      this.showToast("Please enter a valid 6-digit PIN code", "error");
      return;
    }

    result.classList.remove("hidden");
    result.innerHTML = `
      <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
        <i class="fa-solid fa-truck-fast text-emerald-600 mt-0.5"></i>
        <div>
          <p class="font-bold">FREE Express Delivery to ${pin} by Thursday, 29 Oct</p>
          <p class="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Fastest delivery tomorrow by 2 PM if ordered within 3 hrs.</p>
        </div>
      </div>
    `;
    this.showToast("Delivery estimate verified for " + pin, "success");
  }

  addToCartFromPdp() {
    if (!this.activeProduct) return;
    window.store.addToCart(this.activeProduct, this.selectedSize, this.selectedColor, this.selectedQty);
    
    // Animate Cart Icon in Header
    const cartBtn = document.querySelector(".cart-counter");
    if (cartBtn && window.gsap) {
      gsap.fromTo(cartBtn, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" });
    }

    this.showToast(`Added ${this.selectedQty}x ${this.activeProduct.name} to Bag`, "success");
  }

  buyNowFromPdp() {
    if (!this.activeProduct) return;
    window.store.addToCart(this.activeProduct, this.selectedSize, this.selectedColor, this.selectedQty);
    this.openCheckoutModal();
  }

  toggleWishlistFromPdp() {
    if (!this.activeProduct) return;
    const isAdded = window.store.toggleWishlist(this.activeProduct.id);
    const wishlistBtn = document.getElementById("pdp-wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.innerHTML = `
        <i class="${isAdded ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-sm"></i>
        <span>${isAdded ? 'Saved in Wishlist' : 'Add to Wish List'}</span>
      `;
      if (window.gsap) {
        gsap.fromTo(wishlistBtn, { scale: 1.08 }, { scale: 1, duration: 0.25 });
      }
    }
    this.showToast(isAdded ? "Saved to your Wishlist" : "Removed from Wishlist", isAdded ? "success" : "info");
  }

  // --- AMAZON-STYLE REVIEWS SECTION ---
  renderPdpReviews() {
    if (!this.activeProduct) return;
    const product = this.activeProduct;
    const reviews = product.reviews || [];

    const avgRating = product.rating || 4.8;
    const totalReviews = reviews.length;

    document.getElementById("pdp-reviews-overall-score").textContent = avgRating;
    document.getElementById("pdp-reviews-total-subtitle").textContent = `Based on ${product.reviewCount || totalReviews || 120} verified customer ratings`;

    // Percentage Breakdown
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      starCounts[star]++;
    });

    const totalCounted = reviews.length || 1;
    const pct5 = Math.round((starCounts[5] / totalCounted) * 100) || 78;
    const pct4 = Math.round((starCounts[4] / totalCounted) * 100) || 16;
    const pct3 = Math.round((starCounts[3] / totalCounted) * 100) || 4;
    const pct2 = Math.round((starCounts[2] / totalCounted) * 100) || 1;
    const pct1 = Math.round((starCounts[1] / totalCounted) * 100) || 1;

    document.getElementById("bar-5-star").style.width = `${pct5}%`;
    document.getElementById("bar-5-star-pct").textContent = `${pct5}%`;
    document.getElementById("bar-4-star").style.width = `${pct4}%`;
    document.getElementById("bar-4-star-pct").textContent = `${pct4}%`;
    document.getElementById("bar-3-star").style.width = `${pct3}%`;
    document.getElementById("bar-3-star-pct").textContent = `${pct3}%`;
    document.getElementById("bar-2-star").style.width = `${pct2}%`;
    document.getElementById("bar-2-star-pct").textContent = `${pct2}%`;
    document.getElementById("bar-1-star").style.width = `${pct1}%`;
    document.getElementById("bar-1-star-pct").textContent = `${pct1}%`;

    const reviewsListContainer = document.getElementById("pdp-customer-reviews-list");
    if (reviewsListContainer) {
      if (reviews.length === 0) {
        reviewsListContainer.innerHTML = `
          <div class="p-8 text-center bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700">
            <p class="text-xs text-gray-500">No written reviews yet. Be the first customer to share your thoughts!</p>
          </div>
        `;
        return;
      }

      reviewsListContainer.innerHTML = reviews.map(rev => `
        <div class="py-5 border-b border-gray-100 dark:border-zinc-800 last:border-0 flex flex-col gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-bold text-xs flex items-center justify-center font-mono">
              ${rev.author.charAt(0)}
            </div>
            <div>
              <span class="text-xs font-bold text-gray-900 dark:text-white">${rev.author}</span>
              <div class="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <i class="fa-solid fa-circle-check"></i>
                <span>Verified Purchase</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <div class="flex text-amber-400">
              ${Array.from({ length: 5 }, (_, i) => `
                <i class="${i < rev.rating ? 'fa-solid' : 'fa-regular'} fa-star text-[11px]"></i>
              `).join('')}
            </div>
            <span class="font-bold text-gray-900 dark:text-white">${rev.title}</span>
          </div>

          <p class="text-[11px] text-gray-400 font-mono">Reviewed on ${rev.date}</p>
          <p class="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">${rev.comment}</p>

          <div class="flex items-center gap-3 pt-1">
            <button onclick="app.voteHelpful('${rev.id}', this)" class="px-3 py-1 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-black text-[11px] font-bold text-gray-600 dark:text-zinc-400 transition-colors flex items-center gap-1.5">
              <i class="fa-regular fa-thumbs-up"></i>
              <span>Helpful (${rev.helpful || 0})</span>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  setReviewRating(stars) {
    this.selectedReviewRating = stars;
    document.querySelectorAll(".review-star-picker i").forEach((starEl, idx) => {
      if (idx < stars) {
        starEl.className = "fa-solid fa-star text-amber-400 text-lg cursor-pointer";
      } else {
        starEl.className = "fa-regular fa-star text-gray-300 text-lg cursor-pointer";
      }
    });
  }

  submitProductReview(e) {
    e.preventDefault();
    if (!this.activeProduct) return;

    const nameInput = document.getElementById("review-author-input");
    const titleInput = document.getElementById("review-title-input");
    const textInput = document.getElementById("review-text-input");

    const author = nameInput ? nameInput.value.trim() : "Verified Customer";
    const title = titleInput ? titleInput.value.trim() : "Superb Quality";
    const comment = textInput ? textInput.value.trim() : "Really loved the fit and finish.";

    if (!comment) {
      this.showToast("Please write a few words in your review", "error");
      return;
    }

    const reviewData = {
      author: author || "Customer",
      rating: this.selectedReviewRating,
      title: title || "High Quality Drop",
      comment: comment
    };

    window.store.addReview(this.activeProduct.id, reviewData);

    if (titleInput) titleInput.value = "";
    if (textInput) textInput.value = "";

    if (window.confetti) {
      window.confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
    }

    this.showToast("Thank you! Your verified review has been published.", "success");
    this.renderPdpReviews();
  }

  voteHelpful(revId, btn) {
    btn.innerHTML = `<i class="fa-solid fa-check text-emerald-600"></i> <span class="text-emerald-700">Thank you!</span>`;
    btn.disabled = true;
    this.showToast("Feedback recorded", "info");
  }

  // --- RELATED RECOMMENDATIONS ON PDP ---
  renderPdpRelated(product) {
    const relatedContainer = document.getElementById("pdp-related-items");
    if (!relatedContainer) return;

    const all = window.store.getProducts(product.gender);
    const related = all.filter(p => p.id !== product.id).slice(0, 4);

    relatedContainer.innerHTML = related.map(item => `
      <div 
        onclick="app.navigateToProduct('${item.id}')" 
        class="group p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
      >
        <div class="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-950 mb-2.5">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <div>
          <h5 class="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-black">${item.name}</h5>
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs font-black font-mono">₹${item.price}</span>
            <span class="text-[10px] text-gray-400 line-through font-mono">₹${item.originalPrice || Math.round(item.price * 1.8)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- DEDICATED MY ORDERS PAGE (#orders-view) ---
  renderOrdersPage() {
    const container = document.getElementById("orders-page-list");
    if (!container) return;

    const orders = window.store.getOrders();
    if (orders.length === 0) {
      container.innerHTML = `
        <div class="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-8">
          <i class="fa-solid fa-box-open text-4xl text-gray-300 dark:text-zinc-600 mb-3"></i>
          <h4 class="text-base font-bold text-gray-900 dark:text-white">You haven't placed any orders yet</h4>
          <p class="text-xs text-gray-500 mt-1 mb-5">Explore our seasonal collections and place your first order today.</p>
          <button onclick="app.showPage('catalog-view')" class="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider">
            Explore Drops
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all">
        <!-- Order Header Bar -->
        <div class="p-4 sm:p-5 bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div class="flex flex-wrap items-center gap-6">
            <div>
              <span class="text-[10px] font-bold uppercase text-gray-500 font-mono">Order Placed</span>
              <p class="font-bold text-gray-900 dark:text-white mt-0.5">${order.date}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-gray-500 font-mono">Total Amount</span>
              <p class="font-black font-mono text-gray-950 dark:text-white mt-0.5">₹${order.total}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-gray-500 font-mono">Ship To</span>
              <p class="font-bold text-gray-900 dark:text-white mt-0.5">${order.customer?.name || 'Customer'}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs font-mono text-gray-500 font-bold">#${order.id}</span>
            <button onclick="window.location.hash = '#track-${order.id}'" class="px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs transition-colors">
              Track Package
            </button>
          </div>
        </div>

        <!-- Order Items Body -->
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-blue-500'}"></span>
              <h5 class="text-sm font-bold text-gray-900 dark:text-white">${order.status}</h5>
            </div>
            <span class="text-xs text-gray-500 font-mono">${order.carrier || 'Express Logistics'}</span>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-zinc-800">
            ${order.items.map(item => `
              <div class="py-3 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-12 h-14 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'}" alt="${item.name}" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <h6 class="text-xs font-bold text-gray-900 dark:text-white truncate">${item.name}</h6>
                    <p class="text-[11px] text-gray-500 mt-0.5">Size: <b>${item.size}</b> • Color: <b>${item.color || 'Standard'}</b> • Qty: <b>${item.qty}</b></p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold text-gray-950 dark:text-white">₹${item.price * item.qty}</span>
                  <button onclick="app.quickSelectSizeAndAdd('${item.id}', '${item.size}')" class="px-3 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 hover:border-black text-[11px] font-bold text-gray-700 dark:text-zinc-300">
                    Buy Again
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- DEDICATED TRACK ORDER PAGE (#track-view) ---
  renderTrackPage(orderId = null) {
    const orders = window.store.getOrders();
    const order = orderId ? (orders.find(o => o.id === orderId) || orders[0]) : orders[0];

    const input = document.getElementById("track-input-search");
    if (input && order) input.value = order.id;

    if (!order) {
      document.getElementById("track-page-content").innerHTML = `
        <div class="py-16 text-center text-gray-400">
          <p class="text-sm">No active order to track. Enter an order number above.</p>
        </div>
      `;
      return;
    }

    const container = document.getElementById("track-page-content");
    if (!container) return;

    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between pb-6 border-b border-gray-200 dark:border-zinc-800 gap-4">
          <div>
            <span class="text-[10px] font-bold uppercase text-gray-400 font-mono">Tracking Package</span>
            <h3 class="text-xl font-black text-gray-950 dark:text-white font-mono mt-0.5">#${order.id}</h3>
            <p class="text-xs text-gray-500 mt-0.5">${order.carrier || 'Express Air Courier Logistics'}</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-bold uppercase text-gray-400 font-mono">Status</span>
            <h4 class="text-base font-black text-emerald-600 dark:text-emerald-400">${order.status}</h4>
            <p class="text-xs text-gray-500">Estimated delivery in 2-3 business days</p>
          </div>
        </div>

        <!-- Visual Stepper Progress -->
        <div class="py-4 space-y-6">
          ${(order.trackingSteps || [
            { label: "Order Confirmed", date: "Just now", completed: true },
            { label: "Packed at Warehouse (Mumbai Hub)", date: "Today", completed: false },
            { label: "Dispatched & In Transit", date: "Tomorrow", completed: false },
            { label: "Out for Delivery", date: "Pending", completed: false },
            { label: "Delivered", date: "Pending", completed: false }
          ]).map((step, idx, arr) => `
            <div class="flex items-start gap-4 relative">
              ${idx < arr.length - 1 ? `
                <div class="absolute top-6 left-3.5 w-0.5 h-12 ${step.completed ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}"></div>
              ` : ""}
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${step.completed ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-200 dark:bg-zinc-800 text-gray-400'}">
                ${step.completed ? '✓' : idx + 1}
              </div>
              <div class="flex-1">
                <h5 class="text-xs font-bold ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}">${step.label}</h5>
                <p class="text-[11px] text-gray-500 font-mono mt-0.5">${step.date}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-6 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500">
          <span>Shipping destination: <b>${order.customer?.address || 'Mumbai'}, ${order.customer?.pincode || '400001'}</b></span>
          <button onclick="app.showToast('Courier dispatch notifications enabled', 'success')" class="text-black dark:text-white font-bold underline">
            Get SMS Updates
          </button>
        </div>
      </div>
    `;
  }

  searchTrackOrder() {
    const input = document.getElementById("track-input-search");
    if (!input) return;
    const query = input.value.trim().toUpperCase();
    if (!query) {
      this.showToast("Please enter an order ID (e.g. ORD-94821)", "error");
      return;
    }
    this.renderTrackPage(query);
  }

  // --- DEDICATED WISHLIST PAGE (#wishlist-view) ---
  renderWishlistPage() {
    const container = document.getElementById("wishlist-page-grid");
    const countEl = document.getElementById("wishlist-page-count");
    if (!container) return;

    const wishlistIds = window.store.getWishlist();
    const products = wishlistIds.map(id => window.store.getProductById(id)).filter(Boolean);

    if (countEl) countEl.textContent = `${products.length} Saved Items`;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-8">
          <i class="fa-regular fa-heart text-4xl text-gray-300 dark:text-zinc-600 mb-3"></i>
          <h4 class="text-base font-bold text-gray-900 dark:text-white">Your Wishlist is Empty</h4>
          <p class="text-xs text-gray-500 mt-1 mb-5">Save your favorite street drops and couture pieces as you browse.</p>
          <button onclick="app.showPage('catalog-view')" class="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider">
            Explore Drops
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-950 mb-3 cursor-pointer" onclick="app.navigateToProduct('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <h5 class="text-xs font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:underline" onclick="app.navigateToProduct('${product.id}')">${product.name}</h5>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm font-black font-mono">₹${product.price}</span>
            <span class="text-xs text-gray-400 line-through font-mono">₹${product.originalPrice || Math.round(product.price * 1.8)}</span>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-100 dark:border-zinc-800 mt-3 flex items-center gap-2">
          <button onclick="app.quickSelectSizeAndAdd('${product.id}', '${product.sizes ? product.sizes[0] : 'M'}'); app.toggleWishlist('${product.id}')" class="flex-1 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider transition-all">
            Move to Bag
          </button>
          <button onclick="app.toggleWishlist('${product.id}')" class="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- DEDICATED CUSTOMER SUPPORT PAGE (#support-view) ---
  submitSupportTicket(e) {
    e.preventDefault();
    const name = document.getElementById("support-name")?.value.trim();
    const subject = document.getElementById("support-subject")?.value.trim();
    this.showToast(`Thank you ${name}! Support Ticket #${Math.floor(1000 + Math.random() * 9000)} received. Our concierge will reply within 15 mins.`, "success");
    e.target.reset();
  }

  // --- QUICK ACTIONS FROM CATALOG ---
  quickSelectSizeAndAdd(productId, size) {
    const product = window.store.getProductById(productId);
    if (!product) return;

    const defaultColor = product.colors ? product.colors[0]?.name : "Standard";
    window.store.addToCart(product, size, defaultColor, 1);

    const cartBtn = document.querySelector(".cart-counter");
    if (cartBtn && window.gsap) {
      gsap.fromTo(cartBtn, { scale: 1.5 }, { scale: 1, duration: 0.3 });
    }

    this.showToast(`Added ${product.name} (Size: ${size}) to Bag`, "success");
  }

  toggleWishlist(productId, btnElement = null) {
    const isAdded = window.store.toggleWishlist(productId);

    if (btnElement) {
      const icon = btnElement.querySelector("i");
      if (icon) {
        if (isAdded) {
          icon.className = "fa-solid fa-heart text-red-500 text-sm";
          btnElement.classList.add("heart-pop");
          setTimeout(() => btnElement.classList.remove("heart-pop"), 350);
          // Lottie heart pulse micro-animation
          window.VeloirAnimations?.playWishlistHeart(btnElement);
        } else {
          icon.className = "fa-regular fa-heart text-sm";
        }
      }
    }

    this.showToast(isAdded ? "Added to Wishlist" : "Removed from Wishlist", isAdded ? "success" : "info");
  }

  updateWishlistBadges() {
    const count = window.store.getWishlist().length;
    document.querySelectorAll(".wishlist-counter").forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle("hidden", count === 0);
    });
  }

  // --- CART DRAWER ---
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
      this.updateCartUI();
      drawer.classList.add("active");
      // Motion One slide-in animation
      window.VeloirAnimations?.animateCartOpen();
    }
  }

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
      // Motion One slide-out animation
      window.VeloirAnimations?.animateCartClose();
      drawer.classList.remove("active");
    }
  }

  updateCartUI() {
    const cart = window.store.getCart();
    const totals = window.store.calculateCartTotals();

    document.querySelectorAll(".cart-counter").forEach(badge => {
      badge.textContent = totals.itemCount;
    });

    const itemsContainer = document.getElementById("cart-items-container");
    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center text-gray-400">
          <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-gray-300 dark:text-zinc-700"></i>
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Your Shopping Bag is Empty</h4>
          <p class="text-xs text-gray-500 mb-4">Discover our high-fashion drops and fill your wardrobe.</p>
          <button onclick="app.closeCartDrawer(); app.showPage('catalog-view')" class="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider">
            Shop Drops
          </button>
        </div>
      `;
      this.updateCartTotalsUI(totals);
      return;
    }

    itemsContainer.innerHTML = cart.map((item, idx) => `
      <div class="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-start gap-3 shadow-sm">
        <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-20 object-cover rounded-xl border border-gray-100 dark:border-zinc-700 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h5 class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">${item.product.name}</h5>
            <button onclick="window.store.removeFromCart(${idx})" class="text-gray-400 hover:text-red-500 text-xs p-1" title="Remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
            <span>Size: <b class="text-black dark:text-white">${item.size}</b></span>
            <span>•</span>
            <span>Color: <b class="text-black dark:text-white">${item.color}</b></span>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900">
              <button onclick="window.store.updateCartQty(${idx}, -1)" class="px-2 py-0.5 text-xs text-gray-600 dark:text-zinc-300 hover:bg-gray-200 font-bold">-</button>
              <span class="px-2.5 py-0.5 text-xs font-mono font-bold text-black dark:text-white">${item.qty}</span>
              <button onclick="window.store.updateCartQty(${idx}, 1)" class="px-2 py-0.5 text-xs text-gray-600 dark:text-zinc-300 hover:bg-gray-200 font-bold">+</button>
            </div>
            <span class="text-xs font-black font-mono">₹${(item.product.price || 0) * item.qty}</span>
          </div>
        </div>
      </div>
    `).join('');

    this.updateCartTotalsUI(totals);
  }

  updateCartTotalsUI(totals) {
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountEl = document.getElementById("cart-discount");
    const shippingEl = document.getElementById("cart-shipping");
    const finalEl = document.getElementById("cart-final-total");
    const freeShipProgress = document.getElementById("free-shipping-progress");
    const freeShipMsg = document.getElementById("free-shipping-msg");

    if (subtotalEl) subtotalEl.textContent = `₹${totals.rawTotal}`;
    if (discountEl) discountEl.textContent = `-₹${totals.promoDiscount}`;
    if (shippingEl) shippingEl.textContent = totals.shippingFee === 0 ? "FREE" : `₹${totals.shippingFee}`;
    if (finalEl) finalEl.textContent = `₹${totals.finalAmount}`;

    if (freeShipProgress && freeShipMsg) {
      if (totals.rawTotal >= totals.freeShippingThreshold) {
        freeShipProgress.style.width = "100%";
        freeShipMsg.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> You've unlocked <b>FREE Express Shipping!</b>`;
      } else {
        const pct = Math.min(100, Math.round((totals.rawTotal / totals.freeShippingThreshold) * 100));
        freeShipProgress.style.width = `${pct}%`;
        freeShipMsg.textContent = `Add ₹${totals.neededForFreeShipping} more for FREE Delivery!`;
      }
    }
  }

  applyCartCoupon() {
    const input = document.getElementById("cart-coupon-input");
    if (!input) return;
    const res = window.store.applyCoupon(input.value);
    this.showToast(res.message, res.success ? "success" : "error");
    if (res.success) input.value = "";
  }

  // --- CHECKOUT MODAL ---
  openCheckoutModal() {
    this.closeCartDrawer();
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    const totals = window.store.calculateCartTotals();
    if (totals.itemCount === 0) {
      this.showToast("Your shopping bag is empty", "error");
      return;
    }

    document.getElementById("checkout-total-display").textContent = `₹${totals.finalAmount}`;
    modal.classList.add("active");
    // Motion One modal fade+scale entrance
    window.VeloirAnimations?.animateModalOpen("checkout-modal");
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.remove("active");
  }

  processOrderPlacement(e) {
    e.preventDefault();
    const name = document.getElementById("cust-name")?.value.trim() || "Customer";
    const phone = document.getElementById("cust-phone")?.value.trim() || "+91 98765 43210";
    const address = document.getElementById("cust-address")?.value.trim() || "Downtown Street";
    const city = document.getElementById("cust-city")?.value.trim() || "Mumbai";
    const pincode = document.getElementById("cust-pincode")?.value.trim() || "400001";
    const payment = document.querySelector('input[name="payment-method"]:checked')?.value || "UPI";

    const cart = window.store.getCart();
    const totals = window.store.calculateCartTotals();

    const order = window.store.addOrder({
      customer: { name, phone, address, city, pincode },
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        size: item.size,
        color: item.color,
        price: item.product.price,
        qty: item.qty
      })),
      subtotal: totals.rawTotal,
      discountAmount: totals.promoDiscount,
      shippingFee: totals.shippingFee,
      total: totals.finalAmount,
      paymentMethod: payment
    });

    this.closeCheckoutModal();

    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    // Lottie cart-success micro-animation
    window.VeloirAnimations?.playCartSuccess();

    this.showToast(`Order #${order.id} placed successfully!`, "success");
    window.location.hash = `#track-${order.id}`;
  }

  // --- OUTFIT BUILDER (Complete The Look) ---
  initOutfitBuilder() {
    const products = window.store.getProducts();
    const tops = products.filter(p => p.category === "tees" || p.category === "hoodies");
    const bottoms = products.filter(p => p.category === "bottoms");
    const accessories = products.filter(p => p.category === "accessories" || p.category === "shoes");

    this.outfitState.top = tops[0] || null;
    this.outfitState.bottom = bottoms[0] || null;
    this.outfitState.accessory = accessories[0] || null;

    this.renderOutfitBuilderStage();
    this.renderOutfitBuilderSelectors(tops, bottoms, accessories);
  }

  renderOutfitBuilderStage() {
    const topImg = document.getElementById("stage-top-img");
    const topName = document.getElementById("stage-top-name");
    const topPrice = document.getElementById("stage-top-price");

    const botImg = document.getElementById("stage-bottom-img");
    const botName = document.getElementById("stage-bottom-name");
    const botPrice = document.getElementById("stage-bottom-price");

    const accImg = document.getElementById("stage-acc-img");
    const accName = document.getElementById("stage-acc-name");
    const accPrice = document.getElementById("stage-acc-price");

    const totalEl = document.getElementById("outfit-total-price");

    let total = 0;
    if (this.outfitState.top) {
      if (topImg) topImg.src = this.outfitState.top.image;
      if (topName) topName.textContent = this.outfitState.top.name;
      if (topPrice) topPrice.textContent = `₹${this.outfitState.top.price}`;
      total += this.outfitState.top.price;
    }
    if (this.outfitState.bottom) {
      if (botImg) botImg.src = this.outfitState.bottom.image;
      if (botName) botName.textContent = this.outfitState.bottom.name;
      if (botPrice) botPrice.textContent = `₹${this.outfitState.bottom.price}`;
      total += this.outfitState.bottom.price;
    }
    if (this.outfitState.accessory) {
      if (accImg) accImg.src = this.outfitState.accessory.image;
      if (accName) accName.textContent = this.outfitState.accessory.name;
      if (accPrice) accPrice.textContent = `₹${this.outfitState.accessory.price}`;
      total += this.outfitState.accessory.price;
    }

    if (totalEl) totalEl.textContent = `₹${total}`;
  }

  renderOutfitBuilderSelectors(tops, bottoms, accessories) {
    const topScroll = document.getElementById("picker-scroll-tops");
    const botScroll = document.getElementById("picker-scroll-bottoms");
    const accScroll = document.getElementById("picker-scroll-acc");

    if (topScroll) {
      topScroll.innerHTML = tops.map(item => `
        <div onclick="app.selectOutfitPiece('top', '${item.id}')" class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border-2 ${this.outfitState.top?.id === item.id ? 'border-black' : 'border-gray-200'}">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
        </div>
      `).join('');
    }

    if (botScroll) {
      botScroll.innerHTML = bottoms.map(item => `
        <div onclick="app.selectOutfitPiece('bottom', '${item.id}')" class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border-2 ${this.outfitState.bottom?.id === item.id ? 'border-black' : 'border-gray-200'}">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
        </div>
      `).join('');
    }

    if (accScroll) {
      accScroll.innerHTML = accessories.map(item => `
        <div onclick="app.selectOutfitPiece('accessory', '${item.id}')" class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border-2 ${this.outfitState.accessory?.id === item.id ? 'border-black' : 'border-gray-200'}">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
        </div>
      `).join('');
    }
  }

  selectOutfitPiece(slot, productId) {
    const prod = window.store.getProductById(productId);
    if (!prod) return;
    this.outfitState[slot] = prod;
    this.renderOutfitBuilderStage();

    const products = window.store.getProducts();
    const tops = products.filter(p => p.category === "tees" || p.category === "hoodies");
    const bottoms = products.filter(p => p.category === "bottoms");
    const accessories = products.filter(p => p.category === "accessories" || p.category === "shoes");
    this.renderOutfitBuilderSelectors(tops, bottoms, accessories);
  }

  addCompleteOutfitToCart() {
    let count = 0;
    if (this.outfitState.top) {
      window.store.addToCart(this.outfitState.top, "M", null, 1);
      count++;
    }
    if (this.outfitState.bottom) {
      window.store.addToCart(this.outfitState.bottom, "32", null, 1);
      count++;
    }
    if (this.outfitState.accessory) {
      window.store.addToCart(this.outfitState.accessory, "Standard", null, 1);
      count++;
    }

    this.showToast(`Added Complete ${count}-Piece Look to Bag`, "success");
    this.openCartDrawer();
  }

  // --- ADMIN DASHBOARD ---
  toggleAdminDashboard() {
    const modal = document.getElementById("admin-dashboard-modal");
    if (!modal) return;
    const isActive = modal.classList.contains("active");
    if (isActive) {
      modal.classList.remove("active");
    } else {
      if (window.adminDashboard) window.adminDashboard.refresh();
      modal.classList.add("active");
    }
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
      <i class="fa-solid ${icon} text-sm"></i>
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
