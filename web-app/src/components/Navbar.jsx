import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirect to home or login page after logging out
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand / Home Link */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          TuyenShop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {user ? (
            // Render this if the user IS logged in
            <>
              <span className="text-gray-700">Welcome, {user.fullName || user.username}</span>
              {user.role === 'ADMIN' && (
                 <Link to="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
              )}
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Render this if the user IS NOT logged in
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <Link to="/login" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;