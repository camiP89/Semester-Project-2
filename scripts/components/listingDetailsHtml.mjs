import { getListingStatus } from "../utils/listingStatus.mjs";

export function createListingDetailsHtml(listingData) {
  console.log("1. Data received by component:", listingData);
  const template = document.querySelector("#listing-template");

  const clone = template.content.cloneNode(true);

  clone.querySelector(".js-title").textContent =
    listingData.title || "No title available";

  const imagesElement = clone.querySelector(".js-image");
  const imageUrl = listingData.media?.[0]?.url ?? "/assets/hat-icon.png";
  imagesElement.style.backgroundImage = `url('${imageUrl}')`;

  clone.querySelector(".js-author").textContent =
    listingData.seller?.name || "Unknown Seller";
  clone.querySelector(".js-date").textContent = new Date(
    listingData.created,
  ).toLocaleDateString();
  const endsAt = new Date(listingData.endsAt);

  const dateEl = clone.querySelector(".js-end-date");
  const timeEl = clone.querySelector(".js-end-time");

  if (dateEl) {
    dateEl.textContent = endsAt.toLocaleDateString();
  }

  if (timeEl) {
    timeEl.textContent = endsAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const statusEl = clone.querySelector(".js-status-badge");
  const status = getListingStatus(listingData.endsAt);

  if (statusEl) {
  
    statusEl.className = "";

    statusEl.classList.add(
      "px-2",
      "py-1",
      "text-xs",
      "rounded-lg",
      "text-white",
    );

    if (status === "ending") {
      statusEl.textContent = "Ending soon";
      statusEl.classList.add("bg-yellow-500");
    } else if (status === "ended") {
      statusEl.textContent = "Ended";
      statusEl.classList.add("bg-red-500");
    } else {
      statusEl.style.display = "none";
    }
  }
  clone.querySelector(".js-bid-count").textContent =
    `${listingData._count?.bids || 0} bids`;

  const highestBidElement = clone.querySelector(".js-highest-bid");
  if (listingData.bids && listingData.bids.length > 0) {
    const maxBid = Math.max(...listingData.bids.map((bid) => bid.amount));
    highestBidElement.textContent = `${maxBid} credits`;
  } else {
    highestBidElement.textContent = "No bids yet";
  }

  const desc = clone.querySelector(".js-description");
  if (desc) {
    desc.textContent = listingData.description || "No description provided.";
  }

  const tagsContainer = clone.querySelector(".js-tag-container");

  if (tagsContainer) {
    tagsContainer.innerHTML = "";

    if (listingData.tags && listingData.tags.length > 0) {
      listingData.tags.forEach((tag) => {
        const span = document.createElement("span");

        span.className =
          "text-xs bg-detail/20 px-2 py-1 rounded-full text-text";

        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
    } else {
      tagsContainer.textContent = "No tags available";
    }
  }
  const historyContainer = clone.querySelector(".js-bid-history-container");
  if (historyContainer) {
    historyContainer.innerHTML = "";

    listingData.bids
      .sort((a, b) => b.amount - a.amount)
      .forEach((bid) => {
        const p = document.createElement("p");
        p.className = "text-sm border-b py-1 flex justify-between";
        p.innerHTML = `<span>${bid.bidder.name}</span> <b>${bid.amount} cr</b>`;
        historyContainer.appendChild(p);
      });
  }

  return clone.firstElementChild;
}
