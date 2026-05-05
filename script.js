const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const navLinks = document.querySelectorAll("[data-menu] a");
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-waitlist-form]");
const formNote = document.querySelector("[data-form-note]");
const placeholderPattern = /PASTE_YOUR_FORM_ID_HERE|PASTE_YOUR_REAL|example\.com/i;

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
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
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

if (form) {
  const showPlaceholderNote = () => {
    if (formNote) formNote.classList.add("is-visible");
  };

  if (placeholderPattern.test(form.action)) {
    showPlaceholderNote();
  }

  form.addEventListener("submit", (event) => {
    if (placeholderPattern.test(form.action)) {
      event.preventDefault();
      showPlaceholderNote();
    }
  });
}
