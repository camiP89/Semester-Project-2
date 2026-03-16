import { fetchAllListings } from "../api/listingsApi.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import {
  loadMoreListings,
  toggleLoadMore,
  setupLoadMoreButton,
} from "./loadMoreListings.mjs";

/**
 * Renders the listings feed with a heading and pagination.
 * @param {string} headingText - The text for the page H1.
 * @param {number} pageSize - How many items to show per page.
 */
export async function renderListingsContainer(headingText, pageSize = 10) {
  let allListings = [];
  let currentIndex = 0;

  const heading = document.querySelector("h1");
  if (heading) heading.textContent = headingText;

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
    if (listingContainer) {
      listingContainer.innerHTML = `<p class="text-red-500">Error loading listings: ${error.message}</p>`;
    }
  } finally {
    hideSpinner();
  }
}
