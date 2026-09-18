/* =========================================================
   Spanos Restaurant Pizzeria — script principal
   -----------------------------------------------------------
   ASTUCE : pour mettre le site à jour avec les vraies
   coordonnées du restaurant, il suffit de modifier l'objet
   RESTAURANT ci-dessous. Tout le site (carte, bouton GPS,
   téléphone, adresse, pied de page) se met à jour tout seul.
   ========================================================= */

const RESTAURANT = {
  name: "Spanos Restaurant & Pizzeria",
  addressLine1: "481-C Boulevard Lacombe",
  addressLine2: "Repentigny, QC J5Z 4G4",
  fullAddress: "481-C Boulevard Lacombe, Repentigny, QC J5Z 4G4, Canada",
  phoneDisplay: "(450) 585-4444",
  phoneHref: "+14505854444",
  email: "info@spanosrestaurant.ca",
  // Horaires confirmés directement par le propriétaire : fermeture à 22h,
  // 7 jours sur 7 (le menu papier affichait 23h mais n'était plus à jour).
  hours: [
    { day: "Lundi", hours: "11 h 00 – 22 h 00" },
    { day: "Mardi", hours: "11 h 00 – 22 h 00" },
    { day: "Mercredi", hours: "11 h 00 – 22 h 00" },
    { day: "Jeudi", hours: "11 h 00 – 22 h 00" },
    { day: "Vendredi", hours: "11 h 00 – 22 h 00" },
    { day: "Samedi", hours: "11 h 00 – 22 h 00" },
    { day: "Dimanche", hours: "11 h 00 – 22 h 00" },
  ],
  // Liens de commande en ligne (fiches confirmées des plateformes)
  orderLinks: {
    uberEats:
      "https://www.ubereats.com/ca/store/restaurant-pizzeria-spanos-481c-boulevard-lacombe/mmIQHeAgUI6xMu_-8XINiA",
    doorDash:
      "https://www.doordash.com/store/restaurant-pizzeria-spanos-repentigny-37369335/",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  populateRestaurantInfo();
  setupNavToggle();
  setupTextSizeControl();
  setupBackToTop();
  setupGalleryReveal();
});

function populateRestaurantInfo() {
  // Adresse (peut apparaître plusieurs fois sur la page)
  document.querySelectorAll("[data-address-line1]").forEach((el) => {
    el.textContent = RESTAURANT.addressLine1;
  });
  document.querySelectorAll("[data-address-line2]").forEach((el) => {
    el.textContent = RESTAURANT.addressLine2;
  });

  // Téléphone : texte affiché + lien tel:
  document.querySelectorAll("[data-phone-display]").forEach((el) => {
    el.textContent = RESTAURANT.phoneDisplay;
  });
  document.querySelectorAll("a[data-phone-link]").forEach((el) => {
    el.href = `tel:${RESTAURANT.phoneHref}`;
  });

  // Courriel
  document.querySelectorAll("[data-email-display]").forEach((el) => {
    el.textContent = RESTAURANT.email;
  });
  document.querySelectorAll("a[data-email-link]").forEach((el) => {
    el.href = `mailto:${RESTAURANT.email}`;
  });

  // Lien "itinéraire" (GPS) — ouvre Google Maps directement,
  // sur l'appli mobile si disponible, sinon dans le navigateur.
  const mapsDirectionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(RESTAURANT.fullAddress);
  document.querySelectorAll("a[data-gps-link]").forEach((el) => {
    el.href = mapsDirectionsUrl;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Liens "commander en ligne" (UberEats / DoorDash)
  document.querySelectorAll("a[data-order-ubereats]").forEach((el) => {
    el.href = RESTAURANT.orderLinks.uberEats;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
  document.querySelectorAll("a[data-order-doordash]").forEach((el) => {
    el.href = RESTAURANT.orderLinks.doorDash;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Carte intégrée (iframe Google Maps, aucune clé API requise)
  document.querySelectorAll("iframe[data-map-embed]").forEach((el) => {
    el.src =
      "https://maps.google.com/maps?q=" +
      encodeURIComponent(RESTAURANT.fullAddress) +
      "&t=&z=15&ie=UTF8&iwloc=&output=embed";
  });

  // Horaires
  const hoursLists = document.querySelectorAll("[data-hours-list]");
  hoursLists.forEach((list) => {
    list.innerHTML = "";
    RESTAURANT.hours.forEach(({ day, hours }) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="day">${day}</span><span>${hours}</span>`;
      list.appendChild(li);
    });
  });

  // Année du pied de page
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Réglage de la taille du texte : pensé pour les yeux fatigués.
   Le réglage est mémorisé d'une visite à l'autre. */
function setupTextSizeControl() {
  const root = document.documentElement;
  const STEP = 0.1;
  const MIN = 0.9;
  const MAX = 1.5;
  let scale = 1;

  try {
    const saved = localStorage.getItem("spanos-text-scale");
    if (saved) scale = parseFloat(saved);
  } catch (e) {
    /* stockage indisponible : on continue avec la valeur par défaut */
  }

  applyScale();

  document.querySelectorAll("[data-text-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-text-size");
      if (action === "increase") scale = Math.min(MAX, scale + STEP);
      else if (action === "decrease") scale = Math.max(MIN, scale - STEP);
      else scale = 1;
      applyScale();
      try {
        localStorage.setItem("spanos-text-scale", String(scale));
      } catch (e) {
        /* stockage indisponible : le réglage ne sera pas mémorisé */
      }
    });
  });

  function applyScale() {
    root.style.setProperty("--text-scale", scale.toFixed(2));
  }
}

/* Galerie « photos éparpillées » : chaque photo s'anime une seule fois,
   au moment où elle entre dans l'écran en défilant — jamais en boucle,
   pour rester confortable pour les visiteurs sensibles au mouvement. */
function setupGalleryReveal() {
  const items = document.querySelectorAll(".gallery-mosaic .reveal");
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function setupBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
