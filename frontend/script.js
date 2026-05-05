const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const navLinks = document.querySelectorAll("[data-menu] a");
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-waitlist-form]");
const formNote = document.querySelector("[data-form-note]");
const startedAt = document.querySelector("[data-started-at]");

const closeMenu = () => {
  if (!menuToggle) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  body.classList.remove("menu-open");
};

const openMenu = () => {
  if (!menuToggle) return;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  body.classList.add("menu-open");
};

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (year) {
  year.textContent = new Date().getFullYear();
}

if (startedAt) {
  startedAt.value = String(Date.now());
}

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

const setFormMessage = (message, type = "info") => {
  if (!formNote) return;
  formNote.textContent = message;
  formNote.dataset.state = type;
  formNote.classList.add("is-visible");
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!isValidEmail(email)) {
      setFormMessage("Please enter a valid email address.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Unable to join the waitlist right now.");
      }

      form.reset();
      if (startedAt) startedAt.value = String(Date.now());
      setFormMessage(result.message || "You are on the early beta request list.", "success");
    } catch (error) {
      setFormMessage(error.message || "Unable to join the waitlist right now.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Get early access";
      }
    }
  });
}
