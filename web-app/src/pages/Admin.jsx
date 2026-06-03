import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Protect the route: if not loading auth and user isn't an admin, redirect or show error.
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'ADMIN') {
        setError('Access Denied: You do not have administrator privileges.');
        setLoadingData(false);
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading, navigate, currentPage]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // Fetch stats and orders concurrently for better performance
      const [statsRes, ordersRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getAllOrders(currentPage, 10)
      ]);

      setStats(statsRes.data.result);
      setOrders(ordersRes.data.result.data);
      setTotalPages(ordersRes.data.result.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      // Update the local state so the UI reflects the change immediately
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  if (authLoading || loadingData) {
    return <div className="text-center p-10 text-xl font-semibold">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-10 text-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md inline-block">
          <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
          <p>{error}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 block">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-lg font-semibold uppercase">Total Orders</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-lg font-semibold uppercase">Total Revenue</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">${stats.totalRevenue?.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="p-4 border-b">Order Code</th>
                <th className="p-4 border-b">Customer</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Total</th>
                <th className="p-4 border-b">Payment</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b font-semibold text-blue-600">{order.orderCode}</td>
                  <td className="p-4 border-b">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="p-4 border-b text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 border-b font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4 border-b text-sm">
                    <span className={order.paymentStatus === 'PAID' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 border-b">
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded p-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-600">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;