(function () {
  var root = document.documentElement, KEY = "aqib-theme";
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) root.dataset.theme = saved;
    else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
  } catch (e) {}
  document.getElementById("theme").addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });

  // Loading animation
  var loader = document.getElementById("loader");
  function hideLoader() { loader.classList.add("done"); }
  window.addEventListener("load", function () { setTimeout(hideLoader, still ? 0 : 500); });
  setTimeout(hideLoader, 3000);

  // Mobile menu
  var menu = document.getElementById("menu"), links = document.getElementById("links");
  menu.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) { links.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }
  });

  // Skill badge stagger index
  document.querySelectorAll(".badges").forEach(function (group) {
    group.querySelectorAll(".badge").forEach(function (b, i) { b.style.setProperty("--i", i); });
  });

  // Count-up for metrics
  function count(el) {
    var end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (still) { el.textContent = end.toFixed(dec); return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Scroll reveal
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        en.target.querySelectorAll("[data-count]").forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      if (el.classList.contains("metric")) el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(count);
  }

  // Cursor glow on cards
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Back to top + active nav link
  var top = document.getElementById("top");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = links.querySelectorAll("a");
  function onScroll() {
    top.classList.toggle("show", window.scrollY > 600);
    var y = window.scrollY + 140, current = "";
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }); });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
