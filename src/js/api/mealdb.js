const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMealsByName(query) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error searching meals:", error);
    throw error;
  }
}

export async function getRandomMeal() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching random meal:", error);
    throw error;
  }
}

export async function getMealById(id) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getMealsByCategory(category) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${category}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    throw error;
  }
}

export async function getMealsByArea(area) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=${area}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching meals by area:", error);
    throw error;
  }
}

export async function getAreas() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
}

export function parseIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || "",
      });
    }
  }
  return ingredients;
}
