/**
 * Wanderly - Hotel Booking & Travel Itinerary Platform
 * Comprehensive Application Logic
 */

// =============================================================================
// 1. STORAGE & STATE MANAGEMENT
// =============================================================================
const Store = {
  get(key, fallback) {
    try {
      const item = localStorage.getItem(`wanderly:${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`wanderly:${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },
  remove(key) {
    localStorage.removeItem(`wanderly:${key}`);
  },
};

function getUserStoragePrefix() {
  const current = Store.get("currentUser", null);
  if (current && (current.id || current.email)) {
    const key = String(current.id || current.email).toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `u_${key}_`;
  }
  return `guest_`;
}

const App = {
  data: window.WANDERLY_DATA || { currencies: {}, destinations: [] },
  
  get trip() {
    const prefix = getUserStoragePrefix();
    return Store.get(`${prefix}trip`, null);
  },
  set trip(value) {
    const prefix = getUserStoragePrefix();
    if (value === null) {
      Store.remove(`${prefix}trip`);
    } else {
      Store.set(`${prefix}trip`, value);
    }
  },
  
  get itinerary() {
    const prefix = getUserStoragePrefix();
    return Store.get(`${prefix}itinerary`, {});
  },
  set itinerary(value) {
    const prefix = getUserStoragePrefix();
    if (value === null || Object.keys(value || {}).length === 0) {
      Store.remove(`${prefix}itinerary`);
    } else {
      Store.set(`${prefix}itinerary`, value);
    }
  },
  
  get favorites() {
    const prefix = getUserStoragePrefix();
    return Store.get(`${prefix}favorites`, []);
  },
  set favorites(value) {
    const prefix = getUserStoragePrefix();
    Store.set(`${prefix}favorites`, value);
  },
  
  get favoriteHotels() {
    const prefix = getUserStoragePrefix();
    return Store.get(`${prefix}favoriteHotels`, []);
  },
  set favoriteHotels(value) {
    const prefix = getUserStoragePrefix();
    Store.set(`${prefix}favoriteHotels`, value);
  },
  
  get reviews() {
    return Store.get("reviews", {});
  },
  set reviews(value) {
    Store.set("reviews", value);
  },
  
  get helpfulVotes() {
    const prefix = getUserStoragePrefix();
    return Store.get(`${prefix}helpfulVotes`, {});
  },
  set helpfulVotes(value) {
    const prefix = getUserStoragePrefix();
    Store.set(`${prefix}helpfulVotes`, value);
  },
  
  get currency() {
    const saved = Store.get("currency", "USD");
    return (App.data.currencies && App.data.currencies[saved]) ? saved : "USD";
  },
  set currency(value) {
    Store.set("currency", value);
  },
  
  get users() {
    const rawUsers = Store.get("users", []);
    // Clean out legacy demo seed users if present in localStorage
    return Array.isArray(rawUsers)
      ? rawUsers.filter((u) => u && u.id !== "user-demo-1" && u.id !== "user-demo-2" && !String(u.name || "").includes("Ahmed El-Sayed") && !String(u.email || "").includes("ahmed@example.com"))
      : [];
  },
  set users(value) {
    Store.set("users", value);
  },
  
  get currentUser() {
    const current = Store.get("currentUser", null);
    if (current && (current.id === "user-demo-1" || String(current.name || "").includes("Ahmed El-Sayed") || current.email === "ahmed@example.com")) {
      Store.remove("currentUser");
      return null;
    }
    return current;
  },
  set currentUser(value) {
    if (value) {
      Store.set("currentUser", value);
    } else {
      Store.remove("currentUser");
    }
  },
};

// Firebase sessions replace Firebase users, while local fallback accounts remain
// signed in when Firebase has no user for this browser.
window.addEventListener("wanderly:firebase-auth-state", (event) => {
  const previousUser = App.currentUser;
  const firebaseUser = event.detail;
  const isLocalSession = (user) => user?.authProvider === "local" || String(user?.id || "").startsWith("user-");
  if (firebaseUser) {
    if (!isLocalSession(previousUser)) App.currentUser = firebaseUser;
  } else if (previousUser?.authProvider === "firebase" || (previousUser?.id && !isLocalSession(previousUser))) {
    App.currentUser = null;
  }

  const currentUser = App.currentUser;
  if (document.readyState !== "loading") {
    updateHeaderUserStatus();
    if (previousUser?.id !== currentUser?.id) refreshActivePageView();
  }
});
window.addEventListener("wanderly:firebase-email-link-complete", () => {
  if (document.readyState !== "loading") {
    updateHeaderUserStatus();
    toast("You are signed in successfully.");
  }
});

// =============================================================================
// 2. DOM & QUERY HELPERS
// =============================================================================
function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

// =============================================================================
// 3. CURRENCY CONVERSION & FORMATTING
// =============================================================================
function getCurrencyInfo(code = App.currency) {
  return App.data.currencies[code] || App.data.currencies.USD || { symbol: "$", rate: 1, name: "US Dollar ($)" };
}

function convertUSD(usdAmount, targetCurrency = App.currency) {
  const info = getCurrencyInfo(targetCurrency);
  return Math.round((usdAmount || 0) * (info.rate || 1));
}

function money(usdAmount, targetCurrency = App.currency) {
  const info = getCurrencyInfo(targetCurrency);
  const converted = convertUSD(usdAmount, targetCurrency);
  return `${info.symbol} ${converted.toLocaleString()}`;
}

function updateAllCurrencyDisplays() {
  qsa("[data-usd]").forEach((el) => {
    const usd = Number(el.dataset.usd || 0);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    el.textContent = `${prefix}${money(usd)}${suffix}`;
  });
}

function setAppCurrency(newCurrency) {
  if (App.data.currencies[newCurrency]) {
    const budgetInput = qs('#planner-form [name="budget"]');
    const budgetUsd = budgetInput && Number.isFinite(Number(budgetInput.value))
      ? Number(budgetInput.value) / getCurrencyInfo(App.currency).rate
      : null;
    App.currency = newCurrency;
    toast(`Currency switched to ${newCurrency} (${getCurrencyInfo(newCurrency).symbol})`);

    if (budgetInput && budgetUsd !== null) {
      budgetInput.value = String(Math.round(budgetUsd * getCurrencyInfo(newCurrency).rate * 100) / 100);
      const label = qs('[data-budget-currency-label]');
      if (label) label.textContent = `Trip Budget (${newCurrency})`;
    }
    
    // Update select inputs without reload
    qsa("[data-currency]").forEach((sel) => (sel.value = newCurrency));
    
    // Re-render current page dynamically
    const page = document.body.dataset.page;
    if (page === "home") initHome();
    else if (page === "destination") initDestination();
    else if (page === "planner") initPlanner();
    else if (page === "trip") initTrip();
    else if (page === "favorites") initFavorites();
    else if (page === "summary") initSummary();
  }
}

// =============================================================================
// 4. DATA LOOKUPS & RECOMMENDATION ENGINE
// =============================================================================
function destinationById(id) {
  return App.data.destinations.find((d) => d.id === id) || App.data.destinations[0];
}

function allPlaces() {
  return App.data.destinations.flatMap((destination) =>
    (destination.places || []).map((place) => ({
      ...place,
      destinationId: destination.id,
      destinationName: destination.name,
      destinationCountry: destination.country,
      type: place.category === "Dining" ? "restaurant" : (place.category === "Adventure" || place.category === "Shopping" ? "activity" : "landmark")
    }))
  );
}

function placeById(id) {
  return allPlaces().find((place) => place.id === id);
}

function allHotels() {
  return App.data.destinations.flatMap((destination) =>
    (destination.hotels || []).map((hotel) => ({
      ...hotel,
      destinationId: destination.id,
      destinationName: destination.name,
      destinationCountry: destination.country
    }))
  );
}

function hotelById(id) {
  return allHotels().find((hotel) => hotel.id === id);
}

function destinationHotels(destinationId) {
  const dest = destinationById(destinationId);
  return (dest?.hotels || []).map((hotel) => ({
    ...hotel,
    destinationId: dest.id,
    destinationName: dest.name,
    destinationCountry: dest.country
  }));
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function getHotelProximityInfo(hotel, referencePlace = null) {
  if (referencePlace && referencePlace.lat && referencePlace.lng) {
    const dist = calculateDistanceKm(hotel.lat, hotel.lng, referencePlace.lat, referencePlace.lng);
    return {
      distance: dist,
      label: `${dist} km from ${referencePlace.name}`,
      shortLabel: `${dist} km to ${referencePlace.name}`
    };
  }

  const dest = destinationById(hotel.destinationId);
  const primaryPlace = dest?.places?.[0];
  if (primaryPlace && primaryPlace.lat && primaryPlace.lng) {
    const dist = calculateDistanceKm(hotel.lat, hotel.lng, primaryPlace.lat, primaryPlace.lng);
    return {
      distance: dist,
      label: `${dist} km from ${primaryPlace.name}`,
      shortLabel: `${dist} km to center / beach`
    };
  }

  return { distance: 1.2, label: "Prime City & Coastal Center", shortLabel: "Strategic location" };
}

/**
 * Computes Smart Recommendation Badges for a Hotel
 */
function getHotelRecommendationType(hotel, destinationHotelsList) {
  if (!destinationHotelsList || destinationHotelsList.length <= 1) return "top-rated";

  // Find max rating
  const maxRating = Math.max(...destinationHotelsList.map((h) => h.rating));
  if (hotel.rating === maxRating && hotel.rating >= 4.7) {
    return "top-rated";
  }

  // Find min price with rating >= 4.5
  const qualityHotels = destinationHotelsList.filter((h) => h.rating >= 4.5);
  const minPrice = Math.min(...(qualityHotels.length ? qualityHotels : destinationHotelsList).map((h) => h.pricePerNight));
  if (hotel.pricePerNight === minPrice) {
    return "budget";
  }

  // Strategic location (closest to landmark)
  const sortedByProximity = [...destinationHotelsList].sort((a, b) => {
    return getHotelProximityInfo(a).distance - getHotelProximityInfo(b).distance;
  });
  if (sortedByProximity[0]?.id === hotel.id) {
    return "strategic";
  }

  if (hotel.stars === 5 && hotel.pricePerNight > 200) {
    return "luxury";
  }

  return null;
}

function renderRecommendationBadge(type) {
  if (!type) return "";
  const badges = {
    "top-rated": `<span class="recommendation-badge badge-top-rated"><i class="fa-solid fa-trophy"></i> Top Rated (أعلى تقييماً)</span>`,
    "strategic": `<span class="recommendation-badge badge-strategic"><i class="fa-solid fa-location-crosshairs"></i> Strategic Location (موقع استراتيجي)</span>`,
    "budget": `<span class="recommendation-badge badge-budget"><i class="fa-solid fa-wallet"></i> Best Value (أفضل ميزانية وقيمة)</span>`,
    "luxury": `<span class="recommendation-badge badge-luxury"><i class="fa-solid fa-gem"></i> Luxury Pick (إقامة فاخرة)</span>`
  };
  return badges[type] || "";
}

function renderStarIcons(stars = 5) {
  const fullStars = Math.floor(stars);
  let html = `<div class="flex items-center text-amber-500 gap-0.5" title="${stars} Stars">`;
  for (let i = 0; i < fullStars; i++) {
    html += `<i class="fa-solid fa-star text-xs"></i>`;
  }
  html += `</div>`;
  return html;
}

// =============================================================================
// 5. TOAST NOTIFICATION SYSTEM
// =============================================================================
function toast(message, icon = "fa-circle-check") {
  let container = qs("#wanderly-toast");
  if (!container) {
    container = document.createElement("div");
    container.id = "wanderly-toast";
    document.body.appendChild(container);
  }
  
  container.innerHTML = `<i class="fa-solid ${icon} text-teal-600 text-base"></i> <span>${message}</span>`;
  container.classList.add("show");
  
  if (window.__toastTimer) clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    container.classList.remove("show");
  }, 3200);
}

// =============================================================================
// 6. AUTHENTICATION
// =============================================================================
function requireAccount(nextAction, actionLabel = "book this hotel or save items") {
  if (App.currentUser) {
    if (typeof nextAction === "function") nextAction();
    return;
  }
  openAuthModal(nextAction, actionLabel);
}

function getUserAvatarHtml(user, sizeClass = "size-7 text-xs") {
  if (user?.avatar && typeof user.avatar === "string" && user.avatar.trim().length > 0) {
    return `<img src="${user.avatar}" class="${sizeClass} rounded-full object-cover shadow-sm border border-teal-500/30" alt="${user.name || 'User'}">`;
  }
  const name = String(user?.name || "").trim();
  const nameParts = name.split(" ").filter(Boolean);
  let initials = "W";
  if (nameParts.length > 1) {
    initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  } else if (name.length > 0) {
    initials = name.slice(0, 2).toUpperCase();
  }
  return `<span class="grid ${sizeClass} place-items-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 font-black text-white shadow-sm ring-2 ring-teal-500/20 uppercase select-none">${initials}</span>`;
}

function openAuthModal(onSuccess, actionLabel = "book hotels, save places, or build custom itineraries", defaultMode = "login") {
  let modal = qs("#auth-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "auth-modal";
    document.body.appendChild(modal);
  }

  const closeAuth = () => {
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
  };

  const render = (mode = defaultMode) => {
    const isRegister = mode === "register";
    document.body.classList.add("modal-open");

    modal.innerHTML = `
      <div class="modal-backdrop-custom animate-fade-in" data-auth-backdrop>
        <div class="modal-dialog-custom max-w-md p-6 sm:p-8">
          
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-black mb-2 border border-teal-500/20">
                <i class="fa-solid fa-compass"></i> Wanderly Account
              </span>
              <h2 class="text-2xl font-black text-slate-950 dark:text-white">
                ${isRegister ? "Create an account" : "Welcome back"}
              </h2>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                ${isRegister ? "Sign up to save your favorite destinations and plan trips." : "Sign in to access your bookings, favorites, and itineraries."}
              </p>
            </div>
            <button type="button" data-auth-close class="icon-btn text-slate-400 hover:text-slate-600 dark:hover:text-white" aria-label="Close">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Mode Switcher Tabs -->
          <div class="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 border border-slate-200 dark:border-slate-700/60">
            <button type="button" data-auth-tab="login" class="py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${!isRegister ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In</span>
            </button>
            <button type="button" data-auth-tab="register" class="py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${isRegister ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}">
              <i class="fa-solid fa-user-plus"></i>
              <span>Create Account</span>
            </button>
          </div>

          <!-- Auth Form -->
          <form data-auth-form class="space-y-4">
            ${isRegister ? `
              <div>
                <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  <i class="fa-solid fa-user text-teal-600 mr-1.5"></i> Full Name
                </label>
                <input name="name" type="text" required minlength="2" placeholder="e.g. Heba Ayman" autocomplete="name" class="field text-sm w-full py-2.5 px-3.5">
              </div>
            ` : ""}

            <div>
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                <i class="fa-solid fa-envelope text-teal-600 mr-1.5"></i> Email Address
              </label>
              <input name="email" type="email" required placeholder="name@example.com" autocomplete="email" class="field text-sm w-full py-2.5 px-3.5">
            </div>

            <div>
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                <i class="fa-solid fa-lock text-teal-600 mr-1.5"></i> ${isRegister ? "Password (min 6 characters)" : "Password"}
              </label>
              <div class="relative">
                <input name="password" id="auth-input-password" type="password" required minlength="${isRegister ? '6' : '1'}" placeholder="••••••••" autocomplete="${isRegister ? 'new-password' : 'current-password'}" class="field text-sm w-full py-2.5 pl-3.5 pr-10">
                <button type="button" data-toggle-pw="auth-input-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1" title="Show/Hide Password">
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            ${isRegister ? `
              <div>
                <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  <i class="fa-solid fa-shield-check text-teal-600 mr-1.5"></i> Confirm Password
                </label>
                <div class="relative">
                  <input name="confirmPassword" id="auth-input-confirm-password" type="password" required minlength="6" placeholder="Repeat your password" autocomplete="new-password" class="field text-sm w-full py-2.5 pl-3.5 pr-10">
                  <button type="button" data-toggle-pw="auth-input-confirm-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1" title="Show/Hide Password">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                </div>
              </div>
            ` : `
              <div class="flex items-center justify-between text-xs">
                <label class="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" name="remember" checked class="accent-teal-600 rounded">
                  Remember me
                </label>
                <button type="button" data-forgot-password class="font-bold text-teal-600 hover:underline">Forgot password?</button>
              </div>
            `}

            <!-- Error Banner -->
            <div data-auth-error class="hidden rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation text-rose-500 shrink-0"></i>
              <span data-auth-error-text></span>
            </div>

            <!-- Submit Button -->
            <button class="btn-primary mt-2 w-full justify-center py-3 text-sm font-black shadow-lg" type="submit">
              <i class="fa-solid ${isRegister ? 'fa-user-plus' : 'fa-arrow-right-to-bracket'} mr-1"></i>
              <span>${isRegister ? 'Create My Account' : 'Sign In'}</span>
            </button>
          </form>

          <!-- Footer Switcher -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button type="button" data-auth-switch class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
              ${isRegister ? 'Already have an account? <span class="text-teal-600 dark:text-teal-400 underline font-black">Sign in</span>' : 'Don’t have an account? <span class="text-teal-600 dark:text-teal-400 underline font-black">Create one now</span>'}
            </button>
          </div>

        </div>
      </div>`;

    // Bind Close
    qs("[data-auth-close]", modal)?.addEventListener("click", closeAuth);
    qs("[data-auth-backdrop]", modal)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeAuth();
    });

    // Tab buttons
    qsa("[data-auth-tab]", modal).forEach((btn) => {
      btn.addEventListener("click", () => render(btn.dataset.authTab));
    });

    // Bottom switch button
    qs("[data-auth-switch]", modal)?.addEventListener("click", () => render(isRegister ? "login" : "register"));

    // Toggle password visibility
    qsa("[data-toggle-pw]", modal).forEach((btn) => {
      btn.addEventListener("click", () => {
        const inputId = btn.dataset.togglePw;
        const input = qs(`#${inputId}`, modal);
        if (!input) return;
        const isPass = input.type === "password";
        input.type = isPass ? "text" : "password";
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = isPass ? "fa-solid fa-eye-slash text-xs text-teal-600" : "fa-solid fa-eye text-xs";
        }
      });
    });

    // Forgot password helper
    qs("[data-forgot-password]", modal)?.addEventListener("click", () => {
      const email = String(qs('input[name="email"]', modal)?.value || "").trim();
      const errorBox = qs("[data-auth-error]", modal);
      const errorText = qs("[data-auth-error-text]", modal);
      if (!email) {
        if (errorBox && errorText) {
          errorText.textContent = "Please enter your email address above to reset your password.";
          errorBox.classList.remove("hidden");
        }
        return;
      }
      toast(`Password reset instructions sent to ${email}`);
      if (errorBox) errorBox.classList.add("hidden");
    });

    // Form Submit Handler
    qs("[data-auth-form]", modal)?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") || "").trim().toLowerCase();
      const password = String(form.get("password") || "");
      const errorBox = qs("[data-auth-error]", modal);
      const errorText = qs("[data-auth-error-text]", modal);

      const showError = (msg) => {
        if (errorBox && errorText) {
          errorText.textContent = msg;
          errorBox.classList.remove("hidden");
        }
      };

      if (isRegister) {
        const name = String(form.get("name") || "").trim();
        const confirmPassword = String(form.get("confirmPassword") || "");

        if (!name || name.length < 2) {
          showError("Please enter your full name (minimum 2 characters).");
          return;
        }
        if (!email || !email.includes("@") || !email.includes(".")) {
          showError("Please enter a valid email address.");
          return;
        }
        if (!password || password.length < 6) {
          showError("Password must be at least 6 characters long.");
          return;
        }
        if (password !== confirmPassword) {
          showError("Passwords do not match. Please re-enter.");
          return;
        }

        const currentUsers = App.users;
        if (currentUsers.some((u) => u.email.toLowerCase() === email)) {
          showError("An account with this email already exists. Please sign in instead.");
          return;
        }

        // Try Firebase register if available
        if (window.WANDERLY_FIREBASE_CONFIG) {
          const firebaseAuth = await window.WANDERLY_FIREBASE_READY;
          if (firebaseAuth) {
            try {
              const fbUser = await firebaseAuth.registerEmail(name, email, password);
              App.currentUser = fbUser;
              closeAuth();
              toast(`Account created! Welcome, ${fbUser.name}.`);
              updateHeaderUserStatus();
              if (typeof onSuccess === "function") onSuccess();
              return;
            } catch (err) {
              console.warn("Firebase registration skipped, using local account:", err);
            }
          }
        }

        // Generate clean initials
        const nameParts = name.split(" ").filter(Boolean);
        const initials = nameParts.length > 1
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase();

        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          avatar: "",
          initials,
          role: "Explorer",
          authProvider: "local",
          createdAt: new Date().toISOString()
        };

        App.users = [...currentUsers, newUser];
        App.currentUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          initials: newUser.initials,
          role: newUser.role,
          authProvider: "local"
        };

        closeAuth();
        toast(`Account created successfully! Welcome, ${newUser.name}.`);
        updateHeaderUserStatus();
        if (typeof onSuccess === "function") {
          onSuccess();
        } else {
          refreshActivePageView();
        }

      } else {
        // Sign In Flow
        if (!email || !password) {
          showError("Please enter both your email address and password.");
          return;
        }

        // Try Firebase sign in if available
        if (window.WANDERLY_FIREBASE_CONFIG) {
          const firebaseAuth = await window.WANDERLY_FIREBASE_READY;
          if (firebaseAuth) {
            try {
              const fbUser = await firebaseAuth.signInEmail(email, password);
              App.currentUser = fbUser;
              closeAuth();
              toast(`Welcome back, ${fbUser.name}!`);
              updateHeaderUserStatus();
              if (typeof onSuccess === "function") {
                onSuccess();
              } else {
                refreshActivePageView();
              }
              return;
            } catch (err) {
              console.warn("Firebase sign-in skipped, checking local store:", err);
            }
          }
        }

        const currentUsers = App.users;
        const found = currentUsers.find((u) => u.email.toLowerCase() === email);

        if (!found) {
          showError(`No account found with email "${email}". Please check spelling or click "Create Account" above.`);
          return;
        }

        if (found.password !== password) {
          showError("Incorrect password. Please verify your password and try again.");
          return;
        }

        const nameParts = (found.name || "").split(" ").filter(Boolean);
        const initials = found.initials || (nameParts.length > 1 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : (found.name || "U").slice(0, 2).toUpperCase());

        App.currentUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          avatar: found.avatar || "",
          initials,
          role: found.role || "Explorer",
          authProvider: "local"
        };

        closeAuth();
        toast(`Welcome back, ${found.name}!`);
        updateHeaderUserStatus();
        if (typeof onSuccess === "function") {
          onSuccess();
        } else {
          refreshActivePageView();
        }
      }
    });
  };

  render(defaultMode);
}

function refreshActivePageView() {
  const page = document.body?.dataset?.page || "home";
  if (page === "home" && typeof initHome === "function") initHome();
  else if (page === "destination" && typeof initDestination === "function") initDestination();
  else if (page === "planner" && typeof initPlanner === "function") initPlanner();
  else if (page === "trip" && typeof initTrip === "function") initTrip();
  else if (page === "favorites" && typeof initFavorites === "function") initFavorites();
  else if (page === "summary" && typeof initSummary === "function") initSummary();
}

function updateHeaderUserStatus() {
  const container = qs("#header-auth-container");
  if (!container) return;
  const user = App.currentUser;

  if (user) {
    container.innerHTML = `
      <div class="relative flex items-center gap-2">
        <button id="user-profile-menu-btn" class="flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50/90 dark:bg-teal-950/70 px-3 py-1 text-xs font-black text-slate-800 dark:text-slate-100 transition hover:border-teal-500 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 shadow-sm">
          ${getUserAvatarHtml(user, "size-6 text-[10px]")}
          <span class="max-w-[110px] truncate hidden sm:inline">${user.name}</span>
          <i class="fa-solid fa-chevron-down text-[10px] text-teal-600 dark:text-teal-400"></i>
        </button>
        <div id="user-profile-dropdown" class="hidden absolute right-0 top-11 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
          <div class="p-2.5 mb-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            ${getUserAvatarHtml(user, "size-9 text-xs")}
            <div class="overflow-hidden">
              <p class="text-xs font-black text-slate-900 dark:text-white truncate">${user.name}</p>
              <p class="text-[11px] font-semibold text-slate-400 truncate">${user.email}</p>
            </div>
          </div>
          <a href="my-trip.html" class="flex items-center gap-2.5 rounded-xl p-2 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-300 transition">
            <i class="fa-solid fa-route text-teal-600"></i> My Active Itinerary
          </a>
          <a href="favorites.html" class="flex items-center gap-2.5 rounded-xl p-2 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-300 transition">
            <i class="fa-solid fa-heart text-rose-500"></i> Saved Favorites
          </a>
          <button type="button" data-avatar-upload class="flex w-full items-center gap-2.5 rounded-xl p-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition">
            <i class="fa-solid fa-camera text-teal-600"></i> Change profile photo
          </button>
          ${user.avatar ? `
            <button type="button" data-avatar-remove class="flex w-full items-center gap-2.5 rounded-xl p-2 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition">
              <i class="fa-solid fa-user-xmark"></i> Remove profile photo
            </button>
          ` : ""}
          <input type="file" data-avatar-file accept="image/png,image/jpeg,image/webp" class="hidden">
          <div class="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>
          <button data-logout-action class="flex w-full items-center gap-2.5 rounded-xl p-2 text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </div>`;

    qs("#user-profile-menu-btn")?.addEventListener("click", () => {
      qs("#user-profile-dropdown")?.classList.toggle("hidden");
    });

    const avatarInput = qs("[data-avatar-file]", container);
    qs("[data-avatar-upload]", container)?.addEventListener("click", () => avatarInput?.click());
    avatarInput?.addEventListener("change", () => {
      const file = avatarInput.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        toast("Please choose an image smaller than 2 MB.");
        avatarInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        App.currentUser = { ...user, avatar: reader.result };
        updateHeaderUserStatus();
        toast("Profile photo updated.");
      });
      reader.readAsDataURL(file);
    });

    qs("[data-avatar-remove]", container)?.addEventListener("click", () => {
      App.currentUser = { ...user, avatar: "" };
      updateHeaderUserStatus();
      toast("Profile photo removed.");
    });

    qs("[data-logout-action]")?.addEventListener("click", async () => {
      const firebaseAuth = await window.WANDERLY_FIREBASE_READY;
      if (firebaseAuth) await firebaseAuth.signOut();
      Store.remove("currentUser");
      toast("Signed out successfully");
      updateHeaderUserStatus();
      setTimeout(() => location.reload(), 300);
    });
  } else {
    container.innerHTML = `
      <div class="flex items-center gap-2">
        <button data-auth-signin-btn class="auth-signin-btn">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
          <span>Sign In</span>
        </button>
        <button data-auth-register-btn class="auth-register-btn">
          <i class="fa-solid fa-user-plus"></i>
          <span>Register</span>
        </button>
      </div>`;

    qs("[data-auth-signin-btn]")?.addEventListener("click", () => openAuthModal(null, "access your account", "login"));
    qs("[data-auth-register-btn]")?.addEventListener("click", () => openAuthModal(null, "create your account", "register"));
  }
}

// Close dropdown on outside click
document.addEventListener("click", (e) => {
  const dropdown = qs("#user-profile-dropdown");
  const btn = qs("#user-profile-menu-btn");
  if (dropdown && !dropdown.contains(e.target) && !btn?.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

// =============================================================================
// 7. BOOKING MODAL & DURATION CALCULATION
// =============================================================================
function openBookingModal(hotelId) {
  requireAccount(() => {
    const hotel = hotelById(hotelId);
    if (!hotel) return;

    let modal = qs("#booking-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "booking-modal";
      document.body.appendChild(modal);
    }

    const closeBooking = () => {
      modal.innerHTML = "";
      document.body.classList.remove("modal-open");
    };

    document.body.classList.add("modal-open");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultCheckOut = new Date(tomorrow);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 4);

    const formatDate = (d) => d.toISOString().split("T")[0];

    const allAmenities = hotel.amenities && hotel.amenities.length > 0
      ? hotel.amenities
      : ["Free High-Speed WiFi", "Outdoor Pool", "Spa & Wellness", "Fine Dining", "Air Conditioning", "Room Service"];

    const amenityIcons = {
      "Pyramids View": "fa-mountain-sun",
      "Outdoor Pool": "fa-person-swimming",
      "Pool": "fa-person-swimming",
      "Spa & Wellness": "fa-spa",
      "Spa": "fa-spa",
      "Fine Dining": "fa-utensils",
      "Free High-Speed WiFi": "fa-wifi",
      "Free WiFi": "fa-wifi",
      "WiFi": "fa-wifi",
      "Beachfront": "fa-umbrella-beach",
      "Sea View": "fa-water",
      "Air Conditioning": "fa-snowflake",
      "Fitness Center": "fa-dumbbell",
      "Breakfast Included": "fa-mug-saucer",
      "Room Service": "fa-bell-concierge"
    };

    modal.innerHTML = `
      <div class="modal-backdrop-custom animate-fade-in" data-booking-backdrop>
        <div class="modal-dialog-custom max-w-2xl p-6 md:p-8">
          
          <!-- Modal Header -->
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <div class="flex items-center gap-2">
                <span class="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-black text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <i class="fa-solid fa-calendar-check mr-1"></i> Reserve Your Stay
                </span>
                ${renderStarIcons(hotel.stars)}
                <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> 100% Verified</span>
              </div>
              <h2 class="mt-2 text-2xl md:text-3xl font-black text-slate-950 dark:text-white">${hotel.name}</h2>
              <div class="mt-1 flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-400">
                <span class="flex items-center gap-1"><i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || hotel.destinationName}</span>
                ${hotel.airportDistance ? `<span class="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-black"><i class="fa-solid fa-plane-departure"></i> ${hotel.airportDistance}</span>` : ""}
              </div>
            </div>
            <button type="button" data-booking-close class="icon-btn shrink-0" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Hotel Highlights Preview -->
          <div class="mt-4 grid gap-3 sm:grid-cols-[140px_1fr] rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <img src="${hotel.image}" class="h-28 w-full rounded-lg object-cover cursor-pointer" alt="${hotel.name}" data-view-gallery-direct="${hotel.id}">
            <div class="flex flex-col justify-between">
              <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-5">${hotel.description}</p>
              
              <!-- Key Amenities Pills -->
              <div class="mt-2.5 flex flex-wrap gap-1.5">
                ${allAmenities.map((a) => {
                  const icon = amenityIcons[a] || "fa-circle-check";
                  return `<span class="amenity-tag text-[11px]"><i class="fa-solid ${icon} text-teal-600 text-[10px]"></i> ${a}</span>`;
                }).join("")}
              </div>

              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs font-black text-amber-500"><i class="fa-solid fa-star"></i> ${hotel.rating} / 5 (${(hotel.reviewsCount || 1400).toLocaleString()} reviews)</span>
                <button type="button" class="text-xs font-black text-teal-600 hover:underline" data-view-gallery-direct="${hotel.id}">
                  <i class="fa-solid fa-images"></i> View All Photos (${(hotel.gallery || []).length})
                </button>
              </div>
            </div>
          </div>

          <!-- Dates & Guests Form -->
          <form data-booking-form class="mt-5 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Check-in Date</label>
                <input type="date" name="checkIn" id="modal-check-in" value="${formatDate(tomorrow)}" min="${formatDate(today)}" required class="field text-sm">
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Check-out Date</label>
                <input type="date" name="checkOut" id="modal-check-out" value="${formatDate(defaultCheckOut)}" min="${formatDate(tomorrow)}" required class="field text-sm">
              </div>
            </div>

            <!-- Stay Duration Display -->
            <div class="flex items-center justify-between rounded-xl bg-teal-50/70 p-3 text-xs font-black text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-moon text-teal-600 text-sm"></i>
                <span>Calculated Duration:</span>
              </span>
              <span id="booking-nights-count" class="text-sm font-black text-teal-700 dark:text-teal-300">4 Nights</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Guests & Rooms</label>
                <select name="travelers" class="field text-sm">
                  <option value="1">1 Adult • 1 Room</option>
                  <option value="2" selected>2 Adults • 1 Room</option>
                  <option value="3">3 Adults • 1 Room</option>
                  <option value="4">4 Adults • 2 Rooms (Family)</option>
                  <option value="6">6+ Travelers (Group)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Room Type</label>
                <select name="roomType" id="modal-room-type" class="field text-sm">
                  <option value="standard" data-mult="1.0">Standard Double Room (${money(hotel.pricePerNight)} / night)</option>
                  <option value="deluxe" data-mult="1.1" selected>Deluxe King Room with View (${money(Math.round(hotel.pricePerNight * 1.1))} / night)</option>
                  <option value="suite" data-mult="1.25">Executive Panoramic Suite (${money(Math.round(hotel.pricePerNight * 1.25))} / night)</option>
                </select>
              </div>
            </div>

            <!-- Price Breakdown Calculation -->
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 space-y-2 text-xs font-bold">
              <div class="flex justify-between text-slate-500 dark:text-slate-400">
                <span id="price-rate-label">${money(Math.round(hotel.pricePerNight * 1.1))} × 4 nights</span>
                <span id="price-subtotal-val" class="font-black text-slate-800 dark:text-slate-100">${money(Math.round(hotel.pricePerNight * 1.1 * 4))}</span>
              </div>
              <div class="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Taxes, city fees & service (12%)</span>
                <span id="price-taxes-val" class="font-black text-slate-800 dark:text-slate-100">${money(Math.round(hotel.pricePerNight * 1.1 * 4 * 0.12))}</span>
              </div>
              <div class="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center text-sm font-black text-slate-950 dark:text-white">
                <span>Total Stay Cost:</span>
                <span id="price-grandtotal-val" class="text-xl text-teal-600 dark:text-teal-300 font-black">${money(Math.round(hotel.pricePerNight * 1.1 * 4 * 1.12))}</span>
              </div>
            </div>

            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" class="btn-primary flex-1 justify-center py-3 text-sm font-black shadow-lg">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Confirm Booking & Generate Itinerary</span>
              </button>
              <button type="button" data-booking-close class="btn-soft py-3 font-bold">Cancel</button>
            </div>
          </form>
        </div>
      </div>`;

    const checkInInput = qs("#modal-check-in", modal);
    const checkOutInput = qs("#modal-check-out", modal);
    const roomTypeSelect = qs("#modal-room-type", modal);
    const nightsCountEl = qs("#booking-nights-count", modal);
    const rateLabel = qs("#price-rate-label", modal);
    const subtotalVal = qs("#price-subtotal-val", modal);
    const taxesVal = qs("#price-taxes-val", modal);
    const grandtotalVal = qs("#price-grandtotal-val", modal);

    const recalculate = () => {
      const d1 = new Date(checkInInput.value);
      const d2 = new Date(checkOutInput.value);
      let diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      if (isNaN(diffDays) || diffDays < 1) diffDays = 1;

      const selectedOpt = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const mult = Number(selectedOpt?.dataset.mult || 1.0);
      const nightlyPrice = Math.round(hotel.pricePerNight * mult);

      nightsCountEl.textContent = `${diffDays} Night${diffDays > 1 ? "s" : ""}`;
      const subtotal = nightlyPrice * diffDays;
      const taxes = Math.round(subtotal * 0.12);
      const grandTotal = subtotal + taxes;

      rateLabel.textContent = `${money(nightlyPrice)} × ${diffDays} nights`;
      subtotalVal.textContent = money(subtotal);
      taxesVal.textContent = money(taxes);
      grandtotalVal.textContent = money(grandTotal);
    };

    checkInInput.addEventListener("change", () => {
      const d1 = new Date(checkInInput.value);
      const d2 = new Date(checkOutInput.value);
      if (d2 <= d1) {
        const nextDay = new Date(d1);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.value = formatDate(nextDay);
      }
      checkOutInput.min = checkInInput.value;
      recalculate();
    });

    checkOutInput.addEventListener("change", recalculate);
    roomTypeSelect.addEventListener("change", recalculate);

    // Direct gallery opener
    qsa("[data-view-gallery-direct]", modal).forEach((b) => {
      b.addEventListener("click", () => {
        closeBooking();
        openHotelGallery(hotel.id);
      });
    });

    // Close buttons & backdrop click
    qsa("[data-booking-close]", modal).forEach((b) => b.addEventListener("click", closeBooking));
    qs("[data-booking-backdrop]", modal)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeBooking();
    });

    // Submit Booking
    qs("[data-booking-form]", modal).addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const d1 = new Date(form.get("checkIn"));
      const d2 = new Date(form.get("checkOut"));
      const days = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      const travelers = Number(form.get("travelers") || 2);
      const roomType = form.get("roomType") || "deluxe";

      const selectedOpt = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const mult = Number(selectedOpt?.dataset.mult || 1.0);
      const finalNightlyPrice = Math.round(hotel.pricePerNight * mult);

      // Save Active Trip to Store (localStorage)
      App.trip = {
        destinationId: hotel.destinationId,
        hotelId: hotel.id,
        checkIn: form.get("checkIn"),
        checkOut: form.get("checkOut"),
        days: days,
        travelers: travelers,
        roomType: roomType,
        nightlyPrice: finalNightlyPrice,
        totalCost: Math.round(finalNightlyPrice * days * 1.12),
        tripType: "Leisure",
        budget: Math.round(finalNightlyPrice * days * 1.5),
        confirmedBooking: true
      };

      // Start with clean, user-controlled itinerary slots (empty days for custom planning)
      initializeTripItinerary(days);

      closeBooking();
      toast(`Booking confirmed at ${hotel.name}! Now customize your daily activities.`, "fa-circle-check");
      setTimeout(() => {
        location.href = "my-trip.html";
      }, 600);
    });
  }, "reserve this hotel and customize your travel schedule");
}

// =============================================================================
// 8. TRIP ITINERARY INITIALIZER & DAY PICKER MODAL
// =============================================================================
function initializeTripItinerary(days = 4) {
  const itinerary = {};
  for (let day = 1; day <= days; day++) {
    itinerary[day] = [];
  }
  App.itinerary = itinerary;
  return itinerary;
}

function openAddToTripModal(placeId) {
  const place = placeById(placeId);
  if (!place) return;

  if (!App.trip) {
    let modal = qs("#add-to-trip-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "add-to-trip-modal";
      document.body.appendChild(modal);
    }
    const closeModal = () => {
      modal.innerHTML = "";
      document.body.classList.remove("modal-open");
    };
    document.body.classList.add("modal-open");
    modal.innerHTML = `
      <div class="modal-backdrop-custom animate-fade-in" data-add-trip-backdrop>
        <div class="modal-dialog-custom max-w-md p-6 sm:p-8 text-center">
          <div class="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
            <i class="fa-solid fa-hotel text-2xl"></i>
          </div>
          <h3 class="text-xl font-black text-slate-950 dark:text-white">Start Your Trip First</h3>
          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            To assign activities to specific days, book a hotel or initialize your trip duration first!
          </p>
          <div class="mt-6 flex flex-col gap-2.5">
            <button type="button" data-go-hotels class="btn-primary justify-center py-3 text-xs font-black">
              <i class="fa-solid fa-hotel mr-1.5"></i> Explore & Book Hotels
            </button>
            <button type="button" data-quick-trip class="btn-soft justify-center py-2.5 text-xs font-bold">
              <i class="fa-solid fa-calendar-days mr-1.5"></i> Quick 4-Day Trip Setup
            </button>
          </div>
        </div>
      </div>`;

    qs("[data-go-hotels]", modal)?.addEventListener("click", () => {
      closeModal();
      location.href = `destination.html?destination=${place.destinationId}&view=hotels`;
    });
    qs("[data-quick-trip]", modal)?.addEventListener("click", () => {
      closeModal();
      const dest = destinationById(place.destinationId);
      const firstHotel = dest?.hotels?.[0];
      App.trip = {
        destinationId: place.destinationId,
        hotelId: firstHotel?.id || "custom-hotel",
        days: 4,
        travelers: 2,
        tripType: "Leisure",
        confirmedBooking: false
      };
      initializeTripItinerary(4);
      openAddToTripModal(placeId);
    });
    qs("[data-add-trip-backdrop]", modal)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    return;
  }

  const daysCount = Math.max(1, App.trip.days || 4);
  const itinerary = App.itinerary || {};
  for (let d = 1; d <= daysCount; d++) {
    if (!itinerary[d]) itinerary[d] = [];
  }

  let currentDay = null;
  for (let d = 1; d <= daysCount; d++) {
    if ((itinerary[d] || []).includes(place.id)) {
      currentDay = String(d);
      break;
    }
  }

  let modal = qs("#add-to-trip-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "add-to-trip-modal";
    document.body.appendChild(modal);
  }

  const closeModal = () => {
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
  };

  document.body.classList.add("modal-open");

  modal.innerHTML = `
    <div class="modal-backdrop-custom animate-fade-in" data-add-trip-backdrop>
      <div class="modal-dialog-custom max-w-lg p-6 sm:p-8">
        
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-xs font-black mb-1.5 border border-teal-500/20">
              <i class="fa-solid fa-calendar-plus"></i> Schedule Activity
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">Choose Itinerary Day</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Which day of your trip would you like to schedule this stop?</p>
          </div>
          <button type="button" data-add-trip-close class="icon-btn shrink-0" aria-label="Close">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Place Preview Card -->
        <div class="mt-4 flex items-center gap-3.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <img src="${place.image}" alt="${place.name}" class="size-16 rounded-xl object-cover shrink-0 shadow-sm">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">${place.category}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span class="text-[11px] font-bold text-amber-500"><i class="fa-solid fa-star text-[10px]"></i> ${place.rating}</span>
            </div>
            <h4 class="truncate text-sm font-black text-slate-950 dark:text-white mt-0.5">${place.name}</h4>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">${money(place.price)} • ${place.durationHours || 2} hours</p>
          </div>
        </div>

        <!-- Day Selection Grid -->
        <div class="mt-5">
          <label class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
            Select Destination Day (${daysCount} Days Total):
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            ${Array.from({ length: daysCount }, (_, i) => i + 1).map((dayNum) => {
              const dStr = String(dayNum);
              const isThisDay = currentDay === dStr;
              const count = (itinerary[dStr] || []).length;
              return `
                <button type="button" data-select-day="${dStr}" class="group text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${isThisDay ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/50 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'}">
                  <div class="flex items-center gap-3">
                    <span class="grid size-9 place-items-center rounded-xl text-xs font-black ${isThisDay ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 group-hover:bg-teal-600 group-hover:text-white transition'}">
                      ${dayNum}
                    </span>
                    <div>
                      <p class="text-xs font-black text-slate-900 dark:text-white">Day ${dayNum}</p>
                      <p class="text-[11px] font-semibold text-slate-400">${count} stop${count === 1 ? '' : 's'} scheduled</p>
                    </div>
                  </div>
                  <span class="text-xs font-black ${isThisDay ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-teal-600'}">
                    ${isThisDay ? '<i class="fa-solid fa-circle-check text-base"></i>' : '<i class="fa-solid fa-plus"></i>'}
                  </span>
                </button>`;
            }).join("")}
          </div>
        </div>

        ${currentDay ? `
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 dark:text-slate-400">Currently scheduled in <strong class="text-teal-600 dark:text-teal-400">Day ${currentDay}</strong></span>
            <button type="button" data-remove-from-trip class="text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer">
              <i class="fa-solid fa-trash text-xs"></i> Remove from trip
            </button>
          </div>
        ` : ""}
      </div>
    </div>`;

  // Bind Close
  qs("[data-add-trip-close]", modal)?.addEventListener("click", closeModal);
  qs("[data-add-trip-backdrop]", modal)?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Bind Day Selection
  qsa("[data-select-day]", modal).forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedDay = btn.dataset.selectDay;

      // Remove from any previous day
      for (let d = 1; d <= daysCount; d++) {
        itinerary[d] = (itinerary[d] || []).filter((id) => id !== place.id);
      }

      // Add to chosen day
      itinerary[selectedDay] = [...(itinerary[selectedDay] || []), place.id];
      App.itinerary = itinerary;

      closeModal();
      toast(`Added "${place.name}" to Day ${selectedDay}!`, "fa-calendar-check");

      // Live UI sync
      if (document.body.dataset.page === "trip") {
        renderItineraryDays();
        const dest = destinationById(App.trip.destinationId);
        renderLocalRecommendationsDrawer(dest);
        updateBudgetWidget();
      } else if (document.body.dataset.page === "destination") {
        qsa(`[data-add-place="${place.id}"]`).forEach((b) => {
          b.innerHTML = `<i class="fa-solid fa-calendar-check text-teal-600 mr-1"></i><span>In Day ${selectedDay}</span>`;
          b.className = "btn-soft py-2 text-xs font-black justify-center text-teal-700 dark:text-teal-300 border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/40";
        });
      }
    });
  });

  // Bind Remove from Trip
  qs("[data-remove-from-trip]", modal)?.addEventListener("click", () => {
    for (let d = 1; d <= daysCount; d++) {
      itinerary[d] = (itinerary[d] || []).filter((id) => id !== place.id);
    }
    App.itinerary = itinerary;
    closeModal();
    toast(`Removed "${place.name}" from trip`);

    if (document.body.dataset.page === "trip") {
      renderItineraryDays();
      const dest = destinationById(App.trip.destinationId);
      renderLocalRecommendationsDrawer(dest);
      updateBudgetWidget();
    } else if (document.body.dataset.page === "destination") {
      qsa(`[data-add-place="${place.id}"]`).forEach((b) => {
        b.innerHTML = `<i class="fa-solid fa-plus mr-1"></i><span>Add to Trip</span>`;
        b.className = "btn-primary py-2 text-xs font-black justify-center";
      });
    }
  });
}

// =============================================================================
// 9. HIGH-RESOLUTION PHOTO GALLERY & LIGHTBOX
// =============================================================================
function openHotelGallery(hotelId, initialIndex = 0, initialCategory = "all") {
  const hotel = hotelById(hotelId);
  if (!hotel) return;

  const gallery = hotel.gallery && hotel.gallery.length > 0
    ? hotel.gallery
    : [{ url: hotel.image, caption: hotel.name }];

  let modal = qs("#gallery-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "gallery-modal";
    document.body.appendChild(modal);
  }

  const closeGallery = () => {
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", keyHandler);
  };

  document.body.classList.add("modal-open");
  let currentIndex = initialIndex;

  const render = (idx) => {
    currentIndex = (idx + gallery.length) % gallery.length;
    const currentPhoto = gallery[currentIndex];

    modal.innerHTML = `
      <div class="modal-backdrop-custom flex-col justify-between p-4 md:p-8 animate-fade-in" data-gallery-backdrop>
        
        <!-- Top Bar -->
        <div class="w-full max-w-5xl flex items-center justify-between text-white pb-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> Verified Real Photos</span>
              <span class="text-xs text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                ${currentIndex + 1} of ${gallery.length}
              </span>
            </div>
            <h3 class="text-lg md:text-xl font-black mt-1 text-white">${hotel.name}</h3>
          </div>
          <div class="flex items-center gap-2.5">
            <button type="button" data-gallery-book class="btn-primary py-2 px-4 text-xs font-black">
              <i class="fa-solid fa-calendar-check"></i> Book This Stay
            </button>
            <button type="button" data-gallery-close class="icon-btn bg-white/10 text-white border-white/20 hover:bg-white/20" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Main Photo & Controls -->
        <div class="relative w-full max-w-5xl flex-1 flex items-center justify-center my-3 overflow-hidden select-none">
          <button type="button" data-prev class="absolute left-2 md:left-4 z-10 size-12 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center hover:bg-teal-600 hover:border-teal-500 transition shadow-xl" aria-label="Previous photo">
            <i class="fa-solid fa-chevron-left text-lg"></i>
          </button>

          <img src="${currentPhoto.url}" alt="${currentPhoto.caption || hotel.name}" class="max-h-[68vh] max-w-full rounded-2xl object-contain shadow-2xl transition duration-300">

          <button type="button" data-next class="absolute right-2 md:right-4 z-10 size-12 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center hover:bg-teal-600 hover:border-teal-500 transition shadow-xl" aria-label="Next photo">
            <i class="fa-solid fa-chevron-right text-lg"></i>
          </button>
        </div>

        <!-- Caption & Thumbnails -->
        <div class="w-full max-w-3xl flex flex-col items-center gap-2.5">
          <p class="text-xs sm:text-sm font-bold text-slate-200 text-center">${currentPhoto.caption || hotel.name}</p>
          
          <div class="gallery-thumbnail-strip max-w-2xl px-2">
            ${gallery.map((img, i) => `
              <button type="button" data-thumb="${i}" class="gallery-thumb-btn ${i === currentIndex ? 'active-thumb' : 'opacity-60 hover:opacity-100'}">
                <img src="${img.url}" alt="${img.caption || hotel.name}">
              </button>
            `).join("")}
          </div>
        </div>
      </div>`;

    qs("[data-gallery-close]", modal)?.addEventListener("click", closeGallery);
    qs("[data-prev]", modal)?.addEventListener("click", () => render(currentIndex - 1));
    qs("[data-next]", modal)?.addEventListener("click", () => render(currentIndex + 1));
    qs("[data-gallery-book]", modal)?.addEventListener("click", () => {
      closeGallery();
      openBookingModal(hotel.id);
    });

    qs("[data-gallery-backdrop]", modal)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeGallery();
    });

    qsa("[data-thumb]", modal).forEach((btn) => {
      btn.addEventListener("click", () => render(Number(btn.dataset.thumb)));
    });
  };

  render(initialIndex);

  // Keyboard navigation
  const keyHandler = (e) => {
    if (!modal.innerHTML) {
      document.removeEventListener("keydown", keyHandler);
      return;
    }
    if (e.key === "ArrowLeft") render(currentIndex - 1);
    if (e.key === "ArrowRight") render(currentIndex + 1);
    if (e.key === "Escape") closeGallery();
  };
  document.addEventListener("keydown", keyHandler);
}

// =============================================================================
// 10. VERIFIED GUEST REVIEWS & VISITOR PHOTOS
// =============================================================================
function openHotelReviews(hotelId) {
  const hotel = hotelById(hotelId);
  if (!hotel) return;

  const defaultReviews = hotel.verifiedReviews || [];
  const customReviews = (App.reviews[hotelId] ? [App.reviews[hotelId]] : []);
  const allReviewsList = [...customReviews, ...defaultReviews];

  // Collect separately sourced community photographs attached to reviews.
  const visitorPhotos = allReviewsList.flatMap((r) => (r.photos || []).map((p) => ({ url: p, reviewer: r.name, caption: `Community photo of ${hotel.name}` })));

  let modal = qs("#reviews-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reviews-modal";
    document.body.appendChild(modal);
  }

  const closeReviews = () => {
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
  };

  document.body.classList.add("modal-open");

  modal.innerHTML = `
    <div class="modal-backdrop-custom animate-fade-in" data-reviews-backdrop>
      <div class="modal-dialog-custom max-w-3xl p-6 md:p-8 my-8">
        
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> 100% Verified Guest Stays</span>
              ${renderStarIcons(hotel.stars)}
            </div>
            <h2 class="mt-2 text-3xl font-black text-slate-950 dark:text-white">${hotel.name}</h2>
            <p class="text-sm font-bold text-slate-500 mt-1">
              ⭐ <strong>${hotel.rating} / 5</strong> score based on ${(hotel.reviewsCount || 1420).toLocaleString()} verified reviews
            </p>
          </div>
          <button type="button" data-reviews-close class="icon-btn shrink-0" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Trust Score Breakdown -->
        <div class="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Authentic Rating Breakdown</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
            <div>
              <div class="flex justify-between mb-1.5"><span>Cleanliness</span><b class="text-teal-600">4.9</b></div>
              <div class="trust-score-bar"><div class="trust-score-fill" style="width: 98%"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1.5"><span>Location</span><b class="text-teal-600">4.9</b></div>
              <div class="trust-score-bar"><div class="trust-score-fill" style="width: 98%"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1.5"><span>Service</span><b class="text-teal-600">4.8</b></div>
              <div class="trust-score-bar"><div class="trust-score-fill" style="width: 96%"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1.5"><span>Value</span><b class="text-teal-600">4.7</b></div>
              <div class="trust-score-bar"><div class="trust-score-fill" style="width: 94%"></div></div>
            </div>
          </div>
        </div>

        <!-- Community-contributed property photos -->
        ${visitorPhotos.length > 0 ? `
          <div class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-camera text-teal-600"></i> Real Community Photos of This Property (${visitorPhotos.length})
              </h4>
            </div>
            <div class="visitor-photo-grid">
              ${visitorPhotos.map((photo) => `
                <div class="visitor-photo-item" data-visitor-photo="${photo.url}">
                  <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Action Bar: Add Review & Reserve -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 py-4 dark:border-slate-800">
          <button type="button" data-write-review class="btn-soft font-black text-xs">
            <i class="fa-solid fa-pen-to-square text-teal-600"></i> Write a Verified Review
          </button>
          <button type="button" data-book-hotel-now="${hotel.id}" class="btn-primary text-xs font-black">
            <i class="fa-solid fa-calendar-check"></i> Book Stay at this Hotel
          </button>
        </div>

        <!-- Review Cards List -->
        <div class="mt-6 space-y-4">
          ${allReviewsList.map((rev) => `
            <article class="review-card space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img src="${rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" class="size-10 rounded-full object-cover border border-slate-200 dark:border-slate-700">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-black text-slate-950 dark:text-white">${rev.name}</h4>
                      <span class="verified-badge"><i class="fa-solid fa-check text-[9px]"></i> Verified Stay</span>
                    </div>
                    <p class="text-xs text-slate-400 font-semibold">${rev.date || 'August 2026'} • Stayed with partner</p>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-amber-500 font-black text-xs">
                  <i class="fa-solid fa-star"></i>
                  <span>${rev.rating}.0 / 5</span>
                </div>
              </div>

              ${rev.title ? `<h5 class="text-sm font-black text-slate-900 dark:text-white">${rev.title}</h5>` : ""}
              <p class="text-xs leading-5 text-slate-600 dark:text-slate-300">${rev.comment || rev.note}</p>

              <!-- Attached visitor photos if any -->
              ${rev.photos && rev.photos.length > 0 ? `
                <div class="flex gap-2 pt-1">
                  ${rev.photos.map((p) => `
                    <div class="size-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer hover:scale-105 transition" data-visitor-photo="${p}">
                      <img src="${p}" class="size-full object-cover">
                    </div>
                  `).join("")}
                </div>
              ` : ""}

              <!-- Helpful vote counter -->
              <div class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400">
                <span>Was this review helpful?</span>
                <button type="button" data-helpful="${rev.id || rev.name}" class="btn-soft py-1 px-2.5 text-[11px]">
                  <i class="fa-regular fa-thumbs-up"></i>
                  <span>Helpful (${App.helpfulVotes[rev.id || rev.name] || 12})</span>
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </div>`;

  qs("[data-reviews-close]", modal)?.addEventListener("click", closeReviews);
  qs("[data-reviews-backdrop]", modal)?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeReviews();
  });

  // Book now trigger
  qs(`[data-book-hotel-now="${hotel.id}"]`, modal)?.addEventListener("click", () => {
    closeReviews();
    openBookingModal(hotel.id);
  });

  // Write review trigger
  qs("[data-write-review]", modal)?.addEventListener("click", () => {
    closeReviews();
    openWriteReviewModal(hotel.id);
  });

  // Click on visitor photo to open lightbox
  qsa("[data-visitor-photo]", modal).forEach((item) => {
    item.addEventListener("click", () => {
      const url = item.dataset.visitorPhoto;
      openPhotoModalDirect(url, `${hotel.name} - Visitor Photo`);
    });
  });

  // Helpful votes
  qsa("[data-helpful]", modal).forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.helpful;
      const votes = App.helpfulVotes;
      votes[id] = (votes[id] || 12) + 1;
      App.helpfulVotes = votes;
      btn.innerHTML = `<i class="fa-solid fa-thumbs-up text-teal-600"></i> <span>Helpful (${votes[id]})</span>`;
      toast("Thank you for your feedback!");
    });
  });
}

function openPhotoModalDirect(url, caption = "") {
  let modal = qs("#direct-photo-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "direct-photo-modal";
    document.body.appendChild(modal);
  }
  const closePhoto = () => {
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
  };
  document.body.classList.add("modal-open");
  modal.innerHTML = `
    <div class="modal-backdrop-custom flex-col items-center justify-center p-4 animate-fade-in" data-direct-backdrop>
      <button type="button" data-direct-photo-close class="absolute top-6 right-6 icon-btn bg-white/10 text-white border-white/20 hover:bg-white/20">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <img src="${url}" class="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl">
      <p class="mt-4 text-sm font-bold text-white">${caption}</p>
    </div>`;
  qs("[data-direct-photo-close]", modal)?.addEventListener("click", closePhoto);
  qs("[data-direct-backdrop]", modal)?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closePhoto();
  });
}

function openWriteReviewModal(hotelId) {
  requireAccount(() => {
    const hotel = hotelById(hotelId);
    if (!hotel) return;

    let modal = qs("#write-review-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "write-review-modal";
      document.body.appendChild(modal);
    }

    const closeWrite = () => {
      modal.innerHTML = "";
      document.body.classList.remove("modal-open");
    };

    document.body.classList.add("modal-open");

    modal.innerHTML = `
      <div class="modal-backdrop-custom animate-fade-in" data-write-backdrop>
        <div class="modal-dialog-custom max-w-lg p-6 my-8">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <p class="text-xs font-black uppercase text-teal-600">Verified Experience</p>
              <h3 class="text-2xl font-black text-slate-950 dark:text-white mt-1">Review ${hotel.name}</h3>
            </div>
            <button type="button" data-write-review-close class="icon-btn shrink-0" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form data-review-submit-form class="mt-5 space-y-4">
            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Overall Rating</label>
              <div class="flex items-center gap-3">
                <input type="range" name="rating" min="1" max="5" value="5" id="review-star-slider" class="w-full accent-teal-600">
                <span id="review-star-val" class="text-sm font-black text-amber-500 min-w-[50px]">5.0 ⭐</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Review Title</label>
              <input name="title" required placeholder="e.g. Unbelievable sunset views and royal hospitality" class="field text-sm">
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Your Detailed Experience</label>
              <textarea name="comment" required rows="4" placeholder="Tell other travelers about the room cleanliness, staff friendliness, breakfast quality, and proximity to attractions..." class="field text-sm"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Trip Type</label>
                <select name="tripType" class="field text-xs">
                  <option>Couple Vacation</option>
                  <option>Family with Kids</option>
                  <option>Solo Traveler</option>
                  <option>Friends Getaway</option>
                  <option>Business Trip</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Attach Real Photo</label>
                <input type="file" accept="image/*" class="field text-xs cursor-pointer">
              </div>
            </div>

            <button type="submit" class="btn-primary mt-2 w-full justify-center py-3">
              <i class="fa-solid fa-paper-plane"></i>
              <span>Publish Verified Review</span>
            </button>
          </form>
        </div>
      </div>`;

    const slider = qs("#review-star-slider", modal);
    const starVal = qs("#review-star-val", modal);
    slider.addEventListener("input", () => {
      starVal.textContent = `${slider.value}.0 ⭐`;
    });

    qs("[data-write-review-close]", modal)?.addEventListener("click", closeWrite);
    qs("[data-write-backdrop]", modal)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeWrite();
    });

    qs("[data-review-submit-form]", modal)?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const user = App.currentUser || { name: "Verified Traveler" };

      const newReview = {
        id: `rev-${Date.now()}`,
        name: user.name,
        avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        rating: Number(form.get("rating")),
        title: form.get("title"),
        comment: form.get("comment"),
        date: "Just now",
        verified: true,
        photos: [
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        ]
      };

      App.reviews = { ...App.reviews, [hotelId]: newReview };
      closeWrite();
      toast("Thank you! Your verified review has been published.", "fa-circle-check");
      openHotelReviews(hotelId);
    });
  }, "submit a verified guest review with photos");
}

// =============================================================================
// 11. HOTEL & PLACE CARD RENDERING
// =============================================================================
function hotelCard(hotel, actions = true, referencePlace = null, allDestinationHotels = null) {
  const isSelected = App.trip && App.trip.hotelId === hotel.id;
  const isSaved = (App.favoriteHotels || []).includes(hotel.id);
  const proximity = getHotelProximityInfo(hotel, referencePlace);
  const recType = getHotelRecommendationType(hotel, allDestinationHotels || destinationHotels(hotel.destinationId));
  const amenitiesList = (hotel.amenities || []).slice(0, 3);

  return `
    <article class="hotel-card group flex flex-col h-full ${isSelected ? "is-selected ring-2 ring-teal-500" : ""}">
      ${isSelected ? `<span class="selected-hotel-ribbon"><i class="fa-solid fa-check"></i> Selected Hotel</span>` : ""}
      
      <!-- Top Image & Badges -->
      <div class="relative h-56 w-full shrink-0 overflow-hidden cursor-pointer" data-view-gallery="${hotel.id}">
        <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" src="${hotel.image}" alt="${hotel.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';">
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
        
        <!-- Star rating badge -->
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          <span class="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-black text-white backdrop-blur-md">
            ${renderStarIcons(hotel.stars)}
          </span>
        </div>

        <!-- Verified badge -->
        <div class="absolute top-3 left-3">
          <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> Verified</span>
        </div>

        <!-- Price Tag -->
        <span class="hotel-price-tag absolute bottom-3 right-3">
          <span class="price-num" data-usd="${hotel.pricePerNight}">${money(hotel.pricePerNight)}</span>
          <span class="price-unit">/ night</span>
        </span>

        <!-- Gallery Count Pill -->
        <span class="absolute bottom-3 left-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-md hover:bg-teal-600 transition">
          <i class="fa-solid fa-images mr-1"></i> ${(hotel.gallery || []).length} Photos
        </span>
      </div>

      <!-- Card Body -->
      <div class="flex flex-1 flex-col p-5 justify-between">
        <div class="flex-1 flex flex-col">
          
          <!-- Recommendation badge if matched -->
          ${recType ? `<div class="mb-2">${renderRecommendationBadge(recType)}</div>` : ""}

          <h3 class="text-lg font-black text-slate-950 dark:text-white line-clamp-1">${hotel.name}</h3>
          
          <p class="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-400">
            <i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || hotel.destinationName}
          </p>
          
          <!-- Proximity & Airport Badges -->
          <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span class="proximity-badge">
              <i class="fa-solid fa-route"></i> ${proximity.label}
            </span>
            ${hotel.airportDistance ? `
            <span class="rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 px-2 py-0.5 text-[11px] font-black text-sky-700 dark:text-sky-300 flex items-center gap-1.5 shadow-sm">
              <i class="fa-solid fa-plane-departure text-sky-500"></i> ${hotel.airportDistance}
            </span>` : ""}
          </div>

          <p class="mt-2.5 text-xs leading-5 text-slate-600 dark:text-slate-300 line-clamp-2">${hotel.description}</p>
          
          <!-- Amenities -->
          <div class="mt-3 flex flex-wrap gap-1.5">
            ${amenitiesList.map((a) => `<span class="amenity-tag"><i class="fa-solid fa-circle-check text-teal-600 text-[9px]"></i> ${a}</span>`).join("")}
          </div>
        </div>

        <!-- Card Footer -->
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <button type="button" data-view-reviews="${hotel.id}" class="text-amber-500 font-black hover:underline flex items-center gap-1">
              <i class="fa-solid fa-star"></i> ${hotel.rating} / 5 
              <span class="text-slate-400 font-semibold underline ml-1">(${(hotel.reviewsCount || 1200).toLocaleString()} reviews)</span>
            </button>
            <span class="text-teal-600 font-black text-[11px]"><i class="fa-solid fa-shield-halved"></i> Best Rate Guaranteed</span>
          </div>

          ${actions ? `
            <div class="grid grid-cols-2 gap-2">
              <button class="btn-primary py-2.5 text-xs font-black justify-center" data-book-hotel="${hotel.id}">
                <i class="fa-solid fa-calendar-check"></i>
                <span>${isSelected ? "Manage Stay" : "Book / Reserve"}</span>
              </button>
              <button class="btn-soft py-2.5 text-xs font-black justify-center" data-fav-hotel="${hotel.id}">
                <i class="fa-solid ${isSaved ? "fa-heart text-rose-500" : "fa-heart"}"></i>
                <span>${isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>
          ` : ""}
        </div>
      </div>
    </article>`;
}

function placeCard(place, actions = true) {
  const isSaved = (App.favorites || []).includes(place.id);
  const itinerary = App.itinerary || {};
  let currentDay = null;
  for (const d of Object.keys(itinerary)) {
    if ((itinerary[d] || []).includes(place.id)) {
      currentDay = d;
      break;
    }
  }
  const isScheduled = !!currentDay;

  const typeIcons = {
    landmark: "fa-landmark text-teal-600",
    restaurant: "fa-utensils text-amber-500",
    activity: "fa-compass text-sky-500"
  };
  const iconClass = typeIcons[place.type] || "fa-landmark text-teal-600";

  return `
    <article class="place-card group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div class="relative h-48 w-full shrink-0 overflow-hidden">
        <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" src="${place.image}" alt="${place.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80';">
        <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        <span class="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-900 shadow-md backdrop-blur-md">
          <i class="fa-solid ${iconClass} mr-1"></i> ${place.category}
        </span>
        <span class="absolute bottom-3 right-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur-md">
          <span data-usd="${place.price}">${money(place.price)}</span>
        </span>
      </div>
      
      <div class="flex flex-1 flex-col p-5 justify-between">
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-base font-black text-slate-950 dark:text-white line-clamp-1">${place.name}</h3>
            <span class="shrink-0 text-xs font-black text-amber-500"><i class="fa-solid fa-star mr-0.5"></i>${place.rating}</span>
          </div>
          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">${place.description}</p>
          <div class="mt-3 flex items-center gap-3 text-xs font-bold text-slate-400">
            <span><i class="fa-regular fa-clock mr-1"></i> ${place.durationHours || 2}h</span>
            <span><i class="fa-solid fa-sun mr-1"></i> ${place.timeOfDay || "Anytime"}</span>
          </div>
        </div>

        ${actions ? `
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button class="${isScheduled ? 'btn-soft text-teal-700 dark:text-teal-300 border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/40' : 'btn-primary'} py-2 text-xs font-black justify-center" data-add-place="${place.id}">
              <i class="fa-solid ${isScheduled ? 'fa-calendar-check text-teal-600' : 'fa-plus'}"></i>
              <span>${isScheduled ? `In Day ${currentDay}` : 'Add to Trip'}</span>
            </button>
            <button class="btn-soft py-2 text-xs font-black justify-center" data-fav-place="${place.id}">
              <i class="fa-solid ${isSaved ? "fa-heart text-rose-500" : "fa-heart"}"></i>
              <span>${isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        ` : ""}
      </div>
    </article>`;
}

function bindActionHandlers(root = document) {
  // Booking hotel
  qsa("[data-book-hotel]", root).forEach((btn) => {
    btn.addEventListener("click", () => openBookingModal(btn.dataset.bookHotel));
  });

  // View hotel photo gallery
  qsa("[data-view-gallery]", root).forEach((el) => {
    el.addEventListener("click", () => openHotelGallery(el.dataset.viewGallery));
  });

  // View hotel reviews
  qsa("[data-view-reviews]", root).forEach((el) => {
    el.addEventListener("click", () => openHotelReviews(el.dataset.viewReviews));
  });

  // Toggle Favorite Hotel
  qsa("[data-fav-hotel]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      requireAccount(() => {
        const id = btn.dataset.favHotel;
        let favs = App.favoriteHotels || [];
        const isSaved = favs.includes(id);
        if (isSaved) {
          favs = favs.filter((x) => x !== id);
          toast("Hotel removed from favorites", "fa-heart-crack");
        } else {
          favs = [...favs, id];
          toast("Hotel saved to your favorites!", "fa-heart");
        }
        App.favoriteHotels = favs;

        // Instant In-Place UI Update across all matching buttons
        qsa(`[data-fav-hotel="${id}"]`).forEach((b) => {
          const icon = b.querySelector("i");
          const label = b.querySelector("span");
          const nowSaved = favs.includes(id);
          if (icon) icon.className = `fa-solid ${nowSaved ? "fa-heart text-rose-500" : "fa-heart"}`;
          if (label) label.textContent = nowSaved ? "Saved" : "Save";
        });

        if (document.body.dataset.page === "favorites") initFavorites();
      }, "save hotels to your favorites list");
    });
  });

  // Add Place to Trip with Day Selector Modal
  qsa("[data-add-place]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      requireAccount(() => {
        const id = btn.dataset.addPlace;
        openAddToTripModal(id);
      }, "add activities to your custom trip schedule");
    });
  });

  // Toggle Favorite Place
  qsa("[data-fav-place]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      requireAccount(() => {
        const id = btn.dataset.favPlace;
        let favs = App.favorites || [];
        const isSaved = favs.includes(id);
        if (isSaved) {
          favs = favs.filter((x) => x !== id);
          toast("Place removed from favorites", "fa-heart-crack");
        } else {
          favs = [...favs, id];
          toast("Place saved to your favorites!", "fa-heart");
        }
        App.favorites = favs;

        // Instant In-Place UI Update
        qsa(`[data-fav-place="${id}"]`).forEach((b) => {
          const icon = b.querySelector("i");
          const label = b.querySelector("span");
          const nowSaved = favs.includes(id);
          if (icon) icon.className = `fa-solid ${nowSaved ? "fa-heart text-rose-500" : "fa-heart"}`;
          if (label) label.textContent = nowSaved ? "Saved" : "Save";
        });

        if (document.body.dataset.page === "favorites") initFavorites();
      }, "save places to your favorites");
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// =============================================================================
// 12. SHELL, NAVBAR & MOBILE BOTTOM NAVIGATION
// =============================================================================
function renderNavbar(activePage = (document.body?.dataset?.page || "home")) {
  const currentCurr = App.currency || "USD";
  const showCurrency = (activePage === "destination" || activePage === "planner");
  return `
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 shadow-sm transition-colors duration-200">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <a href="index.html" class="flex items-center gap-3 text-xl font-black text-slate-950 dark:text-white group">
          <span class="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 text-white shadow-md group-hover:scale-105 transition">
            <i class="fa-solid fa-compass"></i>
          </span>
          <span class="tracking-tight">Wanderly</span>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden items-center gap-1 md:flex">
          <a class="nav-link" href="index.html">Home</a>
          <a class="nav-link" href="destination.html">Destinations & Hotels</a>
          <a class="nav-link" href="planner.html">Planner</a>
          <a class="nav-link" href="my-trip.html">My Itinerary</a>
          <a class="nav-link" href="favorites.html">Favorites</a>
          <a class="nav-link" href="summary.html">Summary</a>
        </div>

        <!-- Controls: Currency (on Destination and Planner), Auth, Theme -->
        <div class="flex items-center gap-2.5">
          ${showCurrency ? `
          <!-- Currency Selector Dropdown (Shown on Destination & Booking pages) -->
          <div class="relative flex items-center">
            <label for="nav-currency-select" class="sr-only">Currency</label>
            <div class="relative flex items-center">
              <i class="fa-solid fa-coins absolute left-2.5 text-teal-600 text-xs pointer-events-none"></i>
              <select id="nav-currency-select" data-currency class="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 text-xs font-black text-slate-800 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 cursor-pointer transition shadow-sm">
                <option value="USD" ${currentCurr === "USD" ? "selected" : ""}>USD ($)</option>
                <option value="EGP" ${currentCurr === "EGP" ? "selected" : ""}>EGP (E£)</option>
                <option value="EUR" ${currentCurr === "EUR" ? "selected" : ""}>EUR (€)</option>
              </select>
            </div>
          </div>` : ""}

          <!-- Auth Status Container -->
          <div id="header-auth-container"></div>

          <!-- Dark Mode Toggle -->
          <button data-theme-toggle class="icon-btn size-9" aria-label="Toggle Dark Mode">
            <i class="fa-solid fa-moon text-slate-700 dark:text-slate-300"></i>
          </button>
        </div>
      </nav>
    </header>`;
}

function renderMobileBottomNav(activePage = "home") {
  return `
    <nav id="mobile-bottom-nav">
      <div class="grid grid-cols-5 py-1">
        <a href="index.html" class="mobile-nav-item ${activePage === "home" ? "active-mobile-tab" : ""}">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </a>
        <a href="destination.html" class="mobile-nav-item ${activePage === "destination" ? "active-mobile-tab" : ""}">
          <i class="fa-solid fa-map-location-dot"></i>
          <span>Explore</span>
        </a>
        <a href="my-trip.html" class="mobile-nav-item ${activePage === "trip" ? "active-mobile-tab" : ""}">
          <i class="fa-solid fa-route"></i>
          <span>Itinerary</span>
        </a>
        <a href="favorites.html" class="mobile-nav-item ${activePage === "favorites" ? "active-mobile-tab" : ""}">
          <i class="fa-solid fa-heart"></i>
          <span>Favorites</span>
        </a>
        <button type="button" data-mobile-profile-btn class="mobile-nav-item">
          <i class="fa-solid fa-user"></i>
          <span>Account</span>
        </button>
      </div>
    </nav>`;
}

function renderFooter() {
  return `
    <footer class="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 mt-16">
      <div class="mx-auto flex flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between max-w-7xl">
        <div class="max-w-md">
          <div class="flex items-center gap-2.5 text-lg font-black">
            <span class="grid size-8 place-items-center rounded-xl bg-teal-600 text-white"><i class="fa-solid fa-compass text-xs"></i></span>
            <span>Wanderly Platform</span>
          </div>
          <p class="mt-2.5 text-xs leading-6 text-slate-500">
            Premium hotel booking and automated travel itinerary planning. Explore authentic Egyptian governorates (سياحة داخلية) and premier global destinations with verified reviews and live currency conversion.
          </p>
        </div>
        <div class="flex flex-wrap gap-6 text-xs font-black text-slate-600 dark:text-slate-300">
          <a href="destination.html?scope=domestic" class="hover:text-teal-600">Inside Egypt (سياحة داخلية)</a>
          <a href="destination.html?scope=international" class="hover:text-teal-600">Outside Egypt (سياحة خارجية)</a>
          <a href="planner.html" class="hover:text-teal-600">Trip Planner</a>
          <a href="my-trip.html" class="hover:text-teal-600">Automated Itinerary</a>
          <a href="favorites.html" class="hover:text-teal-600">Saved Items</a>
        </div>
      </div>
      <div class="mx-auto max-w-7xl px-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-center text-[11px] font-bold text-slate-400">
        © 2026 Wanderly Inc. All rights reserved. 100% Verified Properties & Authenticity Guaranteed.
      </div>
    </footer>`;
}

function injectShell() {
  const page = document.body.dataset.page || "home";
  const header = qs("#site-header");
  const foot = qs("#site-footer");
  
  if (header) header.innerHTML = renderNavbar(page);
  if (foot) foot.innerHTML = renderFooter();

  // Inject mobile bottom nav
  let mobileNav = qs("#mobile-bottom-nav");
  if (!mobileNav) {
    const wrap = document.createElement("div");
    wrap.innerHTML = renderMobileBottomNav(page);
    document.body.appendChild(wrap.firstElementChild);
  }

  // Active nav link highlight
  qsa(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && location.pathname.endsWith(href)) {
      link.classList.add("active-nav");
    }
  });

  // Bind Currency Selector and initialize with current value
  qsa("[data-currency]").forEach((sel) => {
    sel.value = App.currency || "USD";
    sel.addEventListener("change", () => setAppCurrency(sel.value));
  });

  // Bind Mobile Profile Button
  qs("[data-mobile-profile-btn]")?.addEventListener("click", () => {
    if (App.currentUser) {
      toast(`Signed in as ${App.currentUser.name}`);
      location.href = "my-trip.html";
    } else {
      openAuthModal();
    }
  });

  // Theme Toggles
  bindThemeControls();
  updateHeaderUserStatus();
}

function bindThemeControls() {
  const isDark = Store.get("darkMode", false);
  if (isDark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");

  qsa("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.documentElement.classList.add("theme-transitioning");
      const current = document.documentElement.classList.contains("dark");
      const next = !current;
      Store.set("darkMode", next);
      if (next) {
        document.documentElement.classList.add("dark");
        toast("Dark theme enabled", "fa-moon");
      } else {
        document.documentElement.classList.remove("dark");
        toast("Light theme enabled", "fa-sun");
      }
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 250);
    });
  });
}

// =============================================================================
// 13. MAP RENDERING (LEAFLET)
// =============================================================================
function renderMap(destination, places = [], hotels = [], id = "destination-map") {
  const container = qs(`#${id}`);
  if (!container) return;

  if (!window.L) {
    console.warn("Leaflet library not found on window");
    return;
  }

  // 1. Clean up previous map instance & leaflet container ID to prevent "Map container is already initialized" crash
  if (window.__wanderlyMap) {
    try {
      window.__wanderlyMap.off();
      window.__wanderlyMap.remove();
    } catch (e) {
      console.warn("Error removing previous map:", e);
    }
    window.__wanderlyMap = null;
  }

  if (container._leaflet_id) {
    container._leaflet_id = null;
  }

  // 2. Resolve destination coordinates with safe fallbacks
  const lat = Number(destination?.lat) || 30.0444;
  const lng = Number(destination?.lng) || 31.2357;

  // 3. Initialize Leaflet Map
  const map = L.map(id, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  }).setView([lat, lng], 12);

  window.__wanderlyMap = map;

  // 4. Ultra-reliable High-Definition Street Map (Esri World Street Map) - 100% Free, No API Key, No Watermark
  const tileLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, METI, TomTom',
    maxZoom: 19
  });

  tileLayer.addTo(map);

  // 5. Custom Map Pins
  const placeIcon = L.divIcon({
    className: "custom-place-pin",
    html: `<div class="grid place-items-center size-8 rounded-full bg-teal-600 text-white shadow-lg border-2 border-white"><i class="fa-solid fa-landmark text-xs"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const restaurantIcon = L.divIcon({
    className: "custom-rest-pin",
    html: `<div class="grid place-items-center size-8 rounded-full bg-amber-500 text-white shadow-lg border-2 border-white"><i class="fa-solid fa-utensils text-xs"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const hotelIcon = L.divIcon({
    className: "custom-hotel-pin",
    html: `<div class="grid place-items-center size-8 rounded-full bg-sky-600 text-white shadow-lg border-2 border-white"><i class="fa-solid fa-hotel text-xs"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const bounds = [[lat, lng]];

  // Places markers
  (places || []).forEach((p) => {
    if (p.lat && p.lng) {
      bounds.push([p.lat, p.lng]);
      const icon = p.category === "Dining" ? restaurantIcon : placeIcon;
      L.marker([p.lat, p.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <b class="text-sm text-slate-900 font-black">${p.name}</b>
            <p class="text-xs text-slate-500 mt-0.5">${p.category} • ${money(p.price)}</p>
          </div>`);
    }
  });

  // Hotel markers
  (hotels || []).forEach((h) => {
    if (h.lat && h.lng) {
      bounds.push([h.lat, h.lng]);
      L.marker([h.lat, h.lng], { icon: hotelIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <div class="flex items-center gap-1">${renderStarIcons(h.stars)}</div>
            <b class="text-sm text-slate-900 font-black mt-1 block">${h.name}</b>
            <p class="text-xs text-teal-700 font-bold mt-0.5">${money(h.pricePerNight)} / night</p>
            <button class="mt-2 text-xs font-black text-teal-600 underline cursor-pointer" onclick="window.__openBookingDirect('${h.id}')">Book Stay</button>
          </div>`);
    }
  });

  window.__openBookingDirect = (hid) => openBookingModal(hid);

  if (bounds.length > 1) {
    try {
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });
    } catch (e) {}
  }

  // 6. Force Leaflet to invalidate size and redraw tiles after layout settles
  setTimeout(() => { if (window.__wanderlyMap) window.__wanderlyMap.invalidateSize(); }, 100);
  setTimeout(() => { if (window.__wanderlyMap) window.__wanderlyMap.invalidateSize(); }, 350);
  setTimeout(() => { if (window.__wanderlyMap) window.__wanderlyMap.invalidateSize(); }, 700);
}

// =============================================================================
// 14. PAGE INITIALIZERS
// =============================================================================

// --- A. HOME PAGE ---
function initHome() {
  const egyptDestinations = App.data.destinations.filter((d) => d.country === "Egypt");
  const intlDestinations = App.data.destinations.filter((d) => d.country !== "Egypt");

  const destinationGrid = qs("#destination-grid");
  const emptyState = qs("#destination-empty");
  const countBadge = qs("#destination-count-badge");
  const searchInput = qs("#home-dest-search");
  const filterTabs = qsa(".dest-filter-tab");

  let currentScope = "all";
  let currentSearch = "";

  const renderGrid = () => {
    let list = App.data.destinations;
    if (currentScope === "domestic") list = egyptDestinations;
    else if (currentScope === "international") list = intlDestinations;

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q));
    }

    if (countBadge) countBadge.textContent = `${list.length} destinations`;

    if (list.length === 0) {
      if (destinationGrid) destinationGrid.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");
    if (destinationGrid) {
      destinationGrid.innerHTML = list.map((dest) => `
        <a href="destination.html?destination=${dest.id}" class="destination-card group">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy">
          <div class="destination-card__shade">
            <div class="flex items-center justify-between">
              <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur-md">
                ${dest.country === "Egypt" ? "🇪🇬 Inside Egypt" : `🌍 ${dest.country}`}
              </span>
              <span class="text-xs font-bold text-teal-200">
                <i class="fa-solid fa-hotel"></i> ${(dest.hotels || []).length} Hotels
              </span>
            </div>
            <h3 class="mt-2 text-3xl font-black text-white">${dest.name}</h3>
            <p class="mt-1 text-xs leading-5 text-slate-200 line-clamp-2">${dest.tagline}</p>
            <div class="mt-4 flex items-center justify-between text-xs font-bold text-teal-200">
              <span>Explore places & hotels <i class="fa-solid fa-arrow-right ml-1 transition group-hover:translate-x-1"></i></span>
              <span class="text-white font-black">${dest.weather.tempC}°C ${dest.weather.season}</span>
            </div>
          </div>
        </a>
      `).join("");
    }
  };

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentScope = tab.dataset.scope;
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderGrid();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderGrid();
  });

  renderGrid();

  // Quick Hero Booking Search Widget
  const heroSearchForm = qs("#hero-booking-widget");
  if (heroSearchForm) {
    const destSelect = qs("#hero-dest-select", heroSearchForm);
    const checkinInput = qs("#hero-checkin", heroSearchForm);
    const checkoutInput = qs("#hero-checkout", heroSearchForm);

    if (destSelect) {
      destSelect.innerHTML = `
        <optgroup label="Inside Egypt (سياحة داخلية)">
          ${egyptDestinations.map((d) => `<option value="${d.id}">${d.name} (Egypt)</option>`).join("")}
        </optgroup>
        <optgroup label="Outside Egypt (سياحة خارجية)">
          ${intlDestinations.map((d) => `<option value="${d.id}">${d.name} (${d.country})</option>`).join("")}
        </optgroup>`;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkoutDate = new Date(tomorrow);
    checkoutDate.setDate(checkoutDate.getDate() + 4);

    const formatDateStr = (d) => d.toISOString().split("T")[0];

    if (checkinInput) {
      checkinInput.min = formatDateStr(today);
      if (!checkinInput.value) checkinInput.value = formatDateStr(tomorrow);
      checkinInput.addEventListener("change", () => {
        const d1 = new Date(checkinInput.value);
        const d2 = new Date(checkoutInput?.value || "");
        if (d2 <= d1) {
          const next = new Date(d1);
          next.setDate(next.getDate() + 1);
          if (checkoutInput) checkoutInput.value = formatDateStr(next);
        }
        if (checkoutInput) checkoutInput.min = checkinInput.value;
      });
    }

    if (checkoutInput) {
      checkoutInput.min = formatDateStr(tomorrow);
      if (!checkoutInput.value) checkoutInput.value = formatDateStr(checkoutDate);
    }

    heroSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData(heroSearchForm);
      const destId = form.get("destination") || "cairo";
      const cin = form.get("checkIn") || "";
      const cout = form.get("checkOut") || "";
      const guests = form.get("guests") || "2";
      location.href = `destination.html?destination=${destId}&checkIn=${encodeURIComponent(cin)}&checkOut=${encodeURIComponent(cout)}&guests=${encodeURIComponent(guests)}`;
    });
  }
}

// --- B. DESTINATION LISTING & EXPLORER PAGE ---
function initDestination() {
  const params = new URLSearchParams(location.search);
  let activeScope = params.get("scope") || "all";
  let destId = params.get("destination");

  if (!destId) {
    if (activeScope === "international") destId = "paris";
    else if (activeScope === "domestic") destId = "cairo";
    else destId = App.trip?.destinationId || "cairo";
  }

  let activeView = params.get("view") === "places" ? "places" : "hotels"; // default to hotels for booking focus

  const destination = destinationById(destId);
  const places = destination.places || [];
  const hotels = destination.hotels || [];

  // Hero Info
  const hero = qs("#destination-hero");
  if (hero) hero.style.backgroundImage = `var(--hero-overlay), url('${destination.image}')`;
  if (qs("#destination-title")) qs("#destination-title").textContent = destination.name;
  if (qs("#destination-copy")) qs("#destination-copy").textContent = destination.tagline;
  const weatherPill = qs("#destination-weather-pill");
  if (weatherPill && destination?.weather) {
    weatherPill.innerHTML = `
      <i class="fa-solid fa-cloud-sun text-amber-400"></i>
      <span>${destination.weather.tempC}°C ${destination.weather.season}</span>
      <span class="opacity-70 text-[11px] hidden sm:inline">• ${destination.weather.humidity}% Humidity</span>`;
  }
  if (qs("#weather-card") && destination?.weather) {
    qs("#weather-card").innerHTML = `
      <i class="fa-solid fa-cloud-sun text-amber-500 text-xl"></i>
      <div class="text-xs">
        <b class="text-sm font-black text-slate-900 dark:text-white">${destination.weather.tempC}°C ${destination.weather.season}</b>
        <span class="text-slate-500 block">Humidity ${destination.weather.humidity}% • Wind ${destination.weather.windKph} km/h</span>
      </div>`;
  }

  // Populate Destination Switcher Dropdown
  const destSelect = qs("#destination-quick-select");
  if (destSelect) {
    const egypts = App.data.destinations.filter((d) => d.country === "Egypt");
    const intls = App.data.destinations.filter((d) => d.country !== "Egypt");
    destSelect.innerHTML = `
      <optgroup label="Inside Egypt (سياحة داخلية)">
        ${egypts.map((d) => `<option value="${d.id}" ${d.id === destination.id ? "selected" : ""}>🇪🇬 ${d.name}</option>`).join("")}
      </optgroup>
      <optgroup label="Outside Egypt (سياحة خارجية)">
        ${intls.map((d) => `<option value="${d.id}" ${d.id === destination.id ? "selected" : ""}>🌍 ${d.name} (${d.country})</option>`).join("")}
      </optgroup>`;

    destSelect.addEventListener("change", () => {
      location.href = `destination.html?destination=${destSelect.value}`;
    });
  }

  // View tabs (Hotels vs Places/Activities vs Restaurants)
  const tabHotelsBtn = qs("#tab-hotels-btn");
  const tabPlacesBtn = qs("#tab-places-btn");
  const hotelsGrid = qs("#hotels-grid");
  const placesGrid = qs("#places-grid");
  const hotelsFilterBox = qs("#hotels-filter-box");
  const placesFilterBox = qs("#places-filter-box");

  if (qs("#places-badge-count")) qs("#places-badge-count").textContent = places.length;
  if (qs("#hotels-badge-count")) qs("#hotels-badge-count").textContent = hotels.length;

  const switchView = (v) => {
    activeView = v;
    if (v === "hotels") {
      tabHotelsBtn?.classList.add("active");
      tabPlacesBtn?.classList.remove("active");
      hotelsGrid?.classList.remove("hidden");
      placesGrid?.classList.add("hidden");
      hotelsFilterBox?.classList.remove("hidden");
      placesFilterBox?.classList.add("hidden");
      renderHotels();
    } else {
      tabPlacesBtn?.classList.add("active");
      tabHotelsBtn?.classList.remove("active");
      placesGrid?.classList.remove("hidden");
      hotelsGrid?.classList.add("hidden");
      placesFilterBox?.classList.remove("hidden");
      hotelsFilterBox?.classList.add("hidden");
      renderPlaces();
    }
  };

  tabHotelsBtn?.addEventListener("click", () => switchView("hotels"));
  tabPlacesBtn?.addEventListener("click", () => switchView("places"));

  // Hotels Filters & Search State
  let starFilter = "all";
  let hotelSearch = "";
  let hotelSort = "smart";
  let maxPriceUSD = 1000;

  // Setup Price Range Slider
  const priceSlider = qs("#hotel-price-slider");
  const priceSliderLabel = qs("#hotel-price-label");
  if (priceSlider) {
    const highestHotelUSD = Math.max(...hotels.map((h) => h.pricePerNight), 500);
    priceSlider.max = highestHotelUSD;
    priceSlider.value = highestHotelUSD;
    maxPriceUSD = highestHotelUSD;
    if (priceSliderLabel) priceSliderLabel.textContent = `Up to ${money(highestHotelUSD)}`;

    priceSlider.addEventListener("input", (e) => {
      maxPriceUSD = Number(e.target.value);
      if (priceSliderLabel) priceSliderLabel.textContent = `Up to ${money(maxPriceUSD)}`;
      renderHotels();
    });
  }

  const renderHotels = () => {
    let list = hotels.map((h) => ({ ...h, destinationName: destination.name, destinationId: destination.id }));

    // Star filter
    if (starFilter !== "all") list = list.filter((h) => h.stars === Number(starFilter));

    // Price filter
    list = list.filter((h) => h.pricePerNight <= maxPriceUSD);

    // Search filter
    if (hotelSearch.trim()) {
      const q = hotelSearch.toLowerCase().trim();
      list = list.filter((h) => h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || (h.amenities && h.amenities.some((a) => a.toLowerCase().includes(q))));
    }

    // Sort
    if (hotelSort === "smart") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (hotelSort === "price-low") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (hotelSort === "price-high") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (hotelSort === "stars") {
      list.sort((a, b) => b.stars - a.stars);
    } else if (hotelSort === "proximity") {
      list.sort((a, b) => getHotelProximityInfo(a).distance - getHotelProximityInfo(b).distance);
    }

    if (hotelsGrid) {
      hotelsGrid.innerHTML = list.length
        ? list.map((h) => hotelCard(h, true, null, hotels)).join("")
        : `<div class="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900 col-span-2">No hotels match your filters. Try adjusting the price slider or star rating.</div>`;
    }

    bindActionHandlers(hotelsGrid);
    renderMap(destination, places, list, "destination-map");
  };

  qsa("[data-star-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      starFilter = btn.dataset.starBtn;
      qsa("[data-star-btn]").forEach((b) => b.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      renderHotels();
    });
  });

  qs("#hotel-search-input")?.addEventListener("input", (e) => {
    hotelSearch = e.target.value;
    renderHotels();
  });

  qs("#hotel-sort-select")?.addEventListener("change", (e) => {
    hotelSort = e.target.value;
    renderHotels();
  });

  // Places Filters
  let placeCategory = "all";
  let placeSearch = "";

  const renderPlaces = () => {
    let list = places.map((p) => ({
      ...p,
      destinationName: destination.name,
      destinationId: destination.id,
      type: p.category === "Dining" ? "restaurant" : (p.category === "Adventure" || p.category === "Shopping" ? "activity" : "landmark")
    }));

    if (placeCategory !== "all") {
      if (placeCategory === "landmarks") list = list.filter((p) => p.type === "landmark");
      else if (placeCategory === "restaurants") list = list.filter((p) => p.type === "restaurant");
      else if (placeCategory === "activities") list = list.filter((p) => p.type === "activity");
    }

    if (placeSearch.trim()) {
      const q = placeSearch.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (placesGrid) {
      placesGrid.innerHTML = list.length
        ? list.map((p) => placeCard(p, true)).join("")
        : `<div class="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900 col-span-2">No recommendations match your search.</div>`;
    }

    bindActionHandlers(placesGrid);
    renderMap(destination, list, hotels, "destination-map");
  };

  qsa("[data-place-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      placeCategory = btn.dataset.placeCat;
      qsa("[data-place-cat]").forEach((b) => b.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      renderPlaces();
    });
  });

  qs("#place-search-input")?.addEventListener("input", (e) => {
    placeSearch = e.target.value;
    renderPlaces();
  });

  switchView(activeView);
}

// --- C. PLANNER SETUP PAGE ---
function initPlanner() {
  const form = qs("#planner-form");
  if (!form) return;

  const egypts = App.data.destinations.filter((d) => d.country === "Egypt");
  const intls = App.data.destinations.filter((d) => d.country !== "Egypt");

  const scopeSelect = qs("#trip-scope");
  const destSelect = qs("#destination-options");
  const hotelSelect = qs("#hotel-options");
  const budgetInput = form.elements.namedItem("budget");
  const budgetCurrencyLabel = qs("[data-budget-currency-label]");
  if (budgetCurrencyLabel) budgetCurrencyLabel.textContent = `Trip Budget (${App.currency})`;
  if (budgetInput && !budgetInput.dataset.currencyInitialized) {
    budgetInput.value = String(Math.round(1500 * getCurrencyInfo(App.currency).rate * 100) / 100);
    budgetInput.dataset.currencyInitialized = "true";
  }

  const populateDestinations = () => {
    const isEgypt = scopeSelect.value === "domestic";
    const list = isEgypt ? egypts : intls;
    destSelect.innerHTML = list.map((d) => `<option value="${d.id}">${d.name} (${d.country})</option>`).join("");
    populateHotels();
  };

  const populateHotels = () => {
    const dest = destinationById(destSelect.value);
    const hotels = dest.hotels || [];
    hotelSelect.innerHTML = hotels.map((h) => `
      <option value="${h.id}">${h.name} (${renderStarsSimple(h.stars)} - ${money(h.pricePerNight)}/night)</option>
    `).join("");
    updatePreview();
  };

  const renderStarsSimple = (s) => "★".repeat(s);

  const updatePreview = () => {
    const dest = destinationById(destSelect.value);
    const hotel = hotelById(hotelSelect.value) || dest.hotels?.[0];
    const days = Number(form.days.value || 4);
    const budget = Number(budgetInput?.value || 0);
    const totalStay = (hotel?.pricePerNight || 0) * days;
    const preview = qs("#planner-preview");

    if (preview && dest) {
      preview.innerHTML = `
        <div class="relative h-48 overflow-hidden rounded-xl">
          <img src="${dest.image}" class="size-full object-cover" alt="${dest.name}">
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
            <p class="text-xs font-black uppercase text-teal-200">${dest.country}</p>
            <h3 class="text-2xl font-black">${dest.name}</h3>
          </div>
        </div>
        <div class="mt-4 space-y-3 text-xs font-bold">
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
            <span class="text-slate-400 block mb-1">SELECTED ACCOMMODATION</span>
            <p class="text-sm font-black text-slate-900 dark:text-white">${hotel?.name || 'Top Recommended Hotel'}</p>
            <p class="text-teal-600 font-bold mt-0.5">${money(hotel?.pricePerNight || 0)} / night × ${days} nights = <strong>${money(totalStay)}</strong></p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400 text-[11px] font-black uppercase">Your Trip Budget (${App.currency})</span>
              <strong class="text-sm font-black text-slate-900 dark:text-white">${money(budget / getCurrencyInfo(App.currency).rate, App.currency)}</strong>
            </div>
            <p class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Saved in ${App.currency}; equivalent to ${money(budget / getCurrencyInfo(App.currency).rate, "USD")}.</p>
          </div>
          <div class="rounded-xl bg-teal-50 p-3 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
            <p class="font-black"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Automated Itinerary Ready</p>
            <p class="text-[11px] font-semibold mt-1">A custom ${days}-day itinerary with landmarks and top restaurants will be automatically generated.</p>
          </div>
        </div>`;
    }
  };

  scopeSelect?.addEventListener("change", populateDestinations);
  destSelect?.addEventListener("change", populateHotels);
  hotelSelect?.addEventListener("change", updatePreview);
  form.days?.addEventListener("input", updatePreview);
  budgetInput?.addEventListener("input", updatePreview);

  populateDestinations();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    requireAccount(() => {
      const data = new FormData(form);
      const destId = data.get("destinationId");
      const hotelId = data.get("hotelId");
      const days = Number(data.get("days") || 4);
      const travelers = Number(data.get("travelers") || 2);
      const tripType = data.get("tripType") || "Leisure";
      const enteredBudget = Number(data.get("budget") || 0);
      const budget = enteredBudget / getCurrencyInfo(App.currency).rate;

      App.trip = {
        destinationId: destId,
        hotelId: hotelId,
        days: days,
        travelers: travelers,
        tripType: tripType,
        budget: budget,
        confirmedBooking: true
      };

      // Start with clean, user-controlled itinerary slots (empty days for custom planning)
      initializeTripItinerary(days);
      toast("Trip setup complete! Now choose which activities to add to your days.");
      setTimeout(() => (location.href = "my-trip.html"), 500);
    }, "create your custom travel plan and itinerary");
  });
}

// --- D. MY ITINERARY PAGE ---
function initTrip() {
  if (!App.trip) {
    qs("#trip-empty")?.classList.remove("hidden");
    qs("#trip-content")?.classList.add("hidden");
    return;
  }

  qs("#trip-empty")?.classList.add("hidden");
  qs("#trip-content")?.classList.remove("hidden");

  const destination = destinationById(App.trip.destinationId);
  const hotel = selectedTripHotel() || destination.hotels?.[0];

  if (qs("#trip-title")) qs("#trip-title").textContent = `${destination.name} Custom Itinerary`;
  if (qs("#trip-subtitle")) qs("#trip-subtitle").textContent = `${App.trip.days} Days Stay • ${App.trip.travelers} Travelers • ${App.trip.tripType || "Leisure"} Trip`;

  renderTripHotelCard(hotel, destination);
  renderItineraryDays();
  renderLocalRecommendationsDrawer(destination);
  updateBudgetWidget();
}

function selectedTripHotel() {
  return hotelById(App.trip?.hotelId) || destinationById(App.trip?.destinationId)?.hotels?.[0];
}

function renderTripHotelCard(hotel, destination) {
  const root = qs("#trip-hotel-card");
  if (!root || !hotel) return;

  const days = Math.max(1, App.trip?.days || 1);
  const totalStay = hotel.pricePerNight * days;

  root.innerHTML = `
    <section class="overflow-hidden rounded-2xl border border-teal-500/40 bg-white p-5 shadow-lg dark:bg-slate-900 grid gap-5 md:grid-cols-[180px_1fr_auto] items-center">
      <div class="h-32 w-full overflow-hidden rounded-xl cursor-pointer" data-view-gallery="${hotel.id}">
        <img src="${hotel.image}" class="h-full w-full object-cover" alt="${hotel.name}">
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-black text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <i class="fa-solid fa-hotel mr-1"></i> Reserved Hotel
          </span>
          ${renderStarIcons(hotel.stars)}
          <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> Verified</span>
        </div>
        <h3 class="text-xl font-black text-slate-950 dark:text-white mt-1.5">${hotel.name}</h3>
        <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
          <i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || destination.name}
        </p>
        <div class="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
          <span class="font-bold text-slate-600 dark:text-slate-300">
            ${money(hotel.pricePerNight)} / night × ${days} nights = <strong class="text-teal-600 dark:text-teal-300 text-sm">${money(totalStay)}</strong>
          </span>
        </div>
      </div>
      <div class="flex md:flex-col gap-2 justify-end">
        <button type="button" data-view-gallery="${hotel.id}" class="btn-soft text-xs font-black">
          <i class="fa-solid fa-images"></i> Photos
        </button>
        <button type="button" data-view-reviews="${hotel.id}" class="btn-soft text-xs font-black">
          <i class="fa-solid fa-star text-amber-500"></i> Reviews
        </button>
        <a href="destination.html?destination=${destination.id}&view=hotels" class="btn-soft text-xs font-black">
          <i class="fa-solid fa-arrow-right-arrow-left"></i> Change
        </a>
      </div>
    </section>`;

  bindActionHandlers(root);
}

function renderItineraryDays() {
  const itinerary = App.itinerary || {};
  const days = Object.keys(itinerary).length ? Object.keys(itinerary) : ["1", "2", "3", "4"];
  const hotel = selectedTripHotel();

  qs("#day-columns").innerHTML = days.map((day) => {
    const placeIds = itinerary[day] || [];
    return `
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span class="grid size-6 place-items-center rounded-full bg-teal-600 text-[11px] text-white">${day}</span>
            Day ${day}
          </h3>
          <span class="text-xs font-bold rounded-full bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ${placeIds.length} stops
          </span>
        </div>
        
        <div class="min-h-52 space-y-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950" data-day="${day}">
          ${placeIds.map((id) => renderItineraryItem(id, hotel, day, days)).join("") || `
            <div class="p-6 text-center text-xs text-slate-400">
              <i class="fa-solid fa-plus-circle text-lg mb-1 block opacity-60"></i>
              No activities scheduled. Add from recommendations below!
            </div>
          `}
        </div>
      </section>`;
  }).join("");

  // Drag & drop
  qsa("[draggable]").forEach((item) => {
    item.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", item.dataset.place));
  });
  qsa("[data-day]").forEach((col) => {
    col.addEventListener("dragover", (e) => e.preventDefault());
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      const placeId = e.dataTransfer.getData("text/plain");
      movePlaceInItinerary(placeId, col.dataset.day);
    });
  });

  // Move Day dropdown for mobile & touch devices
  qsa("[data-move-day]").forEach((sel) => {
    sel.addEventListener("change", () => {
      movePlaceInItinerary(sel.dataset.moveDay, sel.value);
    });
  });

  // Remove buttons
  qsa("[data-remove-place]").forEach((btn) => {
    btn.addEventListener("click", () => removePlaceFromItinerary(btn.dataset.removePlace));
  });

  updateBudgetWidget();
}

function renderItineraryItem(placeId, hotel, currentDay = "1", allDays = ["1", "2", "3", "4"]) {
  const place = placeById(placeId);
  if (!place) return "";

  const dist = hotel ? calculateDistanceKm(hotel.lat, hotel.lng, place.lat, place.lng) : null;
  const timeSlotClass = place.timeOfDay === "Morning" ? "timeslot-morning" : (place.timeOfDay === "Evening" ? "timeslot-evening" : "timeslot-afternoon");

  return `
    <article draggable="true" data-place="${place.id}" class="cursor-grab rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
      <div class="flex gap-2.5 items-start">
        <img src="${place.image}" alt="${place.name}" class="size-14 shrink-0 rounded-lg object-cover">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="timeslot-pill ${timeSlotClass}">${place.timeOfDay || 'Day'}</span>
            <h4 class="truncate font-black text-xs text-slate-950 dark:text-white">${place.name}</h4>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5 font-bold">${place.category} • ${money(place.price)}</p>
          ${dist !== null ? `<p class="text-[10px] font-bold text-teal-600 mt-0.5"><i class="fa-solid fa-route"></i> ${dist} km from hotel</p>` : ""}
          
          <!-- Mobile / Quick Day Switcher -->
          <div class="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
            <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span>Day:</span>
              <select data-move-day="${place.id}" class="h-6 rounded border border-slate-200 bg-slate-50 px-1 text-[10px] font-bold text-teal-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300 cursor-pointer">
                ${allDays.map((d) => `<option value="${d}" ${d === String(currentDay) ? "selected" : ""}>Day ${d}</option>`).join("")}
              </select>
            </div>
            <button class="text-slate-400 hover:text-rose-500 text-[11px] font-bold transition flex items-center gap-1" data-remove-place="${place.id}" title="Remove stop">
              <i class="fa-solid fa-trash text-[10px]"></i>
              <span class="text-[10px]">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>`;
}

function movePlaceInItinerary(placeId, targetDay) {
  const itinerary = App.itinerary || {};
  Object.keys(itinerary).forEach((d) => {
    itinerary[d] = (itinerary[d] || []).filter((id) => id !== placeId);
  });
  itinerary[targetDay] = [...(itinerary[targetDay] || []), placeId];
  App.itinerary = itinerary;
  renderItineraryDays();
  toast("Itinerary updated!");
}

function removePlaceFromItinerary(placeId) {
  const itinerary = App.itinerary || {};
  Object.keys(itinerary).forEach((d) => {
    itinerary[d] = (itinerary[d] || []).filter((id) => id !== placeId);
  });
  App.itinerary = itinerary;
  renderItineraryDays();
  toast("Removed from schedule");
}

function renderLocalRecommendationsDrawer(destination) {
  const root = qs("#local-recommendations-drawer");
  if (!root) return;

  const places = destination.places || [];
  const scheduledIds = Object.values(App.itinerary || {}).flat();

  root.innerHTML = `
    <div class="mt-10 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 class="text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-compass text-teal-600"></i> Recommended Local Landmarks, Top Restaurants & Activities
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Explore curated highlights tailored to ${destination.name} and add them directly to your schedule.</p>
        </div>
        <div class="flex flex-wrap gap-2" id="rec-type-filter">
          <button type="button" data-rec-filter="all" class="chip chip-active text-xs py-1 px-3">All</button>
          <button type="button" data-rec-filter="landmark" class="chip text-xs py-1 px-3"><i class="fa-solid fa-landmark text-teal-600 mr-1"></i> Landmarks</button>
          <button type="button" data-rec-filter="restaurant" class="chip text-xs py-1 px-3"><i class="fa-solid fa-utensils text-amber-500 mr-1"></i> Restaurants</button>
          <button type="button" data-rec-filter="activity" class="chip text-xs py-1 px-3"><i class="fa-solid fa-compass text-sky-500 mr-1"></i> Activities</button>
        </div>
      </div>

      <div id="rec-items-grid" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
    </div>`;

  let currentRecFilter = "all";

  const renderRecItems = () => {
    let list = places.map((p) => ({
      ...p,
      type: p.category === "Dining" ? "restaurant" : (p.category === "Adventure" || p.category === "Shopping" ? "activity" : "landmark")
    }));

    if (currentRecFilter !== "all") list = list.filter((p) => p.type === currentRecFilter);

    const grid = qs("#rec-items-grid", root);
    if (!grid) return;

    grid.innerHTML = list.map((p) => {
      const isScheduled = scheduledIds.includes(p.id);
      return `
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 flex gap-3 items-center justify-between">
          <img src="${p.image}" class="size-14 rounded-lg object-cover">
          <div class="min-w-0 flex-1">
            <h4 class="truncate text-xs font-black text-slate-950 dark:text-white">${p.name}</h4>
            <p class="text-[11px] text-slate-400 font-bold">${p.category} • ${money(p.price)}</p>
          </div>
          <button type="button" data-quick-add-schedule="${p.id}" class="${isScheduled ? 'btn-soft text-teal-600' : 'btn-primary'} text-xs font-black py-1.5 px-3">
            <i class="fa-solid ${isScheduled ? 'fa-check' : 'fa-plus'}"></i>
            <span>${isScheduled ? 'Added' : 'Add'}</span>
          </button>
        </div>`;
    }).join("");

    qsa("[data-quick-add-schedule]", grid).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.quickAddSchedule;
        openAddToTripModal(id);
      });
    });
  };

  qsa("[data-rec-filter]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      currentRecFilter = btn.dataset.recFilter;
      qsa("[data-rec-filter]", root).forEach((b) => b.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      renderRecItems();
    });
  });

  renderRecItems();
}

function updateBudgetWidget() {
  const widget = qs("#budget-widget");
  if (!widget || !App.trip) return;

  const hotel = selectedTripHotel();
  const days = Math.max(1, App.trip.days || 1);
  const hotelTotal = (hotel?.pricePerNight || 0) * days;
  
  const plannedPlaceObjects = Object.values(App.itinerary || {}).flat().map(placeById).filter(Boolean);
  const activitiesTotal = plannedPlaceObjects.reduce((acc, p) => acc + (p.price || 0), 0);
  const grandTotal = hotelTotal + activitiesTotal;
  const budget = App.trip.budget || Math.round(grandTotal * 1.2);

  const percent = Math.min(100, Math.round((grandTotal / budget) * 100));
  const isOver = grandTotal > budget;

  widget.innerHTML = `
    <div class="rounded-2xl p-5 ${isOver ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200' : 'bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'}">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-wider opacity-70">Estimated Trip Spend</p>
          <p class="mt-1 text-2xl font-black">${money(grandTotal)}</p>
        </div>
        <div class="text-right">
          <p class="text-[11px] font-black uppercase tracking-wider opacity-70">Budget You Set (${App.currency})</p>
          <p class="mt-1 text-lg font-black">${money(budget, App.currency)}</p>
        </div>
      </div>
      
      <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-white/60 dark:bg-slate-900">
        <div class="h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-teal-500'}" style="width: ${percent}%"></div>
      </div>
      
      <div class="mt-4 pt-3 border-t border-black/10 dark:border-white/10 space-y-1.5 text-xs font-bold">
        <div class="flex justify-between">
          <span>🏨 Hotel (${days} nights):</span>
          <span>${money(hotelTotal)}</span>
        </div>
        <div class="flex justify-between">
          <span>🎟️ Activities (${plannedPlaceObjects.length} stops):</span>
          <span>${money(activitiesTotal)}</span>
        </div>
      </div>
    </div>`;
}

// --- E. FAVORITES PAGE ---
function initFavorites() {
  const places = (App.favorites || []).map(placeById).filter(Boolean);
  const hotels = (App.favoriteHotels || []).map(hotelById).filter(Boolean);
  const grid = qs("#favorites-grid");
  if (!grid) return;

  if (places.length === 0 && hotels.length === 0) {
    grid.innerHTML = `
      <div class="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-slate-900 col-span-full">
        <i class="fa-solid fa-heart-crack text-4xl text-slate-300 dark:text-slate-700 mb-3 block"></i>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">No saved favorites yet</h2>
        <p class="mt-2 text-xs text-slate-400">Browse destinations, save hotels you like, or bookmark activities for later.</p>
        <a href="destination.html" class="btn-primary mt-6 inline-flex">Explore Destinations & Hotels</a>
      </div>`;
    return;
  }

  let html = "";
  if (hotels.length > 0) {
    html += `<div class="col-span-full"><h3 class="text-2xl font-black mb-4">Saved Hotels (${hotels.length})</h3></div>`;
    html += hotels.map((h) => hotelCard(h, true)).join("");
  }
  if (places.length > 0) {
    html += `<div class="col-span-full mt-6"><h3 class="text-2xl font-black mb-4">Saved Attractions & Restaurants (${places.length})</h3></div>`;
    html += places.map((p) => placeCard(p, true)).join("");
  }

  grid.innerHTML = html;
  bindActionHandlers(grid);
}

// --- F. SUMMARY & PDF EXPORT PAGE ---
function initSummary() {
  const report = qs("#summary-report");
  if (!report) return;

  if (!App.trip) {
    report.innerHTML = `
      <div class="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-slate-900">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">No active trip found</h2>
        <p class="mt-2 text-xs text-slate-400">Set up your destination and book a stay to view your itinerary summary.</p>
        <a href="planner.html" class="btn-primary mt-6 inline-flex">Start Trip Setup</a>
      </div>`;
    return;
  }

  const destination = destinationById(App.trip.destinationId);
  const hotel = selectedTripHotel();
  const days = Math.max(1, App.trip.days || 1);
  const hotelCost = (hotel?.pricePerNight || 0) * days;
  const itinerary = App.itinerary || {};
  const plannedPlaces = Object.values(itinerary).flat().map(placeById).filter(Boolean);
  const activitiesCost = plannedPlaces.reduce((acc, p) => acc + (p.price || 0), 0);
  const total = hotelCost + activitiesCost;

  report.innerHTML = `
    <!-- Header Card -->
    <div class="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div class="relative h-64 w-full">
        <img src="${destination.image}" class="size-full object-cover" alt="${destination.name}">
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white">
          <span class="rounded-full bg-teal-500/80 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur-md">
            ${destination.country === "Egypt" ? "Inside Egypt (سياحة داخلية)" : destination.country}
          </span>
          <h1 class="text-3xl md:text-4xl font-black mt-2">${destination.name} Trip Itinerary & Booking Voucher</h1>
          <p class="text-xs text-slate-200 mt-1">${days} Days Stay • ${App.trip.travelers} Travelers • Verified Booking</p>
        </div>
      </div>

      <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
        <div class="stat"><span>Hotel Stay</span><b>${hotel ? money(hotelCost) : "$0"}</b></div>
        <div class="stat"><span>Activities (${plannedPlaces.length})</span><b>${money(activitiesCost)}</b></div>
        <div class="stat"><span>Total Estimated</span><b class="text-teal-600 dark:text-teal-300">${money(total)}</b></div>
        <div class="stat"><span>Trip Budget (${App.currency})</span><b>${money(App.trip.budget || total)}</b></div>
      </div>

      <!-- Hotel Details -->
      ${hotel ? `
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-5 items-start justify-between">
          <div class="flex gap-4">
            <img src="${hotel.image}" class="size-24 rounded-xl object-cover" alt="${hotel.name}">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase text-teal-600">Confirmed Accommodation</span>
                ${renderStarIcons(hotel.stars)}
              </div>
              <h3 class="text-xl font-black text-slate-950 dark:text-white mt-1">${hotel.name}</h3>
              <p class="text-xs text-slate-400 mt-0.5"><i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || destination.name}</p>
              <p class="text-xs font-bold text-teal-700 dark:text-teal-300 mt-2">${money(hotel.pricePerNight)} / night × ${days} nights</p>
            </div>
          </div>
          <span class="verified-badge"><i class="fa-solid fa-shield-check"></i> 100% Real Property</span>
        </div>
      ` : ""}

      <!-- Day by Day Program -->
      <div class="p-6 space-y-4">
        <h3 class="text-xl font-black text-slate-950 dark:text-white">Day-by-Day Schedule</h3>
        <div class="grid gap-4 md:grid-cols-2">
          ${Object.keys(itinerary).map((d) => `
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h4 class="text-sm font-black text-teal-700 dark:text-teal-300 mb-3 flex items-center justify-between">
                <span>Day ${d}</span>
                <span class="text-[11px] text-slate-400 font-bold">${(itinerary[d] || []).length} stops</span>
              </h4>
              <div class="space-y-2">
                ${(itinerary[d] || []).map((id) => {
                  const place = placeById(id);
                  if (!place) return "";
                  return `
                    <div class="flex items-center justify-between text-xs rounded-lg bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div>
                        <b class="text-slate-900 dark:text-white">${place.name}</b>
                        <span class="text-slate-400 block text-[11px]">${place.category} • ${place.timeOfDay || 'Day'}</span>
                      </div>
                      <span class="font-black text-teal-600">${money(place.price)}</span>
                    </div>`;
                }).join("") || `<p class="text-xs text-slate-400">Leisure time & relaxation</p>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`;

  qs("#export-pdf")?.addEventListener("click", () => {
    toast("Generating PDF trip voucher...", "fa-file-pdf");
    if (window.html2pdf) {
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `${destination.name.toLowerCase()}-wanderly-voucher.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(report).save().then(() => {
        toast("Voucher PDF downloaded successfully!", "fa-circle-check");
      });
    } else {
      window.print();
    }
  });

  qs("#start-over")?.addEventListener("click", () => {
    Store.remove("trip");
    Store.remove("itinerary");
    location.href = "planner.html";
  });
}

// =============================================================================
// 15. DOM CONTENT LOADED
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  injectShell();
  const page = document.body.dataset.page || "home";
  if (page === "home") initHome();
  else if (page === "destination") initDestination();
  else if (page === "planner") initPlanner();
  else if (page === "trip") initTrip();
  else if (page === "favorites") initFavorites();
  else if (page === "summary") initSummary();
});
