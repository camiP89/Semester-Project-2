export function createHeader() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  }
}

createHeader();
