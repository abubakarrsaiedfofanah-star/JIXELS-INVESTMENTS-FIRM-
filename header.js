window.JixelsHeader = (() => {
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
    const routeSections = Array.from(document.querySelectorAll("main > section[id]"));
    const siteFooter = document.querySelector(".site-footer");
    const routeLinks = Array.from(document.querySelectorAll(".brand, a[href^='#']"));

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

  const init = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const routeLinks = Array.from(document.querySelectorAll(".brand, a[href^='#']"));

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
  };

  return { init, showRoute, getRouteId };
})();
