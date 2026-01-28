import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="ml-6 flex-grow">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-primary font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button onClick={() => updateQty(item, item.qty - 1)} className="p-2 hover:text-primary"><Minus size={16} /></button>
                  <span className="font-bold px-2">{item.qty}</span>
                  <button onClick={() => updateQty(item, item.qty + 1)} className="p-2 hover:text-primary"><Plus size={16} /></button>
                </div>
                <button onClick={() => dispatch(removeFromCart(item._id))} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₹5.00</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{(subtotal + 5).toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;