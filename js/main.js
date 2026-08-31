const WHATSAPP_NUMBER = "34678948509";

function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.addEventListener("click", () => trackEvent("click_whatsapp"));
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => trackEvent("click_call"));
  });

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      trackEvent("submit_form");

      const data = new FormData(form);
      const nombre = (data.get("nombre") || "").toString().trim();
      const telefono = (data.get("telefono") || "").toString().trim();
      const ciudad = (data.get("ciudad") || "").toString().trim();
      const servicio = (data.get("servicio") || "").toString().trim();
      const comentario = (data.get("comentario") || "").toString().trim();

      const lines = [
        `Hola, soy ${nombre}.`,
        `Teléfono: ${telefono}`,
        ciudad && `Ciudad: ${ciudad}`,
        servicio && `Necesito: ${servicio}`,
        comentario && `Comentario: ${comentario}`,
      ].filter(Boolean);

      const message = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");
      form.reset();
    });
  }

  const header = document.querySelector("#site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const navToggle = document.querySelector("#nav-toggle");
  const siteNav = document.querySelector("#site-nav");
  if (navToggle && siteNav) {
    const closeNav = () => {
      siteNav.classList.remove("is-open");
      header?.classList.remove("is-menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      header?.classList.toggle("is-menu-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", (event) => {
      if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        closeNav();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 860) closeNav();
    });
  }

  const heroCta = document.querySelector(".hero-cta");
  const navCta = document.querySelector(".nav-cta");
  if (heroCta && navCta && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          navCta.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(heroCta);
  }

  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const processSteps = document.querySelectorAll(".process-step");
  if (processSteps.length && "IntersectionObserver" in window) {
    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            processObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    processSteps.forEach((el) => processObserver.observe(el));
  } else {
    processSteps.forEach((el) => el.classList.add("is-visible"));
  }
});
