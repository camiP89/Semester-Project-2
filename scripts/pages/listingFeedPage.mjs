import { createHeader } from "../components/header.mjs";
import { renderListingsContainer } from "../components/renderListingsContainer.mjs";
import { initSearch } from "../components/search.mjs";

createHeader();

renderListingsContainer("All Auction Listings", 15);

initSearch();