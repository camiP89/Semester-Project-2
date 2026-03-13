import { loginUser } from "../api/authApi.mjs";
import { createHeader } from "../components/header.mjs";
import { hideSpinner, showSpinner } from "../components/loadingSpinner.mjs";
import { addToLocalStorage } from "../utils/utils.mjs";

createHeader();

const loginForm = document.getElementById("form-container");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = `${username}@stud.noroff.no`;
  const submitButton = loginForm.querySelector("button[type='submit']");

  showSpinner();
  try {
    if (submitButton) submitButton.disabled = true;

    const result = await loginUser(email, password);
    if (result && result.data) {
      addToLocalStorage("accessToken", result.data.accessToken);
      addToLocalStorage("userName", result.data.name);
      addToLocalStorage("userEmail", result.data.email);
      if (result.data.credits !== undefined) {
        addToLocalStorage("userCredits", result.data.credits);
      }
    }

    alert(`Welcome ${result.data.name}!`);

    window.location.href = "/listings/index.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  } finally {
    if (submitButton) submitButton.disabled = false;
    hideSpinner();
  }
});
