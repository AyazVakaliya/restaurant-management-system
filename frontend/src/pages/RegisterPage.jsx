import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { login } from '../store/slices/authSlice';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return alert('Please enter a valid email address (e.g. user@gmail.com)');
    if (password !== confirmPassword) return alert('Passwords do not match');
    const lowerCaseEmail = email.toLowerCase();
    try {
      await axios.post('/api/users', { name, email: lowerCaseEmail, password });
      dispatch(login({ email: lowerCaseEmail, password }));
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Join Royal Palace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" placeholder="Email" required className="w-full p-3 border rounded-xl"
            value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
          <input 
            type="password" placeholder="Password" required className="w-full p-3 border rounded-xl"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            type="password" placeholder="Confirm Password" required className="w-full p-3 border rounded-xl"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-red-600 transition">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;