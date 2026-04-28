import {
  ALL_PROFILES_ENDPOINT,
  getSingleProfile,
  updateProfileUrl,
  getListingsByProfile,
  getBidsByProfile,
} from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";

export function fetchAllProfiles() {
  return fetchData(ALL_PROFILES_ENDPOINT);
}

/**
 * Fetch a single profile by username
 * @param {string} username - The profile's username
 * @returns {Promise<Object>} The profile data
 */
export function fetchProfile(username) {
  return fetchData(`${getSingleProfile(username)}?_listings=true&_bids=true`);
}

export function fetchListingsByProfile(userName) {
  return fetchData(`${getListingsByProfile(userName)}`);
}

export function updateProfile(username, bannerUrl, avatarUrl, bio) {
  const body = {
    ...(bannerUrl && {
      banner: { url: bannerUrl, alt: `${username}'s banner` },
    }),
    ...(avatarUrl && {
      avatar: { url: avatarUrl, alt: `${username}'s avatar` },
    }),
    ...(bio ? { bio } : {}),
  };
  return fetchData(updateProfileUrl(username), {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function fetchBidsByProfile(username) {
  return fetchData(`${getBidsByProfile(username)}?_listings=true`);
}

export function getAllWinsByProfileData(username) {
  return fetchData(`${getListingsByProfile(username)}?_bids=true&_seller=true`);
}
