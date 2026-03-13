//Noroff Base Url
export const API_BASE_URL = "https://v2.api.noroff.dev";

//Auth
export const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
export const CREATE_API_KEY_ENDPOINT = `${API_BASE_URL}/auth/create-api-key`;

//Noroff API key - from API key tool
export const NOROFF_API_KEY = "dcb03f49-4dde-4c7c-80ea-d17de6cca69d";

//Listings Endpoints
export const ALL_LISTINGS_ENDPOINT = `${API_BASE_URL}/auction/listings`;
export const getSingleListing = (listingId) =>
  `${API_BASE_URL}/auction/listings/${listingId}`;
export const deleteListing = (listingId) => `${API_BASE_URL}/auction/listings/${listingId}`;
export const updateListing = (listingId) => `${API_BASE_URL}/auction/listings/${listingId}`;
export const bidOnListing = (listingId) => `${API_BASE_URL}/auction/listings/${listingId}/bids`;
export const searchListings = (query) =>
  `${API_BASE_URL}/auction/listings/search?q=${query}`;
export const createListingEndpoint = `${API_BASE_URL}/auction/listings`;

//Profiles Endpoints
export const ALL_PROFILES_ENDPOINT = `${API_BASE_URL}/auction/profiles`;
export const getSingleProfile = (username) =>
  `${API_BASE_URL}/auction/profiles/${username}`;
export const getListingsByProfile = (username) =>
  `${API_BASE_URL}/auction/profiles/${username}/listings`;
export const getBidsByProfile = (username) =>
  `${API_BASE_URL}/auction/profiles/${username}/bids`;
export const getAllWinsByProfile = (username) =>
  `${API_BASE_URL}/auction/profiles/${username}/wins`;
export const searchProfiles = (query) =>
  `${API_BASE_URL}/auction/profiles/search?q=${query}`;
export const updateProfileUrl = (username) =>
  `${API_BASE_URL}/auction/profiles/${username}`;

