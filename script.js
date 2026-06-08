const config = window.MANDARIN_CUE_CONFIG || {};

const isPlaceholder = (value) => !value || /REPLACE|example\.com|localhost/i.test(value);

const currentParams = new URLSearchParams(window.location.search);

document.querySelectorAll("[data-utm]").forEach((input) => {
  const key = input.dataset.utm;
  input.value = currentParams.get(`utm_${key}`) || "";
});

const appendTracking = (url) => {
  const target = new URL(url, window.location.href);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const value = currentParams.get(key);
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  });
  return target.toString();
};

const modal = document.querySelector("#checkout-modal");
const closeModal = document.querySelector(".modal-close");

const openModal = () => {
  if (!modal || !closeModal) return;
  modal.hidden = false;
  closeModal.focus();
};

const closeCheckoutModal = () => {
  if (!modal) return;
  modal.hidden = true;
};

document.querySelectorAll("[data-store-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const configKey = link.dataset.storeLink;
    const storeUrl = config[configKey];
    if (isPlaceholder(storeUrl)) {
      event.preventDefault();
      openModal();
      return;
    }
    link.href = appendTracking(storeUrl);
  });
});

closeModal?.addEventListener("click", closeCheckoutModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeCheckoutModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeCheckoutModal();
  }
});
