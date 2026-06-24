/* =============================================================
   Paulo Caicedo Zapata — CV interactions
   · Accessible background-music toggle (no autoplay)
   · Scroll-spy for the primary nav
   · Reveal-on-scroll (progressive enhancement)
   ============================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Background music — manual, accessible, remembered
     --------------------------------------------------------- */
  (function music() {
    var audio = document.getElementById("audio");
    var toggle = document.getElementById("musicToggle");
    if (!audio || !toggle) return;

    var STORAGE_KEY = "pcz-music";

    function reflect(isPlaying) {
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause background music" : "Play background music"
      );
    }

    function remember(state) {
      try {
        localStorage.setItem(STORAGE_KEY, state);
      } catch (e) {
        /* storage may be unavailable (private mode) — non-critical */
      }
    }

    function play() {
      var p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(function () {
          remember("on");
        }).catch(function () {
          /* blocked until a user gesture — keep UI honest */
          reflect(false);
        });
      }
    }

    toggle.addEventListener("click", function () {
      if (audio.paused) {
        play();
      } else {
        audio.pause();
        remember("off");
      }
    });

    /* Keep the button in sync with the real audio state */
    audio.addEventListener("play", function () {
      reflect(true);
    });
    audio.addEventListener("pause", function () {
      reflect(false);
    });

    reflect(false);

    /* If the visitor had music on previously, resume on their first
       interaction (a gesture) — this respects autoplay policies. */
    var wanted;
    try {
      wanted = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      wanted = null;
    }

    if (wanted === "on") {
      var resume = function () {
        play();
        document.removeEventListener("pointerdown", resume);
        document.removeEventListener("keydown", resume);
      };
      document.addEventListener("pointerdown", resume, { once: true });
      document.addEventListener("keydown", resume, { once: true });
    }
  })();

  /* ---------------------------------------------------------
     2. Scroll-spy — highlight the section in view
     --------------------------------------------------------- */
  (function scrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav__link")
    );
    if (!links.length) return;

    var byId = {};
    var sections = [];
    links.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace("#", "");
      var section = id && document.getElementById(id);
      if (section) {
        byId[id] = link;
        sections.push(section);
      }
    });

    function setActive(id) {
      links.forEach(function (link) {
        if (byId[id] === link) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  })();

  /* ---------------------------------------------------------
     3. Reveal-on-scroll — added via JS so no-JS stays visible
     --------------------------------------------------------- */
  (function reveal() {
    if (prefersReduced || !("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(
      ".section__head, .about__bio, .about__side, .project-card, .stack__group-title, .stack-card, .chip, .contact-item"
    );
    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    /* Stagger items that share a parent for a livelier entrance */
    var groups = {};
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("reveal");

      var parent = el.parentNode;
      var key = groups[parentKey(parent)] || 0;
      var delay = Math.min(key * 60, 300);
      if (delay) el.style.transitionDelay = delay + "ms";
      groups[parentKey(parent)] = key + 1;

      observer.observe(el);
    });

    function parentKey(node) {
      if (!node.__revealKey) {
        parentKey.counter = (parentKey.counter || 0) + 1;
        node.__revealKey = "g" + parentKey.counter;
      }
      return node.__revealKey;
    }
  })();
})();
