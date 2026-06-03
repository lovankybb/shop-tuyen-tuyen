import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import cartService from '../service/CartService';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.data.result);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const response = await cartService.updateQuantity(itemId, quantity);
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === itemId ? response.data.result : item
        )
      );
    } catch (err) {
      alert('Failed to update quantity. The product might be out of stock.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      setCartItems(currentItems =>
        currentItems.filter(item => item.id !== itemId)
      );
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (loading) {
    return <div className="text-center p-10">Loading your cart...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p>Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to view your cart.</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center border-b py-4 gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p className="text-sm text-gray-600">{item.colorName} {item.versionName}</p>
                <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <input type="number" min="1" value={item.quantity} onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))} className="w-16 text-center border rounded" />
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold border-b pb-4 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4 font-bold text-xl border-t pt-4"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
          <Link to="/checkout" className="block w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-center">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;