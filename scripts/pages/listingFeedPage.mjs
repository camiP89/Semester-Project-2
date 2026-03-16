import { createHeader } from "../components/header.mjs";
import { renderListingsContainer } from "../components/renderListingsContainer.mjs";

createHeader();

renderListingsContainer("All Auction Listings", 15);