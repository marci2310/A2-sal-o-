// A2 Salão e Barbearia — interações leves e progressivas
// Número único de agendamento (DDI + DDD + número, só dígitos). Edite apenas aqui.
const WHATSAPP_NUMBER = "5581998720412";
const defaultMessage = "Olá! Vim pelo site e gostaria de agendar um horário.";
const whatsappUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const firstNavLink = mainNav?.querySelector("a");

const isMobileNav = () => window.matchMedia("(max-width: 859px)").matches;

const setMenuState = (open, { returnFocus = false } = {}) => {
  if (!menuToggle || !mainNav) return;
  const mobile = isMobileNav();
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mainNav.classList.toggle("open", open);
  mainNav.setAttribute("aria-hidden", String(mobile && !open));
  mainNav.inert = mobile && !open;
  document.body.classList.toggle("menu-open", mobile && open);
  if (open && mobile) window.setTimeout(() => firstNavLink?.focus(), 0);
  if (returnFocus) menuToggle.focus();
};

const closeMenu = () => setMenuState(false, { returnFocus: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

document.querySelectorAll('.main-nav a[href^="#"]').forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") closeMenu();
});
window.addEventListener("resize", () => setMenuState(menuToggle?.getAttribute("aria-expanded") === "true"));
setMenuState(false);

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 30);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Seleção de vários serviços (lista só aparece ao clicar)
const multi = document.querySelector("[data-multi]");
const multiTrigger = multi?.querySelector(".multi-trigger");
const multiPanel = multi?.querySelector(".multi-panel");
const multiSummary = multi?.querySelector("[data-summary]");
const servicesError = document.querySelector("#services-error");
const checkedServices = () => [...document.querySelectorAll('input[name="services"]:checked')].map((i) => i.value);

const setPanel = (open) => {
  if (!multiTrigger || !multiPanel) return;
  multiTrigger.setAttribute("aria-expanded", String(open));
  multiPanel.hidden = !open;
};
multiTrigger?.addEventListener("click", () => setPanel(multiTrigger.getAttribute("aria-expanded") !== "true"));
document.addEventListener("click", (e) => { if (multi && !multi.contains(e.target)) setPanel(false); });
multi?.addEventListener("keydown", (e) => { if (e.key === "Escape") { setPanel(false); multiTrigger.focus(); } });
multi?.addEventListener("change", () => {
  const list = checkedServices();
  multiSummary.textContent = list.length === 0 ? "Selecione os serviços" : list.length <= 2 ? list.join(", ") : `${list.length} serviços selecionados`;
  multiTrigger.classList.toggle("has-value", list.length > 0);
  if (list.length && servicesError) servicesError.hidden = true;
});

const bookingForm = document.querySelector("#booking-form");
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "").trim();
  const services = checkedServices();
  if (!name) { document.querySelector("#name")?.focus(); return; }
  if (services.length === 0) { if (servicesError) servicesError.hidden = false; multiTrigger?.focus(); return; }
  const date = String(formData.get("date") || "").trim();
  const readableDate = date ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", dateStyle: "long" }).format(new Date(`${date}T12:00:00Z`)) : "a combinar";
  const message = `Olá! Vim pelo site e gostaria de agendar um horário.\n\nNome: ${name}\nServiços: ${services.join(", ")}\nData preferida: ${readableDate}`;
  window.open(whatsappUrl(message), "_blank", "noopener");
});

// Carrosséis: passam sozinhos quando há mais de uma foto
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  if (slides.length < 2 || reduceMotion) return;
  let index = 0;
  let timer = null;
  const show = (i) => { slides[index].classList.remove("is-active"); index = i % slides.length; slides[index].classList.add("is-active"); };
  const start = () => { if (!timer) timer = window.setInterval(() => show(index + 1), 4000); };
  const stop = () => { window.clearInterval(timer); timer = null; };
  new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.3 }).observe(carousel);
  carousel.addEventListener("pointerenter", stop);
  carousel.addEventListener("pointerleave", start);
});

document.querySelectorAll('a[href="#agendamento"]').forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => document.querySelector("#name")?.focus(), 500);
  });
});

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.setAttribute("href", whatsappUrl(link.dataset.message || defaultMessage));
});

// Impede escolher datas passadas no formulário
const dateInput = document.querySelector("#date");
if (dateInput) {
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const yearEl = document.querySelector("#current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
