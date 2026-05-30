/* ================================
   Flavour Fusion - script.js
   Admin: admin@hotel.com / admin@123
================================== */

const ADMIN_EMAIL = "admin@hotel.com";
const ADMIN_PASSWORD = "admin@123";
const STORAGE_KEY = "flavour_fusion_store_v1";

/* ---------- Store (State) ---------- */
const store = {
  currentUser: null, // {firstName, email, ...}
  isAdmin: false,

  users: [],
  cart: [], // [{id, name, price, qty, image?, emoji?...}]
  orders: [], // [{id, user, items, total, status, createdAt, ...}]
  orderCounter: 1000,

  couponApplied: false,
  discount: 0,
  activeCategory: "All",

  menuItems: [
    {
      id: 1,
      name: "Butter Chicken",
      price: 320,
      emoji: "🍗",
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      category: "Main Course",
      type: "nonveg",
      rating: 4.8,
      reviews: 234,
      desc: "Creamy tomato-based curry with tender chicken pieces",
      bestseller: true,
    },
    {
      id: 2,
      name: "Paneer Tikka",
      price: 240,
      emoji: "🍛",
      image:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&h=600&fit=crop",
      category: "Starters",
      type: "veg",
      rating: 4.7,
      reviews: 189,
      desc: "Marinated cottage cheese grilled to perfection",
      bestseller: true,
    },
    {
      id: 3,
      name: "Hyderabadi Biryani",
      price: 280,
      emoji: "🍚",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
      category: "Biryani",
      type: "nonveg",
      rating: 4.9,
      reviews: 456,
      desc: "Aromatic basmati rice layered with spiced meat",
      bestseller: true,
    },
    {
      id: 4,
      name: "Veg Biryani",
      price: 220,
      emoji: "🍚",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop",
      category: "Biryani",
      type: "veg",
      rating: 4.5,
      reviews: 167,
      desc: "Fragrant rice with mixed vegetables and spices",
    },
    {
      id: 5,
      name: "Margherita Pizza",
      price: 199,
      emoji: "🍕",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
      category: "Pizza",
      type: "veg",
      rating: 4.6,
      reviews: 312,
      desc: "Classic pizza with fresh mozzarella and basil",
    },
    {
      id: 6,
      name: "Chicken Burger",
      price: 179,
      emoji: "🍔",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      category: "Burgers",
      type: "nonveg",
      rating: 4.4,
      reviews: 198,
      desc: "Juicy grilled chicken patty with special sauce",
    },
    {
      id: 7,
      name: "Hakka Noodles",
      price: 160,
      emoji: "🍜",
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
      category: "Chinese",
      type: "veg",
      rating: 4.3,
      reviews: 145,
      desc: "Stir-fried noodles with crispy vegetables",
    },
    {
      id: 8,
      name: "Gulab Jamun",
      price: 99,
      emoji: "🍨",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
      category: "Desserts",
      type: "veg",
      rating: 4.7,
      reviews: 267,
      desc: "Soft milk dumplings soaked in sweet syrup",
    },
    {
      id: 9,
      name: "Masala Dosa",
      price: 120,
      emoji: "🍛",
      image:
        "https://images.unsplash.com/photo-1668236543090-82eb5eaf1e42?w=800&h=600&fit=crop",
      category: "Starters",
      type: "veg",
      rating: 4.6,
      reviews: 210,
      desc: "Crispy crepe filled with spiced potato filling",
    },
    {
      id: 10,
      name: "Chicken Fried Rice",
      price: 190,
      emoji: "🍳",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
      category: "Chinese",
      type: "nonveg",
      rating: 4.5,
      reviews: 178,
      desc: "Wok-tossed rice with chicken and vegetables",
    },
    {
      id: 11,
      name: "Mango Lassi",
      price: 89,
      emoji: "🍸",
      image:
        "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&h=600&fit=crop",
      category: "Beverages",
      type: "veg",
      rating: 4.8,
      reviews: 301,
      desc: "Refreshing yogurt drink with fresh mango pulp",
    },
    {
      id: 12,
      name: "Dal Makhani",
      price: 210,
      emoji: "🍲",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      category: "Main Course",
      type: "veg",
      rating: 4.7,
      reviews: 198,
      desc: "Slow-cooked black lentils in rich buttery gravy",
    },
  ],

  nextItemId: 13,
};

/* ---------- Coupons ---------- */
const COUPONS = {
  WELCOME50: { type: "flat", discount: 50, minOrder: 200 },
  FUSION20: { type: "percent", discount: 20, minOrder: 300, maxDiscount: 150 },
  FREEDEL: { type: "delivery", discount: 40, minOrder: 0 },
};

/* ---------- Helpers ---------- */
const el = (id) => document.getElementById(id);

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function persist() {
  const data = {
    users: store.users,
    cart: store.cart,
    orders: store.orders,
    orderCounter: store.orderCounter,
    couponApplied: store.couponApplied,
    discount: store.discount,
    activeCategory: store.activeCategory,
    menuItems: store.menuItems,
    nextItemId: store.nextItemId,
    failedTransactions: store.failedTransactions || []
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function hydrate() {
  const data = safeJSONParse(localStorage.getItem(STORAGE_KEY));
  if (!data) return;

  // Keep currentUser/isAdmin session ephemeral (fresh on reload)
  store.users = Array.isArray(data.users) ? data.users : store.users;
  store.cart = Array.isArray(data.cart) ? data.cart : store.cart;
  store.orders = Array.isArray(data.orders) ? data.orders : store.orders;
  store.orderCounter = Number.isFinite(data.orderCounter)
    ? data.orderCounter
    : store.orderCounter;
  store.couponApplied = !!data.couponApplied;
  store.discount = Number.isFinite(data.discount) ? data.discount : 0;
  store.activeCategory = data.activeCategory || "All";
  store.menuItems = Array.isArray(data.menuItems)
    ? data.menuItems
    : store.menuItems;
  store.nextItemId = Number.isFinite(data.nextItemId)
    ? data.nextItemId
    : store.nextItemId;
  store.failedTransactions = Array.isArray(data.failedTransactions) ? data.failedTransactions : [];
}

function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(icon, message) {
  const container = el("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${icon}</span> ${escapeHTML(message)}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatMoney(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ---------- Navigation ---------- */
function navigateTo(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const target = el("page-" + page);
  if (target) target.classList.add("active");

  window.scrollTo(0, 0);
  updateNavbar();

  if (page === "landing") renderPopularDishes();
  if (page === "menu") renderMenu();
  if (page === "admin") renderAdmin();
}

function updateNavbar() {
  const links = el("navLinks");
  if (!links) return;

  const cartCount = store.cart.reduce((sum, i) => sum + i.qty, 0);

  if (store.isAdmin) {
    links.innerHTML = `
      <button class="nav-link" onclick="navigateTo('landing')">🏠 Home</button>
      <button class="nav-link" onclick="navigateTo('admin')">📊 Dashboard</button>
      <button class="nav-link" onclick="navigateTo('menu')">📜 Menu</button>
      <div class="user-menu">
        <div class="user-avatar" onclick="toggleUserMenu()">🔰</div>
        <div class="user-dropdown" id="userDropdown">
          <button class="user-dropdown-item" onclick="navigateTo('admin')">📊 Dashboard</button>
          <button class="user-dropdown-item danger" onclick="handleLogout()">🚪 Logout</button>
        </div>
      </div>
    `;
  } else if (store.currentUser) {
    const initials = (store.currentUser.firstName || "U")
      .charAt(0)
      .toUpperCase();
    links.innerHTML = `
      <button class="nav-link" onclick="navigateTo('landing')">🏠 Home</button>
      <button class="nav-link" onclick="navigateTo('menu')">📜 Menu</button>
      <button class="nav-link" onclick="toggleCart()" style="position:relative;">
        📑 Cart ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ""}
      </button>
      <div class="user-menu">
        <div class="user-avatar" onclick="toggleUserMenu()">👤</div>
        <div class="user-dropdown" id="userDropdown">
          <button class="user-dropdown-item" onclick="showMyOrders()">📦 My Orders</button>
          <button class="user-dropdown-item danger" onclick="handleLogout()">🚪 Logout</button>
        </div>
      </div>
    `;
  } else {
    links.innerHTML = `
      <button class="nav-link" onclick="navigateTo('landing')">🏠 Home</button>
      <button class="nav-link" onclick="navigateTo('menu')">📜 Menu</button>
      <button class="nav-link" onclick="navigateTo('login')">🔑 Login</button>
      <button class="nav-link btn-primary" onclick="navigateTo('register')">✨ Sign Up</button>
    `;
  }
}

function toggleUserMenu() {
  const dd = el("userDropdown");
  if (dd) dd.classList.toggle("open");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu")) {
    const dd = el("userDropdown");
    if (dd) dd.classList.remove("open");
  }
});

/* ---------- Scroll UI (navbar/back-to-top) ---------- */
window.addEventListener("scroll", () => {
  const navbar = el("navbar");
  const backToTop = el("backToTop");

  if (navbar) {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  if (backToTop) {
    if (window.scrollY > 400) backToTop.classList.add("visible");
    else backToTop.classList.remove("visible");
  }
});

/* ---------- Auth ---------- */
function handleRegister() {
  const firstName = (el("regFirstName")?.value || "").trim();
  const lastName = (el("regLastName")?.value || "").trim();
  const email = (el("regEmail")?.value || "").trim().toLowerCase();
  const phone = (el("regPhone")?.value || "").trim();
  const password = el("regPassword")?.value || "";
  const address = (el("regAddress")?.value || "").trim();

  if (!firstName || !email || !password) {
    showToast("❌", "Please fill in all required fields");
    return;
  }
  if (password.length < 6) {
    showToast("❌", "Password must be at least 6 characters");
    return;
  }
  if (store.users.some((u) => (u.email || "").toLowerCase() === email)) {
    showToast("❌", "Email already registered");
    return;
  }

  const user = {
    id: store.users.length
      ? Math.max(...store.users.map((u) => u.id || 0)) + 1
      : 1,
    firstName,
    lastName,
    email,
    phone,
    password,
    address,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  store.currentUser = user;
  store.isAdmin = false;
  persist();

  showToast("🎉", `Welcome, ${firstName}!`);
  navigateTo("menu");
}

function handleLogin() {
  const email = (el("loginEmail")?.value || "").trim().toLowerCase();
  const password = el("loginPassword")?.value || "";

  if (!email || !password) {
    showToast("❌", "Please enter email and password");
    return;
  }

  // prevent user login using admin credentials
  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    showToast("🛡️", "Use the Admin login button for admin access");
    return;
  }

  const user = store.users.find(
    (u) => (u.email || "").toLowerCase() === email && u.password === password,
  );

  if (!user) {
    showToast("❌", "Invalid email or password");
    return;
  }

  store.currentUser = user;
  store.isAdmin = false;
  showToast("👋", `Welcome back, ${user.firstName}!`);
  navigateTo("menu");
}

function handleAdminLogin() {
  const email = (el("loginEmail")?.value || "").trim().toLowerCase();
  const password = (el("loginPassword")?.value || "").trim();

  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    store.isAdmin = true;
    store.currentUser = { firstName: "Admin", email: ADMIN_EMAIL };
    showToast("💎", "Welcome, Admin!");
    navigateTo("admin");
    return;
  }

  showToast(
    "❌",
    `Invalid admin credentials. Use ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`,
  );
}

function handleLogout() {
  store.currentUser = null;
  store.isAdmin = false;
  store.cart = [];
  store.couponApplied = false;
  store.discount = 0;
  persist();

  showToast("👋", "Logged out successfully");
  navigateTo("landing");
}

/* ---------- Landing: Popular Dishes ---------- */
function renderPopularDishes() {
  const scroll = el("popularScroll");
  if (!scroll) return;

  const popular = [...store.menuItems]
    .sort(
      (a, b) =>
        (b.bestseller === true) - (a.bestseller === true) ||
        b.rating - a.rating,
    )
    .slice(0, 10);

  scroll.innerHTML = popular
    .map(
      (item) => `
    <div class="popular-card" onclick="navigateTo('menu')">
      <div class="popular-card-img">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=\\'emoji-fallback\\'>${item.emoji || "📝"}</div>'">`
          : `<div class="emoji-fallback">${item.emoji || "📝"}</div>`
        }
      </div>
      <div class="popular-card-body">
        <h4>${item.name}</h4>
        <div class="meta">
          <span class="price">${formatMoney(item.price)}</span>
          <span class="rating">⭐ ${item.rating}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ---------- Menu ---------- */
function getCategories() {
  const cats = [...new Set(store.menuItems.map((i) => i.category))]
    .filter(Boolean)
    .sort();
  return ["All", ...cats];
}

function renderCategoryButtons() {
  const bar = el("categoriesBar");
  if (!bar) return;

  const categoryEmojis = {
    "All": "🔥",
    "Starters": "🍲",
    "Main Course": "🍛",
    "Biryani": "🍚",
    "Chinese": "🍜",
    "Pizza": "🍕",
    "Burgers": "🍔",
    "Desserts": "🍰",
    "Beverages": "🍹"
  };

  bar.innerHTML = getCategories()
    .map(
      (cat) => `
      <button class="cat-btn ${store.activeCategory === cat ? "active" : ""}"
              onclick="setCategory('${cat.replace(/'/g, "\\'")}')">
        ${categoryEmojis[cat] || "🍽️"} ${cat}
      </button>
    `,
    )
    .join("");
}

function setCategory(cat) {
  store.activeCategory = cat;
  persist();
  filterMenu();
}

function renderMenu() {
  renderCategoryButtons();
  filterMenu();
  renderMyOrders();
}

function filterMenu() {
  const search = (el("searchInput")?.value || "").toLowerCase();
  const sort = el("sortSelect")?.value || "default";
  const typeFilter = el("typeFilter")?.value || "all";

  let items = [...store.menuItems];

  if (store.activeCategory !== "All") {
    items = items.filter((i) => i.category === store.activeCategory);
  }

  if (typeFilter !== "all") {
    items = items.filter((i) => i.type === typeFilter);
  }

  if (search) {
    items = items.filter((i) => {
      const hay = `${i.name} ${i.category} ${i.desc}`.toLowerCase();
      return hay.includes(search);
    });
  }

  switch (sort) {
    case "price-low":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  renderMenuGrid(items);
  renderCategoryButtons();
}

function renderMenuGrid(items) {
  const grid = el("menuGrid");
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px;color:#666;">
        <span style="font-size:3rem;display:block;margin-bottom:15px;">🍽️</span>
        No dishes found. Try a different search!
      </div>`;
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const cartItem = store.cart.find((c) => c.id === item.id);
      const stars = "⭐".repeat(Math.floor(item.rating || 0));

      return `
      <div class="menu-card">
        <div class="menu-card-img">
          ${item.image
          ? `<img src="${item.image}" alt="${item.name}" loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div class="emoji-fallback" style="display:none; position:absolute; inset:0; background:var(--glass);">
                   ${item.emoji || "🍽️"}
                 </div>`
          : `<div class="emoji-fallback" style="position:absolute; inset:0; background:var(--glass);">
                   ${item.emoji || "🍽️"}
                 </div>`
        }

          <span class="${item.type === "veg" ? "veg-badge" : "nonveg-badge"}">
            ${item.type === "veg" ? "🍏 Veg" : "🍎 Non-Veg"}
          </span>
          ${item.bestseller ? `<span class="bestseller-badge">🏆 Bestseller</span>` : ""}
        </div>

        <div class="menu-card-body">
          <div class="menu-card-category">${item.category || ""}</div>
          <h3>${item.name}</h3>
          <div class="menu-card-meta">
            <div class="menu-price">${formatMoney(item.price)} <small>/plate</small></div>
            <div class="menu-rating">${stars} <span>${item.rating} (${item.reviews || 0})</span></div>
          </div>
          <p class="menu-desc">${item.desc || ""}</p>

          ${cartItem
          ? `<div class="qty-control">
                  <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
                  <span class="qty-display">${cartItem.qty}</span>
                  <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>`
          : `<button class="btn-add-cart" onclick="addToCart(${item.id})"> Add to Cart</button>`
        }
        </div>
      </div>
    `;
    })
    .join("");
}

/* ---------- Cart ---------- */
function toggleCart() {
  el("cartOverlay")?.classList.toggle("open");
  el("cartPanel")?.classList.toggle("open");
  renderCart();
}

function addToCart(itemId) {
  if (!store.currentUser || store.isAdmin) {
    showToast("🔒", "Please login as a user to add items");
    navigateTo("login");
    return;
  }

  const item = store.menuItems.find((i) => i.id === itemId);
  if (!item) return;

  const existing = store.cart.find((c) => c.id === itemId);
  if (existing) existing.qty += 1;
  else store.cart.push({ ...item, qty: 1 });

  store.couponApplied = false;
  store.discount = 0;
  persist();

  showToast("✅", `${item.name} added to cart`);
  renderMenu();
  renderCart();
  updateNavbar();
}

function updateCartQty(itemId, delta) {
  const item = store.cart.find((c) => c.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) store.cart = store.cart.filter((c) => c.id !== itemId);

  store.couponApplied = false;
  store.discount = 0;
  persist();

  renderMenu();
  renderCart();
  updateNavbar();
}

function removeFromCart(itemId) {
  store.cart = store.cart.filter((c) => c.id !== itemId);

  store.couponApplied = false;
  store.discount = 0;
  persist();

  renderMenu();
  renderCart();
  updateNavbar();
}

function renderCart() {
  const container = el("cartItems");
  const footer = el("cartFooter");
  if (!container || !footer) return;

  if (!store.cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="emoji">ℹ️</span>
        <p>Your cart is empty</p>
        <p style="font-size:0.8rem;margin-top:5px;">Add some delicious items!</p>
      </div>`;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";

  container.innerHTML = store.cart
    .map(
      (item) => `
    <div class="cart-item">
      ${item.image
          ? `<div class="cart-item-img">
              <img src="${item.image}" alt="${item.name}"
                onerror="this.parentElement.className='cart-item-emoji'; this.parentElement.innerHTML='${item.emoji || "🍽️"}'">
            </div>`
          : `<div class="cart-item-emoji">${item.emoji || "🍽️"}</div>`
        }
      <div class="cart-item-info">
        <h4>${item.emoji || "🍽️"} ${item.name}</h4>
        <div class="price">${formatMoney(item.price * item.qty)}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + delivery + tax - (store.discount || 0));

  if (el("cartSubtotal"))
    el("cartSubtotal").textContent = formatMoney(subtotal);
  if (el("cartDelivery"))
    el("cartDelivery").textContent =
      delivery === 0 ? "FREE 🎉" : formatMoney(delivery);
  if (el("cartTax")) el("cartTax").textContent = formatMoney(tax);
  if (el("cartDiscount"))
    el("cartDiscount").textContent = store.discount
      ? `-₹${store.discount}`
      : "-₹0";
  if (el("cartTotal")) el("cartTotal").textContent = formatMoney(total);

  const btn = el("btnPlaceOrder");
  if (btn) btn.disabled = false;
}

/* ---------- Coupons ---------- */
function applyCoupon() {
  const input = el("couponInput");
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    showToast("❌", "Enter a coupon code");
    return;
  }

  if (!store.cart.length) {
    showToast("❌", "Cart is empty");
    return;
  }

  if (store.couponApplied) {
    showToast("⚠️", "Coupon already applied");
    return;
  }

  const coupon = COUPONS[code];
  if (!coupon) {
    showToast("❌", "Invalid coupon");
    return;
  }

  const subtotal = store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (subtotal < coupon.minOrder) {
    showToast("❌", `Minimum order ${formatMoney(coupon.minOrder)} required`);
    return;
  }

  let discount = 0;
  if (coupon.type === "flat") {
    discount = coupon.discount;
  } else if (coupon.type === "percent") {
    discount = Math.round((subtotal * coupon.discount) / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === "delivery") {
    discount = 40; // match delivery fee
  }

  store.discount = Math.min(discount, subtotal); // never exceed subtotal
  store.couponApplied = true;
  persist();

  showToast("🎉", `Coupon applied! You saved ₹${store.discount}`);
  updateCartTotals();
}

/* ---------- Orders ---------- */
/* ---------- Orders & Payment ---------- */
let pendingOrderTotal = 0;

function placeOrder() {
  if (!store.cart.length) return;

  const subtotal = store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + delivery + tax - (store.discount || 0));

  pendingOrderTotal = total;
  showPaymentGateway(total);
}

function showPaymentGateway(amount) {
  if (el("paymentAmountDisplay")) el("paymentAmountDisplay").textContent = formatMoney(amount);
  if (el("paymentBtnAmount")) el("paymentBtnAmount").textContent = formatMoney(amount);

  el("paymentModal")?.classList.add("open");

  // Close cart panel if open
  if (el("cartOverlay")?.classList.contains("open")) toggleCart();

  // Reset inputs
  ["cardNumInput", "cardExpInput", "cardCvvInput", "upiIdInput"].forEach(id => {
    if (el(id)) el(id).value = "";
  });

  // Setup Card Live Preview
  const setupPreview = (input, dispId, defaultText) => {
    const inp = el(input);
    const disp = el(dispId);
    if (!inp || !disp) return;
    inp.addEventListener("input", (e) => {
      let val = e.target.value || defaultText;
      if (input === 'cardNumInput') {
        val = val.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = val;
      }
      disp.textContent = val;
    });
  };

  setupPreview("cardNumInput", "cardNumDisp", "•••• •••• •••• ••••");
  setupPreview("cardExpInput", "cardExpDisp", "MM/YY");
  if (el("cardHoldDisp")) el("cardHoldDisp").textContent = (store.currentUser?.firstName + " " + (store.currentUser?.lastName || "")).toUpperCase();
}

function closePaymentModal() {
  el("paymentModal")?.classList.remove("open");
}

function switchPaymentMethod(method) {
  const btns = document.querySelectorAll(".method-btn");
  btns.forEach(btn => btn.classList.remove("active"));

  const forms = ["cardPaymentForm", "upiPaymentForm", "codPaymentForm"];
  forms.forEach(f => { if (el(f)) el(f).style.display = "none"; });

  if (method === 'card') {
    btns[0].classList.add("active");
    el("cardPaymentForm").style.display = "block";
  } else if (method === 'upi') {
    btns[1].classList.add("active");
    el("upiPaymentForm").style.display = "block";
  } else if (method === 'cod') {
    btns[2].classList.add("active");
    el("codPaymentForm").style.display = "block";
  }
}

function processPayment() {
  const activeBtn = document.querySelector(".method-btn.active");
  const methodText = activeBtn.textContent.toLowerCase();
  let method = "card";
  if (methodText.includes("upi")) method = "upi";
  if (methodText.includes("cod")) method = "cod";

  // Validation
  if (method === 'card') {
    const cardNumRaw = el("cardNumInput")?.value || "";
    const cardNum = cardNumRaw.replace(/\s+/g, '');
    const cardHolder = (el("cardHolderInput")?.value || "").trim();

    if (!cardHolder) {
      showToast("❌", "Please enter card holder name");
      return;
    }
    // Accept 15-16 digits (Amex is 15, others 16)
    if (!cardNum || cardNum.length <= 15) {
      showToast("❌", "Card number must be 15 or 16 digits");
      return;
    }
  } else if (method === 'upi') {
    if (!el("upiIdInput").value.includes("@")) {
      showToast("❌", "Please enter a valid UPI ID");
      return;
    }
  }

  // Handle COD immediately or with short delay
  if (method === 'cod') {
    const loading = el("paymentLoadingOverlay");
    loading?.classList.add("active");
    if (el("loadingText")) el("loadingText").textContent = "Confirming COD Order...";

    setTimeout(() => {
      loading?.classList.remove("active");
      completeOrderAfterPayment("COD", "Pending");
    }, 1500);
    return;
  }

  // Show Loading for Online Payments
  const loading = el("paymentLoadingOverlay");
  const loadingText = el("loadingText");

  // IMMEDIATELY close the payment modal and show loading
  el("paymentModal")?.classList.remove("open");
  loading?.classList.add("active");

  if (loadingText) loadingText.textContent = "Processing Payment...";

  setTimeout(() => { if (loadingText) loadingText.textContent = "Initiating Secure Gateway..."; }, 700);
  setTimeout(() => { if (loadingText) loadingText.textContent = "Authorizing Transaction..."; }, 1600);
  setTimeout(() => { if (loadingText) loadingText.textContent = "Finalizing Transaction..."; }, 2800);

  setTimeout(() => {
    loading?.classList.remove("active");
    const isSuccess = Math.random() > 0.05; // 95% success rate for simulation

    if (isSuccess) {
      completeOrderAfterPayment(method.toUpperCase(), "Success");
    } else {
      logFailedTransaction(method.toUpperCase());
      showToast("❌", "Payment Failed! Gateway Timeout.");
      closePaymentModal();
    }
  }, 4200);
}

function generateTransactionId() {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `PAY_FF_${ts}${rand}`;
}

function logFailedTransaction(method) {
  const subtotal = store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + delivery + tax - (store.discount || 0));

  const failedOrder = {
    id: "N/A",
    user: { email: store.currentUser.email, firstName: store.currentUser.firstName },
    items: [...store.cart],
    total: total,
    status: "Failed",
    method: method,
    txnId: generateTransactionId() + "_F",
    createdAt: new Date().toISOString()
  };

  if (!store.failedTransactions) store.failedTransactions = [];
  store.failedTransactions.push(failedOrder);
  persist();
}

function completeOrderAfterPayment(method, status) {
  store.orderCounter += 1;
  const subtotal = store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + delivery + tax - (store.discount || 0));

  const txnId = generateTransactionId();

  const order = {
    id: "FF" + store.orderCounter,
    user: {
      email: store.currentUser.email,
      firstName: escapeHTML(store.currentUser.firstName),
    },
    items: store.cart.map((i) => ({
      id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji
    })),
    subtotal, delivery, tax, discount: store.discount || 0,
    total,
    status: status === "Success" ? "Preparing" : "Pending Approval",
    method: method,
    createdAt: new Date().toISOString(),
    payment: {
      status: status,
      transactionId: txnId,
      time: new Date().toISOString(),
      amount: total,
      method: method
    }
  };

  store.orders.push(order);
  store.cart = [];
  store.couponApplied = false;
  store.discount = 0;
  persist();

  if (el("orderIdDisplay")) el("orderIdDisplay").textContent = "Order #" + order.id;
  if (el("txnIdDisplay")) el("txnIdDisplay").textContent = "TXN: " + txnId;
  el("orderModal")?.classList.add("open");

  closePaymentModal();
  renderMenu();
  updateNavbar();

  const msg = status === "Success" ? "Order placed successfully!" : "Order placed (Cash on Delivery)";
  showToast(status === "Success" ? "✅" : "💵", msg);
}

function handleDownloadInvoiceFromModal() {
  const orderIdText = el("orderIdDisplay")?.textContent || "";
  const orderId = orderIdText.replace("Order #", "").trim();
  if (orderId) downloadInvoice(orderId);
}

function downloadInvoice(orderId) {
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return;

  // Determine colors based on Order Status
  const getStatusColor = (s) => {
    if (s === "Completed") return "#4ade80";
    if (s === "Pending" || s === "Pending Approval") return "#e63946";
    return "#f4a261"; // Preparing
  };

  const statusColor = getStatusColor(order.status);

  // Open the print window
  const printWindow = window.open('', '_blank', 'width=800,height=900');

  if (!printWindow) {
    showToast("⚠️", "Popup blocked! Please allow popups for invoices.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice_${order.id}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 800; color: #e63946; }
        .invoice-title { font-size: 32px; font-weight: 300; text-transform: uppercase; color: #999; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .label { color: #888; text-transform: uppercase; font-size: 11px; font-weight: 700; margin-bottom: 5px; }
        .value { font-size: 15px; font-weight: 600; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; background: #f9f9f9; padding: 12px; border-bottom: 2px solid #eee; font-size: 12px; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; }
        .totals { margin-left: auto; width: 250px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .grand-total { border-top: 2px solid #333; font-size: 20px; font-weight: 800; margin-top: 10px; padding-top: 10px; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 4px; color: #fff; font-weight: 700; font-size: 12px; background: ${statusColor}; text-transform: uppercase; }
        .footer { text-align: center; margin-top: 60px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🍽️ FLAVOUR FUSION</div>
        <div class="invoice-title">OFFICIAL INVOICE</div>
      </div>
      
      <div class="details-grid">
        <div>
          <div class="label">Billed To</div>
          <div class="value">${order.user.firstName}</div>
          <div class="value">${order.user.email}</div>
        </div>
        <div>
          <div class="label">Order Information</div>
          <div class="value">Order ID: #${order.id}</div>
          <div class="value">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          <div class="value">Order Status: <span class="status-badge">${order.status.toUpperCase()}</span></div>
        </div>
      </div>

      <div class="details-grid">
        <div>
          <div class="label">Payment Details</div>
          <div class="value">Method: ${order.method || 'Online'}</div>
          <div class="value">TXN ID: ${order.payment?.transactionId || 'N/A'}</div>
          <div class="value">Payment: <span style="color: ${order.payment?.status === 'Success' ? '#27ae60' : '#f4a261'}">${order.payment?.status || 'SUCCESS'}</span></div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td>${i.qty}</td>
              <td>₹${i.price}</td>
              <td>₹${i.price * i.qty}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
        <div class="total-row"><span>Tax (5%)</span><span>₹${order.tax}</span></div>
        <div class="total-row"><span>Delivery Fee</span><span>₹${order.delivery}</span></div>
        <div class="total-row"><span>Discount</span><span>-₹${order.discount}</span></div>
        <div class="total-row grand-total"><span>Total</span><span>₹${order.total}</span></div>
      </div>

      <div class="footer">
        © 2026 Flavour Fusion Smart Restaurant Platform. This is a computer-generated invoice and requires no signature.
      </div>

      <script>
        setTimeout(() => {
          window.print();
          window.onafterprint = () => window.close();
        }, 800);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  showToast("📄", "Generating printable invoice...");
}

function closeOrderModal() {
  el("orderModal")?.classList.remove("open");
  renderMyOrders();
}

function showMyOrders() {
  el("userDropdown")?.classList.remove("open");
  navigateTo("menu");
  renderMyOrders();
  const section = el("myOrdersSection");
  if (section) {
    section.style.display = "block";
    setTimeout(() => section.scrollIntoView({ behavior: "smooth" }), 100);
  }
}

function renderMyOrders() {
  const section = el("myOrdersSection");
  const list = el("myOrdersList");
  if (!section || !list) return;

  if (!store.currentUser || store.isAdmin) {
    section.style.display = "none";
    return;
  }

  const myOrders = store.orders
    .filter((o) => o.user?.email === store.currentUser.email)
    .slice()
    .reverse();

  if (!myOrders.length) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  const statusClass = (s) => {
    if (s === "Completed" || s === "Received") return "status-completed";
    if (s === "Pending" || s === "Pending Approval") return "status-pending";
    if (s === "Rejected") return "status-rejected";
    return "status-preparing";
  };

  list.innerHTML = myOrders
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-card-header">
        <h4>Order #${escapeHTML(order.id)}</h4>
        <div style="display:flex; gap:10px; align-items:center;">
          ${(order.status !== 'Completed' && order.status !== 'Received' && order.status !== 'Rejected') ? `
            <button class="btn-outline" style="padding: 5px 10px; color: #ff4d4d; border-color: rgba(255, 77, 77, 0.3);" onclick="deleteOrder('${order.id}')">
              🗑️ Cancel
            </button>
          ` : ''}
          ${order.status === 'Completed' ? `
            <button class="btn-hero" style="padding: 5px 12px; font-size: 0.75rem;" onclick="confirmReceived('${order.id}')">
              📦 Confirm Received
            </button>
          ` : ''}
          <button class="btn-invoice" onclick="downloadInvoice('${order.id}')">📥 Invoice</button>
          <span class="order-status ${statusClass(order.status)}">${escapeHTML(order.status)}</span>
        </div>
      </div>
      ${order.status === 'Rejected' && (order.method === 'CARD' || order.method === 'UPI') ? `
        <p style="color: #ff4d4d; font-size: 0.75rem; margin-bottom: 10px; padding: 8px; background: rgba(255, 77, 77, 0.1); border-radius: 8px;">
          ⚠️ Your payment of ${formatMoney(order.total)} will be refunded within 4 to 5 working days.
        </p>
      ` : ''}
      <div class="order-card-items">
        ${order.items.map((i) => {
        const emoji = i.emoji || "🍽️";
        return `<span class="item-emoji">${emoji}</span> ${escapeHTML(i.name)} × ${i.qty}`;
      }).join(" &nbsp;•&nbsp; ")}
      </div>
      <div class="order-card-footer">
        <div>
          <span style="color:#888;font-size:0.8rem;">
            ${(function () {
          const qty = order.items.reduce((s, item) => s + item.qty, 0);
          return `${qty} ${qty === 1 ? 'item' : 'items'}`;
        })()} • 
          </span>
          <span style="color:var(--gold);font-size:0.8rem;">TXN: ${order.payment?.transactionId || 'SEED-DATA'}</span>
        </div>
        <span class="total">${formatMoney(order.total)}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ---------- Order Actions ---------- */
function confirmReceived(orderId) {
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return;

  // Update Order Status
  order.status = "Received";

  // Update Payment Status for COD (which is 'Pending')
  if (order.payment && order.payment.status === "Pending") {
    order.payment.status = "Success";
    order.payment.time = new Date().toISOString();
    showToast("💵", "Payment confirmed for Cash on Delivery!");
  }

  persist();
  renderMyOrders();
  showToast("✅", `Order #${orderId} confirmed as received!`);
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  store.orders = store.orders.filter(o => o.id !== orderId);
  persist();
  renderMyOrders();
  showToast("🗑️", `Order #${orderId} deleted successfully`);
}

/* ---------- Admin ---------- */
function renderAdmin() {
  if (!store.isAdmin) {
    showToast("🔒", "Admin access required");
    navigateTo("login");
    return;
  }

  if (el("adminUsers")) el("adminUsers").textContent = store.users.length;
  if (el("adminOrders")) el("adminOrders").textContent = store.orders.length;

  const successOrders = store.orders.filter(o => o.payment?.status === "Success" || !o.payment || o.payment?.status === "Pending");
  const revenue = successOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (el("adminRevenue")) el("adminRevenue").textContent = formatMoney(revenue);

  const successRate = store.orders.length > 0 ? Math.round((successOrders.length / (store.orders.length + (store.failedTransactions?.length || 0))) * 100) : 100;
  if (el("adminSuccessRate")) el("adminSuccessRate").textContent = successRate + "%";

  // Detailed Transaction Logs per user
  const logTable = el("adminTxnLogs");
  const statusFilter = el("txnStatusFilter")?.value || "all";

  if (logTable) {
    let allLogs = [
      ...store.orders.map(o => ({
        txnId: o.payment?.transactionId || 'SEED_DATA',
        user: o.user?.firstName || 'User',
        items: o.items?.length || 0,
        amount: o.total,
        method: o.method || 'Online',
        status: o.payment?.status || 'Success',
        time: o.createdAt
      })),
      ...(store.failedTransactions || []).map(f => ({
        txnId: f.txnId,
        user: f.user?.firstName || 'User',
        items: f.items?.length || 0,
        amount: f.total,
        method: f.method,
        status: 'Failed',
        time: f.createdAt
      }))
    ];

    allLogs.sort((a, b) => new Date(b.time) - new Date(a.time));

    if (statusFilter !== 'all') {
      allLogs = allLogs.filter(l => l.status.toLowerCase() === statusFilter);
    }

    logTable.innerHTML = allLogs.map(l => `
      <tr>
        <td style="font-family: monospace; font-size: 0.75rem;">${l.txnId}</td>
        <td>${l.user}</td>
        <td>${l.items} items</td>
        <td style="font-weight: 600;">${formatMoney(l.amount)}</td>
        <td>${l.method}</td>
        <td><span class="badge-status badge-${l.status.toLowerCase()}">${l.status}</span></td>
        <td style="font-size: 0.75rem; color: #777;">${new Date(l.time).toLocaleTimeString()}</td>
      </tr>
    `).join('');
  }

  // Orders list
  const ordersList = el("adminOrdersList");
  if (ordersList) {
    if (!store.orders.length) {
      ordersList.innerHTML = `<div class="cart-empty"><span class="emoji">📭</span><p>No orders yet</p></div>`;
    } else {
      const statusClass = (s) => {
        if (s === "Completed" || s === "Received") return "status-completed";
        if (s === "Pending" || s === "Pending Approval") return "status-pending";
        if (s === "Rejected") return "status-rejected";
        return "status-preparing";
      };

      ordersList.innerHTML = store.orders
        .slice()
        .reverse()
        .map(
          (o) => `
        <div class="order-item">
          <div class="order-item-info">
            <h4>#${escapeHTML(o.id)} — ${escapeHTML(o.user?.firstName) || "User"}</h4>
            <p>${o.items?.length || 0} items • ${formatMoney(o.total)}</p>
          </div>
          <select class="admin-form-input ${statusClass(o.status)}" 
                  onchange="updateOrderStatus('${o.id}', this.value)"
                  style="width: 130px; padding: 5px 10px; margin-left: 10px; background-color: var(--dark);">
            <option value="Pending Approval" ${o.status === 'Pending Approval' ? 'selected' : ''}>Pending Approval</option>
            <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Received" ${o.status === 'Received' ? 'selected' : ''}>Received</option>
            <option value="Rejected" ${o.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      `,
        )
        .join("");
    }
  }

  // Menu list
  const menuList = el("adminMenuList");
  if (el("menuItemCount"))
    el("menuItemCount").textContent = `(${store.menuItems.length} items)`;

  if (menuList) {
    menuList.innerHTML = store.menuItems
      .map(
        (item) => `
      <div class="admin-menu-item">
        ${item.image
            ? `<div class="item-thumb"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}"
                 onerror="this.parentElement.outerHTML='<span class=\\'emoji\\'>${escapeHTML(item.emoji) || "🍽️"}</span>'"></div>`
            : `<span class="emoji">${escapeHTML(item.emoji) || "🍽️"}</span>`
          }
        <div class="info">
          <h4>${escapeHTML(item.name)}</h4>
          <p>${escapeHTML(item.category)} • ${formatMoney(item.price)} • ⭐${item.rating}</p>
        </div>
        <button class="del-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
      </div>
    `,
      )
      .join("");
  }
}

function updateOrderStatus(orderId, newStatus) {
  if (!store.isAdmin) return;
  const order = store.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = newStatus;
    persist();
    renderAdmin();
    showToast("✅", `Order #${orderId} marked as ${newStatus}`);
  }
}

function addMenuItem() {
  if (!store.isAdmin) {
    showToast("🔒", "Admin access required");
    return;
  }

  const name = (el("newItemName")?.value || "").trim();
  const price = parseInt(el("newItemPrice")?.value || "", 10);
  const emoji = (el("newItemEmoji")?.value || "").trim() || "🍽️";
  const category = (el("newItemCategory")?.value || "").trim();
  const type = (el("newItemType")?.value || "veg").trim();
  const desc =
    (el("newItemDesc")?.value || "").trim() ||
    "A delicious dish from our kitchen";
  const image = (el("newItemImage")?.value || "").trim();

  if (!name || !Number.isFinite(price) || !category) {
    showToast("❌", "Please fill name, price and category");
    return;
  }

  const item = {
    id: store.nextItemId++,
    name,
    price,
    emoji,
    image: image || "",
    category,
    type: type === "nonveg" ? "nonveg" : "veg",
    rating: Number((4 + Math.random() * 0.9).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 10,
    desc,
    bestseller: false,
  };

  store.menuItems.push(item);
  persist();

  // clear inputs
  [
    "newItemName",
    "newItemPrice",
    "newItemEmoji",
    "newItemCategory",
    "newItemType",
    "newItemDesc",
    "newItemImage",
  ].forEach((id) => {
    if (el(id)) el(id).value = "";
  });

  showToast("✅", `${name} added to menu`);
  renderAdmin();
}

function deleteMenuItem(id) {
  if (!store.isAdmin) return;

  store.menuItems = store.menuItems.filter((i) => i.id !== id);
  store.cart = store.cart.filter((c) => c.id !== id);
  persist();

  showToast("🗑️", "Menu item deleted");
  renderAdmin();
  renderMenu();
  updateNavbar();
}

/* ---------- Init ---------- */
(function init() {
  hydrate();

  // Aggressive Migration: Force refresh emojis for ALL items to fix broken characters/boxes
  const emojiMap = {
    "Masala Dosa": "\u{1F35B}",      // 🍛
    "Veg Biryani": "\u{1F35A}",      // 🍚
    "Butter Chicken": "\u{1F357}",   // 🍗
    "Paneer Tikka": "\u{1F358}",    // 🥘
    "Hyderabadi Biryani": "\u{1F35B}", // 🍛
    "Margherita Pizza": "\u{1F355}", // 🍕
    "Chicken Burger": "\u{1F354}",   // 🍔
    "Hakka Noodles": "\u{1F35C}",    // 🍜
    "Gulab Jamun": "\u{1F368}",      // 🍨
    "Chicken Fried Rice": "\u{1F35A}", // 🍚
    "Mango Lassi": "🍸",      // 
    "Dal Makhani": "\u{1F372}"       // 🍲
  };

  store.menuItems.forEach(item => {
    if (emojiMap[item.name]) item.emoji = emojiMap[item.name];
  });

  store.orders.forEach(order => {
    order.items.forEach(item => {
      if (emojiMap[item.name]) item.emoji = emojiMap[item.name];
    });
  });

  // Seed demo users/orders only once (if empty)
  if (store.users.length === 0) {
    store.users.push(
      {
        id: 1,
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@test.com",
        phone: "+91 98765 43210",
        password: "123456",
        address: "Mumbai, MH",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        firstName: "Rahul",
        lastName: "Patel",
        email: "rahul@test.com",
        phone: "+91 87654 32109",
        password: "123456",
        address: "Delhi, DL",
        createdAt: new Date().toISOString(),
      },
    );
  }

  if (store.orders.length === 0) {
    store.orders.push(
      {
        id: "FF1001",
        user: { email: "priya@test.com", firstName: "Priya" },
        items: [
          { id: 1, name: "Butter Chicken", qty: 2, price: 320, emoji: "🍗" },
          {
            id: 3,
            name: "Hyderabadi Biryani",
            qty: 1,
            price: 280,
            emoji: "🍚",
          },
        ],
        subtotal: 920,
        delivery: 0,
        tax: 46,
        discount: 0,
        total: 966,
        status: "Completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "FF1002",
        user: { email: "rahul@test.com", firstName: "Rahul" },
        items: [
          { id: 5, name: "Margherita Pizza", qty: 1, price: 199, emoji: "🍕" },
          { id: 11, name: "Mango Lassi", qty: 2, price: 89, emoji: "🥭" },
        ],
        subtotal: 377,
        delivery: 40,
        tax: 19,
        discount: 0,
        total: 436,
        status: "Preparing",
        createdAt: new Date().toISOString(),
      },
    );
    store.orderCounter = Math.max(store.orderCounter, 1002);
  }

  persist();
  updateNavbar();
  renderPopularDishes();

  // Listen for changes from other tabs (Admin status updates, etc.)
  window.addEventListener('storage', (e) => {
    if (e.key === 'flavour_fusion_data') {
      hydrate();
      const page = document.querySelector('.page.active')?.id.replace('page-', '');
      if (page === 'admin') renderAdmin();
      if (page === 'menu') {
        renderMenu();
        renderMyOrders();
      }
      updateNavbar();
    }
  });

  // Setup Visual Card Preview Listeners
  const setupCardPreview = () => {
    // Card Number
    el("cardNumInput")?.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      let formatted = val.match(/.{1,4}/g)?.join(" ") || "";
      e.target.value = formatted.slice(0, 19);
      if (el("cardNumDisp")) el("cardNumDisp").textContent = e.target.value || "•••• •••• •••• ••••";
    });

    // Card Holder
    el("cardHolderInput")?.addEventListener("input", (e) => {
      if (el("cardHoldDisp")) el("cardHoldDisp").textContent = e.target.value.toUpperCase() || "YOUR NAME";
    });

    // Card Expiry
    el("cardExpInput")?.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 2) {
        val = val.slice(0, 2) + "/" + val.slice(2, 4);
      }
      e.target.value = val.slice(0, 5);
      if (el("cardExpDisp")) el("cardExpDisp").textContent = e.target.value || "MM/YY";
    });
  };

  setupCardPreview();
})();
