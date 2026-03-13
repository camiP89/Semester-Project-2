import { createSingleListingHtml } from "../components/createSingleListing.mjs";

export function createListingsHtml(
  listings,
  isLoggedIn = false,
  containerId = "listings-container",
  profileUserName = "",
) {
  const listingsContainer = document.getElementById(containerId);

  if (!listingsContainer) return;

  if (!Array.isArray(listings)) {
    listingsContainer.innerHTML = "<p>Could not load listings.</p>";
    return;
  }

  if (listings.length === 0) {
    listingsContainer.innerHTML = "<p>No listings available</p>";
    return;
  }

  listings.forEach((listing) => {
    try {
      const listingHtml = createSingleListingHtml(
        listing,
        isLoggedIn,
        profileUserName,
      );
      listingsContainer.appendChild(listingHtml);
    } catch (error) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Error displaying a listing.";
      errorMsg.style.color = "red";
      listingsContainer.appendChild(errorMsg);
    }
  });
}
