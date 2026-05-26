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
        const lines = [`${formType} from Jixels Technologies website`];

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

  const initCounters = () => {
    const counters = Array.from(document.querySelectorAll("[data-count]"));

    if (!counters.length) {
      return;
    }

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.dataset.suffix || "";
      const duration = 1400;
      const pause = 900;
      let startedAt = performance.now();

      const tick = (now) => {
        const elapsed = now - startedAt;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;

        if (elapsed >= duration + pause) {
          startedAt = now;
          counter.textContent = `0${suffix}`;
        }

        window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        if (entry.target.dataset.countStarted === "true") {
          return;
        }

        entry.target.dataset.countStarted = "true";
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
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
    initCounters();
    initVideoReel();
  };

  return { init };
})();
