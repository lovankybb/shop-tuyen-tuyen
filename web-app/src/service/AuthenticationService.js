const BASE_URL = import.meta.env.VITE_BASE_URL;

const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
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
    const result = data.result || data;
    localStorage.setItem("token", result.token);
    
    // We fetch user profile to get the role if possible, but let's just return result for now
    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

const register = async (username, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role: "USER" }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return data.result || data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

const logout = async () => {
   const token = localStorage.getItem("token");
   localStorage.removeItem("token"); 
   localStorage.removeItem("role"); 

   try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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

export { login, register, logout };