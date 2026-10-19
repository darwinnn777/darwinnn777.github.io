(function () {
  "use strict";

  const data = window.__BRAND__ || {};
  const root = document.documentElement;

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const tr = (v, lang) => (v && typeof v === "object") ? (v[lang] || v.es || "") : (v || "");
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---------- Proyectos (se rellena desde lib/manifest.js) ---------- */
  function mountProjects() {
    const list = $("[data-projects]");
    const items = Array.isArray(data.projects) ? data.projects : [];
    if (!list || !items.length) return; // sin proyectos: se quedan los huecos del HTML
    list.innerHTML = items.map((p, i) => {
      const n = String(i + 1).padStart(2, "0");
      const role = p.role ? '<span class="mono proj-meta" data-es="' + escHTML(tr(p.role, "es")) + '" data-en="' + escHTML(tr(p.role, "en")) + '"></span>'
                          : '<span class="mono proj-meta">' + escHTML(p.year || "") + "</span>";
      const desc = p.desc ? '<p class="proj-desc" data-es="' + escHTML(tr(p.desc, "es")) + '" data-en="' + escHTML(tr(p.desc, "en")) + '"></p>' : "";
      const stack = (p.stack && p.stack.length) ? '<ul class="proj-stack">' + p.stack.map((s) => "<li>" + escHTML(s) + "</li>").join("") + "</ul>" : "";
      const links = (p.url || p.repo) ? '<div class="proj-links">' +
        (p.url ? '<a href="' + escHTML(p.url) + '" target="_blank" rel="noopener">Demo ↗</a>' : "") +
        (p.repo ? '<a href="' + escHTML(p.repo) + '" target="_blank" rel="noopener">GitHub ↗</a>' : "") + "</div>" : "";
      return '<li class="proj reveal"><span class="mono idx">' + n + '</span><h3 class="proj-title">' + escHTML(p.title) + "</h3>" +
        role + desc + stack + links + "</li>";
    }).join("");
    const note = $(".proj-note");
    if (note) note.hidden = true;
  }

  /* ---------- Contacto (solo muestra lo que esté rellenado) ---------- */
  function mountContact() {
    const ul = $("[data-contact-links]");
    const c = data.contact || {};
    if (!ul) return;
    const links = [];
    if (c.email) links.push({ href: "mailto:" + c.email, label: c.email });
    if (c.linkedin) links.push({ href: c.linkedin, label: "LinkedIn", ext: true });
    if (c.github) links.push({ href: c.github, label: "GitHub", ext: true });
    if (!links.length) return;
    ul.innerHTML = links.map((l) =>
      '<li><a href="' + escHTML(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener"' : "") + ">" + escHTML(l.label) + "</a></li>"
    ).join("");
    ul.hidden = false;
  }

  /* ---------- Idioma ES / EN ---------- */
  function initI18n() {
    const dict = (data.i18n && data.i18n.en) || {};
    const metaDesc = $('meta[name="description"]');
    const ogTitle = $('meta[property="og:title"]');
    const es = {
      title: document.title,
      desc: metaDesc ? metaDesc.getAttribute("content") : "",
      og: ogTitle ? ogTitle.getAttribute("content") : ""
    };

    // Guardamos el español original leyendo el propio HTML
    $$("[data-i18n]").forEach((el) => { el.dataset.es = el.innerHTML; });
    $$("[data-i18n-aria]").forEach((el) => { el.dataset.esAria = el.getAttribute("aria-label") || ""; });
    $$("[data-i18n-alt]").forEach((el) => { el.dataset.esAlt = el.getAttribute("alt") || ""; });

    function apply(lang) {
      const en = lang === "en";
      $$("[data-i18n]").forEach((el) => {
        const v = en ? dict[el.dataset.i18n] : el.dataset.es;
        if (v != null) el.innerHTML = v;
      });
      $$("[data-i18n-aria]").forEach((el) => {
        const v = en ? dict[el.dataset.i18nAria] : el.dataset.esAria;
        if (v != null) el.setAttribute("aria-label", v);
      });
      $$("[data-i18n-alt]").forEach((el) => {
        const v = en ? dict[el.dataset.i18nAlt] : el.dataset.esAlt;
        if (v != null) el.setAttribute("alt", v);
      });
      $$("[data-es][data-en]").forEach((el) => { el.textContent = en ? el.dataset.en : el.dataset.es; });
      root.lang = en ? "en" : "es";
      document.title = en && dict["meta.title"] ? dict["meta.title"] : es.title;
      if (metaDesc) metaDesc.setAttribute("content", en && dict["meta.desc"] ? dict["meta.desc"] : es.desc);
      if (ogTitle) ogTitle.setAttribute("content", en && dict["meta.title"] ? dict["meta.title"] : es.og);
      $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
      try { localStorage.setItem("lang", lang); } catch (_) {}
      if (window.__SCENE__) window.__SCENE__.measure(); // la altura de las secciones puede cambiar
    }

    $$("[data-lang]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.lang)));

    let saved = "es";
    try { saved = localStorage.getItem("lang") || "es"; } catch (_) {}
    if (saved === "en") apply("en"); else apply("es");
  }

  /* ---------- Splash ---------- */
  function initSplash() {
    const splash = $("[data-splash]");
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      if (splash) splash.classList.add("is-out");
      root.classList.add("is-ready");
    };
    if (!splash) { hide(); return; }
    if (document.readyState === "complete") setTimeout(hide, 700);
    else window.addEventListener("load", () => setTimeout(hide, 500));
    setTimeout(hide, 4000); // red de seguridad
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    const nav = $("[data-nav]");
    const toggle = $("[data-menu-toggle]");
    const onScroll = () => { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const close = () => {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    };
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    window.addEventListener("resize", () => { if (window.innerWidth >= 960) close(); });

    // Enlace activo según la sección visible
    const links = $$(".nav-links a");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      $$("main section[id]").forEach((s) => io.observe(s));
    }

    // Scroll suave nativo para los anclajes
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      close();
      window.scrollTo({
        top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - (id === "#inicio" ? 0 : 72)),
        behavior: reduced ? "auto" : "smooth"
      });
      try { history.replaceState(null, "", id); } catch (_) {}
    });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  function initReveals() {
    const els = $$(".reveal:not([data-split])");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach((el) => io.observe(el));

    // Red de seguridad: lo que ya esté en pantalla a los 6 s se muestra sí o sí
    setTimeout(() => {
      $$(".reveal:not(.is-visible)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- Inclinación suave del retrato ---------- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach((el) => {
      const MAX = 5;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + (x * MAX * 2).toFixed(2) + "deg) rotateX(" + (-y * MAX * 2).toFixed(2) + "deg)";
      });
      el.addEventListener("mouseout", (e) => {
        if (!el.contains(e.relatedTarget)) el.style.transform = "";
      });
    });
  }

  /* ---------- GSAP: hero, línea de tiempo y paralaje del retrato ---------- */
  function initScrollFx() {
    if (!(window.gsap && window.ScrollTrigger)) return;
    gsap.registerPlugin(ScrollTrigger);

    const heroInner = $("[data-hero]");
    if (heroInner) {
      gsap.to(heroInner, {
        opacity: 0, y: -36, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 35%", scrub: true }
      });
    }

    const tl = $("[data-timeline]");
    const fill = $("[data-tl-fill]");
    if (tl && fill) {
      ScrollTrigger.create({
        trigger: tl, start: "top 70%", end: "bottom 60%",
        onUpdate: (self) => fill.style.setProperty("--p", self.progress.toFixed(3))
      });
    }

    const img = $(".portrait-frame img");
    if (img) {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".portrait", start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  }

  function initYear() {
    const y = $("[data-year]");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function boot() {
    safe(mountProjects, "mountProjects");
    safe(mountContact, "mountContact");
    safe(initI18n, "initI18n");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initScrollFx, "initScrollFx");
    safe(initYear, "initYear");
    root.classList.add("js-ok");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
