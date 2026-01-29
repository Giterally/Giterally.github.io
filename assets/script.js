document.addEventListener("DOMContentLoaded", () => {
  // Header nav buttons: switch whole pages
  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.target;
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      const el = document.getElementById(target);
      if (el) el.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});

