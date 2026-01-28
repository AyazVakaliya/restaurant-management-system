import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu as MenuIcon, LogOut, Settings } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">Gourmet Palace</Link>
        
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/menu" className="hover:text-primary transition">Menu</Link>
          <Link to="/reserve" className="hover:text-primary transition">Reservations</Link>
          {userInfo && (userInfo.role === 'admin' || userInfo.role === 'manager') && (
            <Link to="/admin" className="text-primary font-bold hover:underline transition flex items-center gap-1">
              <Settings className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">{userInfo.name}</span>
              <button onClick={() => dispatch(logout())} className="text-gray-600 hover:text-primary">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 hover:text-primary">
              <User className="w-6 h-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;