export function createSingleListingHtml(listing, profileUserName = null) {
  const template = document.querySelector("#listing-template");
  const clone = template.content.cloneNode(true);

  const authorName =
    listing.seller?.name || profileUserName || "Unknown Author";
  const createdDate = new Date(listing.created).toLocaleDateString();
  const endsAtDate = new Date(listing.endsAt).toLocaleDateString();

  const imagesElement = clone.querySelector(".js-image");
  const imageUrl = listing.media?.[0]?.url ?? "/assets/hat-icon.png";
  imagesElement.style.backgroundImage = `url('${imageUrl}')`;

  clone.querySelector(".js-title").textContent =
    listing.title || "No title available";

  clone.querySelector(".js-author").textContent = authorName;
  clone.querySelector(".js-date").textContent = createdDate;

  clone.querySelector(".js-description").textContent =
    listing.description || "No description provided.";

  clone.querySelector(".js-bid-count").textContent =
    `${listing._count?.bids || 0} bids`;

  clone.querySelector(".js-ends-at").textContent = `Ends: ${endsAtDate}`;

  const highestBidElement = clone.querySelector(".js-highest-bid");

  if (listing.bids?.length) {
    const maxBid = Math.max(...listing.bids.map((bid) => bid.amount));
    highestBidElement.textContent = `${maxBid} credits`;
  } else {
    highestBidElement.textContent = "No bids yet";
  }

  const listingLink = clone.querySelector(".js-link");
  listingLink.href = `/listings/listing.html?id=${listing.id}`;

  const tagContainer = clone.querySelector(".js-tag-container");

  if (listing.tags?.length) {
    listing.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "text-[11px] bg-border/20 px-2 py-0.5 rounded-md";
      span.textContent = tag;

      tagContainer.appendChild(span);
    });
  }

  return clone.firstElementChild;
}
