document.addEventListener("DOMContentLoaded", () => {
  const navButtons = Array.from(document.querySelectorAll(".nav-button"));

  // Smooth scroll behavior (also set in CSS)
  navButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      // Immediately mark this button active
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // Calculate offset to account for fixed header using element offset from document top
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 56;
      // offsetTop is relative to the nearest positioned ancestor; to be safe compute via getBoundingClientRect + current scroll
      const absoluteTop = Math.max(0, targetEl.offsetTop - headerHeight - 16);
      // Fallback using bounding rect if offsetTop is not available
      const finalTop = isNaN(absoluteTop) ? Math.max(0, window.scrollY + targetEl.getBoundingClientRect().top - headerHeight - 16) : absoluteTop;
      window.scrollTo({ top: finalTop, behavior: "smooth" });
    });
  });

  // Observe sections to update active nav and section background
  const sections = Array.from(document.querySelectorAll(".page"));
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.55, // 55% of section visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const btn = document.querySelector(`.nav-button[data-target="${id}"]`);
      if (entry.isIntersecting) {
        // mark nav active
        navButtons.forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");
        // mark section as in-view
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
        if (btn) btn.classList.remove("active");
      }
    });
  }, options);

  sections.forEach(s => {
    // give sections a scroll margin to account for header
    s.style.scrollMarginTop = (document.querySelector(".site-header").offsetHeight + 8) + "px";
    observer.observe(s);
  });
  
  // Darken background when home-content scrolls into view
  const homeContent = document.getElementById("home-content");
  if (homeContent) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          document.body.classList.add("content-visible");
        } else {
          document.body.classList.remove("content-visible");
        }
      });
    }, { threshold: 0.15 });
    bgObserver.observe(homeContent);
  }

  // Contact popover behavior
  const contactBtn = document.getElementById("contact-btn");
  const contactPanel = document.getElementById("contact-panel");
  const contactClose = document.getElementById("contact-close");
  if (contactBtn && contactPanel) {
    function openContact() {
      contactPanel.classList.add("open");
      contactPanel.setAttribute("aria-hidden", "false");
    }
    function closeContact() {
      contactPanel.classList.remove("open");
      contactPanel.setAttribute("aria-hidden", "true");
    }
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (contactPanel.classList.contains("open")) closeContact(); else openContact();
    });
    // close when clicking outside
    document.addEventListener("click", (e) => {
      if (!contactPanel.contains(e.target) && !contactBtn.contains(e.target)) {
        closeContact();
      }
    });
    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeContact();
    });
    if (contactClose) contactClose.addEventListener("click", closeContact);
  }
});

