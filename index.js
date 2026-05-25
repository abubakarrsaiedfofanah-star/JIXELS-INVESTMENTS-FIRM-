const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const topButton = document.querySelector(".top-button");
const reel = document.querySelector("[data-video-reel]");

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

topButton.addEventListener("click", () => {
  document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  topButton.classList.toggle("show", window.scrollY > 800);
});

if (reel) {
  const slides = Array.from(reel.querySelectorAll(".reel-slide"));
  const toggle = reel.querySelector(".reel-toggle");
  const progress = reel.querySelector(".reel-progress span");
  const interval = 4200;
  let activeIndex = 0;
  let startedAt = Date.now();
  let frameId;
  let playing = true;

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
    }

    frameId = window.requestAnimationFrame(tick);
  };

  toggle.addEventListener("click", () => {
    playing = !playing;
    toggle.textContent = playing ? "Pause" : "Play";
    toggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} video reel`);
    startedAt = Date.now();
  });

  frameId = window.requestAnimationFrame(tick);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frameId);
  });
}
