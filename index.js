const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const topButton = document.querySelector(".top-button");
const reel = document.querySelector("[data-video-reel]");
const whatsappNumber = ""; // Add the Jixels WhatsApp number here, e.g. 254700000000.
const defaultWhatsappText = "Hello Jixels, I would like to contact the team.";

const buildWhatsappUrl = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
};

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.href = buildWhatsappUrl(defaultWhatsappText);
});

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

if (topButton) {
  topButton.addEventListener("click", () => {
    document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 800);
  });
}

document.querySelectorAll(".gallery-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelId = tab.getAttribute("aria-controls");

    document.querySelectorAll(".gallery-tab").forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll(".gallery-panel").forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

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
