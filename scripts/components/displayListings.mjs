import { createSingleListingHtml } from "../components/createSingleListing.mjs";

export function createListingsHtml(
  listings,
  isLoggedIn = false,
  containerId = "listings-container",
  profileUserName = "",
) {
  console.log("createListingsHtml called");
  const listingsContainer = document.getElementById(containerId);

  if (!listingsContainer) return;

  if (!Array.isArray(listings)) {
    listingsContainer.innerHTML = "<p>Could not load listings.</p>";
    return;
  }
  console.log("Listings received:", listings);

  if (listings.length === 0) {
    listingsContainer.innerHTML = "<p>No listings available</p>";
    return;
  }
  console.log("Total listings:", listings.length);

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
  console.log("All listings rendered");
}

