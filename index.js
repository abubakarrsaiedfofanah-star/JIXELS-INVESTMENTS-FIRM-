const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const topButton = document.querySelector(".top-button");

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
