import { fetchProfile, updateProfile } from "../api/profileApi.mjs";
import { createSingleListingHtml } from "../components/createSingleListing.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";

createHeader();

export async function initProfile() {
  const container = document.getElementById("listings-container");
  const rawUser = localStorage.getItem("userName") || "";
  const username = rawUser.replace(/"/g, "").trim();

  if (!container || !username) return;

  showSpinner();

  try {
    const response = await fetchProfile(username);
    const profile = response.data ? response.data : response;

    if (!profile) throw new Error("No profile data found.");

    renderProfileHeader(profile);

    setupEditForm(profile, username);

    renderListings(profile.listings, profile.name, container);
  } catch (error) {
    console.error("Profile Error:", error);
    container.innerHTML = `<p class="text-red-500 text-center">Error loading profile data.</p>`;
  } finally {
    hideSpinner();
  }
}

function renderProfileHeader(profile) {
  const nameEl = document.getElementById("profile-name");
  const bioEl = document.getElementById("profile-bio");
  const creditsEl = document.getElementById("credits-count");
  const winsEl = document.getElementById("wins-count");
  const avatarEl = document.getElementById("profile-avatar");

  if (nameEl) nameEl.textContent = profile.name;
  if (bioEl)
    bioEl.textContent = profile.bio || "This user hasn't written a bio yet.";
  if (creditsEl) creditsEl.textContent = `Credits: ${profile.credits}`;
  if (winsEl) winsEl.textContent = `Wins: ${profile._count?.wins || 0}`;
  if (avatarEl && profile.avatar?.url) {
    avatarEl.src = profile.avatar.url;
    avatarEl.alt = profile.avatar.alt || profile.name;
  }
}

function setupEditForm(profile, username) {
  const editSection = document.getElementById("edit-profile-section");
  const editBtn = document.getElementById("edit-profile-btn");
  const closeBtn = document.getElementById("close-edit");
  const updateForm = document.getElementById("update-profile-form");

  editBtn.addEventListener("click", () => {
    editSection.classList.remove("hidden");
    editBtn.classList.add("hidden");

    updateForm.avatarUrl.value = profile.avatar?.url || "";
    updateForm.bio.value = profile.bio || "";
  });

  closeBtn.addEventListener("click", () => {
    editSection.classList.add("hidden");
    editBtn.classList.remove("hidden");
  });

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const avatarUrl = updateForm.avatarUrl.value;
    const bio = updateForm.bio.value;

    try {
      showSpinner();
      await updateProfile(username, avatarUrl, bio);
      alert("Profile updated!");
      window.location.reload();
    } catch (err) {
      alert("Failed to update profile. Check if the image URL is valid.");
    } finally {
      hideSpinner();
    }
  });
}

function renderListings(listings, profileName, container) {
  container.innerHTML = "";
  if (!listings || listings.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center py-10 text-text/50">You haven't created any listings yet.</p>`;
    return;
  }

  listings.forEach((listing) => {
    const html = createSingleListingHtml(listing, profileName);
    if (html) container.appendChild(html);
  });
}

initProfile();
