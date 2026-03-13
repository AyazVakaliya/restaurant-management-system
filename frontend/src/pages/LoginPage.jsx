import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

const LoginPage = ({ isAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(state => state.auth);
  
  const location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : (isAdminLogin ? '/admin' : '/');

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    dispatch(login({ email: email.toLowerCase(), password }));
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          {isAdminLogin ? 'Admin Login' : 'Login to Royal Palace'}
        </h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder={isAdminLogin ? "royaladmin@gmail.com" : "your@email.com"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        {!isAdminLogin && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New Customer? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;