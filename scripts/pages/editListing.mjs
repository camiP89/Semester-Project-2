import {
  fetchSingleListingById,
  updateListingById,
} from "../api/listingsApi.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";
import { createHeader } from "../components/header.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";

createHeader();

const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

const editForm = document.getElementById("create-listing-container");
const imageInput = document.getElementById("image-url");
const previewImage = document.getElementById("image-preview");
const cancelBtn = document.querySelector("button[value='Cancel']");

function redirectToProfile() {
  const userName = getFromLocalStorage("userName");

  window.location.href = `/profile/index.html?name=${userName}`;
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    if (confirm("Discard changes?")) {
      redirectToProfile();
    }
  });
}

async function populateForm() {
  try {
    showSpinner();
    const response = await fetchSingleListingById(listingId);
    const listing = response.data || response;

    if (!listing) {
      throw new Error("Listing data not found");
    }

    document.getElementById("listing-title").value = listing.title || "";
    document.getElementById("listing-description").value = listing.description || "";
    document.getElementById("listing-tags").value = listing.tags?.join(", ") || "";


    if (listing.media && listing.media.length > 0) {
      const media = listing.media[0];
      const altInput = document.getElementById("image-alt-text");

      if (imageInput) imageInput.value = media.url || "";

      if (altInput) {
        altInput.value = media.alt || "";
      }


      if (previewImage && media.url) {
        previewImage.src = media.url;
        previewImage.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Populate Form Error:", error);
    alert("Could not find listing data.");
  } finally {
    hideSpinner();
  }
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const listingData = {
    title: document.getElementById("listing-title").value.trim(),
    description: document.getElementById("listing-description").value.trim(),
    tags: document
      .getElementById("listing-tags")
      .value.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    media: imageInput.value.trim()
      ? [
          {
            url: imageInput.value.trim(),
            alt: document.getElementById("image-alt-text").value.trim(),
          },
        ]
      : [],
  };

  try {
    showSpinner();
    await updateListingById(listingId, listingData);
    alert("Updated successfully!");
    redirectToProfile();
  } catch (error) {
    console.error(error);
    alert("Update failed.");
  } finally {
    hideSpinner();
  }
});

populateForm();
