/**
 * URBN KULT // BE HUMAN - Seller & Admin HQ Controller
 * Real-time analytics, Chart.js visualizations, Product CRUD & Order Fulfillment
 */

class AdminDashboard {
  constructor() {
    this.salesChart = null;
    this.categoryChart = null;
    this.editingProductId = null;

    this.init();
  }

  init() {
    this.setupListeners();
    this.refresh();

    // Re-render when store updates
    window.addEventListener("state:ordersUpdated", () => this.refresh());
    window.addEventListener("state:productsUpdated", () => this.refresh());
  }

  setupListeners() {
    // Add product form submission
    const form = document.getElementById("add-product-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleProductFormSubmit();
      });
    }

    // Image URL live preview in form
    const imgUrlInput = document.getElementById("prod-form-img");
    const imgPreview = document.getElementById("prod-form-img-preview");
    if (imgUrlInput && imgPreview) {
      imgUrlInput.addEventListener("input", (e) => {
        if (e.target.value.startsWith("http")) {
          imgPreview.src = e.target.value;
          imgPreview.classList.remove("hidden");
        } else {
          imgPreview.classList.add("hidden");
        }
      });
    }

    // Dashboard search
    const dashSearch = document.getElementById("dash-product-search");
    if (dashSearch) {
      dashSearch.addEventListener("input", (e) => {
        this.renderProductsTable(e.target.value.toLowerCase().trim());
      });
    }
  }

  refresh() {
    this.renderKPIs();
    this.initCharts();
    this.renderProductsTable();
    this.renderOrdersTable();
    this.renderLowStockAlerts();
  }

  // --- EXECUTIVE KPI CARDS ---
  renderKPIs() {
    const summary = window.store.getAnalyticsSummary();

    const revEl = document.getElementById("kpi-revenue");
    const ordersEl = document.getElementById("kpi-orders");
    const aovEl = document.getElementById("kpi-aov");
    const catalogEl = document.getElementById("kpi-catalog");

    if (revEl) revEl.textContent = `₹${summary.totalRevenue.toLocaleString("en-IN")}`;
    if (ordersEl) ordersEl.textContent = summary.totalOrders;
    if (aovEl) aovEl.textContent = `₹${summary.aov}`;
    if (catalogEl) catalogEl.textContent = summary.catalogSize;
  }

  // --- INTERACTIVE CHART.JS VISUALIZATIONS ---
  initCharts() {
    if (typeof Chart === "undefined") return;

    // 1. Sales Trend Line Chart
    const salesCanvas = document.getElementById("sales-trend-chart");
    if (salesCanvas) {
      if (this.salesChart) this.salesChart.destroy();

      const ctx = salesCanvas.getContext("2d");
      this.salesChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "Gross Sales (₹)",
            data: [4200, 6800, 9400, 11200, 15400, 24800, 19600],
            borderColor: "#d4af37",
            backgroundColor: "rgba(204, 255, 0, 0.08)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#d4af37",
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: { color: "#94a3b8", font: { family: "Plus Jakarta Sans" } }
            },
            y: {
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: { 
                color: "#94a3b8", 
                font: { family: "Space Grotesk" },
                callback: (val) => "₹" + val
              }
            }
          }
        }
      });
    }

    // 2. Category Share Donut Chart
    const catCanvas = document.getElementById("category-share-chart");
    if (catCanvas) {
      if (this.categoryChart) this.categoryChart.destroy();

      const summary = window.store.getAnalyticsSummary();
      const labels = Object.keys(summary.categoryCounts).map(k => k.toUpperCase());
      const counts = Object.values(summary.categoryCounts);

      const ctx = catCanvas.getContext("2d");
      this.categoryChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: ["#d4af37", "#ff4d00", "#3b82f6", "#a855f7", "#ec4899", "#10b981"],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#94a3b8", boxWidth: 12, font: { family: "Plus Jakarta Sans", size: 11 } }
            }
          },
          cutout: "72%"
        }
      });
    }
  }

  // --- PRODUCT MANAGEMENT (CRUD) ---
  renderProductsTable(filterQuery = "") {
    const tableBody = document.getElementById("dash-products-tbody");
    if (!tableBody) return;

    let products = window.store.getProducts();
    if (filterQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(filterQuery) || 
        p.category.toLowerCase().includes(filterQuery)
      );
    }

    tableBody.innerHTML = products.map(product => {
      const stock = product.stockCount || 0;
      let stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">${stock} In Stock</span>`;
      if (stock <= 5) {
        stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse">Low: ${stock}</span>`;
      } else if (stock <= 10) {
        stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">${stock} units</span>`;
      }

      return `
        <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
          <td class="py-3 px-4 flex items-center gap-3">
            <img src="${product.image}" class="w-10 h-12 rounded-lg object-cover bg-zinc-950 flex-shrink-0" />
            <div>
              <p class="font-bold text-sm text-white line-clamp-1">${product.name}</p>
              <p class="text-[11px] text-zinc-500 font-mono uppercase">${product.id} • ${product.category}</p>
            </div>
          </td>
          <td class="py-3 px-4 font-mono font-bold text-white">₹${product.price}</td>
          <td class="py-3 px-4">${stockBadge}</td>
          <td class="py-3 px-4 text-xs text-zinc-400">
            <span class="text-amber-400">★ ${product.rating || '4.8'}</span> (${product.reviewCount || 0})
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="adminDashboard.quickRestock('${product.id}')" title="Restock +25" class="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-[#d4af37] hover:bg-zinc-700 text-xs">
                <i class="fa-solid fa-boxes-stacked"></i> +25
              </button>
              <button onclick="adminDashboard.openEditProductModal('${product.id}')" title="Edit" class="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="adminDashboard.deleteProductConfirm('${product.id}')" title="Delete" class="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-red-400 hover:bg-zinc-700 text-xs">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openAddProductModal() {
    this.editingProductId = null;
    const modal = document.getElementById("product-form-modal");
    const form = document.getElementById("add-product-form");
    if (form) form.reset();
    document.getElementById("modal-form-heading").textContent = "Add New Streetwear Drop";
    document.getElementById("prod-form-img-preview").classList.add("hidden");
    if (modal) modal.classList.add("active");
  }

  openEditProductModal(productId) {
    const product = window.store.getProductById(productId);
    if (!product) return;

    this.editingProductId = productId;
    const modal = document.getElementById("product-form-modal");
    document.getElementById("modal-form-heading").textContent = `Edit Drop: ${product.name}`;

    document.getElementById("prod-form-title").value = product.name;
    document.getElementById("prod-form-category").value = product.category;
    document.getElementById("prod-form-price").value = product.price;
    document.getElementById("prod-form-mrp").value = product.originalPrice || Math.round(product.price * 1.8);
    document.getElementById("prod-form-stock").value = product.stockCount || 10;
    document.getElementById("prod-form-img").value = product.image;
    document.getElementById("prod-form-badge").value = product.badge || "";
    document.getElementById("prod-form-desc").value = product.description || "";

    const preview = document.getElementById("prod-form-img-preview");
    if (preview && product.image) {
      preview.src = product.image;
      preview.classList.remove("hidden");
    }

    if (modal) modal.classList.add("active");
  }

  closeProductFormModal() {
    const modal = document.getElementById("product-form-modal");
    if (modal) modal.classList.remove("active");
  }

  handleProductFormSubmit() {
    const title = document.getElementById("prod-form-title").value.trim();
    const category = document.getElementById("prod-form-category").value;
    const price = parseInt(document.getElementById("prod-form-price").value);
    const mrp = parseInt(document.getElementById("prod-form-mrp").value) || Math.round(price * 1.8);
    const stock = parseInt(document.getElementById("prod-form-stock").value) || 20;
    const image = document.getElementById("prod-form-img").value.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
    const badge = document.getElementById("prod-form-badge").value.trim() || "NEW DROP";
    const desc = document.getElementById("prod-form-desc").value.trim();

    if (!title || !price) {
      alert("Please provide a valid product title and price!");
      return;
    }

    const discountPercent = Math.round(((mrp - price) / mrp) * 100);

    const productPayload = {
      name: title,
      category: category,
      price: price,
      originalPrice: mrp,
      discount: `${discountPercent}% OFF`,
      stockCount: stock,
      image: image,
      badge: badge,
      description: desc,
      fit: "Oversized Street Fit",
      fabric: "100% Heavy Combed Cotton",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Stealth Black", hex: "#111111" },
        { name: "Cream White", hex: "#f5f5f5" }
      ]
    };

    if (this.editingProductId) {
      window.store.updateProduct(this.editingProductId, productPayload);
      window.app.showToast(`Updated "${title}" successfully!`, "success");
    } else {
      window.store.addProduct(productPayload);
      window.app.showToast(`🚀 New drop "${title}" added to store!`, "success");
    }

    this.closeProductFormModal();
    this.refresh();
  }

  quickRestock(productId) {
    window.store.restockProduct(productId, 25);
    window.app.showToast(`Restocked +25 units for item!`, "success");
  }

  deleteProductConfirm(productId) {
    const p = window.store.getProductById(productId);
    if (!p) return;
    if (confirm(`Are you sure you want to delete "${p.name}" from your store catalog?`)) {
      window.store.deleteProduct(productId);
      window.app.showToast(`Deleted ${p.name}`, "info");
    }
  }

  // --- ORDERS FULFILLMENT MANAGEMENT ---
  renderOrdersTable() {
    const tableBody = document.getElementById("dash-orders-tbody");
    if (!tableBody) return;

    const orders = window.store.getOrders();

    tableBody.innerHTML = orders.map(order => {
      let statusClass = "bg-blue-950 text-blue-400 border-blue-800";
      if (order.status === "Delivered") statusClass = "bg-emerald-950 text-emerald-400 border-emerald-800";
      if (order.status === "Processing") statusClass = "bg-amber-950 text-amber-400 border-amber-800";

      return `
        <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-white text-xs">${order.id}</td>
          <td class="py-3 px-4">
            <p class="font-bold text-xs text-white">${order.customer?.name || 'Customer'}</p>
            <p class="text-[11px] text-zinc-500 font-mono">${order.customer?.phone || ''}</p>
          </td>
          <td class="py-3 px-4 text-xs text-zinc-300">
            ${(order.items || []).map(i => `${i.qty}x ${i.name} (${i.size})`).join('<br/>')}
          </td>
          <td class="py-3 px-4 font-mono font-bold text-[#d4af37] text-xs">₹${order.total}</td>
          <td class="py-3 px-4 text-xs text-zinc-400">${order.paymentMethod || 'Online'}</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClass}">
              ${order.status}
            </span>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              ${order.status !== "Shipped" && order.status !== "Delivered" ? `
                <button onclick="adminDashboard.changeOrderStatus('${order.id}', 'Shipped')" class="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/30 transition-colors">
                  Ship
                </button>
              ` : ''}
              ${order.status !== "Delivered" ? `
                <button onclick="adminDashboard.changeOrderStatus('${order.id}', 'Delivered')" class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/30 transition-colors">
                  Deliver
                </button>
              ` : ''}
              <button onclick="app.openOrderTracker('${order.id}')" title="Track Order" class="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs">
                <i class="fa-solid fa-map-location-dot"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  changeOrderStatus(orderId, newStatus) {
    window.store.updateOrderStatus(orderId, newStatus);
    window.app.showToast(`Order ${orderId} status updated to: ${newStatus}`, "success");
    this.refresh();
  }

  // --- LOW STOCK ALERTS ---
  renderLowStockAlerts() {
    const container = document.getElementById("dash-low-stock-container");
    if (!container) return;

    const products = window.store.getProducts();
    const lowStock = products.filter(p => (p.stockCount || 0) <= 6);

    if (lowStock.length === 0) {
      container.innerHTML = `
        <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
          <i class="fa-solid fa-circle-check text-emerald-400 text-lg mb-1 block"></i>
          All products healthy. No low-stock inventory alerts!
        </div>
      `;
      return;
    }

    container.innerHTML = lowStock.map(p => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-red-950/20 border border-red-900/40">
        <div class="flex items-center gap-3">
          <img src="${p.image}" class="w-10 h-12 object-cover rounded bg-black flex-shrink-0" />
          <div>
            <h5 class="text-xs font-bold text-white line-clamp-1">${p.name}</h5>
            <p class="text-[11px] text-red-400 font-mono font-bold">Only ${p.stockCount} remaining</p>
          </div>
        </div>
        <button onclick="adminDashboard.quickRestock('${p.id}')" class="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-white text-black font-extrabold text-xs transition-colors">
          + Restock 25
        </button>
      </div>
    `).join('');
  }
}

// Global Dashboard Instance
document.addEventListener("DOMContentLoaded", () => {
  window.adminDashboard = new AdminDashboard();
});

