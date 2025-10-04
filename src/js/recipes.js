import { renderHeader, renderFooter } from "../partials/index.js";

function init() {
  renderHeader("header-container");
  renderFooter("footer-container");

  // TODO: Load and display all recipes
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
