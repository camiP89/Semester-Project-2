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
  clone.querySelector(".js-ends-at").textContent =
    `Ends: ${new Date(listingData.endsAt).toLocaleDateString()}`;

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
  if (desc)
    desc.textContent = listingData.description || "No description provided.";
  console.log("4. Component successfully built.");

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
