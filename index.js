const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const routeLinks = Array.from(document.querySelectorAll(".brand, a[href^='#']"));
const routeSections = Array.from(document.querySelectorAll("main > section[id]"));
const siteFooter = document.querySelector(".site-footer");
const reel = document.querySelector("[data-video-reel]");
const whatsappNumber = "254713111666";
const defaultWhatsappText = "Hello Jixels, I would like to learn more about your products, partnerships or support.";
const routeIds = new Set([
  "home",
  "about-us",
  "vision-mission",
  "how-it-works",
  "what-we-do",
  "electronics",
  "gallery",
  "feedback",
  "leadership",
  "contact",
  "tenje-values",
  "problem",
  "community-impact",
  "success-stories",
  "partner-with-jixels",
  "outlets",
  "privacy",
]);

const getRouteId = (hash) => {
  const id = hash.replace("#", "") || "home";
  return id === "management" ? "leadership" : id;
};

const showRoute = (id, shouldScroll = true) => {
  const routeId = routeIds.has(id) ? id : "home";
  const isHome = routeId === "home";

  document.body.classList.toggle("single-section-view", !isHome);

  routeSections.forEach((section) => {
    section.classList.toggle("route-active", !isHome && section.id === routeId);
  });

  if (siteFooter) {
    siteFooter.classList.toggle("route-active", !isHome && siteFooter.id === routeId);
  }

  routeLinks.forEach((link) => {
    const linkId = getRouteId(link.hash || "");
    link.classList.toggle("active", routeIds.has(linkId) && linkId === routeId);
  });

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: isHome ? "smooth" : "auto" });
  }
};

const buildWhatsappUrl = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
};

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.href = buildWhatsappUrl(defaultWhatsappText);
});

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const routeId = getRouteId(link.hash || "");

    if (!routeIds.has(routeId)) {
      return;
    }

    event.preventDefault();
    history.pushState(null, "", `#${routeId}`);
    showRoute(routeId);
  });
});

window.addEventListener("hashchange", () => {
  showRoute(getRouteId(window.location.hash));
});

window.addEventListener("popstate", () => {
  showRoute(getRouteId(window.location.hash));
});

showRoute(getRouteId(window.location.hash), false);

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formType = form.dataset.formType || "Website contact";
    const lines = [`${formType} from Jixels website`];

    ["name", "location", "interest", "contact", "message"].forEach((key) => {
      const value = String(formData.get(key) || "").trim();

      if (value) {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        lines.push(`${label}: ${value}`);
      }
    });

    window.open(buildWhatsappUrl(lines.join("\n")), "_blank", "noopener");
  });
});

const teamSearch = document.querySelector("[data-team-search]");
const teamCards = Array.from(document.querySelectorAll("[data-team-card]"));

if (teamSearch && teamCards.length) {
  teamSearch.addEventListener("input", () => {
    const query = teamSearch.value.trim().toLowerCase();

    teamCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.hidden = query !== "" && !text.includes(query);
    });
  });
}

if (reel) {
  const slides = Array.from(reel.querySelectorAll(".reel-slide"));
  const player = reel.closest(".video-player") || document;
  const toggle = player.querySelector(".reel-toggle");
  const progress = player.querySelector(".reel-progress span");
  const interval = 4200;
  let activeIndex = 0;
  let startedAt = Date.now();
  let frameId;
  let playing = false;

  const showSlide = (index) => {
    slides[activeIndex].classList.remove("active");
    activeIndex = index % slides.length;
    slides[activeIndex].classList.add("active");
    startedAt = Date.now();
  };

  const tick = () => {
    if (playing) {
      const elapsed = Date.now() - startedAt;
      const percent = Math.min((elapsed / interval) * 100, 100);
      progress.style.width = `${percent}%`;

      if (elapsed >= interval) {
        showSlide(activeIndex + 1);
      }
    } else {
      progress.style.width = "0";
    }

    frameId = window.requestAnimationFrame(tick);
  };

  if (toggle && progress && slides.length) {
    toggle.addEventListener("click", () => {
      playing = !playing;
      toggle.textContent = playing ? "Pause" : "Play";
      toggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} video reel`);

      if (playing) {
        showSlide(activeIndex + 1);
      } else {
        startedAt = Date.now();
      }
    });
  }

  frameId = window.requestAnimationFrame(tick);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frameId);
  });
}
