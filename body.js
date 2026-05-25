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
