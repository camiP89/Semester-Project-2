let spinnerCount = 0;

export function showSpinner() {
  spinnerCount++;
  let spinner = document.getElementById("loading-spinner");

  if (!spinner) {
    spinner = document.createElement("div");
    spinner.id = "loading-spinner";

    spinner.className =
      "fixed top-1/2 left-1/2 flex items-center justify-center " +
      "-translate-x-1/2 -translate-y-1/2 z-[9999] backdrop-blur-sm";

    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-live", "polite");
    spinner.setAttribute("aria-label", "Loading");

    const loader = document.createElement("div");
    loader.className =
      "w-[50px] h-[50px] rounded-full border-[5px] border-accent " +
      "border-t-[6px] border-b-[6px] border-b-black " +
      "animate-spin shadow-md";

    spinner.appendChild(loader);
    document.body.appendChild(spinner);
  }

  spinner.style.display = "flex";
  document.body.classList.add("loading");
}

export function hideSpinner() {
  if (spinnerCount > 0) spinnerCount--;

  if (spinnerCount === 0) {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) {
      spinner.style.display = "none";
      document.body.classList.remove("loading");
    }
  }
}
