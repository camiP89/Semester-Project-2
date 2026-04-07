import { fetchAllListings } from "../api/listingsApi.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import {
  loadMoreListings,
  toggleLoadMore,
  setupLoadMoreButton,
} from "./loadMoreListings.mjs";
import { sortListings, setupSortDropdown } from "./sortListings.mjs";

/**
 * Renders the listings feed with a heading and pagination.
 * @param {string} headingText - The text for the page H1.
 * @param {number} pageSize - How many items to show per page.
 */
export async function renderListingsContainer(headingText, pageSize = 10) {
  let allListings = [];
  let sortedListings = [];
  let currentIndex = 0;

  const heading = document.querySelector("h1");
  if (heading) heading.textContent = headingText;

  showSpinner();

  try {
    allListings = await fetchAllListings();

    sortedListings = [...allListings];

    currentIndex = loadMoreListings(sortedListings, currentIndex, pageSize);
    toggleLoadMore("load-more-button", currentIndex, sortedListings.length);

    setupLoadMoreButton("load-more-button", () => {
      currentIndex = loadMoreListings(sortedListings, currentIndex, pageSize);
      toggleLoadMore("load-more-button", currentIndex, sortedListings.length);
    });

    setupSortDropdown("sort-dropdown", (sortType) => {
      currentIndex = 0;

      sortedListings = sortListings(allListings, sortType);

      document.getElementById("listings-container").innerHTML = "";

      currentIndex = loadMoreListings(sortedListings, currentIndex, pageSize);

      toggleLoadMore("load-more-button", currentIndex, sortedListings.length);
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