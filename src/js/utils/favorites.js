const FAVORITES_KEY = "globalCuisine_favorites";

export function getFavorites() {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

export function getFavoriteMeals() {
  try {
    const favoritesData = localStorage.getItem(`${FAVORITES_KEY}_data`);
    return favoritesData ? JSON.parse(favoritesData) : [];
  } catch (error) {
    console.error("Error reading favorite meals:", error);
    return [];
  }
}

export function addToFavorites(meal) {
  try {
    const favorites = getFavorites();
    const favoriteMeals = getFavoriteMeals();

    if (!favorites.includes(meal.idMeal)) {
      favorites.push(meal.idMeal);
      favoriteMeals.push(meal);

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      localStorage.setItem(
        `${FAVORITES_KEY}_data`,
        JSON.stringify(favoriteMeals)
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
}

export function removeFromFavorites(mealId) {
  try {
    const favorites = getFavorites();
    const favoriteMeals = getFavoriteMeals();

    const index = favorites.indexOf(mealId);
    if (index > -1) {
      favorites.splice(index, 1);
      const mealIndex = favoriteMeals.findIndex((m) => m.idMeal === mealId);
      if (mealIndex > -1) {
        favoriteMeals.splice(mealIndex, 1);
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      localStorage.setItem(
        `${FAVORITES_KEY}_data`,
        JSON.stringify(favoriteMeals)
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
}

export function isFavorite(mealId) {
  const favorites = getFavorites();
  return favorites.includes(mealId);
}

export function toggleFavorite(meal) {
  if (isFavorite(meal.idMeal)) {
    removeFromFavorites(meal.idMeal);
    return false;
  } else {
    addToFavorites(meal);
    return true;
  }
}

export function getFavoritesCount() {
  return getFavorites().length;
}

export function clearAllFavorites() {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(`${FAVORITES_KEY}_data`);
    return true;
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return false;
  }
}
