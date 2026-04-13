import { API_BASE_URL } from "../constants/constants.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";
import { getSingleProfile } from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";

export async function createHeader() {
  const token = getFromLocalStorage("accessToken");
  const userName = getFromLocalStorage("userName");

  if (!token || !userName) return;

  const profile = await fetchData(
    `${getSingleProfile(userName)}?_credits=true`,
  );

  const credits = profile.data?.credits ?? profile.credits;

  console.log("TOKEN:", token);
  const loggedInContainers = [
    document.getElementById("logged-in-nav"),
    document.getElementById("mobile-logged-in-nav"),
    document.getElementById("user-status-bar"),
  ];

  const loggedOutContainers = [
    document.getElementById("logged-out-nav"),
    document.getElementById("mobile-logged-out-nav"),
  ];

  if (token && userName) {
    loggedInContainers.forEach((el) => {
      if (!el) return;

      el.classList.remove("hidden");

      if (el.id === "user-status-bar") {
        el.classList.add("flex");
      }

      if (el.id === "mobile-logged-in-nav") {
        el.classList.add("flex", "flex-col");
      }
    });
    loggedOutContainers.forEach((el) => el?.classList.add("hidden"));

    const welcomeText = document.getElementById("welcome-text");
    const userCredits = document.getElementById("user-credits");
    if (welcomeText) welcomeText.textContent = `Welcome, ${userName}!`;
    if (userCredits) userCredits.textContent = Number(credits).toLocaleString();
  } else {
    loggedInContainers.forEach((el) => el?.classList.add("hidden"));
    loggedOutContainers.forEach((el) => el?.classList.remove("hidden"));
  }

  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    };
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/index.html";
  };

  document
    .getElementById("logout-button")
    ?.addEventListener("click", handleLogout);
  document
    .getElementById("mobile-logout-button")
    ?.addEventListener("click", handleLogout);
}
