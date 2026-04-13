import { placeBid } from "../api/listingsApi.mjs";

export function setupBidForm(listingData, refreshListing) {
  const form = document.querySelector("#bid-form");
  const input = document.querySelector("#bid-amount");
  const message = document.querySelector("#bid-message");

  if (!form) return;

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const isOwner = user?.name === listingData.seller?.name;

  if (!token || isOwner) {
    form.style.display = "none";
    return;
  }

  const highestBid =
    listingData.bids?.length > 0
      ? Math.max(...listingData.bids.map((b) => b.amount))
      : 0;

  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = Number(input.value);

    if (!amount || amount <= highestBid) {
      message.textContent = "Bid must be higher than current highest bid.";
      return;
    }
    try {
      await placeBid(listingData.id, amount);

      message.textContent = "✅ Bid placed successfully!";

      setTimeout(() => {
        message.textContent = "";
        refreshListing();
      }, 1200);
    } catch (error) {
      console.error(error);
      message.textContent = "❌ Failed to place bid.";
    } finally {
      button.disabled = false;
    }
  });
}
