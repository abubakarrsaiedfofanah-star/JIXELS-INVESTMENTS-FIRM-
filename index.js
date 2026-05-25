const initializePage = () => {
  window.JixelsFooter?.init();
  window.JixelsHeader?.init();
  window.JixelsBody?.init();
};

const loadComponent = async (target) => {
  const name = target.dataset.component;
  const response = await fetch(`${name}.html`);

  if (!response.ok) {
    throw new Error(`Unable to load ${name}.html`);
  }

  target.outerHTML = await response.text();
};

const loadPage = async () => {
  while (document.querySelector("[data-component]")) {
    const components = Array.from(document.querySelectorAll("[data-component]"));
    await Promise.all(components.map(loadComponent));
  }

  initializePage();
};

window.addEventListener("DOMContentLoaded", () => {
  loadPage().catch((error) => {
    console.error(error);
    initializePage();
  });
});
