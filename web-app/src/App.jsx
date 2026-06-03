import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Authentication from "./pages/Authentication/Authentication";
import Home from "./pages/Home";
import Admin from "./components/Admin/Admin";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
