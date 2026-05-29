const BASE_URL = import.meta.env.VITE_BASE_URL;

const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

const logout = async ()=> {

    localStorage.removeItem("token"); 
    localStorage.removeItem("role"); 

   try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}


export { login, logout };   