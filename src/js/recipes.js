import {
  renderHeader,
  renderFooter,
  refreshHeaderFavoritesCount,
} from "../partials/index.js";
import {
  getCategories,
  getMealsByCategory,
  getMealById,
  parseIngredients,
} from "./api/mealdb.js";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "./utils/favorites.js";

let currentCategory = "Seafood";

async function init() {
  renderHeader("header-container");
  renderFooter("footer-container");

  await loadCategories();
  await loadRecipesByCategory(currentCategory);
}

async function loadCategories() {
  try {
    const categories = await getCategories();
    displayCategories(categories);
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function displayCategories(categories) {
  const recipesGrid = document.getElementById("recipes-grid");
  if (!recipesGrid) return;

  const categorySection = document.createElement("div");
  categorySection.className = "col-span-full mb-6";
  categorySection.id = "category-filters";

  categorySection.innerHTML = `
    <h2 class="text-2xl font-semibold mb-4">Browse by Category</h2>
    <div class="flex flex-wrap gap-2">
      ${categories
        .slice(0, 10)
        .map(
          (cat) => `
        <button 
          onclick="window.filterByCategory('${cat.strCategory}')"
          class="category-btn px-4 py-2 rounded-lg transition-colors duration-200 ${cat.strCategory === currentCategory ? "bg-amber-700 text-white" : "bg-white text-stone-700 hover:bg-amber-100"}"
          data-category="${cat.strCategory}"
        >
          ${cat.strCategory}
        </button>
      `
        )
        .join("")}
    </div>
  `;

  recipesGrid.parentElement?.insertBefore(
    categorySection,
    recipesGrid.parentElement.firstChild
  );
}

async function loadRecipesByCategory(category) {
  const recipesGrid = document.getElementById("recipes-grid");
  if (!recipesGrid) return;

  currentCategory = category;
  updateCategoryButtons();

  recipesGrid.innerHTML = `
    <div class="col-span-full flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
    </div>
  `;

  try {
    const meals = await getMealsByCategory(category);
    displayRecipes(meals);
  } catch (error) {
    console.error("Error loading recipes:", error);
    recipesGrid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-xl text-red-600">Failed to load recipes. Please try again.</p>
      </div>
    `;
  }
}

function updateCategoryButtons() {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    if (btn.dataset.category === currentCategory) {
      btn.className =
        "category-btn px-4 py-2 rounded-lg transition-colors duration-200 bg-amber-700 text-white";
    } else {
      btn.className =
        "category-btn px-4 py-2 rounded-lg transition-colors duration-200 bg-white text-stone-700 hover:bg-amber-100";
    }
  });
}

function displayRecipes(meals) {
  const recipesGrid = document.getElementById("recipes-grid");
  if (!recipesGrid) return;

  if (!meals || meals.length === 0) {
    recipesGrid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-xl text-stone-600">No recipes found in this category.</p>
      </div>
    `;
    return;
  }

  recipesGrid.innerHTML = meals
    .map(
      (meal) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative">
        <img 
          src="${meal.strMealThumb}" 
          alt="${meal.strMeal}"
          class="w-full h-48 object-cover cursor-pointer"
          onclick="window.showRecipeDetails('${meal.idMeal}')"
        />
        <button
          onclick="event.stopPropagation(); window.toggleRecipeFavorite('${meal.idMeal}', this)"
          class="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg"
          data-meal-id="${meal.idMeal}"
          title="${isFavorite(meal.idMeal) ? "Remove from favorites" : "Add to favorites"}"
        >
          <svg class="w-5 h-5 ${isFavorite(meal.idMeal) ? "text-red-600 fill-current" : "text-stone-400"}" fill="${isFavorite(meal.idMeal) ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 cursor-pointer" onclick="window.showRecipeDetails('${meal.idMeal}')">
        <h3 class="font-bold text-lg mb-2 line-clamp-2">${meal.strMeal}</h3>
      </div>
    </div>
  `
    )
    .join("");
}

async function showRecipeDetails(mealId) {
  try {
    const meal = await getMealById(mealId);
    if (meal) {
      displayRecipeModal(meal);
    }
  } catch (error) {
    console.error("Error loading recipe details:", error);
    alert("Failed to load recipe details. Please try again.");
  }
}

function displayRecipeModal(meal) {
  const ingredients = parseIngredients(meal);

  // Create modal if it doesn't exist
  let modal = document.getElementById("recipe-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "recipe-modal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
        <h2 class="text-2xl font-bold">${meal.strMeal}</h2>
        <div class="flex items-center gap-3">
          <button
            onclick="window.toggleRecipeModalFavorite('${meal.idMeal}')"
            id="recipe-modal-favorite-btn-${meal.idMeal}"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isFavorite(meal.idMeal) ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}"
            title="${isFavorite(meal.idMeal) ? "Remove from favorites" : "Add to favorites"}"
          >
            <svg class="w-5 h-5 ${isFavorite(meal.idMeal) ? "fill-current" : ""}" fill="${isFavorite(meal.idMeal) ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span class="hidden sm:inline">${isFavorite(meal.idMeal) ? "Saved" : "Save"}</span>
          </button>
          <button 
            onclick="window.closeRecipeModal()"
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
  modal.style.display = "flex";
}

function closeRecipeModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

async function toggleRecipeFavorite(mealId, buttonElement) {
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
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

async function toggleRecipeModalFavorite(mealId) {
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
    const button = document.getElementById(
      `recipe-modal-favorite-btn-${mealId}`
    );
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
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

window.filterByCategory = loadRecipesByCategory;
window.showRecipeDetails = showRecipeDetails;
window.closeRecipeModal = closeRecipeModal;
window.toggleRecipeFavorite = toggleRecipeFavorite;
window.toggleRecipeModalFavorite = toggleRecipeModalFavorite;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
