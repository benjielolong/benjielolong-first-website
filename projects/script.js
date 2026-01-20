// ===== Helpers =====
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ===== Mobile menu =====
const burger = $("#burger");
const navLinks = $("#navLinks");

burger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking a nav link (mobile)
$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

// ===== Theme toggle =====
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// ===== Cart counter (demo) =====
let cartCount = 0;
const cartCountEl = $("#cartCount");

function bumpCart() {
  cartCount += 1;
  cartCountEl.textContent = cartCount;
  cartCountEl.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
    { duration: 220 }
  );
}

$$("[data-add]").forEach(btn => {
  btn.addEventListener("click", () => {
    bumpCart();
  });
});

// ===== Product filtering =====
const chips = $$(".chip");
const cards = $$(".card");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;

    cards.forEach(card => {
      const tags = card.dataset.tags || "";
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "block" : "none";
    });
  });
});

// ===== FAQ accordion =====
const faqItems = $$(".faq-item");
faqItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const expanded = btn.getAttribute("aria-expanded") === "true";

    // Close all
    faqItems.forEach(b => {
      b.setAttribute("aria-expanded", "false");
      const p = b.nextElementSibling;
      if (p) p.style.display = "none";
    });

    // Open selected if it was closed
    if (!expanded) {
      btn.setAttribute("aria-expanded", "true");
      panel.style.display = "block";
    }
  });
});

// ===== Contact form validation (front-end only) =====
const form = $("#orderForm");
const formMsg = $("#formMsg");

function setError(field, message) {
  const errorEl = $(`[data-error="${field}"]`);
  if (errorEl) errorEl.textContent = message || "";
}

function isPhoneValid(v) {
  // Simple PH-friendly pattern: starts with 09 or +63, allow spaces/dashes
  const cleaned = v.replace(/[\s-]/g, "");
  return /^(09\d{9}|\+639\d{9})$/.test(cleaned);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const name = $("#name").value.trim();
  const phone = $("#phone").value.trim();
  const order = $("#order").value.trim();

  let ok = true;

  setError("name", "");
  setError("phone", "");
  setError("order", "");

  if (name.length < 2) {
    setError("name", "Please enter your name.");
    ok = false;
  }

  if (!isPhoneValid(phone)) {
    setError("phone", "Use format like 09xx xxx xxxx or +63 9xx xxx xxxx.");
    ok = false;
  }

  if (order.length < 6) {
    setError("order", "Please add your order details.");
    ok = false;
  }

  if (!ok) return;

  // Demo "success"
  formMsg.textContent = "✅ Message ready! (Demo) Connect this to your backend or Messenger API next.";
  form.reset();
});

// ===== Active nav highlight on scroll =====
const sections = ["products", "why", "reviews", "faq", "contact"].map(id => document.getElementById(id));
const navMap = new Map($$(".nav-link").map(a => [a.getAttribute("href").replace("#", ""), a]));

function setActive(id) {
  $$(".nav-link").forEach(a => a.classList.remove("active"));
  const link = navMap.get(id);
  if (link) link.classList.add("active");
}

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + 120;
  for (const section of sections) {
    if (!section) continue;
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      setActive(section.id);
      break;
    }
  }
});

// ===== Footer year + back to top =====
$("#year").textContent = new Date().getFullYear();

$("#toTop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
