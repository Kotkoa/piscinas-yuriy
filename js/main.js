const WHATSAPP_NUMBER = "34678948509";

// Web3Forms access key. Public by design: it can only cause mail to be sent to the
// account's own inbox, so it is safe in this public repo (ADR-003, ADR-007).
// Empty string = the form falls back to the WhatsApp deep link (ADR-017).
const WEB3FORMS_ACCESS_KEY = "c4a80025-1df4-4581-a7e4-434b84543608";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// GA4 measurement ID. Public by design (it only lets a script send events into this one
// property). Empty string = no analytics script is ever requested. The tag is injected by
// loadAnalytics() only after the visitor accepts the cookie banner (ADR-008).
const GA_MEASUREMENT_ID = "G-MSCPV8GS1T";

const CONSENT_STORAGE_KEY = "pyConsent";

function readStoredConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function storeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Private mode or storage disabled: the choice simply is not persisted.
  }
}

function pushToDataLayer() {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function initConsentDefaults() {
  if (typeof window.gtag !== "function") {
    window.gtag = pushToDataLayer;
  }
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

let analyticsLoaded = false;

function loadAnalytics() {
  if (analyticsLoaded || !GA_MEASUREMENT_ID) return;
  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
  });
}

function grantConsent() {
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  loadAnalytics();
}

// Consent Mode stops new writes but leaves the cookies already set, so a
// withdrawal has to drop them for the choice to be honoured in full.
function revokeConsent() {
  window.gtag("consent", "update", {
    analytics_storage: "denied",
  });
  const host = window.location.hostname;
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expired;
    document.cookie = `${expired}; domain=${host}`;
    document.cookie = `${expired}; domain=.${host}`;
  });
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

initConsentDefaults();

document.addEventListener("DOMContentLoaded", () => {
  const storedConsent = readStoredConsent();
  if (storedConsent === "granted") grantConsent();

  const banner = document.querySelector("#cookie-banner");
  const showBanner = () => {
    if (!banner) return;
    banner.hidden = false;
    // Keeps the reserved height in sync with the visible banner
    document.documentElement.classList.add("has-cookie-banner");
  };
  const hideBanner = () => {
    if (banner) banner.hidden = true;
    document.documentElement.classList.remove("has-cookie-banner");
  };

  if (banner) {
    const settle = (choice) => {
      storeConsent(choice);
      if (choice === "granted") {
        grantConsent();
      } else {
        revokeConsent();
      }
      hideBanner();
    };
    banner
      .querySelector("#cookie-accept")
      ?.addEventListener("click", () => settle("granted"));
    banner
      .querySelector("#cookie-reject")
      ?.addEventListener("click", () => settle("denied"));
  }

  if (storedConsent) {
    hideBanner();
  } else {
    showBanner();
  }

  document
    .querySelector("#cookie-reopen")
    ?.addEventListener("click", showBanner);

  document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
    link.addEventListener("click", () => trackEvent("click_whatsapp"));
  });

  document.querySelectorAll(".js-call-link").forEach((link) => {
    link.addEventListener("click", () => trackEvent("click_call"));
  });

  const form = document.querySelector("#contact-form");
  if (form) initContactForm(form);

  const header = document.querySelector("#site-header");
  if (header) {
    const onScroll = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    requestAnimationFrame(onScroll);
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
      { threshold: 0.35 }
    );
    processSteps.forEach((el) => processObserver.observe(el));
  } else {
    processSteps.forEach((el) => el.classList.add("is-visible"));
  }
});

function initContactForm(form) {
  const status = form.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  const rules = [
    {
      name: "nombre",
      errorId: "error-nombre",
      validate: (value) => value.trim().length >= 2,
      message: "Indica tu nombre.",
    },
    {
      name: "telefono",
      errorId: "error-telefono",
      validate: (value) => value.replace(/\D/g, "").length >= 9,
      message: "Indica un teléfono válido.",
    },
    {
      name: "consentimiento",
      errorId: "error-consentimiento",
      validate: (_value, field) => field.checked,
      message: "Debes aceptar la política de privacidad.",
    },
  ];

  const setStatus = (message, state) => {
    if (!status) return;
    status.textContent = message;
    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  };

  const showFieldError = (rule, field, message) => {
    const target = form.querySelector(`#${rule.errorId}`);
    if (target) target.textContent = message;
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  };

  const validateField = (rule) => {
    const field = form.elements[rule.name];
    if (!field) return true;
    const ok = rule.validate(field.value || "", field);
    showFieldError(rule, field, ok ? "" : rule.message);
    return ok;
  };

  rules.forEach((rule) => {
    const field = form.elements[rule.name];
    if (!field) return;
    field.addEventListener("blur", () => validateField(rule));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(rule);
    });
  });

  const sendViaWhatsApp = (data) => {
    const lines = [
      `Hola, soy ${data.nombre}.`,
      `Teléfono: ${data.telefono}`,
      data.ciudad && `Ciudad: ${data.ciudad}`,
      data.servicio && `Necesito: ${data.servicio}`,
      data.comentario && `Comentario: ${data.comentario}`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener"
    );
    form.reset();
    setStatus(
      "Abrimos WhatsApp con tu solicitud. Envía el mensaje para completarla.",
      "success"
    );
  };

  const sendViaWeb3Forms = async (payload) => {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);
    return Boolean(response.ok && result && result.success);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalidRules = rules.filter((rule) => !validateField(rule));
    if (invalidRules.length) {
      setStatus("Revisa los campos marcados.", "error");
      const firstField = form.elements[invalidRules[0].name];
      firstField?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    if (!WEB3FORMS_ACCESS_KEY) {
      sendViaWhatsApp(data);
      trackEvent("submit_form");
      return;
    }

    submitButton?.setAttribute("disabled", "disabled");
    setStatus("Enviando…", null);

    try {
      const sent = await sendViaWeb3Forms({
        ...data,
        access_key: WEB3FORMS_ACCESS_KEY,
      });
      if (sent) {
        trackEvent("submit_form");
        form.reset();
        rules.forEach((rule) => {
          const field = form.elements[rule.name];
          if (field) showFieldError(rule, field, "");
        });
        setStatus(
          "Solicitud enviada. Te contestamos lo antes posible.",
          "success"
        );
      } else {
        setStatus(
          "No hemos podido enviar la solicitud. Escríbenos por WhatsApp.",
          "error"
        );
      }
    } catch {
      setStatus(
        "Error de conexión. Inténtalo de nuevo o escríbenos por WhatsApp.",
        "error"
      );
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}
