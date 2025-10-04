export function createLoadingSpinner() {
  return `
    <div id="loading-spinner" class="text-center hidden">
      <p>Loading...</p>
    </div>
  `;
}

export function renderLoadingSpinner(containerId = "spinner-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createLoadingSpinner();
  }
}

export function showLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("hidden");
  }
}

export function hideLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.add("hidden");
  }
}
