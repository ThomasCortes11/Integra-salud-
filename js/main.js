(function () {
  const config = window.SITE_CONFIG || {};

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function toWaUrl(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function pathValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
  }

  function updateThemeVariables() {
    if (!config.theme) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-navy", config.theme.navy || "#0B2A5B");
    root.style.setProperty("--brand-emerald", config.theme.emerald || "#0E8F6E");
    root.style.setProperty("--brand-graphite", config.theme.graphite || "#4A5568");
    root.style.setProperty("--brand-white", config.theme.white || "#FFFFFF");
    root.style.setProperty("--brand-gold", config.theme.gold || "#C9A24B");
  }

  function updateSimpleBindings() {
    qsa("[data-bind]").forEach((node) => {
      const value = pathValue(config, node.dataset.bind);
      if (typeof value === "string" && value.trim()) {
        node.textContent = value;
      }
    });

    if (config.brand?.name) {
      document.title = `${config.brand.name} | Asesoria EPS, ARL, Medicina Prepagada y Planes Complementarios en ${config.brand.city || "[PONER CIUDAD]"}`;
    }

    const description =
      `Asesoria en EPS, ARL, medicina prepagada y planes complementarios en ${config.brand?.city || "[PONER CIUDAD]"}, Colombia. ${config.brand?.name || "INTEGRA SALUD"} te acompana con atencion personalizada para personas, familias y empresas.`;
    const descMeta = qs('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", description);

    const ogDescription = qs('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", description);

    const canonical = qs('link[rel="canonical"]');
    if (canonical && config.brand?.domain) {
      canonical.setAttribute("href", `${config.brand.domain.replace(/\/$/, "")}/`);
    }

  }

  function renderTrustBadges() {
    const container = qs('[data-render="trustBadges"]');
    if (!container || !Array.isArray(config.trustBadges) || !config.trustBadges.length) return;
    container.innerHTML = config.trustBadges.map((item) => `<li>${item}</li>`).join("");
  }

  function renderServices() {
    const container = qs('[data-render="services"]');
    if (!container || !Array.isArray(config.services) || !config.services.length) return;

    const phone = config.contact?.whatsappNumber || "573184479028";

    container.innerHTML = config.services
      .map((service) => {
        const message = `Hola, quiero informacion sobre ${service.title}.`;
        const url = toWaUrl(phone, message);
        return `
          <article class="card service-card reveal in-view">
            <h3><span aria-hidden="true">${service.icon || "✔"}</span> ${service.title}</h3>
            <p>${service.description}</p>
            <a class="btn btn-tertiary" href="${url}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_service_${service.key}">
              Pedir informacion
            </a>
          </article>
        `;
      })
      .join("");
  }

  function renderWhyChooseUs() {
    const container = qs('[data-render="whyChooseUs"]');
    if (!container || !Array.isArray(config.whyChooseUs) || !config.whyChooseUs.length) return;
    container.innerHTML = config.whyChooseUs.map((item) => `<li class="reveal in-view">${item}</li>`).join("");
  }

  function renderSteps() {
    const container = qs('[data-render="steps"]');
    if (!container || !Array.isArray(config.steps) || !config.steps.length) return;
    container.innerHTML = config.steps
      .map(
        (step, index) => `
        <article class="card step reveal in-view">
          <span class="step-index">${index + 1}</span>
          <h3>${step.title}</h3>
          <p>${step.description}</p>
        </article>
      `
      )
      .join("");
  }

  function renderEntities() {
    const container = qs('[data-render="alliedEntities"]');
    if (!container || !Array.isArray(config.alliedEntities) || !config.alliedEntities.length) return;
    container.innerHTML = config.alliedEntities.map((entity) => `<li class="reveal in-view">${entity}</li>`).join("");
  }

  function renderTestimonials() {
    const container = qs('[data-render="testimonials"]');
    if (!container || !Array.isArray(config.testimonials) || !config.testimonials.length) return;
    container.innerHTML = config.testimonials
      .map(
        (t) => `
        <blockquote class="card testimonial reveal in-view">
          <p>"${t.quote}"</p>
          <cite>${t.name} · ${t.city}</cite>
        </blockquote>
      `
      )
      .join("");
  }

  function renderFaqs() {
    const container = qs('[data-render="faqs"]');
    if (!container || !Array.isArray(config.faqs) || !config.faqs.length) return;

    container.innerHTML = config.faqs
      .map(
        (faq) => `
        <details class="faq-item reveal in-view">
          <summary>${faq.question}</summary>
          <p>${faq.answer}</p>
        </details>
      `
      )
      .join("");

    const faqSchema = qs("#schema-faq");
    if (faqSchema) {
      const payload = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      };
      faqSchema.textContent = JSON.stringify(payload);
    }
  }

  function syncContactLinks() {
    const phoneDisplay = config.contact?.phoneDisplay || "318 447 9028";
    const phoneLink = config.contact?.phoneLink || "tel:+573184479028";
    const email = config.contact?.email || "Saludtotal390@gmail.com";
    const waDefault = config.contact?.whatsappDefaultMessage || "Hola, quiero asesoria sobre seguros de salud con INTEGRA SALUD.";
    const waNumber = config.contact?.whatsappNumber || "573184479028";
    const waUrl = toWaUrl(waNumber, waDefault);

    qsa('a[href^="tel:"]').forEach((a) => {
      a.href = phoneLink;
      if (/\d/.test(a.textContent || "")) {
        a.textContent = phoneDisplay;
      }
    });

    qsa('a[href^="mailto:"]').forEach((a) => {
      a.href = `mailto:${email}`;
      if ((a.textContent || "").includes("@")) {
        a.textContent = email;
      }
    });

    qsa('a[href*="wa.me"]').forEach((a) => {
      a.href = waUrl;
    });

    qsa("[data-social]").forEach((a) => {
      const network = a.dataset.social;
      if (config.social && config.social[network]) {
        a.href = config.social[network];
      }
    });
  }

  function setupMenu() {
    const toggle = qs("#menuToggle");
    const menu = qs("#menuPrincipal");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
    });

    qsa("a", menu).forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  function setupRevealAnimations() {
    const reveals = qsa(".reveal");
    if (!("IntersectionObserver" in window) || !reveals.length) {
      reveals.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function setupStaggeredReveal() {
    const groups = [
      ".services-grid .reveal",
      ".benefits-list .reveal",
      ".steps-grid .reveal",
      ".testimonials-grid .reveal",
      ".entities .reveal"
    ];

    groups.forEach((selector) => {
      qsa(selector).forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
      });
    });
  }

  function setupInteractiveCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    qsa(".card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -4;
        const rotateY = ((x / rect.width) - 0.5) * 4;
        card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function setupHeroParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const heroMedia = qs(".hero-media img");
    if (!heroMedia) return;

    window.addEventListener("mousemove", (event) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (event.clientX - centerX) / centerX;
      const dy = (event.clientY - centerY) / centerY;
      heroMedia.style.transform = `translate3d(${(dx * 8).toFixed(2)}px, ${(dy * 6).toFixed(2)}px, 0)`;
    });
  }

  function loadAnalytics() {
    const ga4Id = config.analytics?.ga4Id;
    const pixelId = config.analytics?.metaPixelId;

    if (ga4Id) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id, { anonymize_ip: true });
    }

    if (pixelId) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          if (n.callMethod) {
            n.callMethod.apply(n, arguments);
          } else {
            n.queue.push(arguments);
          }
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
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  }

  function trackEvent(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params || {});
    }
  }

  function setupTracking() {
    qsa("[data-track]").forEach((element) => {
      element.addEventListener("click", () => {
        trackEvent("conversion_action", {
          action_id: element.dataset.track,
          page_location: window.location.pathname
        });
      });
    });
  }

  function setupForm() {
    const form = qs("#leadForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = (qs("#nombre", form)?.value || "").trim();
      const telefono = (qs("#telefono", form)?.value || "").trim();
      const servicio = (qs("#servicio", form)?.value || "").trim();
      const ciudad = (qs("#ciudad", form)?.value || "").trim();

      const message = [
        "Hola, quiero asesoria con INTEGRA SALUD.",
        `Nombre: ${nombre}`,
        `Telefono: ${telefono}`,
        `Servicio de interes: ${servicio}`,
        `Ciudad: ${ciudad}`
      ].join("\n");

      const waUrl = toWaUrl(config.contact?.whatsappNumber || "573184479028", message);

      trackEvent("form_submit_whatsapp", {
        service: servicio || "no_service",
        city: ciudad || "no_city"
      });

      window.open(waUrl, "_blank", "noopener,noreferrer");
      form.submit();
    });
  }

  function updateYear() {
    const yearNode = qs("#year");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  }

  function init() {
    updateThemeVariables();
    updateSimpleBindings();
    renderTrustBadges();
    renderServices();
    renderWhyChooseUs();
    renderSteps();
    renderEntities();
    renderTestimonials();
    renderFaqs();
    syncContactLinks();
    setupMenu();
    setupStaggeredReveal();
    setupRevealAnimations();
    setupInteractiveCards();
    setupHeroParallax();
    loadAnalytics();
    setupTracking();
    setupForm();
    updateYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
