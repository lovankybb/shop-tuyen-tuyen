const BASE_URL = import.meta.env.VITE_BASE_URL;

const cartService = {
  getCart: async () => {
    const url = `${BASE_URL}/cart`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to load cart");
    return { data: await response.json() };
  },

  updateQuantity: async (cartItemId, quantity) => {
    const url = `${BASE_URL}/cart/${cartItemId}?quantity=${quantity}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to update quantity");
    return { data: await response.json() };
  },

  removeItem: async (cartItemId) => {
    const url = `${BASE_URL}/cart/${cartItemId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to remove item");
    return { data: await response.json() };
  },

  addToCart: async (cartItemRequest) => {
    const url = `${BASE_URL}/cart`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cartItemRequest)
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    return { data: await response.json() };
  }
};

export default cartService;
