import {
  ALL_LISTINGS_ENDPOINT,
  API_BASE_URL,
  getSingleListing,
} from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";
import { getAuthHeaders } from "../api/authApi.mjs";

export async function fetchAllListings() {
  return fetchData(`${ALL_LISTINGS_ENDPOINT}?_seller=true&_bids=true`);
}

export function fetchSingleListingById(listingId) {
  return fetchData(`${getSingleListing(listingId)}?_seller=true&_bids=true`);
}

/**
 * Create a new listing
 * @param {string} title
 * @param {string} body
 * @param {Array<string>} tags
 * @param {string} Optional image URL
 * @param {string} Optional image Alt text
 * @returns { Promise<Object}
 */
export function createListing(
  title,
  description,
  tags = [],
  mediaUrl,
  mediaAlt,
) {
  const url = `${API_BASE_URL}/auction/listings`;

  const listingData = {
    title,
    description,
    tags,
    ...(mediaUrl ? { media: [{ url: mediaUrl, alt: mediaAlt || "" }] } : {}),
  };

  return fetchData(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(listingData),
  });
}

export function updateListingById(listingId, listingData) {
  return fetchData(`${API_BASE_URL}/auction/listings/${listingId}`, {
    method: "PUT",
    body: JSON.stringify(listingData),
  });
}

export function fetchListingsByProfile(userName) {
  return fetchData(
    `${API_BASE_URL}/auction/profiles/${userName}/listings??_seller=true&_bids=true`,
  );
}

export async function deleteListing(listingId) {
  const response = await fetch(
    `${API_BASE_URL}/auction/listings/${listingId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || "Failed to delete listing.",
    );
  }

  return true;
}
