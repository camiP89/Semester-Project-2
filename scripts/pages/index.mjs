import { createHeader } from "../components/header.mjs";
import { renderListingsContainer } from "../components/renderListingsContainer.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";

createHeader();

const token = getFromLocalStorage("accessToken");
const heroBanner = document.getElementById("hero-banner");
if (token && heroBanner) {
  heroBanner.classList.add("hidden");
}

renderListingsContainer("All Auction Listings", 10);