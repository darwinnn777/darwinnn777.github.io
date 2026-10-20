/*
 * Datos editables de la web. Es el único archivo que necesitas tocar para:
 *   - añadir tu contacto (contact)
 *   - publicar proyectos (projects)
 * El español está escrito directamente en index.html; aquí vive la traducción al inglés.
 */
(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Darwin Fabián Vizhnay Corral",

    /* Rellena lo que quieras mostrar. Lo que dejes vacío no aparece en la web. */
    contact: {
      email: "darwinfabian253@gmail.com",
      linkedin: "https://www.linkedin.com/in/darwin-fabi%C3%A1n-vizhnay-corral-b73b48289/",
      github: "https://github.com/darwinnn777"
    },

    /*
     * Proyectos. Mientras esté vacío se muestran los huecos "próximamente".
     * Cada proyecto:
     * {
     *   title: "Nombre",
     *   year: "2026",
     *   role:  { es: "Desarrollo full stack", en: "Full stack development" },
     *   desc:  { es: "Qué hace en una frase.", en: "What it does in one sentence." },
     *   stack: ["PHP", "MySQL"],
     *   page:  "proyectos/mi-proyecto.html", // página explicativa propia (opcional): la fila entera enlaza a ella
     *   url:   "https://...",      // demo (opcional)
     *   repo:  "https://github.com/..." // código (opcional)
     * }
     */
    projects: [],

    i18n: {
      en: {
        "meta.title": "Darwin Fabián Vizhnay Corral — Full stack web developer",
        "meta.desc": "Darwin Fabián Vizhnay Corral, junior full stack web developer based in Madrid. PHP, Java, JavaScript and SQL. Data Engineering & AI student.",
        "skip": "Skip to content",

        "nav.about": "About",
        "nav.exp": "Experience",
        "nav.edu": "Education",
        "nav.stack": "Stack",
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "nav.lang": "Language",
        "nav.menu": "Open menu",

        "hero.kicker": "Madrid, Spain · Junior Full Stack · Data &amp; AI",
        "hero.sub": "Junior full stack web developer. I write PHP, Java, JavaScript and SQL, and I'm now studying data engineering and artificial intelligence.",
        "hero.cta1": "See projects",
        "hero.cta2": "Contact",
        "hero.scroll": "Scroll",

        "about.k": "01 — About",
        "about.h": "I like things that work, and that <em>look right</em>.",
        "about.p1": "I'm Darwin Fabián Vizhnay Corral, a junior full stack web developer from Alcorcón, Madrid. I trained in Web Application Development and work with PHP, Java, JavaScript and SQL.",
        "about.p2": "I did a web development internship working with WordPress and web infrastructure, and balanced my studies with a customer-facing job. Now I'm taking the next step: data engineering and AI at Tajamar.",
        "about.f1l": "Location",
        "about.f1v": "Alcorcón, Madrid",
        "about.f2l": "Profile",
        "about.f2v": "Full Stack Web Developer · Junior",
        "about.f3l": "Studying",
        "about.f3v": "Data Engineering &amp; AI",
        "about.alt": "Portrait of Darwin Fabián Vizhnay Corral",
        "about.cap": "Darwin · Madrid",

        "exp.k": "02 — Experience",
        "exp.h": "From dealing with customers <em>to code</em>.",
        "exp.skills": "Skills",
        "exp.1.d": "Jan – Apr 2026",
        "exp.1.r": "Web development intern",
        "exp.1.o": "ROS Iberia S.L. · Guadalajara · Hybrid",
        "exp.1.t2": "Web infrastructure",
        "exp.2.d": "Jul 2024 – Sep 2026",
        "exp.2.r": "Sales associate · part-time",
        "exp.2.o": "IKEA · Alcorcón · On-site",
        "exp.2.t1": "Teamwork",
        "exp.2.t2": "Sales management",
        "exp.3.d": "Mar – Jun 2024",
        "exp.3.r": "Administrative assistant · internship",
        "exp.3.o": "Mapfre · Madrid · On-site",

        "edu.k": "03 — Education",
        "edu.h": "Always studying <em>something new</em>.",
        "edu.1.d": "Sep 2026 – Jun 2027",
        "edu.1.s": "In progress",
        "edu.1.r": "Data Engineer &amp; AI",
        "edu.2.d": "Sep 2024 – May 2026",
        "edu.2.r": "Higher Vocational Degree · Web Application Development",

        "stack.k": "04 — Stack",
        "stack.h": "What I <em>work with</em>.",
        "stack.g1": "What I already use",
        "stack.g3": "Now studying",

        "proj.k": "05 — Projects",
        "proj.h": "Upcoming <em>projects</em>.",
        "proj.p": "I'm still preparing my first portfolio projects. This space will grow with every one I publish.",
        "proj.t": "Project — coming soon",
        "proj.s": "In the works",

        "contact.k": "06 — Contact",
        "contact.h": "<em>Let's talk.</em>",
        "contact.p": "If you have an offer, an idea, or just want to say hi, write to me.",

        "foot.loc": "Alcorcón, Madrid",
        "foot.top": "Back to top ↑"
      }
    }
  };
})();
