import { API_BASE_URL } from "../constants/constants.mjs";
import { createListingDetailsHtml } from "../components/listingDetailsHtml.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";
import { fetchData } from "../api/apiFetch.mjs";
import { placeBid } from "../api/listingsApi.mjs";

createHeader();

const listingDetailsContainer = document.querySelector("#listings-container");

export function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    listingId: params.get("id"),
  };
}

export async function mainId() {
  const { listingId } = getIdFromURL();

  if (!listingId) {
    const container = document.querySelector("#listings-container");
    if (container) {
      container.innerHTML =
        "<p class'p-4 text-center'>No listing ID found in URL.</p>";
    }
    console.error("Missing listing ID.");
    return;
  }

  const url = `${API_BASE_URL}/auction/listings/${listingId}?_seller=true&_bids=true`;

  showSpinner();

  try {
    const listingData = await fetchData(url);

    if (!listingData) throw new Error("Listing data is empty.");

    const singleListingHtml = createListingDetailsHtml(listingData);

    listingDetailsContainer.innerHTML = "";
    listingDetailsContainer.appendChild(singleListingHtml);

    setupBidForm(listingData);

    document.title = `${listingData.title} | Student Auction House`;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    document.querySelector("#listings-container").innerHTML =
      "<p class'p-4 text-center'>Error loading listing.</p>";
  } finally {
    hideSpinner();
  }
}

mainId();

function setupBidForm(listingData) {
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

    if (!amount || amount <= 0) {
      message.textContent = "Please enter a valid bid amount.";
      return;
    }

    if (amount <= highestBid) {
      message.textContent = "Bid must be higher than current highest bid.";
      return;
    }

    button.disabled = true;

    try {
      await placeBid(listingData.id, amount);

      message.textContent = "✅ Bid placed successfully!";

      setTimeout(async () => {
        const creditsEl = document.querySelector("#user-credits");

        if (creditsEl) {
          creditsEl.textContent = (
            Number(creditsEl.textContent) - amount
          ).toLocaleString();
        }

        message.textContent = "";

        await mainId();
      }, 2000);


    } catch (error) {
      console.error(error);
      message.textContent = "❌ Failed to place bid.";
    } finally {
      button.disabled = false;
    }
  });
}
