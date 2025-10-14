export function createHeader() {
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const basePath = isInPagesFolder ? "../.." : ".";

  return `
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl md:text-3xl font-bold text-amber-800">
            <a href="${basePath}/index.html" class="hover:text-amber-900 transition-colors">Global Cuisine Explorer</a>
          </h1>
          
          <button id="mobile-menu-toggle" class="md:hidden text-amber-800 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-2" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <nav id="desktop-nav" class="hidden md:flex gap-6 items-center">
            <a href="${basePath}/index.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">Home</a>
            <a href="${basePath}/recipes.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">Recipes</a>
            <a href="${basePath}/src/pages/nutrition.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">Nutrition</a>
            <a href="${basePath}/src/pages/about.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium">About</a>
            <a href="${basePath}/src/pages/favorites.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium flex items-center gap-1">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              Favorites
              <span id="header-favorites-count" class="bg-amber-700 text-white text-xs px-2 py-1 rounded-full hidden"></span>
            </a>
          </nav>
        </div>
        
        <nav id="mobile-nav" class="md:hidden hidden flex-col gap-4 mt-4 pb-4 border-t border-stone-200 pt-4">
          <a href="${basePath}/index.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium px-2 py-2 rounded hover:bg-amber-50">Home</a>
          <a href="${basePath}/recipes.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium px-2 py-2 rounded hover:bg-amber-50">Recipes</a>
          <a href="${basePath}/src/pages/nutrition.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium px-2 py-2 rounded hover:bg-amber-50">Nutrition</a>
          <a href="${basePath}/src/pages/about.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium px-2 py-2 rounded hover:bg-amber-50">About</a>
          <a href="${basePath}/src/pages/favorites.html" class="text-lg text-stone-700 hover:text-amber-800 transition-colors font-medium px-2 py-2 rounded hover:bg-amber-50 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            Favorites
            <span id="mobile-header-favorites-count" class="bg-amber-700 text-white text-xs px-2 py-1 rounded-full hidden"></span>
          </a>
        </nav>
      </div>
    </header>
  `;
}

export function renderHeader(containerId = "header-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createHeader();
    updateHeaderFavoritesCount();
    setupMobileMenu();
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileNav.classList.contains("hidden");

      if (isHidden) {
        mobileNav.classList.remove("hidden");
        mobileNav.classList.add("flex");
        menuToggle.innerHTML = `
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `;
      } else {
        mobileNav.classList.add("hidden");
        mobileNav.classList.remove("flex");
        menuToggle.innerHTML = `
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        `;
      }
    });

    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        mobileNav.classList.remove("flex");
        menuToggle.innerHTML = `
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        `;
      });
    });
  }
}

function updateHeaderFavoritesCount() {
  try {
    const favorites = localStorage.getItem("globalCuisine_favorites");
    const count = favorites ? JSON.parse(favorites).length : 0;
    const countElement = document.getElementById("header-favorites-count");
    const mobileCountElement = document.getElementById(
      "mobile-header-favorites-count"
    );

    if (countElement) {
      if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove("hidden");
      } else {
        countElement.classList.add("hidden");
      }
    }

    if (mobileCountElement) {
      if (count > 0) {
        mobileCountElement.textContent = count;
        mobileCountElement.classList.remove("hidden");
      } else {
        mobileCountElement.classList.add("hidden");
      }
    }
  } catch (error) {
    console.error("Error updating favorites count:", error);
  }
}

export function refreshHeaderFavoritesCount() {
  updateHeaderFavoritesCount();
}
