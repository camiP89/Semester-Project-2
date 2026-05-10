import {
  fetchProfile,
  updateProfile,
  fetchBidsByProfile,
} from "../api/profileApi.mjs";

import { createSingleListingHtml } from "../components/createSingleListing.mjs";
import { createSingleBidHtml } from "../components/createSingleBid.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";
import { API_BASE_URL } from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";

createHeader();

const isDefaultImage = (url) =>
  !url || url.includes("images.unsplash.com");

export async function initProfile() {
  const listingsContainer = document.getElementById("profile-listings-container");
  const bidsContainer = document.getElementById("my-bids-container");

  const rawUser = localStorage.getItem("userName");
  if (!rawUser) {
    console.error("No user found in storage");
    return;
  }

  const username = rawUser.replace(/"/g, "").trim();

  if (!listingsContainer) return;

  showSpinner();

  try {

    const [profileResponse, bids] = await Promise.all([
      fetchProfile(username),
      fetchBidsByProfile(username),
    ]);

    const profile = profileResponse.data || profileResponse;
    const bidsData = bids.data || bids;

    if (!profile) throw new Error("No profile data found.");


    renderProfileHeader(profile);
    setupEditForm(profile, username);

    let listingsWithBids = [];

    if (profile.listings && profile.listings.length > 0) {
      listingsWithBids = await Promise.all(
        profile.listings.map(async (listing) => {
          const full = await fetchData(
            `${API_BASE_URL}/auction/listings/${listing.id}?_bids=true&_seller=true`
          );
          return full.data || full;
        })
      );
    }

    renderListings(listingsWithBids, profile.name, listingsContainer);

    if (bidsContainer) {
      bidsContainer.innerHTML = "";

      if (bidsData && bidsData.length > 0) {
        bidsData.forEach((bid) => {
          const html = createSingleBidHtml(bid);
          if (html) bidsContainer.appendChild(html);
        });
      } else {
        bidsContainer.innerHTML = `
          <p class="col-span-full text-center py-10 text-text/50">
            You haven't placed any bids yet.
          </p>
        `;
      }
    }
  } catch (error) {
    console.error("Profile Error:", error);
    listingsContainer.innerHTML = `
      <p class="text-red-500 text-center">
        Error loading profile data.
      </p>
    `;
  } finally {
    hideSpinner();
  }
}


function renderProfileHeader(profile) {
  document.getElementById("profile-name").textContent = profile.name;

  document.getElementById("profile-bio").textContent =
    profile.bio || "This user hasn't written a bio yet.";

  document.getElementById("credits-count").textContent =
    `Credits: ${profile.credits}`;

  const avatarEl = document.getElementById("profile-avatar");
  const bannerEl = document.getElementById("profile-banner");

  const avatarUrl = profile.avatar?.url;
  const bannerUrl = profile.banner?.url;

  avatarEl.src = isDefaultImage(avatarUrl)
    ? "/assets/hat-icon.png"
    : avatarUrl;

  bannerEl.src = isDefaultImage(bannerUrl)
    ? "/assets/fallback-img.jpg"
    : bannerUrl;
}

function setupEditForm(profile, username) {
  const editSection = document.getElementById("edit-profile-section");
  const editBtn = document.getElementById("edit-profile-btn");
  const closeBtn = document.getElementById("close-edit");
  const updateForm = document.getElementById("update-profile-form");

  if (!editSection || !editBtn || !updateForm) return;

  editBtn.addEventListener("click", () => {
    editSection.classList.remove("hidden");
    editBtn.classList.add("hidden");

    updateForm.bannerUrl.value = profile.banner?.url || "";
    updateForm.avatarUrl.value = profile.avatar?.url || "";
    updateForm.bio.value = profile.bio || "";
  });

  closeBtn.addEventListener("click", () => {
    editSection.classList.add("hidden");
    editBtn.classList.remove("hidden");
  });

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bannerUrl = updateForm.bannerUrl.value.trim();
    const avatarUrl = updateForm.avatarUrl.value.trim();
    const bio = updateForm.bio.value.trim();

    try {
      showSpinner();
      await updateProfile(username, bannerUrl, avatarUrl, bio);

      alert("Profile updated!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      hideSpinner();
    }
  });
}


function renderListings(listings, profileName, container) {
  container.innerHTML = "";

  if (!listings || listings.length === 0) {
    container.innerHTML = `
      <p class="col-span-full text-center py-10 text-text/50">
        You haven't created any listings yet.
      </p>
    `;
    return;
  }

  listings.forEach((listing) => {
    const html = createSingleListingHtml(listing, profileName);
    if (html) container.appendChild(html);
  });
}


initProfile();