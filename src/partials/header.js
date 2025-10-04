export function createHeader() {
  return `
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-amber-800">
            <a href="/" class="hover:text-amber-900 transition-colors">Global Cuisine Explorer</a>
          </h1>
          <nav class="flex gap-6">
            <a href="/" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">Home</a>
            <a href="/src/pages/recipes.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">Recipes</a>
            <a href="/src/pages/about.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">About</a>
          </nav>
        </div>
      </div>
    </header>
  `;
}

export function renderHeader(containerId = "header-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createHeader();
  }
}
