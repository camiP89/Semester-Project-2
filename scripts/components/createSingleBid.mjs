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

  const dateEl = clone.querySelector(".js-date");
  if (dateEl) {
    dateEl.textContent = new Date(bid.created).toLocaleDateString();
  }

  const endsAtEl = clone.querySelector(".js-ends-at");
  if (endsAtEl) {
    endsAtEl.textContent = `${new Date(listing.endsAt).toLocaleDateString()}`;
  }

  const linkEl = clone.querySelector(".js-link");
  if (linkEl) {
    linkEl.href = `/listings/listing-detail.html?id=${listing.id}`;
  }

  return clone;
}
