import { fetchAllListings } from "../api/listingsApi.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";
import {
  loadMoreListings,
  toggleLoadMore,
  setupLoadMoreButton,
} from "../components/loadMoreListings.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";

let allListings = [];
let currentIndex = 0;
const pageSize = 10;

document.addEventListener("DOMContentLoaded", () => {
  main();
});

async function main() {
  createHeader();
  const token = getFromLocalStorage("accessToken");
  const heroBanner = document.getElementById("hero-banner");

  if (token && heroBanner) {
    heroBanner.classList.add("hidden");
  }

  const heading = document.querySelector("h1");
  if (heading) heading.textContent = "All Auction Listings";

  showSpinner();
  try {
    allListings = await fetchAllListings();

    currentIndex = loadMoreListings(allListings, currentIndex, pageSize);

    toggleLoadMore("load-more-button", currentIndex, allListings.length);

    setupLoadMoreButton("load-more-button", () => {
      currentIndex = loadMoreListings(allListings, currentIndex, pageSize);
      toggleLoadMore("load-more-button", currentIndex, allListings.length);
    });
  } catch (error) {
    const listingContainer = document.getElementById("listings-container");
    if (listingContainer)
      listingContainer.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
  } finally {
    hideSpinner();
  }
}
