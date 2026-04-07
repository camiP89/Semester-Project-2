function getHighestBid(listing) {
  if (!listing.bids || listing.bids.length === 0) return 0;
  return Math.max(...listing.bids.map((bid) => bid.amount));
}

export function sortListings(listings, sortType) {
  const sortedListings = [...listings];

  if (sortType === "newest") {
    sortedListings.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  if (sortType === "oldest") {
    sortedListings.sort((a, b) => new Date(a.created) - new Date(b.created));
  }

  if (sortType === "highestBid") {
    sortedListings.sort((a, b) => getHighestBid(b) - getHighestBid(a));
  }

  return sortedListings;
}

export function setupSortDropdown(dropdownId, callback) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  dropdown.addEventListener("change", (event) => {
    callback(event.target.value);
  });
}