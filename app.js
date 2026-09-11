/**
 * Logika Aplikasi POS Salapan Coffee & Eatery
 */

// Application State
const state = {
  activeCategory: 'all',
  searchQuery: '',
  priceTier: 'offline', // 'offline' | 'tax' | 'online'
  orderType: 'Dine In', // 'Dine In' | 'Take Away' | 'Online'
  cart: [], // [{ id, item, qty, note }]
  discountPercent: 0,
  paymentMethod: 'cash',
  cashReceived: 0,
  currentReceipt: null,
  transactions: JSON.parse(localStorage.getItem('salapan_pos_transactions') || '[]')
};

// Subtle Web Audio Sound Effects (Zero External Assets Required)
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playBeep(freq = 600, duration = 0.05, type = 'sine') {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) {}
  }
};

// Initialize App on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  renderCategoryPills();
  renderProductGrid();
  renderCart();

  // Keyboard shortcut: F4 or Space on idle to checkout
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F4' && state.cart.length > 0) {
      e.preventDefault();
      openCheckoutModal();
    }
  });

  // Re-render Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Live Clock & Date
function initClock() {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');

  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }
  update();
  setInterval(update, 1000);
}

// 1. Render Category Pills
function renderCategoryPills() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => {
    const isActive = state.activeCategory === cat.id;
    const activeClass = isActive
      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800';

    // Count items
    const count = cat.id === 'all'
      ? MENU_ITEMS.length
      : MENU_ITEMS.filter(m => m.category === cat.id).length;

    return `
      <button onclick="setCategory('${cat.id}')"
        class="cat-pill whitespace-nowrap px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 text-xs ${activeClass}">
        <span>${cat.name}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'} font-bold">${count}</span>
      </button>
    `;
  }).join('');
}

// Set Active Category
function setCategory(catId) {
  AudioFX.playBeep(450, 0.04);
  state.activeCategory = catId;
  renderCategoryPills();
  renderProductGrid();
}

// Set Price Tier (Offline / Tax / Online)
function setPriceTier(tier) {
  AudioFX.playBeep(520, 0.05);
  state.priceTier = tier;

  // Update Tier Buttons UI
  ['offline', 'tax', 'online'].forEach(t => {
    const btn = document.getElementById(`tier-${t}`);
    if (!btn) return;
    if (t === tier) {
      btn.className = "tier-btn px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-amber-500 text-slate-950 shadow-sm";
    } else {
      btn.className = "tier-btn px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-all";
    }
  });

  // Update Cart label
  const badgeSummary = document.getElementById('tier-badge-summary');
  if (badgeSummary) {
    if (tier === 'offline') badgeSummary.textContent = "Harga Offline (Dine-in)";
    else if (tier === 'tax') badgeSummary.textContent = "Harga Offline + 10% Tax";
    else badgeSummary.textContent = "Harga Online Delivery";
  }

  // Update Mobile Tier Select
  const mobileSelect = document.getElementById('mobile-tier-select');
  if (mobileSelect) mobileSelect.value = tier;

  renderProductGrid();
  renderCart();
}

// Toggle Mobile Cart Drawer
function toggleMobileCart(show) {
  AudioFX.playBeep(480, 0.03);
  const aside = document.getElementById('cart-aside');
  if (!aside) return;
  if (show) {
    aside.classList.remove('hidden');
    aside.classList.add('flex');
  } else {
    aside.classList.add('hidden');
    aside.classList.remove('flex');
  }
}

// Search Filter
function handleSearch(val) {
  state.searchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) {
    clearBtn.classList.toggle('hidden', state.searchQuery === '');
  }
  renderProductGrid();
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  handleSearch('');
}

// 2. Render Product Grid
function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  const countBadge = document.getElementById('filtered-count');
  if (!grid) return;

  // Filter items
  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = state.activeCategory === 'all' || item.category === state.activeCategory;
    const matchSearch = !state.searchQuery ||
      item.name.toLowerCase().includes(state.searchQuery) ||
      item.displayName.toLowerCase().includes(state.searchQuery) ||
      item.category.toLowerCase().includes(state.searchQuery);
    return matchCat && matchSearch;
  });

  if (countBadge) countBadge.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(item => {
    const currentPrice = getPriceByTier(item, state.priceTier);
    const inCart = state.cart.find(c => c.id === item.id);
    const qty = inCart ? inCart.qty : 0;

    return `
      <div onclick="addToCart(${item.id})"
        class="menu-card relative bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-amber-500/5 transition">
        
        <!-- Cart Badge indicator if item exists in cart -->
        ${qty > 0 ? `
          <div class="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[11px] w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-slate-950">
            ${qty}
          </div>
        ` : ''}

        <!-- Card Top -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
              ${item.category}
            </span>
          </div>

          <h3 class="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-400 transition leading-snug line-clamp-2">
            ${item.displayName}
          </h3>

          <p class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            ${item.desc || ''}
          </p>
        </div>

        <!-- Card Bottom / Price -->
        <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <div class="font-mono font-bold text-xs sm:text-sm text-amber-400">
            ${formatRupiah(currentPrice)}
          </div>
          <button type="button" class="w-7 h-7 rounded-xl bg-slate-800 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 3. Cart Operations
function addToCart(itemId) {
  AudioFX.playBeep(700, 0.04);
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  const existing = state.cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: item.id,
      item: item,
      qty: 1,
      note: ''
    });
  }

  renderCart();
  renderProductGrid();
}

function updateCartQty(itemId, delta) {
  AudioFX.playBeep(550, 0.03);
  const existing = state.cart.find(c => c.id === itemId);
  if (!existing) return;

  existing.qty += delta;
  if (existing.qty <= 0) {
    state.cart = state.cart.filter(c => c.id !== itemId);
  }

  renderCart();
  renderProductGrid();
}

function removeCartItem(itemId) {
  AudioFX.playBeep(350, 0.06);
  state.cart = state.cart.filter(c => c.id !== itemId);
  renderCart();
  renderProductGrid();
}

function addCartNote(itemId) {
  const item = state.cart.find(c => c.id === itemId);
  if (!item) return;

  const current = item.note || '';
  const note = prompt(`Catatan untuk ${item.item.displayName} (mis: Less Ice, Gula Pisah, Level 3):`, current);
  if (note !== null) {
    item.note = note.trim();
    renderCart();
  }
}

function clearCart() {
  if (state.cart.length === 0) return;
  if (confirm("Reset seluruh daftar pesanan di keranjang?")) {
    AudioFX.playBeep(300, 0.08);
    state.cart = [];
    state.discountPercent = 0;
    renderCart();
    renderProductGrid();
  }
}

function setOrderType(type) {
  AudioFX.playBeep(500, 0.03);
  state.orderType = type;

  ['Dine In', 'Take Away', 'Online'].forEach(t => {
    const btn = document.getElementById(`type-${t.toLowerCase().replace(' ', '')}`);
    if (!btn) return;
    if (t === type) {
      btn.className = "order-type-btn py-1 text-[11px] font-semibold rounded bg-amber-500 text-slate-950 transition";
    } else {
      btn.className = "order-type-btn py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition";
    }
  });
}

function promptDiscount() {
  const current = state.discountPercent;
  const input = prompt("Masukkan persentase diskon (0 - 100%):", current);
  if (input !== null) {
    const val = parseFloat(input);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      state.discountPercent = val;
      renderCart();
    } else {
      alert("Masukkan nilai diskon yang valid antara 0 dan 100.");
    }
  }
}

// 4. Render Cart
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('cart-empty-view');
  const itemCountEl = document.getElementById('cart-item-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRowEl = document.getElementById('cart-discount');
  const discountLabelEl = document.getElementById('discount-label');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (!container) return;

  const totalItemsCount = state.cart.reduce((sum, c) => sum + c.qty, 0);
  if (itemCountEl) itemCountEl.textContent = `${totalItemsCount} item`;

  if (state.cart.length === 0) {
    container.innerHTML = '';
    if (emptyView) emptyView.classList.remove('hidden');
    if (subtotalEl) subtotalEl.textContent = "Rp 0";
    if (discountRowEl) discountRowEl.textContent = "- Rp 0";
    if (totalEl) totalEl.textContent = "Rp 0";
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i><span>BAYAR SEKARANG</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (emptyView) emptyView.classList.add('hidden');

  let subtotal = 0;

  container.innerHTML = state.cart.map(c => {
    const unitPrice = getPriceByTier(c.item, state.priceTier);
    const itemTotal = unitPrice * c.qty;
    subtotal += itemTotal;

    return `
      <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
        <!-- Name & delete -->
        <div class="flex items-start justify-between gap-1.5">
          <div>
            <div class="font-bold text-xs text-slate-100">${c.item.displayName}</div>
            <div class="font-mono text-[11px] text-slate-400">${formatRupiah(unitPrice)} / item</div>
          </div>
          <button onclick="removeCartItem(${c.id})" class="text-slate-500 hover:text-rose-400 p-1 transition" title="Hapus">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Note tag if exists -->
        ${c.note ? `
          <div class="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center justify-between">
            <span>📝 ${c.note}</span>
            <button onclick="addCartNote(${c.id})" class="text-amber-400 hover:text-amber-200 ml-1 text-[9px] underline">edit</button>
          </div>
        ` : `
          <button onclick="addCartNote(${c.id})" class="text-left text-[10px] text-slate-500 hover:text-amber-400 transition flex items-center gap-1">
            <i data-lucide="file-edit" class="w-3 h-3"></i> + Catatan
          </button>
        `}

        <!-- Quantity Controls & Subtotal -->
        <div class="flex items-center justify-between pt-1 border-t border-slate-900">
          <div class="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button onclick="updateCartQty(${c.id}, -1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition">
              -
            </button>
            <span class="w-7 text-center font-mono font-bold text-xs text-slate-100">${c.qty}</span>
            <button onclick="updateCartQty(${c.id}, 1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition">
              +
            </button>
          </div>
          <span class="font-mono font-bold text-xs text-amber-400">
            ${formatRupiah(itemTotal)}
          </span>
        </div>
      </div>
    `;
  }).join('');

  const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Update Mobile Floating Cart Bar
  const mobileBar = document.getElementById('mobile-cart-bar');
  const mobileBarQty = document.getElementById('mobile-bar-qty');
  const mobileBarTotal = document.getElementById('mobile-bar-total');
  if (mobileBar) {
    if (state.cart.length > 0) {
      mobileBar.classList.remove('hidden');
      if (mobileBarQty) mobileBarQty.textContent = totalItemsCount;
      if (mobileBarTotal) mobileBarTotal.textContent = formatRupiah(finalTotal);
    } else {
      mobileBar.classList.add('hidden');
    }
  }

  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (discountLabelEl) discountLabelEl.textContent = `(${state.discountPercent}%)`;
  if (discountRowEl) discountRowEl.textContent = `- ${formatRupiah(discountAmount)}`;
  if (totalEl) totalEl.textContent = formatRupiah(finalTotal);

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = `
      <i data-lucide="check-circle-2" class="w-4 h-4"></i>
      <span>BAYAR ${formatRupiah(finalTotal)}</span>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

// 5. Checkout Modal Flow
function openCheckoutModal() {
  if (state.cart.length === 0) return;
  AudioFX.playBeep(650, 0.05);

  const modal = document.getElementById('checkout-modal');
  const summaryText = document.getElementById('modal-order-summary');
  const totalAmountEl = document.getElementById('modal-total-amount');

  const custName = document.getElementById('cust-name').value.trim() || 'Umum';
  const tableNo = document.getElementById('table-no').value.trim() || '-';

  if (summaryText) {
    summaryText.textContent = `${state.orderType} • Meja: ${tableNo} • Pelanggan: ${custName}`;
  }

  const subtotal = state.cart.reduce((sum, c) => sum + (getPriceByTier(c.item, state.priceTier) * c.qty), 0);
  const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (totalAmountEl) {
    totalAmountEl.textContent = formatRupiah(finalTotal);
  }

  // Reset Cash inputs
  setPaymentMethod('cash');
  setCashAmount('exact');

  if (modal) modal.classList.remove('hidden');
  if (modal) modal.classList.add('flex');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setPaymentMethod(method) {
  AudioFX.playBeep(500, 0.03);
  state.paymentMethod = method;

  ['cash', 'qris', 'transfer', 'debit'].forEach(m => {
    const btn = document.getElementById(`pay-method-${m}`);
    if (!btn) return;
    if (m === method) {
      btn.className = "pay-method-btn p-2 rounded-xl border border-amber-500 bg-amber-500/20 text-amber-400 flex flex-col items-center gap-1 text-xs font-semibold transition";
    } else {
      btn.className = "pay-method-btn p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 flex flex-col items-center gap-1 text-xs font-semibold transition hover:text-slate-200";
    }
  });

  const cashSection = document.getElementById('cash-payment-section');
  const nonCashSection = document.getElementById('non-cash-section');
  const nonCashTitle = document.getElementById('non-cash-title');

  if (method === 'cash') {
    if (cashSection) cashSection.classList.remove('hidden');
    if (nonCashSection) nonCashSection.classList.add('hidden');
    calculateChange();
  } else {
    if (cashSection) cashSection.classList.add('hidden');
    if (nonCashSection) nonCashSection.classList.remove('hidden');

    if (method === 'qris' && nonCashTitle) nonCashTitle.textContent = "Scan QRIS Salapan Coffee";
    if (method === 'transfer' && nonCashTitle) nonCashTitle.textContent = "Transfer Bank Salapan (BCA / Mandiri)";
    if (method === 'debit' && nonCashTitle) nonCashTitle.textContent = "Mesin EDC Kartu Debit / Kredit";
  }
}

function setCashAmount(amount) {
  const input = document.getElementById('cash-received-input');
  if (!input) return;

  const subtotal = state.cart.reduce((sum, c) => sum + (getPriceByTier(c.item, state.priceTier) * c.qty), 0);
  const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (amount === 'exact') {
    input.value = finalTotal;
  } else {
    input.value = amount;
  }
  calculateChange();
}

function calculateChange() {
  const input = document.getElementById('cash-received-input');
  const changeEl = document.getElementById('cash-change-display');
  const changeCard = document.getElementById('change-card');
  const processBtn = document.getElementById('btn-process-payment');

  if (!input || !changeEl) return;

  const subtotal = state.cart.reduce((sum, c) => sum + (getPriceByTier(c.item, state.priceTier) * c.qty), 0);
  const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const received = parseFloat(input.value) || 0;
  state.cashReceived = received;

  if (state.paymentMethod === 'cash') {
    const change = received - finalTotal;
    if (change < 0) {
      changeEl.textContent = `Kurang ${formatRupiah(Math.abs(change))}`;
      changeEl.className = "font-mono text-base font-bold text-rose-400";
      if (processBtn) processBtn.disabled = true;
    } else {
      changeEl.textContent = formatRupiah(change);
      changeEl.className = "font-mono text-lg font-bold text-emerald-400";
      if (processBtn) processBtn.disabled = false;
    }
  } else {
    if (processBtn) processBtn.disabled = false;
  }
}

// 6. Process Payment & Save Transaction
function processPayment() {
  if (state.cart.length === 0) return;

  const subtotal = state.cart.reduce((sum, c) => sum + (getPriceByTier(c.item, state.priceTier) * c.qty), 0);
  const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const custName = document.getElementById('cust-name').value.trim() || 'Pelanggan Umum';
  const tableNo = document.getElementById('table-no').value.trim() || '-';

  let paidAmount = finalTotal;
  let changeAmount = 0;

  if (state.paymentMethod === 'cash') {
    paidAmount = state.cashReceived;
    if (paidAmount < finalTotal) {
      alert("Jumlah uang tunai yang diterima kurang dari total tagihan.");
      return;
    }
    changeAmount = paidAmount - finalTotal;
  }

  // Create Transaction Record
  const now = new Date();
  const invoiceNo = "INV-" + now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + "-" +
    String(Math.floor(1000 + Math.random() * 9000));

  const transaction = {
    invoice: invoiceNo,
    timestamp: now.toISOString(),
    formattedTime: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    formattedDate: now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    cashier: 'Kasir Salapan',
    orderType: state.orderType,
    customer: custName,
    table: tableNo,
    priceTier: state.priceTier,
    items: state.cart.map(c => ({
      id: c.id,
      name: c.item.displayName,
      price: getPriceByTier(c.item, state.priceTier),
      qty: c.qty,
      total: getPriceByTier(c.item, state.priceTier) * c.qty,
      note: c.note || ''
    })),
    subtotal: subtotal,
    discountPercent: state.discountPercent,
    discountAmount: discountAmount,
    total: finalTotal,
    paymentMethod: state.paymentMethod.toUpperCase(),
    paidAmount: paidAmount,
    changeAmount: changeAmount
  };

  // Save to State & LocalStorage
  state.transactions.unshift(transaction);
  try {
    localStorage.setItem('salapan_pos_transactions', JSON.stringify(state.transactions));
  } catch (e) {
    console.error("Gagal simpan ke localStorage", e);
  }

  // Sound Success
  AudioFX.playSuccess();

  // Close Checkout Modal
  closeCheckoutModal();

  // Clear Form
  document.getElementById('cust-name').value = '';
  document.getElementById('table-no').value = '';
  state.cart = [];
  state.discountPercent = 0;
  renderCart();
  renderProductGrid();

  // Show Receipt Modal
  showReceipt(transaction);
}

// 7. Show Thermal Receipt Preview
function showReceipt(trx) {
  state.currentReceipt = trx;

  document.getElementById('rec-inv').textContent = trx.invoice;
  document.getElementById('rec-time').textContent = `${trx.formattedDate} ${trx.formattedTime}`;
  document.getElementById('rec-cashier').textContent = trx.cashier;
  document.getElementById('rec-type').textContent = trx.orderType;
  document.getElementById('rec-cust').textContent = trx.customer;
  document.getElementById('rec-table').textContent = trx.table;

  const itemsContainer = document.getElementById('rec-items-list');
  if (itemsContainer) {
    itemsContainer.innerHTML = trx.items.map(item => `
      <div>
        <div class="flex justify-between font-semibold">
          <span>${item.name}</span>
          <span>${formatRupiah(item.total)}</span>
        </div>
        <div class="flex justify-between text-[9px] text-gray-500">
          <span>${item.qty} x ${formatRupiah(item.price)}</span>
          ${item.note ? `<span>(${item.note})</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  document.getElementById('rec-subtotal').textContent = formatRupiah(trx.subtotal);

  const discountRow = document.getElementById('rec-discount-row');
  if (trx.discountAmount > 0) {
    if (discountRow) discountRow.style.display = 'flex';
    document.getElementById('rec-discount').textContent = `- ${formatRupiah(trx.discountAmount)} (${trx.discountPercent}%)`;
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }

  document.getElementById('rec-total').textContent = formatRupiah(trx.total);
  document.getElementById('rec-paymethod').textContent = trx.paymentMethod;
  document.getElementById('rec-paid').textContent = formatRupiah(trx.paidAmount);
  document.getElementById('rec-change').textContent = formatRupiah(trx.changeAmount);

  // Prepare Print Area for Thermal Printer
  const printArea = document.getElementById('receipt-print-area');
  const receiptView = document.getElementById('thermal-receipt-view');
  if (printArea && receiptView) {
    printArea.innerHTML = receiptView.outerHTML;
  }

  const modal = document.getElementById('receipt-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeReceiptModal() {
  const modal = document.getElementById('receipt-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function printReceipt() {
  const printArea = document.getElementById('receipt-print-area');
  const receiptView = document.getElementById('thermal-receipt-view');
  if (printArea && receiptView) {
    printArea.innerHTML = receiptView.outerHTML;
  }
  window.print();
}

// 8. History Modal
function openHistoryModal() {
  AudioFX.playBeep(500, 0.04);
  const modal = document.getElementById('history-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  renderHistoryTable();
}

function closeHistoryModal() {
  const modal = document.getElementById('history-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderHistoryTable(query = '') {
  const tbody = document.getElementById('history-table-body');
  const emptyEl = document.getElementById('history-empty');
  if (!tbody) return;

  const filterQuery = query.toLowerCase();
  const list = state.transactions.filter(t =>
    t.invoice.toLowerCase().includes(filterQuery) ||
    t.customer.toLowerCase().includes(filterQuery) ||
    t.items.some(i => i.name.toLowerCase().includes(filterQuery))
  );

  if (list.length === 0) {
    tbody.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  tbody.innerHTML = list.map(t => {
    const totalQty = t.items.reduce((s, i) => s + i.qty, 0);
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-2 px-3 font-semibold text-amber-400">${t.invoice}</td>
        <td class="py-2 px-3 text-slate-400 text-[11px]">${t.formattedDate} ${t.formattedTime}</td>
        <td class="py-2 px-3 text-slate-200">${t.customer} (${t.orderType})</td>
        <td class="py-2 px-3 text-slate-300 text-[11px]">${totalQty} item</td>
        <td class="py-2 px-3 font-bold text-slate-100">${formatRupiah(t.total)}</td>
        <td class="py-2 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${t.paymentMethod === 'CASH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}">
            ${t.paymentMethod}
          </span>
        </td>
        <td class="py-2 px-3 text-right space-x-1">
          <button onclick="reprintInvoice('${t.invoice}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition" title="Cetak Ulang">
            Cetak
          </button>
          <button onclick="voidInvoice('${t.invoice}')" class="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[11px] transition" title="Batalkan Transaksi">
            Void
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function reprintInvoice(invoiceNo) {
  const trx = state.transactions.find(t => t.invoice === invoiceNo);
  if (trx) {
    showReceipt(trx);
  }
}

function voidInvoice(invoiceNo) {
  if (confirm(`Batalkan transaksi ${invoiceNo}? Data akan dihapus dari riwayat.`)) {
    AudioFX.playBeep(300, 0.08);
    state.transactions = state.transactions.filter(t => t.invoice !== invoiceNo);
    localStorage.setItem('salapan_pos_transactions', JSON.stringify(state.transactions));
    renderHistoryTable();
  }
}

function clearAllHistory() {
  if (state.transactions.length === 0) return;
  if (confirm("PERINGATAN: Anda yakin ingin menghapus SELURUH riwayat transaksi penjualan?")) {
    state.transactions = [];
    localStorage.removeItem('salapan_pos_transactions');
    renderHistoryTable();
  }
}

// 9. Report / Omset Modal
function openReportModal() {
  AudioFX.playBeep(520, 0.04);
  const modal = document.getElementById('report-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  // Calculate Metrics
  const totalRevenue = state.transactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = state.transactions.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  document.getElementById('rep-total-revenue').textContent = formatRupiah(totalRevenue);
  document.getElementById('rep-total-orders').textContent = totalOrders;
  document.getElementById('rep-avg-order').textContent = formatRupiah(avgOrder);

  // Calculate Top Selling Items
  const itemMap = {};
  state.transactions.forEach(t => {
    t.items.forEach(i => {
      if (!itemMap[i.name]) {
        itemMap[i.name] = { name: i.name, qty: 0, revenue: 0 };
      }
      itemMap[i.name].qty += i.qty;
      itemMap[i.name].revenue += i.total;
    });
  });

  const sortedItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const topContainer = document.getElementById('rep-top-items');
  if (topContainer) {
    if (sortedItems.length === 0) {
      topContainer.innerHTML = `<p class="text-slate-500 text-xs py-2">Belum ada transaksi.</p>`;
    } else {
      topContainer.innerHTML = sortedItems.map((item, idx) => `
        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
            <span class="font-medium text-slate-200">${item.name}</span>
          </div>
          <div class="text-right font-mono">
            <span class="font-bold text-slate-100">${item.qty} terjual</span>
            <span class="text-slate-400 text-[11px] block">${formatRupiah(item.revenue)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Calculate Payment Methods Breakdown
  const methodMap = { CASH: 0, QRIS: 0, TRANSFER: 0, DEBIT: 0 };
  state.transactions.forEach(t => {
    const m = t.paymentMethod || 'CASH';
    methodMap[m] = (methodMap[m] || 0) + t.total;
  });

  const payContainer = document.getElementById('rep-payment-methods');
  if (payContainer) {
    payContainer.innerHTML = Object.entries(methodMap).map(([m, total]) => `
      <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
        <span class="text-[11px] text-slate-400">${m}</span>
        <div class="font-mono font-bold text-sm text-slate-100 mt-0.5">${formatRupiah(total)}</div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function closeReportModal() {
  const modal = document.getElementById('report-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// 10. Export to CSV
function exportHistoryCSV() {
  if (state.transactions.length === 0) {
    alert("Belum ada data transaksi untuk diekspor.");
    return;
  }

  const headers = ["Invoice", "Tanggal", "Jam", "Kasir", "Tipe Pesanan", "Pelanggan", "Meja", "Metode Bayar", "Item Detail", "Subtotal", "Diskon", "Total", "Bayar", "Kembalian"];
  const rows = state.transactions.map(t => {
    const itemDetail = t.items.map(i => `${i.name} (${i.qty}x)`).join("; ");
    return [
      `"${t.invoice}"`,
      `"${t.formattedDate}"`,
      `"${t.formattedTime}"`,
      `"${t.cashier}"`,
      `"${t.orderType}"`,
      `"${t.customer}"`,
      `"${t.table}"`,
      `"${t.paymentMethod}"`,
      `"${itemDetail}"`,
      t.subtotal,
      t.discountAmount,
      t.total,
      t.paidAmount,
      t.changeAmount
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `laporan_penjualan_salapan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
