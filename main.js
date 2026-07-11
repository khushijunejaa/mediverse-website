/* =====================================================
   MEDIVERSE — Motion & Interaction
   GSAP · ScrollTrigger · Lenis · SplitType
   ===================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js-ready");

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     NAVIGATION — scroll state, mobile menu
     ===================================================== */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");

  const setNavState = (y) => {
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
  };

  navToggle && navToggle.addEventListener("click", () => {
    const open = navToggle.classList.toggle("is-open");
    navMobile.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navMobile.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  navMobile && navMobile.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("is-open");
      navMobile.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    })
  );

  /* =====================================================
     CONTACT MODAL — open/close, focus trap, Formspree submit
     ===================================================== */
  const modal = document.getElementById("contactModal");
  if (modal) {
    const panel = modal.querySelector(".modal__panel");
    const form = document.getElementById("contactForm");
    const note = form.querySelector(".mform__note");
    const bodyView = document.getElementById("modalBody");
    const successView = document.getElementById("modalSuccess");
    const submitBtn = form.querySelector(".mform__submit");
    let lastFocused = null;

    const focusables = () =>
      modal.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])');

    const openModal = (e) => {
      if (e) e.preventDefault();
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const first = form.querySelector("input, select, textarea");
      setTimeout(() => first && first.focus(), 60);
    };
    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll(".js-open-contact").forEach((b) => b.addEventListener("click", openModal));
    modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const f = Array.from(focusables());
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Formspree AJAX submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      note.textContent = ""; note.classList.remove("is-error");

      if (!form.checkValidity()) { form.reportValidity(); return; }

      const action = form.getAttribute("action");
      if (!action || action.includes("YOUR_FORM_ID")) {
        note.textContent = "Form not configured yet — see README to add your Formspree ID.";
        note.classList.add("is-error");
        return;
      }

      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          bodyView.hidden = true;
          successView.hidden = false;
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          note.textContent = (data.errors && data.errors[0] && data.errors[0].message) ||
            "Something went wrong. Please email hello@mediverse.example.";
          note.classList.add("is-error");
        }
      } catch (err) {
        note.textContent = "Network error. Please try again or email hello@mediverse.example.";
        note.classList.add("is-error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }

  /* =====================================================
     MARQUEE — duplicate content for seamless loop
     ===================================================== */
  const track = document.getElementById("marqueeTrack");
  if (track) {
    track.innerHTML += track.innerHTML; // duplicate once
    if (!prefersReduced) {
      const style = document.createElement("style");
      style.textContent =
        "@keyframes mv-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
        ".marquee__track{animation:mv-marquee 42s linear infinite}";
      document.head.appendChild(style);
    }
  }

  /* =====================================================
     Wait for libraries (loaded with defer)
     ===================================================== */
  function whenReady(cb) {
    if (window.gsap) return cb();
    let tries = 0;
    const t = setInterval(() => {
      if (window.gsap || tries++ > 60) { clearInterval(t); cb(); }
    }, 30);
  }

  whenReady(function () {
    const gsap = window.gsap;

    /* ---------- Fallback if GSAP failed to load ---------- */
    if (!gsap) {
      document.querySelectorAll(".reveal, .reveal-fade").forEach((el) => {
        el.style.opacity = 1; el.style.transform = "none";
      });
      window.addEventListener("scroll", () => setNavState(window.scrollY), { passive: true });
      setNavState(window.scrollY);
      return;
    }

    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    /* =====================================================
       LENIS — smooth scrolling
       ===================================================== */
    let lenis = null;
    if (window.Lenis && !prefersReduced) {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);

      if (window.ScrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
      }

      // Progress bar + nav state via Lenis
      const progress = document.querySelector(".scroll-progress span");
      lenis.on("scroll", ({ scroll, limit }) => {
        setNavState(scroll);
        if (progress) progress.style.transform = "scaleX(" + (limit ? scroll / limit : 0) + ")";
      });

      // Anchor links → Lenis
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        if (a.classList.contains("js-open-contact")) return; // handled by modal
        a.addEventListener("click", (e) => {
          const id = a.getAttribute("href");
          if (id.length > 1 && document.querySelector(id)) {
            e.preventDefault();
            lenis.scrollTo(id, { offset: -20 });
          }
        });
      });
    } else {
      window.addEventListener("scroll", () => {
        setNavState(window.scrollY);
        const progress = document.querySelector(".scroll-progress span");
        const limit = document.body.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = "scaleX(" + (limit ? window.scrollY / limit : 0) + ")";
      }, { passive: true });
    }
    setNavState(window.scrollY || 0);

    /* =====================================================
       REDUCED MOTION — reveal everything, skip animation
       ===================================================== */
    if (prefersReduced) {
      gsap.set(".reveal, .reveal-fade", { opacity: 1, y: 0 });
      return;
    }

    /* =====================================================
       HERO — SplitType line reveal
       ===================================================== */
    const heroTitle = document.querySelector(".hero__title");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (window.SplitType && heroTitle) {
      const split = new window.SplitType(heroTitle.querySelectorAll(".line"), { types: "lines" });
      gsap.set(split.lines, { yPercent: 110 });
      tl.to(split.lines, { yPercent: 0, duration: 1.3, stagger: 0.12, delay: 0.15 });
    } else if (heroTitle) {
      gsap.set(heroTitle, { opacity: 0, y: 40 });
      tl.to(heroTitle, { opacity: 1, y: 0, duration: 1.2 });
    }

    tl.to(".hero__eyebrow", { opacity: 1, y: 0, duration: 1 }, 0.1)
      .to(".hero__copy", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
      .to(".hero__actions", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
      .to(".scroll-hint", { opacity: 1, duration: 1 }, "-=0.5");

    /* =====================================================
       SMOKE — slow drifting parallax
       ===================================================== */
    document.querySelectorAll(".smoke--tl, .smoke--br, .smoke--center").forEach((el, i) => {
      gsap.to(el, {
        x: i % 2 ? -60 : 60, y: i % 2 ? 50 : -40, scale: 1.12,
        duration: 18 + i * 4, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    });

    /* =====================================================
       SECTION REVEALS
       ===================================================== */
    if (window.ScrollTrigger) {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Staggered groups: cards & experts
      gsap.utils.toArray(".cards").forEach((group) => {
        gsap.to(group.querySelectorAll(".card"), {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 85%" },
        });
      });

      /* ---------- About sphere: float + scroll rotate ---------- */
      const sphere = document.getElementById("aboutSphere");
      if (sphere) {
        gsap.to(sphere, { y: -18, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(sphere, {
          rotation: 12,
          scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.fromTo(sphere, { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: "#about", start: "top 78%" } });
      }

      /* ---------- CTA card subtle rise ---------- */
      gsap.fromTo(".cta__card", { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, ease: "power3.out",
          scrollTrigger: { trigger: ".cta", start: "top 78%" } });

      /* ---------- Section title parallax drift ---------- */
      gsap.utils.toArray(".section__title").forEach((t) => {
        gsap.fromTo(t, { y: 0 }, {
          y: -26, ease: "none",
          scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
    }

    /* =====================================================
       EXPERTS CAROUSEL — keyboard + drag to scroll
       ===================================================== */
    const carousel = document.getElementById("carousel");
    if (carousel) {
      // Keyboard arrows
      carousel.addEventListener("keydown", (e) => {
        const card = carousel.querySelector(".expert");
        const step = card ? card.getBoundingClientRect().width + 26 : 320;
        if (e.key === "ArrowRight") { carousel.scrollBy({ left: step, behavior: "smooth" }); e.preventDefault(); }
        if (e.key === "ArrowLeft")  { carousel.scrollBy({ left: -step, behavior: "smooth" }); e.preventDefault(); }
      });

      // Pointer drag (desktop)
      let down = false, startX = 0, startScroll = 0, moved = false;
      carousel.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") return; // native touch handles it
        down = true; moved = false; startX = e.clientX; startScroll = carousel.scrollLeft;
        carousel.style.cursor = "grabbing";
      });
      window.addEventListener("pointermove", (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        carousel.scrollLeft = startScroll - dx;
      });
      window.addEventListener("pointerup", () => { down = false; carousel.style.cursor = ""; });
      carousel.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
    }

    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
})();
