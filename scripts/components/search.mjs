import { fetchAllListings } from "../api/listingsApi.mjs";
import { createListingsHtml } from "../components/displayListings.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";

const searchInput = document.getElementById("search-input");
const listingsContainer = document.getElementById("listings-container");

let allListings = [];

export function renderListings() {
  if (!searchInput || !listingsContainer) return;

  const query = searchInput.value.trim().toLowerCase();

  const filteredListings = allListings.filter((listing) => {
    return (
      listing.title?.toLowerCase().includes(query) ||
      listing.description?.toLowerCase().includes(query) ||
      listing.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  listingsContainer.innerHTML = "";

  if (filteredListings.length === 0) {
    listingsContainer.innerHTML = `<p class="col-span-full text-center py-10 text-text/60">No listings found for "${query}"</p>`;
    return;
  }

  createListingsHtml(
    filteredListings,
    !!localStorage.getItem("accessToken"),
    "listings-container"
  );
}

export async function initSearch() {
  try {
    showSpinner();
    allListings = await fetchAllListings();
    hideSpinner();

    if (searchInput) {
      searchInput.addEventListener("input", renderListings);
    }
  } catch (err) {
    hideSpinner();
    console.error("Error initializing search:", err);
  }
}