import { getListingStatus } from "../utils/listingStatus.mjs";

export function createSingleBidHtml(bid) {
  const template = document.getElementById("bid-card-template");

  if (!template) {
    console.error("Missing bid template");
    return null;
  }

  const clone = template.content.cloneNode(true);

  const listing = bid.listing;
  if (!listing) return null;

  const imageEl = clone.querySelector(".js-image");
  if (imageEl) {
    const imageUrl = listing.media?.[0]?.url ?? "/assets/hat-icon.png";
    imageEl.style.backgroundImage = `url('${imageUrl}')`;
  }

  const titleEl = clone.querySelector(".js-title");
  if (titleEl) {
    titleEl.textContent = listing.title || "Untitled";
  }

  const amountEl = clone.querySelector(".js-bid-amount");
  if (amountEl) {
    amountEl.textContent = bid.amount;
  }

  const endDateEl = clone.querySelector(".js-end-date");
  const endTimeEl = clone.querySelector(".js-end-time");

  let status = null;
  let date = null;

  if (listing.endsAt) {
    date = new Date(listing.endsAt);

    if (endDateEl) {
      endDateEl.textContent = date.toLocaleDateString();
    }

    if (endTimeEl) {
      endTimeEl.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    status = getListingStatus(listing.endsAt);
  }

  const statusBadge = clone.querySelector(".js-status-badge");
  const statusWrapper = clone.querySelector(".js-status-wrapper");

  if (statusBadge && statusWrapper && status) {
    statusWrapper.className =
      "js-status-wrapper absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-md hidden";

    statusBadge.className = "js-status-badge text-white";

    if (status === "ended") {
      statusBadge.textContent = "Ended";
      statusWrapper.classList.remove("hidden");
      statusWrapper.classList.add("bg-red-500");
    } else if (status === "ending") {
      statusBadge.textContent = "Ending soon";
      statusWrapper.classList.remove("hidden");
      statusWrapper.classList.add("bg-yellow-500");
    } else {
      statusWrapper.classList.add("hidden");
    }
  }

  const linkEl = clone.querySelector(".js-link");
  if (linkEl) {
    linkEl.href = `/listings/listing-detail.html?id=${listing.id}`;
  }

  return clone;
}
