const Store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`wanderly:${key}`)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(`wanderly:${key}`, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(`wanderly:${key}`);
  },
};

const App = {
  data: window.WANDERLY_DATA,
  get trip() {
    return Store.get("trip", null);
  },
  set trip(value) {
    Store.set("trip", value);
  },
  get itinerary() {
    return Store.get("itinerary", {});
  },
  set itinerary(value) {
    Store.set("itinerary", value);
  },
  get favorites() {
    return Store.get("favorites", []);
  },
  set favorites(value) {
    Store.set("favorites", value);
  },
  get favoriteHotels() {
    return Store.get("favoriteHotels", []);
  },
  set favoriteHotels(value) {
    Store.set("favoriteHotels", value);
  },
  get reviews() {
    return Store.get("reviews", {});
  },
  set reviews(value) {
    Store.set("reviews", value);
  },
  get currency() {
    return Store.get("currency", "USD");
  },
  set currency(value) {
    Store.set("currency", value);
  },
  get users() {
    return Store.get("users", []);
  },
  set users(value) {
    Store.set("users", value);
  },
  get currentUser() {
    return Store.get("currentUser", null);
  },
  set currentUser(value) {
    Store.set("currentUser", value);
  },
};

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function destinationById(id) {
  return App.data.destinations.find((destination) => destination.id === id) || App.data.destinations[0];
}

function allPlaces() {
  return App.data.destinations.flatMap((destination) =>
    (destination.places || []).map((place) => ({ ...place, destinationId: destination.id, destinationName: destination.name })),
  );
}

function placeById(id) {
  return allPlaces().find((place) => place.id === id);
}

function allHotels() {
  return App.data.destinations.flatMap((destination) =>
    (destination.hotels || []).map((hotel) => ({ ...hotel, destinationId: destination.id, destinationName: destination.name })),
  );
}

function hotelById(id) {
  return allHotels().find((hotel) => hotel.id === id);
}

function destinationHotels(destinationId) {
  const destination = destinationById(destinationId);
  return (destination?.hotels || []).map((hotel) => ({ ...hotel, destinationId: destination.id, destinationName: destination.name }));
}

function money(usd) {
  const currency = App.data.currencies[App.currency] || App.data.currencies.USD;
  const value = Math.round(usd * currency.rate);
  return `${currency.symbol} ${value.toLocaleString()}`;
}

function activeDestination() {
  const params = new URLSearchParams(location.search);
  return destinationById(params.get("destination") || App.trip?.destinationId || "cairo");
}

function ensureItinerary() {
  const trip = App.trip;
  if (!trip) return {};
  const current = App.itinerary;
  const next = {};
  for (let day = 1; day <= trip.days; day += 1) next[day] = current[day] || [];
  App.itinerary = next;
  return next;
}

// Distance calculation using Haversine formula (km)
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

function getPlannedPlaceObjects() {
  const itinerary = App.itinerary || {};
  return Object.values(itinerary).flat().map(placeById).filter(Boolean);
}

function getHotelProximityInfo(hotel, referencePlace = null) {
  if (referencePlace && referencePlace.lat && referencePlace.lng) {
    const dist = calculateDistanceKm(hotel.lat, hotel.lng, referencePlace.lat, referencePlace.lng);
    return {
      distance: dist,
      label: `${dist} km from ${referencePlace.name}`,
    };
  }

  const plannedPlaces = getPlannedPlaceObjects();
  if (plannedPlaces.length > 0) {
    const distances = plannedPlaces.map((p) => calculateDistanceKm(hotel.lat, hotel.lng, p.lat, p.lng));
    const avgDist = Math.round((distances.reduce((a, b) => a + b, 0) / distances.length) * 10) / 10;
    const minDist = Math.min(...distances);
    const closestPlace = plannedPlaces[distances.indexOf(minDist)];
    return {
      distance: avgDist,
      minDistance: minDist,
      label: `${avgDist} km avg distance (${minDist} km from ${closestPlace.name})`,
    };
  }

  const dest = destinationById(hotel.destinationId);
  const dist = calculateDistanceKm(hotel.lat, hotel.lng, dest.lat, dest.lng);
  return {
    distance: dist,
    label: `${dist} km from center of ${dest.name}`,
  };
}

function totalActivitiesCost() {
  return Object.values(App.itinerary || {})
    .flat()
    .map(placeById)
    .filter(Boolean)
    .reduce((sum, place) => sum + (place.price || 0), 0);
}

function selectedTripHotel() {
  if (!App.trip) return null;
  if (App.trip.hotelId) {
    const found = hotelById(App.trip.hotelId);
    if (found) return found;
  }
  // Default to first hotel of active destination
  const destHotels = destinationHotels(App.trip.destinationId);
  return destHotels[0] || null;
}

function totalAccommodationsCost() {
  if (!App.trip) return 0;
  const hotel = selectedTripHotel();
  if (!hotel) return 0;
  const nights = Math.max(1, App.trip.days);
  return (hotel.pricePerNight || 0) * nights;
}

function currentCost() {
  return totalActivitiesCost() + totalAccommodationsCost();
}

function renderStarIcons(stars) {
  const count = Math.max(1, Math.min(5, Number(stars) || 5));
  let starsHtml = "";
  for (let i = 0; i < count; i++) {
    starsHtml += `<i class="fa-solid fa-star text-amber-500 text-xs"></i>`;
  }
  return `<span class="star-badge">${starsHtml} <span class="ml-1">${count}-Star</span></span>`;
}

function selectTripHotel(hotelId) {
  requireAccount(() => {
    const hotel = hotelById(hotelId);
    if (!hotel) return;
    if (!App.trip) {
      App.trip = {
        destinationId: hotel.destinationId,
        hotelId: hotel.id,
        days: 4,
        budget: 1200,
        travelers: 2,
        tripType: "Leisure",
      };
    } else {
      App.trip = {
        ...App.trip,
        hotelId: hotel.id,
      };
    }
    toast(`Selected ${hotel.name} for your trip`);
    if (document.body.dataset.page === "destination") {
      initDestination();
    } else if (document.body.dataset.page === "trip") {
      initTrip();
    }
  }, "select a hotel for your trip");
}

function toggleFavoriteHotel(hotelId) {
  requireAccount(() => {
    const favs = App.favoriteHotels || [];
    if (favs.includes(hotelId)) {
      App.favoriteHotels = favs.filter((id) => id !== hotelId);
      toast("Removed hotel from favorites");
    } else {
      App.favoriteHotels = [...new Set([...favs, hotelId])];
      toast("Saved hotel to favorites");
    }
    if (document.body.dataset.page === "destination") {
      initDestination();
    } else if (document.body.dataset.page === "favorites") {
      initFavorites();
    }
  }, "save hotels to your favorites");
}

function setTheme(enabled) {
  Store.set("darkMode", enabled);
  document.documentElement.classList.toggle("dark", enabled);
  syncThemeControls(enabled);
}

function initTheme() {
  const savedTheme = Store.get("darkMode", null);
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
  setTheme(savedTheme ?? prefersDark);
}

function syncThemeControls(enabled = Store.get("darkMode", false)) {
  qsa("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", enabled ? "Switch to light mode" : "Switch to dark mode");
    button.innerHTML = `<i data-lucide="${enabled ? "sun" : "moon"}"></i>`;
  });
  if (window.lucide) window.lucide.createIcons();
}

function bindThemeToggles() {
  qsa("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => setTheme(!Store.get("darkMode", false)));
  });
}

function renderProgress(step) {
  const steps = ["Setup", "Explore", "Plan", "Summary"];
  const current = Math.max(0, steps.indexOf(step));
  qsa("[data-progress]").forEach((root) => {
    root.innerHTML = steps
      .map((label, index) => {
        const state =
          index <= current
            ? "bg-teal-500 text-white border-teal-500"
            : "bg-white/80 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
        const line =
          index < steps.length - 1
            ? `<span class="hidden sm:block flex-1 h-0.5 ${index < current ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}"></span>`
            : "";
        return `<span class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-full border text-sm font-bold ${state}">${index + 1}</span><span class="hidden md:block text-sm font-semibold">${label}</span></span>${line}`;
      })
      .join("");
  });
}

function nav() {
  const user = App.currentUser;
  return `
    <header class="sticky top-0 z-50 border-b border-white/20 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <a href="index.html" class="flex items-center gap-3 text-xl font-black text-slate-950 dark:text-white">
          <span class="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 text-white shadow-lg"><i data-lucide="plane"></i></span>
          Wanderly
        </a>
        <div class="hidden items-center gap-1 md:flex">
          <a class="nav-link" href="planner.html">Planner</a>
          <a class="nav-link" href="destination.html">Explore & Hotels</a>
          <a class="nav-link" href="my-trip.html">My Trip</a>
          <a class="nav-link" href="favorites.html">Favorites</a>
          <a class="nav-link" href="summary.html">Summary</a>
        </div>
        <div class="flex items-center gap-2">
          <select data-currency aria-label="Select currency" class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-950 shadow-sm transition hover:border-teal-500 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer">
            ${Object.keys(App.data.currencies).map((code) => `<option value="${code}" class="bg-white text-slate-950 dark:bg-slate-900 dark:text-slate-100" ${App.currency === code ? "selected" : ""}>${code}</option>`).join("")}
          </select>
          ${
            user
              ? `<button data-logout class="hidden rounded-full bg-teal-50 px-4 py-2 text-sm font-black text-teal-700 transition hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-200 sm:inline-flex">${user.name}</button>`
              : `<button data-auth-open class="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-teal-600 dark:bg-white dark:text-slate-950 sm:inline-flex">Sign in</button>`
          }
          <button data-theme-toggle class="icon-btn" aria-label="Toggle dark mode"><i data-lucide="moon"></i></button>
        </div>
      </nav>
    </header>`;
}

function footer() {
  return `
    <footer class="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div class="mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between max-w-7xl">
        <div>
          <p class="text-lg font-black">Wanderly</p>
          <p class="mt-2 text-sm text-slate-500">Plan full journeys with verified real hotels, live proximity sorting, and complete cost breakdowns.</p>
        </div>
        <div class="flex gap-4 text-sm font-semibold text-slate-500">
          <a href="planner.html">Start Planner</a>
          <a href="destination.html">Explore Hotels & Places</a>
          <a href="favorites.html">Favorites</a>
        </div>
      </div>
    </footer>`;
}

function injectShell(step) {
  const header = qs("#site-header");
  const foot = qs("#site-footer");
  if (header) header.innerHTML = nav();
  if (foot) foot.innerHTML = footer();
  bindThemeToggles();
  bindAuthControls();
  syncThemeControls();
  renderProgress(step);
  qsa("[data-currency]").forEach((select) => {
    select.value = App.currency;
    select.addEventListener("change", () => {
      App.currency = select.value;
      location.reload();
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function bindAuthControls() {
  qsa("[data-auth-open]").forEach((button) => {
    button.addEventListener("click", () => openAuthModal());
  });
  qsa("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      Store.remove("currentUser");
      toast("Signed out");
      setTimeout(() => location.reload(), 500);
    });
  });
}

function requireAccount(nextAction, actionLabel = "save places, write reviews, or build your trip") {
  if (App.currentUser) {
    nextAction();
    return;
  }
  openAuthModal(nextAction, actionLabel);
}

function openAuthModal(onSuccess, actionLabel = "save places, write reviews, or build your trip") {
  let modal = qs("#auth-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "auth-modal";
    document.body.appendChild(modal);
  }

  const render = (mode = "login") => {
    const isRegister = mode === "register";
    modal.innerHTML = `
      <div class="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <form class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" data-auth-form>
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-black uppercase tracking-[.18em] text-teal-600">${isRegister ? "Create Account" : "Welcome Back"}</p>
              <h2 class="mt-2 text-3xl font-black text-slate-950 dark:text-white">${isRegister ? "Join Wanderly" : "Sign in first"}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500">${isRegister ? `Create a local account to ${actionLabel}.` : `You need an account before you can ${actionLabel}.`}</p>
            </div>
            <button type="button" data-auth-close class="icon-btn" aria-label="Close"><i data-lucide="x"></i></button>
          </div>
          <div class="mt-6 space-y-4">
            ${isRegister ? `<label class="block text-sm font-black">Name<input name="name" required minlength="2" class="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-semibold dark:border-slate-700 dark:bg-slate-950"></label>` : ""}
            <label class="block text-sm font-black">Email<input name="email" type="email" required class="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-semibold dark:border-slate-700 dark:bg-slate-950"></label>
            <label class="block text-sm font-black">Password<input name="password" type="password" required minlength="4" class="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-semibold dark:border-slate-700 dark:bg-slate-950"></label>
          </div>
          <p data-auth-error class="mt-4 hidden rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600 dark:bg-rose-950"></p>
          <button class="btn-primary mt-5 w-full" type="submit">${isRegister ? "Create account" : "Sign in"}</button>
          <button type="button" data-auth-switch class="mt-4 w-full text-center text-sm font-black text-teal-600">
            ${isRegister ? "Already have an account? Sign in" : "No account? Create one"}
          </button>
        </form>
      </div>`;

    qs("[data-auth-close]", modal).addEventListener("click", () => (modal.innerHTML = ""));
    qs("[data-auth-switch]", modal).addEventListener("click", () => render(isRegister ? "login" : "register"));
    qs("[data-auth-form]", modal).addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email")).trim().toLowerCase();
      const password = String(form.get("password"));
      const users = App.users;
      const error = qs("[data-auth-error]", modal);

      if (isRegister) {
        if (users.some((user) => user.email === email)) {
          error.textContent = "This email already has an account. Sign in instead.";
          error.classList.remove("hidden");
          return;
        }
        const user = { id: crypto.randomUUID(), name: String(form.get("name")).trim(), email, password };
        App.users = [...users, user];
        App.currentUser = { id: user.id, name: user.name, email: user.email };
      } else {
        const user = users.find((item) => item.email === email && item.password === password);
        if (!user) {
          error.textContent = "Email or password is incorrect. Create a new account if this is your first trip.";
          error.classList.remove("hidden");
          return;
        }
        App.currentUser = { id: user.id, name: user.name, email: user.email };
      }

      modal.innerHTML = "";
      toast(isRegister ? "Account created" : "Signed in");
      injectShell(
        { home: "Setup", planner: "Setup", destination: "Explore", trip: "Plan", favorites: "Explore", summary: "Summary" }[
          document.body.dataset.page
        ] || "Setup",
      );
      if (typeof onSuccess === "function") onSuccess();
    });
    if (window.lucide) window.lucide.createIcons();
  };

  render("login");
}

function toast(message) {
  const box = document.createElement("div");
  box.className =
    "fixed bottom-5 left-1/2 z-[9999] -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl dark:bg-white dark:text-slate-950";
  box.textContent = message;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2200);
}

function syncFavoriteState(placeId) {
  if (document.body.dataset.page === "favorites") {
    initFavorites();
  } else {
    qsa(`[data-fav="${placeId}"]`).forEach((btn) => {
      const saved = App.favorites.includes(placeId);
      btn.innerHTML = `<i data-lucide="${saved ? "heart-off" : "heart"}"></i><span>${saved ? "Saved" : "Save"}</span>`;
    });
    if (window.lucide) window.lucide.createIcons();
  }
}

function addFavorite(placeId) {
  requireAccount(() => {
    App.favorites = [...new Set([...App.favorites, placeId])];
    toast("Saved to favorites");
    syncFavoriteState(placeId);
  }, "save places to your favorites");
}

function removeFavorite(placeId) {
  requireAccount(() => {
    App.favorites = App.favorites.filter((id) => id !== placeId);
    toast("Removed from favorites");
    syncFavoriteState(placeId);
  }, "manage your favorites");
}

function toggleFavorite(placeId) {
  requireAccount(() => {
    if (App.favorites.includes(placeId)) {
      removeFavorite(placeId);
    } else {
      addFavorite(placeId);
    }
  }, "save places to your favorites");
}

function addToTrip(placeId, day = 1) {
  requireAccount(() => {
    if (!App.trip) {
      App.trip = {
        destinationId: activeDestination().id,
        hotelId: destinationHotels(activeDestination().id)[0]?.id,
        days: 3,
        budget: 900,
        travelers: 2,
        tripType: "Leisure",
      };
    }
    const itinerary = ensureItinerary();
    const targetDay = String(Math.min(Number(day), App.trip.days));
    itinerary[targetDay] = [...new Set([...(itinerary[targetDay] || []), placeId])];
    App.itinerary = itinerary;
    toast("Added to your trip itinerary");
    if (document.body.dataset.page === "destination") {
      updateDestinationActiveTripStatus();
    }
  }, "add places to your trip");
}

function placeCard(place, actions = true) {
  const saved = App.favorites.includes(place.id);
  const review = App.reviews[place.id];
  return `
    <article class="place-card group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div class="relative h-48 w-full shrink-0 overflow-hidden">
        <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" src="${place.image}" alt="${place.name}" loading="lazy">
        <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/75 to-transparent"></div>
        <span class="image-label absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black text-slate-800">${place.category}</span>
        <span class="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-black text-slate-900 shadow-sm">${money(place.price)}</span>
      </div>
      <div class="flex flex-1 flex-col p-5 justify-between">
        <div class="flex-1">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-black text-slate-950 dark:text-white line-clamp-1 min-h-[1.75rem]">${place.name}</h3>
          </div>
          <p class="text-xs font-bold text-slate-400 line-clamp-1 mt-0.5 min-h-[1.25rem]">${place.destinationName || ""}</p>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[3rem]">${place.description}</p>
        </div>
        <div class="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="font-bold text-amber-500"><i class="fa-solid fa-star"></i> ${place.rating}</span>
            ${review ? `<span class="text-teal-600 dark:text-teal-300 font-bold">Your rating: ${review.rating}/5</span>` : `<span class="text-slate-400 text-xs">No review yet</span>`}
          </div>
          ${
            actions
              ? `<div class="grid grid-cols-3 gap-2">
            <button class="btn-soft" data-add="${place.id}"><i data-lucide="plus"></i><span>Add</span></button>
            <button class="btn-soft" data-fav="${place.id}"><i data-lucide="${saved ? "heart-off" : "heart"}"></i><span>${saved ? "Saved" : "Save"}</span></button>
            <button class="btn-soft" data-review="${place.id}"><i data-lucide="message-square"></i><span>Review</span></button>
          </div>`
              : ""
          }
        </div>
      </div>
    </article>`;
}

function hotelCard(hotel, actions = true, referencePlace = null) {
  const isSelected = App.trip && App.trip.hotelId === hotel.id;
  const isSaved = (App.favoriteHotels || []).includes(hotel.id);
  const proximity = getHotelProximityInfo(hotel, referencePlace);
  const amenitiesList = (hotel.amenities || []).slice(0, 3);

  return `
    <article class="hotel-card group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${isSelected ? "is-selected ring-2 ring-teal-500" : ""}">
      ${isSelected ? `<span class="selected-hotel-ribbon"><i class="fa-solid fa-check"></i> Selected Hotel</span>` : ""}
      <div class="relative h-52 w-full shrink-0 overflow-hidden">
        <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" src="${hotel.image}" alt="${hotel.name}" loading="lazy">
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          ${renderStarIcons(hotel.stars)}
        </div>
        <span class="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-sm font-black text-slate-900 shadow-md">
          ${money(hotel.pricePerNight)} <span class="text-xs font-bold text-slate-500">/ night</span>
        </span>
      </div>
      <div class="flex flex-1 flex-col p-5 justify-between">
        <div class="flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-black text-slate-950 dark:text-white line-clamp-1 min-h-[1.75rem]">${hotel.name}</h3>
          </div>
          <p class="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-400 line-clamp-1 min-h-[1.25rem]">
            <i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || hotel.destinationName}
          </p>
          
          <!-- Proximity Badge -->
          <div class="mt-2.5 flex items-center min-h-[1.75rem]">
            <span class="proximity-badge line-clamp-1">
              <i class="fa-solid fa-route"></i> ${proximity.label}
            </span>
          </div>

          <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[3rem]">${hotel.description}</p>
          
          <!-- Amenities Pills -->
          <div class="mt-3 flex flex-wrap gap-1.5 min-h-[1.75rem] items-center">
            ${amenitiesList.map((amenity) => `<span class="amenity-tag"><i class="fa-solid fa-circle-check text-teal-600 text-[9px]"></i> ${amenity}</span>`).join("")}
          </div>
        </div>

        <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span class="text-amber-500 font-black"><i class="fa-solid fa-star"></i> ${hotel.rating} / 5</span>
            <span>${(hotel.reviewsCount || 1200).toLocaleString()} reviews</span>
          </div>
          ${
            actions
              ? `<div class="grid grid-cols-2 gap-2">
            <button class="${isSelected ? "btn-primary" : "btn-soft"} font-black" data-select-hotel="${hotel.id}">
              <i class="fa-solid ${isSelected ? "fa-circle-check" : "fa-bed"}"></i>
              <span>${isSelected ? "Selected" : "Select for Trip"}</span>
            </button>
            <button class="btn-soft" data-fav-hotel="${hotel.id}">
              <i class="fa-solid ${isSaved ? "fa-heart text-rose-500" : "fa-heart"}"></i>
              <span>${isSaved ? "Saved" : "Favorite"}</span>
            </button>
          </div>`
              : ""
          }
        </div>
      </div>
    </article>`;
}

function bindPlaceActions(root = document) {
  qsa("[data-add]", root).forEach((button) => button.addEventListener("click", () => addToTrip(button.dataset.add)));
  qsa("[data-fav]", root).forEach((button) => button.addEventListener("click", () => toggleFavorite(button.dataset.fav)));
  qsa("[data-review]", root).forEach((button) => button.addEventListener("click", () => openReview(button.dataset.review)));
  if (window.lucide) window.lucide.createIcons();
}

function bindHotelActions(root = document) {
  qsa("[data-select-hotel]", root).forEach((button) =>
    button.addEventListener("click", () => selectTripHotel(button.dataset.selectHotel)),
  );
  qsa("[data-fav-hotel]", root).forEach((button) =>
    button.addEventListener("click", () => toggleFavoriteHotel(button.dataset.favHotel)),
  );
  if (window.lucide) window.lucide.createIcons();
}

function openReview(placeId) {
  requireAccount(() => {
    const place = placeById(placeId);
    const existing = App.reviews[placeId] || { rating: 5, note: "" };
    const modal = qs("#review-modal");
    if (!modal || !place) return;
    modal.innerHTML = `
      <div class="fixed inset-0 z-[999] grid place-items-center bg-slate-950/60 p-4">
        <form class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          <div class="flex items-start justify-between gap-4">
            <div><p class="text-sm font-bold text-teal-600">Review</p><h3 class="text-2xl font-black">${place.name}</h3></div>
            <button type="button" data-close class="icon-btn"><i data-lucide="x"></i></button>
          </div>
          <label class="mt-5 block text-sm font-bold">Rating</label>
          <input name="rating" type="range" min="1" max="5" value="${existing.rating}" class="mt-2 w-full accent-teal-500">
          <label class="mt-5 block text-sm font-bold">Notes</label>
          <textarea name="note" class="mt-2 h-28 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">${existing.note}</textarea>
          <button class="btn-primary mt-5 w-full" type="submit">Save review</button>
        </form>
      </div>`;
    qs("[data-close]", modal).addEventListener("click", () => (modal.innerHTML = ""));
    qs("form", modal).addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      App.reviews = { ...App.reviews, [placeId]: { rating: Number(form.get("rating")), note: form.get("note") } };
      modal.innerHTML = "";
      toast("Review saved");
      if (document.body.dataset.page === "destination") {
        initDestination();
      } else if (document.body.dataset.page === "favorites") {
        initFavorites();
      }
    });
    if (window.lucide) window.lucide.createIcons();
  }, "write a review");
}

function destinationFlowData() {
  const egyptDestinations = App.data.destinations.filter((destination) => destination.country === "Egypt");
  const internationalDestinations = App.data.destinations.filter((destination) => destination.country !== "Egypt");
  const internationalCountries = [...new Set(internationalDestinations.map((destination) => destination.country))];
  return { egyptDestinations, internationalDestinations, internationalCountries };
}

function setupDestinationFlow(root, ids, onChange) {
  const scopeSelect = qs(ids.scope, root);
  const countryField = qs(ids.countryField, root);
  const countrySelect = qs(ids.country, root);
  const destinationField = qs(ids.destinationField, root);
  const destinationSelect = qs(ids.destination, root);
  const placeSelect = qs(ids.place, root);
  const hotelSelect = qs(ids.hotel || "#hotel-options", root);
  const { egyptDestinations, internationalDestinations, internationalCountries } = destinationFlowData();

  const setFieldLabel = () => {
    destinationField.childNodes[0].textContent = scopeSelect.value === "domestic" ? "Governorate" : "Destination";
    countryField.classList.toggle("hidden", scopeSelect.value !== "international");
    countrySelect.required = scopeSelect.value === "international";
  };

  const currentDestinations = () => {
    if (scopeSelect.value === "domestic") return egyptDestinations;
    return internationalDestinations.filter((destination) => destination.country === countrySelect.value);
  };

  const renderCountries = () => {
    countrySelect.innerHTML = internationalCountries.map((country) => `<option value="${country}">${country}</option>`).join("");
  };

  const renderDestinations = (preferredId) => {
    const destinations = currentDestinations();
    destinationSelect.innerHTML = destinations
      .map((destination) => `<option value="${destination.id}">${destination.name}</option>`)
      .join("");
    if (preferredId && destinations.some((destination) => destination.id === preferredId)) destinationSelect.value = preferredId;
  };

  const renderPlaces = (preferredId) => {
    const destination = destinationById(destinationSelect.value);
    placeSelect.innerHTML = (destination.places || [])
      .map((place) => `<option value="${place.id}">${place.name} (${place.category})</option>`)
      .join("");
    if (preferredId && destination.places.some((place) => place.id === preferredId)) placeSelect.value = preferredId;
  };

  const renderHotels = (preferredId) => {
    if (!hotelSelect) return;
    const destination = destinationById(destinationSelect.value);
    const selectedPlace = (destination.places || []).find((p) => p.id === placeSelect.value) || destination.places[0];
    const hotels = [...(destination.hotels || [])];

    // Sort hotels by proximity to the selected place
    if (selectedPlace) {
      hotels.sort((a, b) => {
        const distA = calculateDistanceKm(a.lat, a.lng, selectedPlace.lat, selectedPlace.lng);
        const distB = calculateDistanceKm(b.lat, b.lng, selectedPlace.lat, selectedPlace.lng);
        return distA - distB;
      });
    }

    hotelSelect.innerHTML = hotels
      .map((h) => {
        const dist = selectedPlace ? calculateDistanceKm(h.lat, h.lng, selectedPlace.lat, selectedPlace.lng) : 0;
        return `<option value="${h.id}">${h.name} (${"★".repeat(h.stars)} - ${dist} km from landmark - ${money(h.pricePerNight)}/nt)</option>`;
      })
      .join("");

    if (preferredId && hotels.some((h) => h.id === preferredId)) {
      hotelSelect.value = preferredId;
    }
  };

  const sync = (preferredDestinationId, preferredPlaceId, preferredHotelId) => {
    setFieldLabel();
    renderDestinations(preferredDestinationId);
    renderPlaces(preferredPlaceId);
    renderHotels(preferredHotelId);
    if (typeof onChange === "function") {
      onChange({
        destination: destinationById(destinationSelect.value),
        place: placeById(placeSelect.value),
        hotel: hotelById(hotelSelect?.value),
      });
    }
  };

  renderCountries();
  scopeSelect.addEventListener("change", () => sync());
  countrySelect.addEventListener("change", () => sync());
  destinationSelect.addEventListener("change", () => {
    renderPlaces();
    renderHotels();
    if (typeof onChange === "function") {
      onChange({
        destination: destinationById(destinationSelect.value),
        place: placeById(placeSelect.value),
        hotel: hotelById(hotelSelect?.value),
      });
    }
  });
  placeSelect.addEventListener("change", () => {
    renderHotels();
    if (typeof onChange === "function") {
      onChange({
        destination: destinationById(destinationSelect.value),
        place: placeById(placeSelect.value),
        hotel: hotelById(hotelSelect?.value),
      });
    }
  });
  if (hotelSelect) {
    hotelSelect.addEventListener("change", () => {
      if (typeof onChange === "function") {
        onChange({
          destination: destinationById(destinationSelect.value),
          place: placeById(placeSelect.value),
          hotel: hotelById(hotelSelect.value),
        });
      }
    });
  }

  return { sync, scopeSelect, countrySelect, destinationSelect, placeSelect, hotelSelect };
}

function destinationCard(destination) {
  const isDomestic = destination.country === "Egypt";
  const placesCount = destination.places ? destination.places.length : 0;
  const hotelsCount = destination.hotels ? destination.hotels.length : 0;
  return `
    <a href="destination.html?destination=${destination.id}" class="destination-card group block rounded-2xl transition hover:-translate-y-1.5 hover:shadow-2xl">
      <img src="${destination.image}" alt="${destination.name}" loading="lazy">
      <div class="destination-card__shade">
        <div class="flex items-center justify-between gap-2">
          <span class="destination-card__tag">${isDomestic ? "Governorate • Egypt" : destination.country}</span>
          <div class="flex items-center gap-1.5">
            <span class="rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white/90 backdrop-blur-md">${placesCount} places</span>
            <span class="rounded-full bg-teal-600/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">${hotelsCount} hotels</span>
          </div>
        </div>
        <h3 class="mt-3 text-2xl font-black">${destination.name}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-100 line-clamp-2">${destination.tagline}</p>
        <div class="mt-4 flex items-center justify-between text-xs font-black text-teal-300 transition group-hover:text-teal-200">
          <span>Explore hotels & attractions</span>
          <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1.5"></i>
        </div>
      </div>
    </a>`;
}

function initHomeDestinations() {
  const grid = qs("#destination-grid");
  const emptyState = qs("#destination-empty");
  const badge = qs("#destination-count-badge");
  const searchInput = qs("#home-dest-search");
  const tabs = qsa(".dest-filter-tab");
  if (!grid) return;

  let currentScope = "all";
  let searchQuery = "";

  const render = () => {
    let list = App.data.destinations;

    if (currentScope === "domestic") {
      list = list.filter((d) => d.country === "Egypt");
    } else if (currentScope === "international") {
      list = list.filter((d) => d.country !== "Egypt");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          (d.places && d.places.some((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) ||
          (d.hotels && d.hotels.some((h) => h.name.toLowerCase().includes(q))),
      );
    }

    if (list.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
    } else {
      if (emptyState) emptyState.classList.add("hidden");
      grid.innerHTML = list.map(destinationCard).join("");
    }

    if (badge) {
      badge.textContent = `${list.length} ${list.length === 1 ? "destination" : "destinations"}`;
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentScope = tab.dataset.scope || "all";
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      render();
    });
  }

  render();
}

function initHome() {
  const hero = qs("#hero-slider");
  let index = 0;
  const paint = () => {
    const destination = App.data.destinations[index % App.data.destinations.length];
    hero.style.backgroundImage = `var(--hero-overlay), url('${destination.image}')`;
    qs("#hero-kicker").textContent = `${destination.name}, ${destination.country}`;
  };
  paint();
  setInterval(() => {
    index += 1;
    paint();
  }, 4500);

  const statDestinations = qs("#hero-stat-destinations");
  const statPlaces = qs("#hero-stat-places");
  const statHotels = qs("#hero-stat-hotels");
  if (statDestinations) statDestinations.textContent = App.data.destinations.length;
  if (statPlaces) statPlaces.textContent = App.data.destinations.reduce((acc, d) => acc + (d.places ? d.places.length : 0), 0);
  if (statHotels) statHotels.textContent = App.data.destinations.reduce((acc, d) => acc + (d.hotels ? d.hotels.length : 0), 0);

  initHomeDestinations();
}

function initPlanner() {
  const form = qs("#planner-form");
  const flow = setupDestinationFlow(
    form,
    {
      scope: "#trip-scope",
      countryField: "#country-field",
      country: "#country-options",
      destinationField: "#destination-field",
      destination: "#destination-options",
      place: "#featured-place-options",
      hotel: "#hotel-options",
    },
    () => updatePlannerPreview(form),
  );

  if (App.trip) {
    const savedDestination = destinationById(App.trip.destinationId);
    flow.scopeSelect.value = savedDestination.country === "Egypt" ? "domestic" : "international";
    if (flow.scopeSelect.value === "international") flow.countrySelect.value = savedDestination.country;
    form.days.value = App.trip.days || 4;
    form.budget.value = App.trip.budget || 1200;
    form.travelers.value = App.trip.travelers || 2;
    form.tripType.value = App.trip.tripType || "Leisure";
  }

  flow.sync(App.trip?.destinationId, App.trip?.featuredPlaceId, App.trip?.hotelId);
  qsa("input,select", form).forEach((input) => input.addEventListener("input", () => updatePlannerPreview(form)));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    requireAccount(() => {
      const previousTrip = App.trip;
      App.trip = {
        destinationId: form.destinationId.value,
        featuredPlaceId: form.featuredPlaceId.value,
        hotelId: form.hotelId?.value || destinationHotels(form.destinationId.value)[0]?.id,
        days: Number(form.days.value),
        budget: Number(form.budget.value),
        travelers: Number(form.travelers.value),
        tripType: form.tripType.value,
      };
      if (!previousTrip || previousTrip.destinationId !== form.destinationId.value) App.itinerary = {};
      const itinerary = ensureItinerary();
      itinerary[1] = [...new Set([...(itinerary[1] || []), form.featuredPlaceId.value])];
      App.itinerary = itinerary;
      location.href = `destination.html?destination=${form.destinationId.value}`;
    });
  });
}

function updatePlannerPreview(form) {
  const destination = destinationById(form.destinationId.value);
  const selectedPlace = destination.places.find((place) => place.id === form.featuredPlaceId?.value) || destination.places[0];
  const hotel = hotelById(form.hotelId?.value) || destination.hotels?.[0];
  const days = Number(form.days.value || 1);
  const hotelStayTotal = hotel ? hotel.pricePerNight * days : 0;
  const initialActivitiesTotal = selectedPlace ? selectedPlace.price : 0;
  const totalEstimated = hotelStayTotal + initialActivitiesTotal;
  const dist = (hotel && selectedPlace) ? calculateDistanceKm(hotel.lat, hotel.lng, selectedPlace.lat, selectedPlace.lng) : 0;

  qs("#planner-preview").innerHTML = `
    <div class="relative overflow-hidden rounded-2xl shadow-md">
      <img src="${destination.image}" class="h-64 w-full object-cover" alt="${destination.name}">
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 text-white">
        <p class="text-xs font-black uppercase tracking-[.18em] text-teal-200">${destination.country}</p>
        <h2 class="mt-1 text-2xl font-black">${destination.name}</h2>
      </div>
    </div>

    <div class="mt-5 space-y-4 text-sm">
      <!-- Destination Weather -->
      <div class="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950">
        <p class="font-bold text-slate-700 dark:text-slate-300">
          <i class="fa-solid fa-cloud-sun text-amber-500 mr-1.5"></i>
          <strong>${destination.name}</strong> is ${destination.weather.tempC}°C and ${destination.weather.season.toLowerCase()} right now.
        </p>
      </div>

      <!-- Primary Place Preview -->
      <div class="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
        <p class="text-xs font-black uppercase text-teal-600">First Stop Attraction</p>
        <p class="font-black text-slate-900 dark:text-white mt-1">${selectedPlace.name}</p>
        <p class="text-xs text-slate-500 mt-0.5">${selectedPlace.category} • ${money(selectedPlace.price)}</p>
      </div>

      <!-- Recommended Hotel Preview -->
      ${
        hotel
          ? `<div class="rounded-xl border border-teal-500/30 bg-teal-50/50 p-3.5 dark:bg-teal-950/30">
        <div class="flex items-center justify-between">
          <p class="text-xs font-black uppercase text-teal-700 dark:text-teal-300">Selected Hotel</p>
          ${renderStarIcons(hotel.stars)}
        </div>
        <p class="font-black text-slate-900 dark:text-white mt-1.5">${hotel.name}</p>
        <p class="text-xs font-semibold text-slate-500 mt-0.5">
          <i class="fa-solid fa-route text-teal-600"></i> ${dist} km from ${selectedPlace.name}
        </p>
        <p class="text-xs font-bold text-teal-700 dark:text-teal-300 mt-2">
          ${money(hotel.pricePerNight)} / night × ${days} nights = <strong>${money(hotelStayTotal)}</strong>
        </p>
      </div>`
          : ""
      }

      <!-- Cost Breakdown Widget -->
      <div class="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/70">
        <p class="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Estimated Initial Total</p>
        <div class="flex justify-between text-xs font-semibold">
          <span>Hotel Stay (${days} nights):</span>
          <span>${money(hotelStayTotal)}</span>
        </div>
        <div class="flex justify-between text-xs font-semibold mt-1">
          <span>Attractions (${selectedPlace.name}):</span>
          <span>${money(initialActivitiesTotal)}</span>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-700 mt-2.5 pt-2 flex justify-between font-black text-base">
          <span>Est. Trip Total:</span>
          <span class="text-teal-600 dark:text-teal-300">${money(totalEstimated)}</span>
        </div>
        <div class="text-right text-xs text-slate-400 mt-0.5">Budget: ${money(Number(form.budget.value || 0))}</div>
      </div>
    </div>`;
}

function updateDestinationActiveTripStatus() {
  const banner = qs("#trip-hotel-status");
  if (!banner) return;
  const hotel = selectedTripHotel();
  const plannedCount = getPlannedPlaceObjects().length;

  if (App.trip && (hotel || plannedCount > 0)) {
    banner.classList.remove("hidden");
    banner.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">Your Current Active Trip</p>
          <p class="font-black text-slate-900 dark:text-white mt-0.5">
            ${hotel ? `🏨 Stay: <strong>${hotel.name}</strong> (${"★".repeat(hotel.stars)})` : "No hotel chosen yet"} • 📍 ${plannedCount} activities selected
          </p>
        </div>
        <a href="my-trip.html" class="btn-primary py-2 px-4 text-xs font-black">
          <i class="fa-solid fa-list-check"></i> View Trip Schedule
        </a>
      </div>`;
  } else {
    banner.classList.add("hidden");
  }
}

function initDestination() {
  const destination = activeDestination();
  const params = new URLSearchParams(location.search);
  let activeTab = params.get("view") === "hotels" ? "hotels" : "places";

  qs("#destination-hero").style.backgroundImage = `var(--hero-overlay), url('${destination.image}')`;
  qs("#destination-title").textContent = destination.name;
  qs("#destination-copy").textContent = destination.tagline;
  qs("#weather-card").innerHTML = `
    <i data-lucide="sun" class="text-amber-500"></i>
    <b>${destination.weather.tempC}°C</b>
    <span>${destination.weather.season} • Humidity ${destination.weather.humidity}% • Wind ${destination.weather.windKph} kph</span>`;

  updateDestinationActiveTripStatus();

  // Places setup
  const places = destination.places || [];
  const hotels = destination.hotels || [];

  if (qs("#places-badge-count")) qs("#places-badge-count").textContent = places.length;
  if (qs("#hotels-badge-count")) qs("#hotels-badge-count").textContent = hotels.length;

  // View Switcher Tabs (Places vs Hotels)
  const tabPlacesBtn = qs("#tab-places-btn");
  const tabHotelsBtn = qs("#tab-hotels-btn");
  const placesFilterBox = qs("#places-filter-box");
  const hotelsFilterBox = qs("#hotels-filter-box");
  const placesGrid = qs("#places-grid");
  const hotelsGrid = qs("#hotels-grid");
  const viewIndicator = qs("#view-indicator-text");

  const switchView = (tab) => {
    activeTab = tab;
    if (tab === "places") {
      tabPlacesBtn.classList.add("active");
      tabHotelsBtn.classList.remove("active");
      placesFilterBox.classList.remove("hidden");
      hotelsFilterBox.classList.add("hidden");
      placesGrid.classList.remove("hidden");
      hotelsGrid.classList.add("hidden");
      if (viewIndicator) viewIndicator.textContent = `Showing ${places.length} curated attractions in ${destination.name}`;
      renderPlacesList();
    } else {
      tabHotelsBtn.classList.add("active");
      tabPlacesBtn.classList.remove("active");
      hotelsFilterBox.classList.remove("hidden");
      placesFilterBox.classList.add("hidden");
      hotelsGrid.classList.remove("hidden");
      placesGrid.classList.add("hidden");
      if (viewIndicator) viewIndicator.textContent = `Showing ${hotels.length} verified real hotels in ${destination.name}`;
      renderHotelsList();
    }
  };

  if (tabPlacesBtn) tabPlacesBtn.addEventListener("click", () => switchView("places"));
  if (tabHotelsBtn) tabHotelsBtn.addEventListener("click", () => switchView("hotels"));

  // 1. Places Rendering Logic
  const categories = ["All", ...new Set(places.map((place) => place.category))];
  qs("#category-filter").innerHTML = categories
    .map((category) => `<button class="chip" data-category="${category}">${category}</button>`)
    .join("");

  let placeCategory = "All";
  let placeSearch = "";
  let placeSort = "featured";

  const renderPlacesList = () => {
    let list = places.map((place) => ({ ...place, destinationName: destination.name, destinationId: destination.id }));
    list = list.filter(
      (place) =>
        (placeCategory === "All" || place.category === placeCategory) &&
        (place.name.toLowerCase().includes(placeSearch.toLowerCase()) ||
          place.description.toLowerCase().includes(placeSearch.toLowerCase())),
    );
    if (placeSort === "low") list.sort((a, b) => a.price - b.price);
    if (placeSort === "high") list.sort((a, b) => b.price - a.price);

    placesGrid.innerHTML =
      list.map((place) => placeCard(place)).join("") ||
      `<p class="rounded-2xl bg-white p-6 text-slate-500 dark:bg-slate-900 col-span-2 text-center">No places match your filters.</p>`;
    bindPlaceActions(placesGrid);
    renderMap(destination, list, hotels, "destination-map");
  };

  qsa("[data-category]").forEach((button) =>
    button.addEventListener("click", () => {
      placeCategory = button.dataset.category;
      qsa("[data-category]").forEach((item) => item.classList.remove("chip-active"));
      button.classList.add("chip-active");
      renderPlacesList();
    }),
  );
  qs("[data-category]")?.classList.add("chip-active");

  qs("#place-search")?.addEventListener("input", (event) => {
    placeSearch = event.target.value;
    renderPlacesList();
  });
  qs("#price-sort")?.addEventListener("change", (event) => {
    placeSort = event.target.value;
    renderPlacesList();
  });

  // 2. Hotels Rendering Logic
  let hotelStar = "all";
  let hotelSearch = "";
  let hotelSort = "proximity";

  const renderHotelsList = () => {
    let list = hotels.map((h) => ({ ...h, destinationName: destination.name, destinationId: destination.id }));

    // Filter by Stars
    if (hotelStar !== "all") {
      list = list.filter((h) => h.stars === Number(hotelStar));
    }

    // Filter by Search
    if (hotelSearch.trim()) {
      const q = hotelSearch.toLowerCase().trim();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          (h.amenities && h.amenities.some((a) => a.toLowerCase().includes(q))),
      );
    }

    // Sort Hotels
    if (hotelSort === "proximity") {
      list.sort((a, b) => {
        const infoA = getHotelProximityInfo(a);
        const infoB = getHotelProximityInfo(b);
        return infoA.distance - infoB.distance;
      });
    } else if (hotelSort === "stars-high") {
      list.sort((a, b) => b.stars - a.stars);
    } else if (hotelSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (hotelSort === "price-low") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (hotelSort === "price-high") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    hotelsGrid.innerHTML =
      list.map((hotel) => hotelCard(hotel)).join("") ||
      `<p class="rounded-2xl bg-white p-6 text-slate-500 dark:bg-slate-900 col-span-2 text-center">No hotels match your filters.</p>`;
    bindHotelActions(hotelsGrid);
    renderMap(destination, places, list, "destination-map");
  };

  qsa("[data-star]").forEach((button) =>
    button.addEventListener("click", () => {
      hotelStar = button.dataset.star;
      qsa("[data-star]").forEach((item) => item.classList.remove("chip-active"));
      button.classList.add("chip-active");
      renderHotelsList();
    }),
  );

  qs("#hotel-search")?.addEventListener("input", (event) => {
    hotelSearch = event.target.value;
    renderHotelsList();
  });
  qs("#hotel-sort")?.addEventListener("change", (event) => {
    hotelSort = event.target.value;
    renderHotelsList();
  });

  // Initial paint based on activeTab
  switchView(activeTab);
}

function renderMap(destination, places = [], hotels = [], id = "destination-map") {
  if (!window.L || !qs(`#${id}`)) return;
  if (window.__wanderlyMap) window.__wanderlyMap.remove();

  const map = L.map(id, { scrollWheelZoom: false }).setView([destination.lat, destination.lng], 11);
  window.__wanderlyMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Custom icons
  const placeIcon = L.divIcon({
    className: "custom-place-pin",
    html: `<div class="grid place-items-center size-8 rounded-full bg-teal-600 text-white shadow-lg border-2 border-white"><i class="fa-solid fa-landmark text-xs"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const hotelIcon = L.divIcon({
    className: "custom-hotel-pin",
    html: `<div class="grid place-items-center size-8 rounded-full bg-amber-500 text-white shadow-lg border-2 border-white"><i class="fa-solid fa-bed text-xs"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const bounds = [];

  // Add Places Markers
  (places || []).forEach((place) => {
    if (place.lat && place.lng) {
      bounds.push([place.lat, place.lng]);
      L.marker([place.lat, place.lng], { icon: placeIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <b class="text-sm text-slate-900">${place.name}</b>
            <p class="text-xs text-slate-500 mt-0.5">${place.category} • ${money(place.price)}</p>
          </div>`);
    }
  });

  // Add Hotel Markers
  (hotels || []).forEach((hotel) => {
    if (hotel.lat && hotel.lng) {
      bounds.push([hotel.lat, hotel.lng]);
      L.marker([hotel.lat, hotel.lng], { icon: hotelIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <div class="flex items-center gap-1">${renderStarIcons(hotel.stars)}</div>
            <b class="text-sm text-slate-900 mt-1 block">${hotel.name}</b>
            <p class="text-xs text-teal-700 font-bold mt-0.5">${money(hotel.pricePerNight)} / night</p>
          </div>`);
    }
  });

  if (bounds.length > 1) {
    try {
      map.fitBounds(bounds, { padding: [30, 30] });
    } catch (e) {}
  }

  setTimeout(() => map.invalidateSize(), 100);
}

function initTrip() {
  if (!App.trip) {
    qs("#trip-empty")?.classList.remove("hidden");
    qs("#trip-content")?.classList.add("hidden");
    return;
  }
  qs("#trip-empty")?.classList.add("hidden");
  qs("#trip-content")?.classList.remove("hidden");

  const destination = destinationById(App.trip.destinationId);
  const hotel = selectedTripHotel();

  qs("#trip-title").textContent = `${destination.name} Itinerary`;
  qs("#trip-subtitle").textContent = `${App.trip.days} days • ${App.trip.travelers} travelers • ${App.trip.tripType} Trip`;

  renderTripHotelCard();
  ensureItinerary();
  renderItinerary();
}

function renderTripHotelCard() {
  const root = qs("#trip-hotel-card");
  if (!root) return;
  const hotel = selectedTripHotel();
  const destination = destinationById(App.trip.destinationId);
  const days = Math.max(1, App.trip.days);
  const totalStay = (hotel?.pricePerNight || 0) * days;

  if (!hotel) {
    root.innerHTML = `
      <div class="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:bg-amber-950/30 flex items-center justify-between">
        <div>
          <p class="font-black text-amber-800 dark:text-amber-200">No hotel selected for this trip</p>
          <p class="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Pick a hotel to calculate stay costs and distance to your activities.</p>
        </div>
        <a href="destination.html?destination=${destination.id}&view=hotels" class="btn-primary py-2 px-4 text-xs font-black">Choose Hotel</a>
      </div>`;
    return;
  }

  const proximity = getHotelProximityInfo(hotel);

  root.innerHTML = `
    <section class="overflow-hidden rounded-2xl border border-teal-500/40 bg-white p-5 shadow-lg dark:bg-slate-900 grid gap-5 md:grid-cols-[180px_1fr_auto] items-center">
      <div class="h-32 w-full overflow-hidden rounded-xl">
        <img src="${hotel.image}" class="h-full w-full object-cover" alt="${hotel.name}">
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase text-teal-600">Selected Accommodation</span>
          ${renderStarIcons(hotel.stars)}
        </div>
        <h3 class="text-xl font-black text-slate-950 dark:text-white mt-1">${hotel.name}</h3>
        <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || hotel.destinationName}
        </p>
        <div class="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <span class="proximity-badge"><i class="fa-solid fa-route"></i> ${proximity.label}</span>
          <span class="font-bold text-slate-600 dark:text-slate-300">
            ${money(hotel.pricePerNight)} / night × ${days} nights = <strong class="text-teal-600 dark:text-teal-300 text-sm">${money(totalStay)}</strong>
          </span>
        </div>
      </div>
      <div class="flex md:flex-col gap-2 justify-end">
        <a href="destination.html?destination=${destination.id}&view=hotels" class="btn-soft text-xs font-black whitespace-nowrap">
          <i class="fa-solid fa-arrow-right-arrow-left"></i> Change Hotel
        </a>
      </div>
    </section>`;
}

function renderItinerary() {
  const itinerary = App.itinerary;
  const days = Object.keys(itinerary);
  qs("#day-columns").innerHTML = days
    .map(
      (day) => `
    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 class="mb-4 flex items-center justify-between text-lg font-black">
        Day ${day}
        <span class="text-xs font-bold rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          ${itinerary[day].length} stops
        </span>
      </h3>
      <div class="min-h-60 space-y-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950" data-day="${day}">
        ${itinerary[day].map((id) => tripItem(id)).join("") || `<p class="p-4 text-sm text-center text-slate-400">Drag & drop activities here</p>`}
      </div>
    </section>`,
    )
    .join("");

  qsa("[draggable]").forEach((item) => {
    item.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", item.dataset.place));
  });
  qsa("[data-day]").forEach((column) => {
    column.addEventListener("dragover", (event) => event.preventDefault());
    column.addEventListener("drop", (event) => {
      event.preventDefault();
      movePlace(event.dataTransfer.getData("text/plain"), column.dataset.day);
    });
  });
  qsa("[data-remove-trip]").forEach((button) =>
    button.addEventListener("click", () => {
      removeFromTrip(button.dataset.removeTrip);
    }),
  );
  updateBudget();
  if (window.lucide) window.lucide.createIcons();
}

function tripItem(id) {
  const place = placeById(id);
  const hotel = selectedTripHotel();
  if (!place) return "";
  const dist = hotel ? calculateDistanceKm(hotel.lat, hotel.lng, place.lat, place.lng) : null;

  return `
    <article draggable="true" data-place="${id}" class="cursor-grab rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 transition hover:shadow-md">
      <div class="flex gap-3">
        <img src="${place.image}" alt="${place.name}" class="size-16 rounded-xl object-cover">
        <div class="min-w-0 flex-1">
          <h4 class="truncate font-black text-sm text-slate-950 dark:text-white">${place.name}</h4>
          <p class="text-xs text-slate-500">${place.category} • ${money(place.price)}</p>
          ${dist !== null ? `<p class="text-[11px] font-bold text-teal-600 mt-1"><i class="fa-solid fa-route"></i> ${dist} km from hotel</p>` : ""}
        </div>
        <button class="icon-btn size-8" data-remove-trip="${id}" aria-label="Remove"><i data-lucide="trash-2"></i></button>
      </div>
    </article>`;
}

function movePlace(placeId, targetDay) {
  const itinerary = App.itinerary;
  Object.keys(itinerary).forEach((day) => {
    itinerary[day] = itinerary[day].filter((id) => id !== placeId);
  });
  itinerary[targetDay] = [...itinerary[targetDay], placeId];
  App.itinerary = itinerary;
  renderItinerary();
}

function removeFromTrip(placeId) {
  const itinerary = App.itinerary;
  Object.keys(itinerary).forEach((day) => {
    itinerary[day] = itinerary[day].filter((id) => id !== placeId);
  });
  App.itinerary = itinerary;
  renderItinerary();
}

function updateBudget() {
  const budget = App.trip?.budget || 0;
  const activitiesTotal = totalActivitiesCost();
  const hotelTotal = totalAccommodationsCost();
  const total = activitiesTotal + hotelTotal;
  const percent = budget ? Math.min(100, Math.round((total / budget) * 100)) : 0;
  const isOver = total > budget;
  const state = isOver ? "text-rose-600 bg-rose-50 dark:bg-rose-950" : "text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-200";

  qs("#budget-widget").innerHTML = `
    <div class="rounded-2xl p-5 ${state}">
      <p class="text-xs font-black uppercase tracking-wider">Estimated Total Trip Spend</p>
      <p class="mt-1 text-3xl font-black">${money(total)} <span class="text-base font-bold opacity-70">/ ${money(budget)}</span></p>
      
      <div class="mt-3 h-3 overflow-hidden rounded-full bg-white/60 dark:bg-slate-900">
        <div class="h-full rounded-full ${isOver ? "bg-rose-500" : "bg-teal-500"}" style="width:${percent}%"></div>
      </div>
      
      <div class="mt-4 pt-3 border-t border-black/10 dark:border-white/10 space-y-1.5 text-xs font-bold">
        <div class="flex justify-between">
          <span>🏨 Hotel Stay (${App.trip?.days || 1} nights):</span>
          <span>${money(hotelTotal)}</span>
        </div>
        <div class="flex justify-between">
          <span>🎟️ Activities (${getPlannedPlaceObjects().length} places):</span>
          <span>${money(activitiesTotal)}</span>
        </div>
      </div>

      <p class="mt-3 text-xs font-semibold">
        ${isOver ? "⚠️ Over budget. Consider switching to a 3-star or 4-star hotel or raising your budget." : "✓ Looking balanced. You have room for extra experiences."}
      </p>
    </div>`;
}

function initFavorites() {
  const places = (App.favorites || []).map(placeById).filter(Boolean);
  const hotels = (App.favoriteHotels || []).map(hotelById).filter(Boolean);

  if (places.length === 0 && hotels.length === 0) {
    qs("#favorites-grid").innerHTML = `
      <div class="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-slate-900 col-span-3">
        <h2 class="text-2xl font-black">No favorites yet</h2>
        <p class="mt-2 text-slate-500">Explore destinations and save hotels and attractions you love.</p>
        <a class="btn-primary mt-6 inline-flex" href="destination.html">Explore places & hotels</a>
      </div>`;
    return;
  }

  let html = "";
  if (hotels.length > 0) {
    html += `<div class="col-span-full"><h2 class="text-2xl font-black mb-4">Saved Hotels (${hotels.length})</h2></div>`;
    html += hotels.map((h) => hotelCard(h)).join("");
  }
  if (places.length > 0) {
    html += `<div class="col-span-full mt-6"><h2 class="text-2xl font-black mb-4">Saved Attractions (${places.length})</h2></div>`;
    html += places.map((p) => placeCard(p)).join("");
  }

  qs("#favorites-grid").innerHTML = html;
  bindPlaceActions(qs("#favorites-grid"));
  bindHotelActions(qs("#favorites-grid"));
}

function initSummary() {
  if (!App.trip) {
    qs("#summary-report").innerHTML = `
      <div class="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-slate-900">
        <h1 class="text-3xl font-black">No active trip</h1>
        <a href="planner.html" class="btn-primary mt-6 inline-flex">Start planning</a>
      </div>`;
    return;
  }

  const destination = destinationById(App.trip.destinationId);
  const hotel = selectedTripHotel();
  const itinerary = ensureItinerary();
  const plannedPlaces = Object.values(itinerary).flat().map(placeById).filter(Boolean);
  const days = Math.max(1, App.trip.days);
  const hotelCost = (hotel?.pricePerNight || 0) * days;
  const activitiesCost = totalActivitiesCost();
  const total = hotelCost + activitiesCost;

  qs("#summary-report").innerHTML = `
    <!-- Summary Header Card -->
    <section class="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900">
      <img src="${destination.image}" class="h-64 w-full object-cover" alt="${destination.name}">
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between">
          <p class="font-bold text-teal-600">${destination.country}</p>
          <span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 dark:bg-teal-950 dark:text-teal-200">
            ${App.trip.tripType} Trip
          </span>
        </div>
        <h1 class="text-4xl font-black mt-1">${destination.name} Trip Summary</h1>
        <p class="mt-2 text-slate-500">${days} days • ${App.trip.travelers} travelers • ${plannedPlaces.length} scheduled stops</p>
        
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="stat"><span>Activities</span><b>${plannedPlaces.length}</b></div>
          <div class="stat"><span>Hotel Stay</span><b>${hotel ? money(hotelCost) : "$0"}</b></div>
          <div class="stat"><span>Total Estimated</span><b class="text-teal-600 dark:text-teal-300">${money(total)}</b></div>
          <div class="stat"><span>Trip Budget</span><b>${money(App.trip.budget)}</b></div>
        </div>
      </div>
    </section>

    <!-- Selected Hotel Section -->
    ${
      hotel
        ? `
    <section class="mt-6 rounded-2xl border border-teal-500/30 bg-white p-6 shadow-sm dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <p class="text-xs font-black uppercase text-teal-600">Reserved Accommodation</p>
          <h2 class="text-2xl font-black text-slate-950 dark:text-white mt-0.5">${hotel.name}</h2>
        </div>
        <div class="flex items-center gap-2">
          ${renderStarIcons(hotel.stars)}
          <span class="font-black text-teal-600 text-lg">${money(hotel.pricePerNight)} / night</span>
        </div>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-[160px_1fr]">
        <img src="${hotel.image}" class="h-32 w-full rounded-xl object-cover" alt="${hotel.name}">
        <div>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">${hotel.description}</p>
          <p class="text-xs text-slate-400 mt-2"><i class="fa-solid fa-location-dot text-teal-600"></i> ${hotel.address || destination.name}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            ${(hotel.amenities || []).map((a) => `<span class="amenity-tag">${a}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>`
        : ""
    }

    <!-- Daily Breakdown & Map -->
    <section class="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <div class="space-y-4">
        <h2 class="text-2xl font-black">Daily Program</h2>
        ${Object.keys(itinerary)
          .map(
            (day) => `
          <div class="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
            <h3 class="text-xl font-black flex items-center justify-between">
              Day ${day}
              <span class="text-xs text-slate-400 font-bold">${itinerary[day].length} stops</span>
            </h3>
            <div class="mt-4 space-y-3">
              ${
                itinerary[day]
                  .map((id) => {
                    const place = placeById(id);
                    if (!place) return "";
                    const dist = hotel ? calculateDistanceKm(hotel.lat, hotel.lng, place.lat, place.lng) : null;
                    return `
                  <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950">
                    <div>
                      <p class="font-black text-slate-900 dark:text-white">${place.name}</p>
                      <p class="text-xs text-slate-400">${place.category} ${dist !== null ? `• ${dist} km from hotel` : ""}</p>
                    </div>
                    <b class="text-teal-600 font-bold">${money(place.price)}</b>
                  </div>`;
                  })
                  .join("") || `<p class="text-sm text-slate-400">No activities scheduled for this day.</p>`
              }
            </div>
          </div>`,
          )
          .join("")}
      </div>

      <!-- Map -->
      <div class="space-y-4">
        <h2 class="text-2xl font-black">Trip Route Map</h2>
        <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <div id="summary-map" class="h-[460px] rounded-2xl"></div>
        </div>
      </div>
    </section>`;

  renderMap(destination, plannedPlaces.length ? plannedPlaces : destination.places, hotel ? [hotel] : [], "summary-map");

  qs("#export-pdf")?.addEventListener("click", () => {
    toast("Generating PDF report...");
    html2pdf()
      .set({ margin: 0.4, filename: `${destination.name.toLowerCase()}-wanderly-trip-summary.pdf` })
      .from(qs("#summary-report"))
      .save();
  });
  qs("#save-trip")?.addEventListener("click", () => toast("Trip successfully saved to your device"));
  qs("#start-over")?.addEventListener("click", () => {
    ["trip", "itinerary"].forEach((key) => Store.remove(key));
    location.href = "planner.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  const page = document.body.dataset.page;
  const step =
    { home: "Setup", planner: "Setup", destination: "Explore", trip: "Plan", favorites: "Explore", summary: "Summary" }[page] ||
    "Setup";
  injectShell(step);
  if (page === "home") initHome();
  if (page === "planner") initPlanner();
  if (page === "destination") initDestination();
  if (page === "trip") initTrip();
  if (page === "favorites") initFavorites();
  if (page === "summary") initSummary();
});
