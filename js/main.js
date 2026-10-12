/* INTEGRA SALUD — interacción de la página.
   Todo el contenido ya está en el HTML; este archivo solo agrega comportamiento. */
(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const contact = config.contact || {};
  const WA_NUMBER = contact.whatsappNumber || "573184479028";
  const WA_DEFAULT = contact.whatsappDefaultMessage || "Hola, quiero asesoría en salud con INTEGRA SALUD.";

  const qs = (selector, scope) => (scope || document).querySelector(selector);
  const qsa = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  function waUrl(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message || WA_DEFAULT);
  }

  /* ---------- Medición (opcional: GA4 y Pixel de Meta) ---------- */
  function loadAnalytics() {
    const analytics = config.analytics || {};
    if (analytics.ga4Id) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(analytics.ga4Id);
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", analytics.ga4Id);
    }
    if (analytics.metaPixelId) {
      /* Código oficial del Pixel de Meta */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", analytics.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  /** Registra un contacto (clic en WhatsApp o llamada) como conversión. */
  function trackLead(source, extra) {
    const params = Object.assign({ source: source }, extra || {});
    if (typeof window.gtag === "function") {
      window.gtag("event", source.indexOf("call") === 0 ? "click_to_call" : "generate_lead", params);
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", params);
    }
  }

  /* ---------- Enlaces de WhatsApp y llamadas ---------- */
  function setupContactLinks() {
    qsa("a[data-wa]").forEach((link) => {
      link.href = waUrl(link.dataset.wa);
    });
    if (contact.phoneLink) {
      qsa('a[href^="tel:"]').forEach((link) => {
        link.href = contact.phoneLink;
      });
    }
    qsa("[data-track]").forEach((element) => {
      if (element.tagName === "BUTTON") return; // los formularios registran al enviarse
      element.addEventListener("click", () => trackLead(element.dataset.track));
    });
  }

  /* ---------- Menú móvil ---------- */
  function setupMenu() {
    const toggle = qs("#menuToggle");
    const menu = qs("#menuPrincipal");
    if (!toggle || !menu) return;
    const label = qs(".sr-only", toggle);

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Cerrar menú" : "Abrir menú";
    }

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    qsa("a", menu).forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  /* ---------- Utilidades de formulario ---------- */
  function showError(node, message) {
    if (!node) return;
    node.textContent = message;
    node.hidden = !message;
  }

  /** Abre WhatsApp. En celulares abre la app; en computador, WhatsApp Web en otra pestaña. */
  function openWhatsApp(message) {
    const url = waUrl(message);
    // Sin "noopener" en las opciones: con él, window.open siempre devuelve null.
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url; // ventanas emergentes bloqueadas
  }

  /* ---------- Quiz: encuentra tu opción ---------- */
  function setupQuiz() {
    const form = qs("#quiz");
    if (!form) return;
    const steps = qsa(".quiz-step", form);
    const back = qs("#quizBack", form);
    const next = qs("#quizNext", form);
    const submit = qs("#quizSubmit", form);
    const bar = qs("#quizBar", form);
    const error = qs("#quizError", form);
    let current = 0;

    function show(index) {
      current = index;
      steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
      back.hidden = index === 0;
      next.hidden = index === steps.length - 1;
      submit.hidden = index !== steps.length - 1;
      bar.style.width = ((index + 1) / steps.length) * 100 + "%";
      showError(error, "");
    }

    function stepValid(index) {
      const step = steps[index];
      const radios = qsa('input[type="radio"]', step);
      if (radios.length && !radios.some((radio) => radio.checked)) {
        showError(error, "Elige una opción para continuar.");
        return false;
      }
      const text = qsa('input[type="text"]', step).find((input) => !input.value.trim());
      if (text) {
        showError(error, "Completa tu " + text.name + " para continuar.");
        text.focus();
        return false;
      }
      const consent = qs('input[type="checkbox"]', step);
      if (consent && !consent.checked) {
        showError(error, "Debes aceptar el tratamiento de datos para que podamos escribirte.");
        return false;
      }
      return true;
    }

    // Al elegir una opción se avanza solo: menos toques, más respuestas completas.
    qsa('input[type="radio"]', form).forEach((radio) => {
      radio.addEventListener("change", () => {
        if (current < steps.length - 1) window.setTimeout(() => show(current + 1), 220);
      });
    });

    next.addEventListener("click", () => {
      if (stepValid(current)) show(current + 1);
    });
    back.addEventListener("click", () => show(Math.max(0, current - 1)));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!stepValid(current)) return;
      const data = new FormData(form);
      const message = [
        "Hola, soy " + data.get("nombre").trim() + " de " + data.get("ciudad").trim() + ".",
        "Quiero asesoría: " + data.get("para") + " · " + data.get("busca") + ".",
        "¿Me ayudan a encontrar la mejor opción?",
      ].join("\n");
      trackLead("wa_quiz", { para: data.get("para"), busca: data.get("busca") });
      openWhatsApp(message);
    });

    show(0);
  }

  /* ---------- Formulario de contacto ---------- */
  function setupLeadForm() {
    const form = qs("#leadForm");
    if (!form) return;
    const error = qs("#leadError", form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const ciudad = String(data.get("ciudad") || "").trim();
      const servicio = String(data.get("servicio") || "").trim();
      const detalle = String(data.get("detalle") || "").trim();

      if (!nombre || !ciudad || !servicio) {
        showError(error, "Completa tu nombre, ciudad y lo que necesitas.");
        qs(!nombre ? "#nombre" : !ciudad ? "#ciudad" : "#servicio", form).focus();
        return;
      }
      if (!data.get("acepto")) {
        showError(error, "Debes aceptar el tratamiento de datos para que podamos escribirte.");
        return;
      }
      showError(error, "");

      const lines = [
        "Hola, soy " + nombre + " de " + ciudad + ".",
        "Necesito asesoría en: " + servicio + ".",
      ];
      if (detalle) lines.push(detalle);
      trackLead("wa_form", { servicio: servicio });
      openWhatsApp(lines.join("\n"));
    });
  }

  /* ---------- Estado de atención (hora de Colombia) ---------- */
  const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function toMinutes(time) {
    const parts = time.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function formatTime(time) {
    const minutes = toMinutes(time);
    const hour = Math.floor(minutes / 60);
    const rest = String(minutes % 60).padStart(2, "0");
    if (hour === 12 && rest === "00") return "12:00 m.";
    return ((hour + 11) % 12) + 1 + ":" + rest + (hour < 12 ? " a. m." : " p. m.");
  }

  /** Día y minuto actuales en Bogotá, sin importar la zona horaria del visitante. */
  function bogotaNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Bogota",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (type) => (parts.find((part) => part.type === type) || {}).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  function openStatus() {
    const schedule = config.schedule;
    if (!Array.isArray(schedule) || !schedule.length) return null;
    const now = bogotaNow();
    const today = schedule.find((slot) => slot.days.indexOf(now.day) !== -1);
    if (today && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
      return { open: true, text: "Estamos atendiendo ahora · hasta las " + formatTime(today.close) };
    }
    // Próxima apertura (hoy más tarde o en los próximos días)
    for (let offset = 0; offset < 8; offset++) {
      const day = (now.day + offset) % 7;
      const slot = schedule.find((item) => item.days.indexOf(day) !== -1);
      if (!slot || (offset === 0 && now.minutes >= toMinutes(slot.open))) continue;
      const when = offset === 0 ? "hoy" : offset === 1 ? "mañana" : "el " + DAY_NAMES[day];
      return { open: false, text: "Escríbenos ya: te respondemos " + when + " desde las " + formatTime(slot.open) };
    }
    return null;
  }

  function setupOpenStatus() {
    const status = openStatus();
    if (!status) return;
    qsa("[data-open-status]").forEach((node) => {
      node.textContent = status.text;
      node.classList.toggle("is-open", status.open);
      node.hidden = false;
    });
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = qsa(".section-head, .pain, .service, .step, .why-list li, .faq details, .quiz, .lead-form, .table-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach((element) => {
      // Solo se anima lo que aún no se ve, para no ocultar contenido ya visible.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      element.style.transitionDelay = Math.min(siblings.indexOf(element), 5) * 70 + "ms";
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  function init() {
    loadAnalytics();
    setupContactLinks();
    setupMenu();
    setupQuiz();
    setupLeadForm();
    setupOpenStatus();
    setupReveal();
    const year = qs("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
