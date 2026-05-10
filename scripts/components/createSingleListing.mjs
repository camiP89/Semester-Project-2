import { deleteListing } from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";
import { getListingStatus } from "../utils/listingStatus.mjs";

/**
 * Creates a listing card HTML element from a template.
 * @param {Object} listing
 * @param {string|null} profileUserName
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

  const dateEl = clone.querySelector(".js-date");
  if (dateEl) dateEl.textContent = createdDate;

  const endDateEl = clone.querySelector(".js-end-date");
  const endTimeEl = clone.querySelector(".js-end-time");

  if (listing.endsAt) {
    const date = new Date(listing.endsAt);

    if (endDateEl) {
      endDateEl.textContent = date.toLocaleDateString();
    }

    if (endTimeEl) {
      endTimeEl.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  const statusWrapper = clone.querySelector(".js-status-wrapper");
  const statusBadge = clone.querySelector(".js-status-badge");

  if (statusWrapper && statusBadge && listing.endsAt) {
    const status = getListingStatus(listing.endsAt);

    statusWrapper.className =
      "js-status-wrapper absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-md hidden";

    statusBadge.className = "js-status-badge text-white";

    if (status === "ended") {
      statusBadge.textContent = "Ended";

      statusWrapper.classList.remove("hidden");
      statusWrapper.classList.add("bg-red-700");
    } else if (status === "ending") {
      statusBadge.textContent = "Ending soon";

      statusWrapper.classList.remove("hidden");
      statusWrapper.classList.add("bg-yellow-500");
    } else {
      statusWrapper.classList.add("hidden");
    }
  }

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
  if (descEl) {
    descEl.textContent = listing.description || "No description available.";
  }

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
            await fetchData(deleteListing(listing.id), {
              method: "DELETE",
            });

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
