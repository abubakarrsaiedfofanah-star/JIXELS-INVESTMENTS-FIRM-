const loadComponent = async (name) => {
  const target = document.querySelector(`[data-component="${name}"]`);

  if (!target) {
    return;
  }

  const response = await fetch(`${name}.html`);

  if (!response.ok) {
    throw new Error(`Unable to load ${name}.html`);
  }

  target.outerHTML = await response.text();
};

const initializePage = () => {
  window.JixelsFooter?.init();
  window.JixelsHeader?.init();
  window.JixelsBody?.init();
};

const loadPage = async () => {
  while (document.querySelector("[data-component]")) {
    const componentNames = Array.from(document.querySelectorAll("[data-component]"), (target) => {
      return target.dataset.component;
    });

    await Promise.all(componentNames.map(loadComponent));
  }

  initializePage();
};

window.addEventListener("DOMContentLoaded", () => {
  loadPage().catch((error) => {
    console.error(error);
  });
});
