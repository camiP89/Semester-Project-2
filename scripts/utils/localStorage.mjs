export function getFromLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === "undefined") return null;
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function addToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearStorage() {
  localStorage.clear();
}
