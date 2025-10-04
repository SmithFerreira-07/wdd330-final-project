import { renderHeader, renderFooter } from "../partials/index.js";

function init() {
  renderHeader("header-container");
  renderFooter("footer-container");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
