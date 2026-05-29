const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllBrands = async () => {
  const url = `${BASE_URL}/api/brands`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
}

const createBrand = async (brandData) => {
  const url = `${BASE_URL}/api/brands`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      throw new Error("Failed to create brand");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
}

const updateBrand = async (brandId, brandData) => {
  const url = `${BASE_URL}/api/brands/${brandId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      throw new Error("Failed to update brand");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
}


const deleteBrand = async (brandId) => {
  const url = `${BASE_URL}/api/brands/${brandId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete brand");
    }

  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
}

export { getAllBrands, createBrand, updateBrand, deleteBrand };  