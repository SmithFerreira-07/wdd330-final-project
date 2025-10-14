import { renderHeader, renderFooter, renderModal } from "../partials/index.js";
import { getMealById, parseIngredients } from "./api/mealdb.js";
import {
  getFavoriteMeals,
  removeFromFavorites,
  clearAllFavorites as clearFavorites,
  getFavoritesCount,
} from "./utils/favorites.js";

async function init() {
  renderHeader("header-container");
  renderFooter("footer-container");
  renderModal("modal-container");

  loadFavorites();
  updateFavoritesCount();
}

function loadFavorites() {
  const favoriteMeals = getFavoriteMeals();
  displayFavorites(favoriteMeals);
  toggleClearButton(favoriteMeals.length > 0);
}

function displayFavorites(meals) {
  const grid = document.getElementById("favorites-grid");
  const message = document.getElementById("favorites-message");

  if (!grid) return;

  if (!meals || meals.length === 0) {
    grid.innerHTML = "";
    message.innerHTML = `
      <div class="text-center py-12 bg-white rounded-lg shadow-md">
        <svg class="w-24 h-24 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <p class="text-xl text-stone-600 mb-4">No favorite recipes yet</p>
        <p class="text-stone-500 mb-6">Start adding recipes to your favorites by clicking the heart icon</p>
        <a href="/" class="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors duration-200">
          Explore Recipes
        </a>
      </div>
    `;
    return;
  }

  message.innerHTML = "";
  grid.innerHTML = meals
    .map(
      (meal) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative">
        <img 
          src="${meal.strMealThumb}" 
          alt="${meal.strMeal}"
          class="w-full h-48 object-cover cursor-pointer"
          onclick="window.showFavoriteMealDetails('${meal.idMeal}')"
        />
        <button
          onclick="window.removeFavorite('${meal.idMeal}')"
          class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg"
          title="Remove from favorites"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 cursor-pointer" onclick="window.showFavoriteMealDetails('${meal.idMeal}')">
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
}

function toggleClearButton(show) {
  const clearBtn = document.getElementById("clear-favorites-btn");
  if (clearBtn) {
    if (show) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
  }
}

function updateFavoritesCount() {
  const countElement = document.getElementById("favorites-count");
  if (countElement) {
    const count = getFavoritesCount();
    countElement.textContent = count > 0 ? `(${count})` : "";
  }
}

async function showFavoriteMealDetails(mealId) {
  try {
    const meal = await getMealById(mealId);
    if (meal) {
      displayMealModal(meal);
    }
  } catch (error) {
    console.error("Error loading meal details:", error);
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
        <button 
          onclick="window.closeModal()"
          class="text-stone-500 hover:text-stone-700 text-2xl"
        >
          &times;
        </button>
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
            ${ingredients
              .map(
                (ing) =>
                  `<li class="flex items-center"><span class="mr-2">•</span> ${ing.measure} ${ing.name}</li>`
              )
              .join("")}
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

function closeModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function removeFavorite(mealId) {
  const success = removeFromFavorites(mealId);
  if (success) {
    loadFavorites();
    updateFavoritesCount();
  }
}

function clearAllFavoritesHandler() {
  if (
    confirm(
      "Are you sure you want to remove all favorites? This cannot be undone."
    )
  ) {
    const success = clearFavorites();
    if (success) {
      loadFavorites();
      updateFavoritesCount();
    }
  }
}

window.showFavoriteMealDetails = showFavoriteMealDetails;
window.closeModal = closeModal;
window.removeFavorite = removeFavorite;
window.clearAllFavorites = clearAllFavoritesHandler;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
