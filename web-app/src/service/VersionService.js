const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getVersions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/versions`);
    if (!response.ok) {
      throw new Error("Failed to fetch versions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching versions:", error);
    throw error;
  }
};

export const createVersion = async (versionData) => {
  try {
    const response = await fetch(`${BASE_URL}/versions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(versionData),
    });
    if (!response.ok) {
      throw new Error("Failed to create version");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating version:", error);
    throw error;
  }
};

export const updateVersion = async (id, versionData) => {
  try {
    const response = await fetch(`${BASE_URL}/versions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(versionData),
    });
    if (!response.ok) {
      throw new Error("Failed to update version");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating version:", error);
    throw error;
  }
};

export const deleteVersion = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/versions/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) {
      throw new Error("Failed to delete version");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
};