import { API_BASE_URL } from "../constants/constants.mjs";
import { createListingDetailsHtml } from "../components/listingDetailsHtml.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";
import { getAuthHeaders } from "../api/authApi.mjs";
import { fetchData } from "../api/apiFetch.mjs";

createHeader();

const listingDetailsContainer = document.querySelector("#listings-container");

export function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    listingId: params.get("id"),
  };
}

export async function mainId() {
  const { listingId } = getIdFromURL();

  if (!listingId) {
    const container = document.querySelector("#listings-container");
    if (container) {
      container.innerHTML =
        "<p class'p-4 text-center'>No listing ID found in URL.</p>";
    }
    console.error("Missing listing ID.");
    return;
  }

  const url = `${API_BASE_URL}/auction/listings/${listingId}?_seller=true&_bids=true`;

  showSpinner();

  try {
    const data = await fetchData(url);
    console.log("Full API Response:", data);
    const listingData = data;

    if (!listingData) throw new Error("Listing data is empty.");

    const singleListingHtml = createListingDetailsHtml(listingData);

    listingDetailsContainer.innerHTML = "";
    listingDetailsContainer.appendChild(singleListingHtml);

    document.title = `${listingData.title} | Student Auction House`;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    document.querySelector("#listings-container").innerHTML =
      "<p class'p-4 text-center'>Error loading listing.</p>";
  } finally {
    hideSpinner();
  }
}

mainId();
