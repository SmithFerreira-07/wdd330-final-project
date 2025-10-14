import { renderHeader, renderFooter } from "../partials/index.js";
import {
  searchProducts,
  getProductByBarcode,
  getNutritionInfo,
  getIngredientInfo,
  formatNutritionData,
} from "./api/openfoodfacts.js";

function init() {
  renderHeader("header-container");
  renderFooter("footer-container");
  setupEventListeners();
}

function setupEventListeners() {
  const searchForm = document.getElementById("nutrition-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById("nutrition-search-input");
  const query = searchInput?.value.trim();

  if (!query) return;

  await searchForProducts(query);
}

async function searchForProducts(query) {
  const spinner = document.getElementById("spinner-container");
  const resultsSection = document.getElementById("nutrition-results-section");
  const resultsContainer = document.getElementById(
    "nutrition-results-container"
  );
  const nutriScoreInfo = document.getElementById("nutriscore-info");

  if (spinner) spinner.classList.remove("hidden");
  if (resultsSection) resultsSection.style.display = "none";
  if (nutriScoreInfo) nutriScoreInfo.style.display = "none";

  try {
    const results = await searchProducts(query, 1, 20);

    if (spinner) spinner.classList.add("hidden");
    if (resultsSection) resultsSection.style.display = "block";

    if (!results.products || results.products.length === 0) {
      resultsContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <svg class="w-24 h-24 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-2xl font-semibold mb-2">No products found</h3>
          <p class="text-stone-600 mb-4">Try searching with different keywords</p>
        </div>
      `;
      return;
    }

    displayResults(results.products, query);
  } catch (error) {
    console.error("Error searching products:", error);
    if (spinner) spinner.classList.add("hidden");
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline"> Failed to search products. Please try again.</span>
        </div>
      `;
    }
  }
}

function displayResults(products, query) {
  const resultsContainer = document.getElementById(
    "nutrition-results-container"
  );
  if (!resultsContainer) return;

  const validProducts = products.filter(
    (p) => p.product_name && (p.image_url || p.image_front_url)
  );

  resultsContainer.innerHTML = `
    <div class="mb-6">
      <h2 class="text-3xl font-bold border-b-2 border-green-700 pb-2">
        Results for "${query}" (${validProducts.length})
      </h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      ${validProducts.map((product) => createProductCard(product)).join("")}
    </div>
  `;
}

function createProductCard(product) {
  const nutrition = getNutritionInfo(product);
  const imageUrl = product.image_url || product.image_front_url || "";

  return `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
         onclick="window.showProductDetails('${product.code}')">
      ${imageUrl ? `<img src="${imageUrl}" alt="${product.product_name}" class="w-full h-48 object-contain bg-white p-2">` : '<div class="w-full h-48 bg-stone-200 flex items-center justify-center"><span class="text-stone-400">No image</span></div>'}
      
      <div class="p-4">
        <h3 class="font-bold text-lg mb-2 line-clamp-2">${product.product_name || "Unknown Product"}</h3>
        ${product.brands ? `<p class="text-sm text-stone-600 mb-3">${product.brands}</p>` : ""}
        
        ${
          nutrition?.nutritionGrade
            ? `
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-semibold">Nutri-Score:</span>
            <span class="px-3 py-1 rounded-full text-white font-bold text-sm
              ${nutrition.nutritionGrade === "a" ? "bg-green-600" : ""}
              ${nutrition.nutritionGrade === "b" ? "bg-lime-500" : ""}
              ${nutrition.nutritionGrade === "c" ? "bg-yellow-500" : ""}
              ${nutrition.nutritionGrade === "d" ? "bg-orange-500" : ""}
              ${nutrition.nutritionGrade === "e" ? "bg-red-600" : ""}
            ">
              ${nutrition.nutritionGrade.toUpperCase()}
            </span>
          </div>
        `
            : ""
        }
        
        <button class="mt-3 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors">
          View Details
        </button>
      </div>
    </div>
  `;
}

async function showProductDetails(barcode) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 class="text-2xl font-bold">Loading...</h2>
          <button 
            onclick="window.closeProductModal()"
            class="text-stone-500 hover:text-stone-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div class="p-6 flex justify-center items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");

  try {
    const product = await getProductByBarcode(barcode);
    if (product) {
      displayProductModal(product);
    } else {
      modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 class="text-2xl font-bold mb-4">Product Not Found</h2>
            <p class="text-stone-600 mb-4">Unable to load product details.</p>
            <button 
              onclick="window.closeProductModal()"
              class="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              Close
            </button>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading product details:", error);
    closeProductModal();
  }
}

function displayProductModal(product) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  const nutrition = getNutritionInfo(product);
  const ingredients = getIngredientInfo(product);
  const imageUrl = product.image_url || product.image_front_url || "";

  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 class="text-2xl font-bold">${product.product_name || "Unknown Product"}</h2>
          <button 
            onclick="window.closeProductModal()"
            class="text-stone-500 hover:text-stone-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              ${imageUrl ? `<img src="${imageUrl}" alt="${product.product_name}" class="w-full rounded-lg shadow-md">` : '<div class="w-full h-64 bg-stone-200 rounded-lg flex items-center justify-center"><span class="text-stone-400">No image available</span></div>'}
            </div>
            
            <div>
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Product Information</h3>
                ${product.brands ? `<p class="mb-1"><strong>Brand:</strong> ${product.brands}</p>` : ""}
                ${product.quantity ? `<p class="mb-1"><strong>Quantity:</strong> ${product.quantity}</p>` : ""}
                ${product.categories ? `<p class="mb-1"><strong>Categories:</strong> ${product.categories}</p>` : ""}
                ${product.code ? `<p class="mb-1"><strong>Barcode:</strong> ${product.code}</p>` : ""}
              </div>
              
              ${
                nutrition?.nutritionGrade
                  ? `
                <div class="mb-4">
                  <h3 class="text-lg font-semibold mb-2">Nutri-Score</h3>
                  <div class="flex items-center gap-3">
                    <span class="px-6 py-3 rounded-lg text-white font-bold text-3xl
                      ${nutrition.nutritionGrade === "a" ? "bg-green-600" : ""}
                      ${nutrition.nutritionGrade === "b" ? "bg-lime-500" : ""}
                      ${nutrition.nutritionGrade === "c" ? "bg-yellow-500" : ""}
                      ${nutrition.nutritionGrade === "d" ? "bg-orange-500" : ""}
                      ${nutrition.nutritionGrade === "e" ? "bg-red-600" : ""}
                    ">
                      ${nutrition.nutritionGrade.toUpperCase()}
                    </span>
                    <span class="text-stone-600">
                      ${nutrition.nutritionGrade === "a" ? "Excellent nutritional quality" : ""}
                      ${nutrition.nutritionGrade === "b" ? "Good nutritional quality" : ""}
                      ${nutrition.nutritionGrade === "c" ? "Average nutritional quality" : ""}
                      ${nutrition.nutritionGrade === "d" ? "Poor nutritional quality" : ""}
                      ${nutrition.nutritionGrade === "e" ? "Bad nutritional quality" : ""}
                    </span>
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
          
          ${
            nutrition
              ? `
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3">Nutrition Facts (per 100g)</h3>
              <div class="bg-stone-50 rounded-lg p-4">
                <table class="w-full">
                  <tbody>
                    ${formatNutritionData(nutrition)
                      .map(
                        (item) => `
                      <tr class="border-b border-stone-200">
                        <td class="py-2 font-semibold">${item.label}</td>
                        <td class="py-2 text-right">${item.value}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
          `
              : ""
          }
          
          ${
            ingredients?.ingredientsText
              ? `
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3">Ingredients</h3>
              <p class="text-stone-700 bg-stone-50 p-4 rounded-lg">${ingredients.ingredientsText}</p>
            </div>
          `
              : ""
          }
          
          ${
            ingredients?.allergens
              ? `
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3">Allergens</h3>
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 font-semibold">${ingredients.allergens}</p>
              </div>
            </div>
          `
              : ""
          }
          
          ${
            product.labels
              ? `
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3">Labels & Certifications</h3>
              <div class="flex flex-wrap gap-2">
                ${product.labels
                  .split(",")
                  .map(
                    (label) =>
                      `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">${label.trim()}</span>`
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.innerHTML = "";
  }
}

function quickSearch(query) {
  const searchInput = document.getElementById("nutrition-search-input");
  if (searchInput) {
    searchInput.value = query;
    searchForProducts(query);
  }
}

window.showProductDetails = showProductDetails;
window.closeProductModal = closeProductModal;
window.quickSearch = quickSearch;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
