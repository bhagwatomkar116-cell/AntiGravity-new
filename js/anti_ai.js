/**
 * ANTI.AI // VÉLOIR NEURAL COPILOT
 * Autonomous AI Fashion Stylist Agent for Maison Véloir
 */

class AntiAIEngine {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        sender: "agent",
        text: "✦ Systems online. I am **Anti.AI**, Maison Véloir's Neural Fashion Intelligence. What aesthetic, occasion, or budget shall we synthesize today?",
        time: "Just now"
      }
    ];

    this.init();
  }

  init() {
    this.setupListeners();
    this.renderChatMessages();
  }

  setupListeners() {
    // Floating agent trigger button
    const trigger = document.getElementById("anti-ai-trigger");
    if (trigger) {
      trigger.addEventListener("click", () => this.toggleHUD());
    }

    // Close HUD button
    const closeBtn = document.getElementById("anti-ai-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.toggleHUD(false));
    }

    // Input form
    const form = document.getElementById("anti-ai-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("anti-ai-input");
        if (input && input.value.trim()) {
          this.handleUserPrompt(input.value.trim());
          input.value = "";
        }
      });
    }

    // Hero prompt bar
    const heroPromptInput = document.getElementById("hero-ai-prompt");
    const heroPromptBtn = document.getElementById("hero-ai-prompt-btn");
    if (heroPromptBtn && heroPromptInput) {
      heroPromptBtn.addEventListener("click", () => {
        const query = heroPromptInput.value.trim();
        if (query) {
          this.toggleHUD(true);
          this.handleUserPrompt(query);
          heroPromptInput.value = "";
        }
      });

      heroPromptInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          heroPromptBtn.click();
        }
      });
    }
  }

  toggleHUD(forceState = null) {
    const modal = document.getElementById("anti-ai-modal");
    if (!modal) return;

    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    if (this.isOpen) {
      modal.classList.add("active");
      const input = document.getElementById("anti-ai-input");
      if (input) setTimeout(() => input.focus(), 200);
    } else {
      modal.classList.remove("active");
    }
  }

  quickPrompt(promptText) {
    this.toggleHUD(true);
    this.handleUserPrompt(promptText);
  }

  handleUserPrompt(userText) {
    // 1. Add User Message
    this.messages.push({
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.renderChatMessages();

    // 2. Show typing indicator
    this.showThinkingIndicator();

    // 3. Synthesize recommendation
    setTimeout(() => {
      this.hideThinkingIndicator();
      const aiResponse = this.synthesizeLook(userText);
      this.messages.push({
        sender: "agent",
        text: aiResponse.text,
        outfit: aiResponse.outfit,
        action: aiResponse.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderChatMessages();

      // Audio/Visual pulse
      if (window.app) {
        window.app.showToast("✦ Anti.AI synthesized a custom wardrobe match!", "info");
      }
    }, 750);
  }

  showThinkingIndicator() {
    const container = document.getElementById("anti-ai-messages");
    if (!container) return;
    const thinking = document.createElement("div");
    thinking.id = "anti-ai-thinking";
    thinking.className = "flex items-center gap-2 p-3 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono max-w-[80%]";
    thinking.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      <span class="tracking-wide">Analyzing neural drape vectors & inventory...</span>
    `;
    container.appendChild(thinking);
    container.scrollTop = container.scrollHeight;
  }

  hideThinkingIndicator() {
    const el = document.getElementById("anti-ai-thinking");
    if (el) el.remove();
  }

  synthesizeLook(prompt) {
    const p = prompt.toLowerCase();
    const products = window.store ? window.store.getProducts() : INITIAL_PRODUCTS;

    let top = null;
    let bottom = null;
    let acc = null;
    let replyText = "";

    if (p.includes("cyber") || p.includes("dark") || p.includes("street") || p.includes("drip")) {
      top = products.find(i => i.id === "prod-01") || products[0]; // Acid Wash
      bottom = products.find(i => i.id === "prod-02") || products[1]; // Cargos
      acc = products.find(i => i.id === "prod-11") || products[products.length - 1]; // Sneakers
      replyText = `Synthesized a **Cyber-Dystopian Street Capsule**. Featuring the 240 GSM acid wash oversized drape paired with reinforced tactical cargo silhouettes. Match index: **99.4%**.`;
    } else if (p.includes("minimal") || p.includes("cafe") || p.includes("brunch") || p.includes("pastel") || p.includes("clean")) {
      top = products.find(i => i.id === "prod-09") || products[2]; // Sage Hoodie
      bottom = products.find(i => i.id === "prod-07") || products[3]; // Waffle Co-ord
      acc = products.find(i => i.id === "prod-12") || products[products.length - 1]; // Bucket Hat
      replyText = `Synthesized an **Aesthetic Coffee Run / Modern Minimalist Capsule**. Soft muted pastels with French terry comfort and subtle luxury tailoring. Match index: **98.2%**.`;
    } else if (p.includes("retro") || p.includes("varsity") || p.includes("college") || p.includes("grunge") || p.includes("denim")) {
      top = products.find(i => i.id === "prod-04") || products[3]; // Varsity Jacket
      bottom = products.find(i => i.id === "prod-06") || products[2]; // 90s Skater Denim
      acc = products.find(i => i.id === "prod-11") || products[products.length - 1]; // Sneakers
      replyText = `Synthesized a **90s Americana Varsity Archive**. Heavy wool bomber with relaxed skate denim drape. Match index: **97.8%**.`;
    } else if (p.includes("cheap") || p.includes("budget") || p.includes("499") || p.includes("799") || p.includes("steal")) {
      top = products.find(i => i.id === "prod-05") || products[0]; // ₹399 Stay Human Tee
      bottom = products.find(i => i.id === "prod-07") || products[1]; // ₹799 Co-ord
      acc = products.find(i => i.id === "prod-12") || products[products.length - 1]; // ₹349 Hat
      replyText = `Synthesized an **Ultra-Value Haute Steal**. Complete multi-piece look under ₹1,500 without compromising organic cotton weight. Match index: **96.5%**.`;
    } else {
      // Default curated AI match
      top = products.find(i => i.id === "prod-03") || products[0]; // Fleece Hoodie
      bottom = products.find(i => i.id === "prod-02") || products[1]; // Utility Cargos
      acc = products.find(i => i.id === "prod-11") || products[products.length - 1]; // Platform Sneakers
      replyText = `Calibrated a custom **Haute All-Day Luxury Fit** tailored to your prompt: "*${prompt}*". Balanced silhouette with signature drop-shoulder proportion.`;
    }

    const rawTotal = (top?.price || 0) + (bottom?.price || 0) + (acc?.price || 0);
    const bundlePrice = Math.round(rawTotal * 0.85);

    return {
      text: replyText,
      outfit: {
        top,
        bottom,
        acc,
        rawTotal,
        bundlePrice
      }
    };
  }

  loadOutfitToCanvas(topId, bottomId, accId) {
    if (window.app) {
      window.app.selectOutfitPiece('top', topId);
      window.app.selectOutfitPiece('bottom', bottomId);
      window.app.selectOutfitPiece('accessory', accId);
      this.toggleHUD(false);
      document.getElementById("outfit-builder").scrollIntoView({ behavior: "smooth" });
      window.app.showToast("✦ Anti.AI Look loaded into the Live Outfit Stage!", "success");
    }
  }

  addAILookToBag(topId, bottomId, accId) {
    if (window.store) {
      const top = window.store.getProductById(topId);
      const btm = window.store.getProductById(bottomId);
      const acc = window.store.getProductById(accId);

      if (top) window.store.addToCart(top, top.sizes?.[0] || "M", top.colors?.[0]?.name || "Black", 1);
      if (btm) window.store.addToCart(btm, btm.sizes?.[0] || "32", btm.colors?.[0]?.name || "Default", 1);
      if (acc) window.store.addToCart(acc, acc.sizes?.[0] || "One Size", acc.colors?.[0]?.name || "Default", 1);

      window.store.applyCoupon("VELOIR10");
      this.toggleHUD(false);
      if (window.app) {
        window.app.openCartDrawer();
        window.app.showToast("✦ Anti.AI Synthesized Look added to Bag with 15% Bundle + 10% Privilege!", "success");
      }
    }
  }

  renderChatMessages() {
    const container = document.getElementById("anti-ai-messages");
    if (!container) return;

    container.innerHTML = this.messages.map(msg => {
      const isAgent = msg.sender === "agent";

      return `
        <div class="flex flex-col ${isAgent ? 'items-start' : 'items-end'} space-y-1">
          <div class="flex items-center gap-2 text-[10px] font-mono text-zinc-500 px-1">
            <span>${isAgent ? '✦ Anti.AI Stylist' : 'You'}</span>
            <span>•</span>
            <span>${msg.time}</span>
          </div>

          <div class="p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
            isAgent 
              ? 'bg-zinc-900 border border-cyan-500/30 text-zinc-200 shadow-lg' 
              : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium shadow-md'
          }">
            <div class="prose prose-invert prose-xs">${msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</div>

            <!-- Optional Synthesized Outfit Card -->
            ${msg.outfit ? `
              <div class="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-cyan-500/40 space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="text-cyan-400 font-bold">SYNTHESIZED BUNDLE</span>
                  <span class="text-white font-bold">₹${msg.outfit.bundlePrice} <span class="text-zinc-500 strikethrough text-[10px]">₹${msg.outfit.rawTotal}</span></span>
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <div class="text-center">
                    <img src="${msg.outfit.top.image}" class="w-full h-14 object-cover rounded-lg bg-black border border-white/10" />
                    <p class="text-[9px] text-zinc-300 truncate mt-1">${msg.outfit.top.name}</p>
                  </div>
                  <div class="text-center">
                    <img src="${msg.outfit.bottom.image}" class="w-full h-14 object-cover rounded-lg bg-black border border-white/10" />
                    <p class="text-[9px] text-zinc-300 truncate mt-1">${msg.outfit.bottom.name}</p>
                  </div>
                  <div class="text-center">
                    <img src="${msg.outfit.acc.image}" class="w-full h-14 object-cover rounded-lg bg-black border border-white/10" />
                    <p class="text-[9px] text-zinc-300 truncate mt-1">${msg.outfit.acc.name}</p>
                  </div>
                </div>

                <div class="flex gap-2 pt-1">
                  <button onclick="antiAI.loadOutfitToCanvas('${msg.outfit.top.id}', '${msg.outfit.bottom.id}', '${msg.outfit.acc.id}')" class="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold transition-colors">
                    Preview in Canvas
                  </button>
                  <button onclick="antiAI.addAILookToBag('${msg.outfit.top.id}', '${msg.outfit.bottom.id}', '${msg.outfit.acc.id}')" class="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-90 text-black font-extrabold text-[10px] transition-all">
                    Add Fit to Bag &rarr;
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  }
}

// Global AntiAI Instance
document.addEventListener("DOMContentLoaded", () => {
  window.antiAI = new AntiAIEngine();
});

