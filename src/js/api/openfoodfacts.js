const OFF_BASE_URL = "https://world.openfoodfacts.org";

export async function searchProducts(query, page = 1, pageSize = 20) {
  try {
    const response = await fetch(
      `${OFF_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&json=true`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || 1,
      pageSize: data.page_size || pageSize,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
}

export async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(
      `${OFF_BASE_URL}/api/v0/product/${barcode}.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    throw error;
  }
}

export async function getProductsByCategory(category, page = 1, pageSize = 20) {
  try {
    const response = await fetch(
      `${OFF_BASE_URL}/category/${encodeURIComponent(category)}/${page}.json?page_size=${pageSize}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || 1,
      pageSize: data.page_size || pageSize,
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
}

export function getNutritionInfo(product) {
  if (!product || !product.nutriments) {
    return null;
  }

  return {
    energy: product.nutriments.energy_100g || null,
    energyUnit: product.nutriments.energy_unit || "kJ",
    fat: product.nutriments.fat_100g || null,
    saturatedFat: product.nutriments["saturated-fat_100g"] || null,
    carbohydrates: product.nutriments.carbohydrates_100g || null,
    sugars: product.nutriments.sugars_100g || null,
    proteins: product.nutriments.proteins_100g || null,
    salt: product.nutriments.salt_100g || null,
    fiber: product.nutriments.fiber_100g || null,
    nutritionGrade: product.nutrition_grades || null,
  };
}

export function getIngredientInfo(product) {
  if (!product) {
    return null;
  }

  return {
    ingredients: product.ingredients || [],
    ingredientsText: product.ingredients_text || "",
    allergens: product.allergens || "",
    traces: product.traces || "",
  };
}

export function formatNutritionData(nutrition) {
  if (!nutrition) return [];

  const items = [];

  if (nutrition.energy !== null) {
    items.push({
      label: "Energy",
      value: `${nutrition.energy} ${nutrition.energyUnit}`,
    });
  }
  if (nutrition.fat !== null) {
    items.push({ label: "Fat", value: `${nutrition.fat} g` });
  }
  if (nutrition.saturatedFat !== null) {
    items.push({
      label: "Saturated Fat",
      value: `${nutrition.saturatedFat} g`,
    });
  }
  if (nutrition.carbohydrates !== null) {
    items.push({
      label: "Carbohydrates",
      value: `${nutrition.carbohydrates} g`,
    });
  }
  if (nutrition.sugars !== null) {
    items.push({ label: "Sugars", value: `${nutrition.sugars} g` });
  }
  if (nutrition.proteins !== null) {
    items.push({ label: "Proteins", value: `${nutrition.proteins} g` });
  }
  if (nutrition.salt !== null) {
    items.push({ label: "Salt", value: `${nutrition.salt} g` });
  }
  if (nutrition.fiber !== null) {
    items.push({ label: "Fiber", value: `${nutrition.fiber} g` });
  }

  return items;
}
