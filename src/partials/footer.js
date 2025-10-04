export function createFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="bg-stone-800 text-white py-6 mt-auto">
      <div class="container mx-auto px-6 text-center">
        <p>&copy; ${currentYear} Global Cuisine Explorer. Happy Cooking!</p>
      </div>
    </footer>
  `;
}

export function renderFooter(containerId = "footer-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createFooter();
  }
}
