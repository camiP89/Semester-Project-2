import { registerUser } from "../api/authApi.mjs";
import { createHeader } from "../components/header.mjs";
import { hideSpinner, showSpinner } from "../components/loadingSpinner.mjs";

createHeader();

const registrationForm = document.getElementById("form-container");

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const avatarUrl = document.getElementById("avatarUrl").value.trim();

  const email = `${username}@stud.noroff.no`;

  const submitButton = registrationForm.querySelector("button[type='submit']");

  showSpinner();
  try {
    if (submitButton) submitButton.disabled = true;

    await registerUser(name, email, password, avatarUrl);

    alert("Registration successful! Redirecting to login...");
    window.location.href = "../account/login.html";
  } catch (error) {
    alert("Registration failed: " + error.message);
  } finally {
    if (submitButton) submitButton.disabled = false;
    hideSpinner();
  }
});
