const  BASE_URL = import.meta.env.VITE_API_BASE_URL;

const createProductVariant = async (productId, variantData) => {
  const url = `${BASE_URL}/products/${productId}/variants`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product variant");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error creating product variant:", error);
    throw error;
  }
};

const deleteProductVariant = async (productId, variantId) => {
  const url = `${BASE_URL}/products/${productId}/variants/${variantId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product variant");
    }

    return true; // Return true if deletion was successful
  } catch (error) {
    console.error("Error deleting product variant:", error);
    throw error;
  }
};

const updateProductVariant = async (variantId, variantData) => {
  const url = `${BASE_URL}/products/variants/${variantId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product variant");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error updating product variant:", error);
    throw error;
  }
};

const getProductVariantsByProductId = async (productId) => {
  const url = `${BASE_URL}/products/${productId}/variants`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product variants");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};

export { createProductVariant, deleteProductVariant, updateProductVariant, getProductVariantsByProductId };