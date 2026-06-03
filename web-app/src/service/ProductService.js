const BASE_URL = import.meta.env.VITE_BASE_URL;


/**
 * 
 * 
 *  @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "brandId", required = false) Long brandId,
            @RequestParam(value = "keyword", required = false) String keyword
 */

const getAllProducts = async (page, size, sortBy, direction, categoryId, brandId, keyword) => {
  const url = `${BASE_URL}/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&categoryId=${categoryId}&brandId=${brandId}&keyword=${keyword}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const createProduct = async (productData) => {
  const url = `${BASE_URL}/products`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const updateProduct = async (productId, productData) => {
  const url = `${BASE_URL}/products/${productId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  const url = `${BASE_URL}/products/${productId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const getProductById = async (productId) => {
  const url = `${BASE_URL}/products/${productId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};


const changeProductStatus = async (productId, status) => {
  const url = `${BASE_URL}/products/${productId}/status`;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to change product status");
    }

    const data = await response.json();
    return data.result ? (data.result.data || data.result) : data;
  } catch (error) {
    console.error("Error changing product status:", error);
    throw error;
  }
};

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  changeProductStatus
};
