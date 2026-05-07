export function getListingStatus(endsAt) {
  const now = new Date();
  const endDate = new Date(endsAt);

  if (endDate < now) return "ended";

  const diff = endDate - now;
  const hoursLeft = diff / (1000 * 60 * 60);

if (hoursLeft < 24) return "ending";
if (hoursLeft < 72) return "warning";

  return "active";
}