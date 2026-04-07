import { createListing } from "../api/listingsApi.mjs";
import { createHeader } from "../components/header.mjs";
import { hideSpinner, showSpinner } from "../components/loadingSpinner.mjs";

createHeader();

const listingForm = document.getElementById("create-listing-container");

listingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const listingTitle = document.getElementById("listing-title").value.trim();
  const listingDescription = document
    .getElementById("listing-description")
    .value.trim();
  const listingImage = document.getElementById("image-url").value.trim();
  const imageInput = document.getElementById("image-url");
  const previewImage = document.getElementById("image-preview");

  imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();

    if (!url) {
      previewImage.classList.add("hidden");
      previewImage.src = "";
      return;
    }

    previewImage.src = url;
    previewImage.classList.remove("hidden");
  });
  const imageAltText = document.getElementById("image-alt-text").value.trim();
  const listingTags = document
    .getElementById("listing-tags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const endsAtDate = document.getElementById("end-datetime").value;

  const submitButton = listingForm.querySelector("button[type='submit']");

  const listingData = {
    title: listingTitle,
    description: listingDescription,
    media: listingImage
      ? [{ url: listingImage, alt: imageAltText || listingTitle }]
      : [],
    tags: listingTags,
    endsAt: new Date(endsAtDate).toISOString(),
  };

  showSpinner();

  try {
    if (submitButton) submitButton.disabled = true;

    await createListing(listingData);

    alert("Post created successfully!");
    window.location.href = "../listings/index.html";
  } catch (error) {
    console.error(error);
    alert("Failed to create listing. Check console for details.");
  } finally {
    if (submitButton) submitButton.disabled = false;
    hideSpinner();
  }
});
