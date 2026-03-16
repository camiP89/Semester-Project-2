import { createHeader } from "../components/header.mjs";

createHeader();

const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

if (contactForm && successMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactForm.classList.add("hidden");
    successMessage.classList.remove("hidden");
  });
}
