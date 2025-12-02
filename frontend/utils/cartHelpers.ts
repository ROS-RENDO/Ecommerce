// utils/cartHelpers.ts
const orderedProductsKey = "orderedProducts";

export const trackProductAdd = (productId: string): boolean => {
  const stored = localStorage.getItem(orderedProductsKey);
  let products: string[] = stored ? JSON.parse(stored) : [];

  const isSecondTime = products.includes(productId);

  // Add product to storage if not already there
  if (!isSecondTime) {
    products.push(productId);
    localStorage.setItem(orderedProductsKey, JSON.stringify(products));
  }

  return isSecondTime; // true only on second addition
};
