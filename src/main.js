import {
  renderHeader,
  renderFooter,
  renderSearchForm,
  renderModal,
  renderLoadingSpinner,
  hideModal,
  showLoadingSpinner,
  hideLoadingSpinner,
  refreshHeaderFavoritesCount,
} from "./partials/index.js";
import {
  searchMealsByName,
  getRandomMeal,
  getMealById,
  parseIngredients,
} from "./js/api/mealdb.js";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoriteMeals,
} from "./js/utils/favorites.js";

function init() {
  renderHeader("header-container");
  renderFooter("footer-container");
  renderSearchForm("search-container");
  renderModal("modal-container");
  renderLoadingSpinner("spinner-container");

  setupEventListeners();
  loadRecipeOfTheDay();
  loadFavorites();
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

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");
  const query = searchInput?.value.trim();

  if (!query) return;

  showLoadingSpinner();

  try {
    const meals = await searchMealsByName(query);
    displaySearchResults(meals);
  } catch (error) {
    console.error("Error searching meals:", error);
    displayError("Failed to search recipes. Please try again.");
  } finally {
    hideLoadingSpinner();
  }
}

async function loadRecipeOfTheDay() {
  try {
    const meal = await getRandomMeal();
    if (meal) {
      displayRecipeOfTheDay(meal);
    }
  } catch (error) {
    console.error("Error loading recipe of the day:", error);
  }
}

function displayRecipeOfTheDay(meal) {
  const container = document.getElementById("recipe-of-the-day-container");
  if (!container) return;

  const ingredients = parseIngredients(meal);

  container.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="md:flex">
        <div class="md:w-1/2">
          <img 
            src="${meal.strMealThumb}" 
            alt="${meal.strMeal}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="md:w-1/2 p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold mb-2">${meal.strMeal}</h3>
              <div class="flex gap-2 flex-wrap">
                <span class="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                  ${meal.strCategory}
                </span>
                <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  ${meal.strArea}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="font-semibold text-lg mb-2">Ingredients:</h4>
            <ul class="grid grid-cols-2 gap-2 text-sm">
              ${ingredients
                .slice(0, 6)
                .map((ing) => `<li>• ${ing.measure} ${ing.name}</li>`)
                .join("")}
              ${ingredients.length > 6 ? `<li class="col-span-2 text-amber-700">+ ${ingredients.length - 6} more ingredients</li>` : ""}
            </ul>
          </div>
          
          <button 
            onclick="window.showMealDetails('${meal.idMeal}')"
            class="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-200"
          >
            View Full Recipe
          </button>
        </div>
      </div>
    </div>
  `;
}

function displaySearchResults(meals) {
  const container = document.getElementById("search-results-container");
  const section = document.getElementById("search-results-section");
  if (!container || !section) return;

  section.style.display = "block";

  if (!meals || meals.length === 0) {
    container.innerHTML = `
      <h2 class="text-3xl font-bold border-b-2 border-amber-700 pb-2 mb-6">
        Search Results
      </h2>
      <div class="text-center py-12">
        <p class="text-xl text-stone-600">No recipes found. Try another search!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <h2 class="text-3xl font-bold border-b-2 border-amber-700 pb-2 mb-6">
      Search Results (${meals.length})
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      ${meals
        .map(
          (meal) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="relative">
            <img 
              src="${meal.strMealThumb}" 
              alt="${meal.strMeal}"
              class="w-full h-48 object-cover cursor-pointer"
              onclick="window.showMealDetails('${meal.idMeal}')"
            />
            <button
              onclick="event.stopPropagation(); window.toggleFavoriteFromCard('${meal.idMeal}', this)"
              class="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg favorite-btn"
              data-meal-id="${meal.idMeal}"
              title="Add to favorites"
            >
              <svg class="w-5 h-5 ${isFavorite(meal.idMeal) ? "text-red-600 fill-current" : "text-stone-400"}" fill="${isFavorite(meal.idMeal) ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          <div class="p-4 cursor-pointer" onclick="window.showMealDetails('${meal.idMeal}')">
            <h3 class="font-bold text-lg mb-2 line-clamp-2">${meal.strMeal}</h3>
            <div class="flex gap-2 flex-wrap">
              <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                ${meal.strCategory}
              </span>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                ${meal.strArea}
              </span>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function displayError(message) {
  const container = document.getElementById("search-results-container");
  if (!container) return;

  container.innerHTML = `
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> ${message}</span>
    </div>
  `;
}

function loadFavorites() {
  const favoriteMeals = getFavoriteMeals();
  displayFavorites(favoriteMeals);
}

function displayFavorites(meals) {
  const grid = document.getElementById("favorites-grid");
  const section = document.getElementById("favorites-section");

  if (!grid) return;

  if (!meals || meals.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = meals
    .slice(0, 4)
    .map(
      (meal) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative">
        <img 
          src="${meal.strMealThumb}" 
          alt="${meal.strMeal}"
          class="w-full h-48 object-cover cursor-pointer"
          onclick="window.showMealDetails('${meal.idMeal}')"
        />
        <button
          onclick="event.stopPropagation(); window.removeFavoriteFromHome('${meal.idMeal}', this)"
          class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg"
          data-meal-id="${meal.idMeal}"
          title="Remove from favorites"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 cursor-pointer" onclick="window.showMealDetails('${meal.idMeal}')">
        <h3 class="font-bold text-lg mb-2 line-clamp-2">${meal.strMeal}</h3>
        <div class="flex gap-2 flex-wrap">
          <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            ${meal.strCategory}
          </span>
          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            ${meal.strArea}
          </span>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Add "View All" link if there are more than 4 favorites
  if (meals.length > 4) {
    grid.innerHTML += `
      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex items-center justify-center p-8">
        <a href="./src/pages/favorites.html" class="text-center">
          <svg class="w-16 h-16 mx-auto text-amber-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <p class="text-lg font-semibold text-amber-700 mb-2">View All Favorites</p>
          <p class="text-sm text-stone-600">${meals.length} recipes saved</p>
        </a>
      </div>
    `;
  }
}

function removeFavoriteFromHome(mealId) {
  removeFromFavorites(mealId);
  loadFavorites();
  refreshHeaderFavoritesCount();
}

async function showMealDetails(mealId) {
  showLoadingSpinner();
  try {
    const meal = await getMealById(mealId);
    if (meal) {
      displayMealModal(meal);
    }
  } catch (error) {
    console.error("Error loading meal details:", error);
    displayError("Failed to load recipe details. Please try again.");
  } finally {
    hideLoadingSpinner();
  }
}

function displayMealModal(meal) {
  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  const ingredients = parseIngredients(meal);

  modalContent.innerHTML = `
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
        <h2 class="text-2xl font-bold">${meal.strMeal}</h2>
        <div class="flex items-center gap-3">
          <button
            onclick="window.toggleFavoriteInModal('${meal.idMeal}')"
            id="modal-favorite-btn-${meal.idMeal}"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isFavorite(meal.idMeal) ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}"
            title="${isFavorite(meal.idMeal) ? "Remove from favorites" : "Add to favorites"}"
          >
            <svg class="w-5 h-5 ${isFavorite(meal.idMeal) ? "fill-current" : ""}" fill="${isFavorite(meal.idMeal) ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span class="hidden sm:inline">${isFavorite(meal.idMeal) ? "Saved" : "Save"}</span>
          </button>
          <button 
            onclick="window.hideModalGlobal()"
            class="text-stone-500 hover:text-stone-700 text-2xl"
          >
            &times;
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <img 
          src="${meal.strMealThumb}" 
          alt="${meal.strMeal}"
          class="w-full h-64 object-cover rounded-lg mb-6"
        />
        
        <div class="flex gap-2 mb-6 flex-wrap">
          <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            ${meal.strCategory}
          </span>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            ${meal.strArea}
          </span>
          ${
            meal.strTags
              ? meal.strTags
                  .split(",")
                  .map(
                    (tag) =>
                      `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">${tag.trim()}</span>`
                  )
                  .join("")
              : ""
          }
        </div>
        
        <div class="mb-6">
          <h3 class="text-xl font-bold mb-3">Ingredients</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${ingredients.map((ing) => `<li class="flex items-center"><span class="mr-2">•</span> ${ing.measure} ${ing.name}</li>`).join("")}
          </ul>
        </div>
        
        <div class="mb-6">
          <h3 class="text-xl font-bold mb-3">Instructions</h3>
          <div class="prose max-w-none">
            ${meal.strInstructions
              .split("\n")
              .map((para) => (para.trim() ? `<p class="mb-3">${para}</p>` : ""))
              .join("")}
          </div>
        </div>
        
        ${
          meal.strYoutube
            ? `
          <div class="mb-6">
            <h3 class="text-xl font-bold mb-3">Video Tutorial</h3>
            <a 
              href="${meal.strYoutube}" 
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        `
            : ""
        }
        
        ${
          meal.strSource
            ? `
          <div>
            <a 
              href="${meal.strSource}" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-amber-700 hover:text-amber-800 underline"
            >
              View Original Source
            </a>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

async function toggleFavoriteFromCard(mealId, buttonElement) {
  try {
    const meal = await getMealById(mealId);
    if (!meal) return;

    const isNowFavorite = !isFavorite(mealId);

    if (isNowFavorite) {
      addToFavorites(meal);
    } else {
      removeFromFavorites(mealId);
    }

    // Update button UI
    const svg = buttonElement.querySelector("svg");
    if (isNowFavorite) {
      svg.classList.add("text-red-600", "fill-current");
      svg.classList.remove("text-stone-400");
      svg.setAttribute("fill", "currentColor");
      buttonElement.title = "Remove from favorites";
    } else {
      svg.classList.remove("text-red-600", "fill-current");
      svg.classList.add("text-stone-400");
      svg.setAttribute("fill", "none");
      buttonElement.title = "Add to favorites";
    }

    refreshHeaderFavoritesCount();
    loadFavorites(); // Refresh the favorites section on the home page
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

async function toggleFavoriteInModal(mealId) {
  try {
    const meal = await getMealById(mealId);
    if (!meal) return;

    const isNowFavorite = !isFavorite(mealId);

    if (isNowFavorite) {
      addToFavorites(meal);
    } else {
      removeFromFavorites(mealId);
    }

    // Update modal button UI
    const button = document.getElementById(`modal-favorite-btn-${mealId}`);
    if (button) {
      if (isNowFavorite) {
        button.className =
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 bg-red-100 text-red-700 hover:bg-red-200";
        button.title = "Remove from favorites";
        button.querySelector("span").textContent = "Saved";
        button.querySelector("svg").classList.add("fill-current");
        button.querySelector("svg").setAttribute("fill", "currentColor");
      } else {
        button.className =
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 bg-stone-100 text-stone-700 hover:bg-stone-200";
        button.title = "Add to favorites";
        button.querySelector("span").textContent = "Save";
        button.querySelector("svg").classList.remove("fill-current");
        button.querySelector("svg").setAttribute("fill", "none");
      }
    }

    refreshHeaderFavoritesCount();
    loadFavorites(); // Refresh the favorites section on the home page
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

window.showMealDetails = showMealDetails;
window.hideModalGlobal = hideModal;
window.toggleFavoriteFromCard = toggleFavoriteFromCard;
window.toggleFavoriteInModal = toggleFavoriteInModal;
window.removeFavoriteFromHome = removeFavoriteFromHome;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
