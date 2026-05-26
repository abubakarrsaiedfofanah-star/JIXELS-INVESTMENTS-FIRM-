window.JixelsBody = (() => {
  const buildWhatsappUrl = (message) => {
    if (window.JixelsFooter && window.JixelsFooter.buildWhatsappUrl) {
      return window.JixelsFooter.buildWhatsappUrl(message);
    }

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const initForms = () => {
    document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const formType = form.dataset.formType || "Website contact";
        const lines = [`${formType} from Jixel Technology website`];

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
  };

  const initTeamSearch = () => {
    const teamSearch = document.querySelector("[data-team-search]");
    const teamCards = Array.from(document.querySelectorAll("[data-team-card]"));

    if (!teamSearch || !teamCards.length) {
      return;
    }

    teamSearch.addEventListener("input", () => {
      const query = teamSearch.value.trim().toLowerCase();

      teamCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.hidden = query !== "" && !text.includes(query);
      });
    });
  };

  const initVideoReel = () => {
    const reel = document.querySelector("[data-video-reel]");

    if (!reel) {
      return;
    }

    const slides = Array.from(reel.querySelectorAll(".reel-slide"));
    const player = reel.closest(".video-player") || document;
    const toggle = player.querySelector(".reel-toggle");
    const centerToggle = player.querySelector(".reel-center-toggle");
    const label = player.querySelector(".reel-label");
    const progress = player.querySelector(".reel-progress span");
    const interval = 4200;
    let activeIndex = 0;
    let startedAt = Date.now();
    let frameId;
    let playing = false;

    if (!toggle || !progress || !slides.length) {
      return;
    }

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

    const setPlaying = (nextPlaying) => {
      playing = nextPlaying;
      const state = playing ? "Pause" : "Play";
      if (label) {
        label.textContent = state;
      } else {
        toggle.textContent = state;
      }
      toggle.setAttribute("aria-label", `${state} video reel`);
      if (centerToggle) {
        centerToggle.setAttribute("aria-label", `${state} video reel`);
      }
      player.classList.toggle("is-playing", playing);

      if (playing) {
        showSlide(activeIndex + 1);
      } else {
        startedAt = Date.now();
      }
    };

    toggle.addEventListener("click", () => {
      setPlaying(!playing);
    });

    if (centerToggle) {
      centerToggle.addEventListener("click", () => {
        setPlaying(!playing);
      });
    }

    frameId = window.requestAnimationFrame(tick);

    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(frameId);
    });
  };

  const init = () => {
    initForms();
    initTeamSearch();
    initVideoReel();
  };

  return { init };
})();
