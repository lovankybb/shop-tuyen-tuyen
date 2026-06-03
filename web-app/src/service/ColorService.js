const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllColors   = async () => {
    const url = `${BASE_URL}/colors`;       
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            
        });
        if (!response.ok) { 
            throw new Error("Failed to fetch colors");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching colors:", error);
        throw error;
    }
}

const createColor = async (colorData) => {
    const url = `${BASE_URL}/colors`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(colorData),
        });
        if (!response.ok) {
            throw new Error("Failed to create color");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating color:", error);
        throw error;
    }
}

const updateColor = async (colorId, colorData) => {
    const url = `${BASE_URL}/colors/${colorId}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(colorData),
        });
        if (!response.ok) {
            throw new Error("Failed to update color");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating color:", error);
        throw error;
    }
}

const deleteColor = async (colorId) => {
    const url = `${BASE_URL}/colors/${colorId}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete color");
        }
    } catch (error) {
        console.error("Error deleting color:", error);
        throw error;
    }
}   

export { getAllColors, createColor, updateColor, deleteColor };