// lib/api/cart.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'


// Get cart items
export const fetchCart = async () => {
  try {
    const res = await fetch(`${API_URL}/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include', // Use cookies instead of Authorization header
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch cart");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart: ", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (productId: string, quantity = 1) => {
  try {
    const res = await fetch(`${API_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      throw new Error("Failed to add to cart");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart: ", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      throw new Error("Failed to update cart item");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating cart item: ", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (itemId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error("Failed to remove from cart");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error removing from cart: ", error);
    throw error;
  }
};