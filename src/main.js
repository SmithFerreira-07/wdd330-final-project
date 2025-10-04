import {
  renderHeader,
  renderFooter,
  renderSearchForm,
  renderModal,
  renderLoadingSpinner,
  hideModal,
  showLoadingSpinner,
  hideLoadingSpinner,
} from "./partials/index.js";

function init() {
  renderHeader("header-container");
  renderFooter("footer-container");
  renderSearchForm("search-container");
  renderModal("modal-container");
  renderLoadingSpinner("spinner-container");

  setupEventListeners();
  loadRecipeOfTheDay();
}

function setupEventListeners() {
  const searchForm = document.getElementById("search-form");
  const modal = document.getElementById("recipe-modal");

  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "recipe-modal") {
        hideModal();
      }
    });
  }
}

function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");
  const query = searchInput?.value.trim();

  if (!query) return;

  showLoadingSpinner();

  // TODO: I'll implement the api call for recipe search here
  setTimeout(() => {
    hideLoadingSpinner();
  }, 1000);
}

function loadRecipeOfTheDay() {
  // TODO: I'll implement the api call here
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
