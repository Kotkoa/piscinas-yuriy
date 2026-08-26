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
    form.addEventListener("submit", () => trackEvent("submit_form"));
  }
});
