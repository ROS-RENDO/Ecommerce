// app/api/ProductService.ts
import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fetch all products
export const fetchProduct = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}/api/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Products");
    }
    const data: Product[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

// Search products by query
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${API_URL}/api/product?search=${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to search products");
    return await res.json();
  } catch (error) {
    console.error("Error searching products: ", error);
    return [];
  }
};

// Fetch featured/random products
export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    // Try the /api/product endpoint first with limit parameter
    const response = await fetch(
      `${API_URL}/api/product?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store', // Don't cache random results
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Fetch products by category
export async function fetchProductsByCategory(
  categorySlug: string,
  limit?: number
): Promise<Product[]> {
  try {
    const url = limit
      ? `${API_URL}/api/product?category=${categorySlug}&limit=${limit}`
      : `${API_URL}/api/product?category=${categorySlug}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

// Fetch products with limit (general purpose)
export async function fetchProducts(limit?: number): Promise<Product[]> {
  try {
    const url = limit
      ? `${API_URL}/api/product?limit=${limit}`
      : `${API_URL}/api/products`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Fetch single product by slug
export async function fetchProductBySlug(slug: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/product/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}