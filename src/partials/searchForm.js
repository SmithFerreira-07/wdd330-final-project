export function createSearchForm() {
  return `
    <section id="search-section" class="mb-12">
      <form id="search-form" class="max-w-xl mx-auto">
        <label
          for="search-input"
          class="block text-center text-xl font-semibold mb-4"
        >
          Find a Recipe
        </label>
        <div class="flex">
          <input
            type="text"
            id="search-input"
            placeholder="e.g., Arrabiata, Lasagna, Chicken..."
            class="w-full px-4 py-3 border border-stone-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            class="bg-amber-700 text-white px-6 py-3 rounded-r-md hover:bg-amber-800 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  `;
}

export function renderSearchForm(containerId = "search-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createSearchForm();
  }
}
