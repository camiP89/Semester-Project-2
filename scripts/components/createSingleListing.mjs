import { deleteListing } from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";

/**
 * Creates a listing card HTML element from a template.
 * @param {Object} listing - The listing data from the API.
 * @param {string|null} profileUserName - Optional: The name of the profile owner if fetching from the profile endpoint.
 */
export function createSingleListingHtml(listing, profileUserName = null) {
  const template = document.querySelector("#listing-card-template");
  if (!template) {
    console.error("Template #listing-card-template not found!");
    return null;
  }

  const clone = template.content.cloneNode(true);
  const card = clone.querySelector("article");

  const authorName = listing.seller?.name || profileUserName || "Unknown User";

  const rawUser = localStorage.getItem("userName") || "";
  const loggedInUser = rawUser.replace(/"/g, "").trim();

  const isOwnListing = loggedInUser.toLowerCase() === authorName.toLowerCase();

  const createdDate = listing.created
    ? new Date(listing.created).toLocaleDateString()
    : "N/A";

  const endsAtDate = listing.endsAt
    ? new Date(listing.endsAt).toLocaleDateString()
    : "N/A";

  const dateEl = clone.querySelector(".js-date");
  if (dateEl) dateEl.textContent = createdDate;

  const endsAtEl = clone.querySelector(".js-ends-at");
  if (endsAtEl) endsAtEl.textContent = `Ends: ${endsAtDate}`;

  const bidCountEl = clone.querySelector(".js-bid-count");
  if (bidCountEl) {
    const count = listing._count?.bids ?? listing.bids?.length ?? 0;
    bidCountEl.textContent = `${count} bids`;
  }

  const highestBidElement = clone.querySelector(".js-highest-bid");
  if (highestBidElement) {
    if (listing.bids && listing.bids.length > 0) {
      const maxBid = Math.max(...listing.bids.map((b) => b.amount));
      highestBidElement.textContent = `${maxBid} credits`;
    } else {
      highestBidElement.textContent = "No bids yet";
    }
  }

  const titleEl = clone.querySelector(".js-title");
  if (titleEl) titleEl.textContent = listing.title || "No Title Provided";

  const authorEl = clone.querySelector(".js-author");
  if (authorEl) authorEl.textContent = authorName;

  const descEl = clone.querySelector(".js-description");
  if (descEl)
    descEl.textContent = listing.description || "No description available.";

  const imageEl = clone.querySelector(".js-image");
  if (imageEl) {
    const imageUrl = listing.media?.[0]?.url ?? "/assets/hat-icon.png";
    imageEl.style.backgroundImage = `url('${imageUrl}')`;
  }

  const ownerControls = clone.querySelector(".js-owner-controls");
  const deleteBtn = clone.querySelector(".js-delete-btn");
  const editBtn = clone.querySelector(".js-edit-btn");

  if (isOwnListing && ownerControls) {
    ownerControls.classList.remove("hidden");
    ownerControls.classList.add("flex");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Delete "${listing.title}"? This cannot be undone.`)) {
          try {
            await fetchData(deleteListing(listing.id), { method: "DELETE" });
            alert("Deleted successfully.");
            card.remove();
          } catch (err) {
            console.error(err);
            alert("Could not delete listing.");
          }
        }
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/listings/edit.html?id=${listing.id}`;
      });
    }
  }

  const listingLink = clone.querySelector(".js-link");
  if (listingLink) {
    listingLink.href = `/listings/listing-detail.html?id=${listing.id}`;
  }

  return card;
}
