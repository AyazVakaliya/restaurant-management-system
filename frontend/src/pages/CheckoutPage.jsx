import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../store/slices/cartSlice';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', zip: ''
  });

  useEffect(() => {
    if (!userInfo) navigate('/login?redirect=checkout');
  }, [userInfo, navigate]);

  const placeOrder = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress,
        paymentMethod: 'Stripe',
        itemsPrice: subtotal,
        taxPrice: subtotal * 0.1,
        shippingPrice: 5.0,
        totalPrice: subtotal * 1.1 + 5.0,
        deliveryType: 'delivery'
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      dispatch(clearCart());
      Swal.fire('Success!', 'Your order has been placed.', 'success');
      navigate(`/order/${data._id}`);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Street Address" 
              className="w-full p-3 border rounded-lg"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
            />
            <input 
              type="text" placeholder="City" 
              className="w-full p-3 border rounded-lg"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
            />
            <input 
              type="text" placeholder="State" 
              className="w-full p-3 border rounded-lg"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
            />
            <input 
              type="text" placeholder="ZIP Code" 
              className="w-full p-3 border rounded-lg"
              value={shippingAddress.zip}
              onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
            />
          </div>
        </div>
        
        <button onClick={placeOrder} className="w-full btn-primary py-4 text-lg font-bold">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;