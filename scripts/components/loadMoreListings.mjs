import { createListingsHtml } from "../components/displayListings.mjs";

export function loadMoreListings(
  listings,
  currentIndex,
  pageSize = 10,
  containerId = "listings-container",
  isListing = true
) {
  const nextListings = listings.slice(currentIndex, currentIndex + pageSize);
  createListingsHtml(nextListings, isListing, containerId);
  return currentIndex + pageSize;
}

export function toggleLoadMore(buttonId, currentIndex, totalListings) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.style.display = currentIndex < totalListings ? "block" : "none";
}

export function setupLoadMoreButton(buttonId, callback) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener("click", callback);
}
