const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createOrder = async (orderData) => {
  const url = `${BASE_URL}/orders`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return data.result ? data.result : data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
