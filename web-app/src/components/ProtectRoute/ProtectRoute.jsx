import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const jwt = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!jwt || role?.toLowerCase() !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectRoute;
