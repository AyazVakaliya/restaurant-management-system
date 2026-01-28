import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { CheckCircle, Clock, Utensils, Truck, Home } from 'lucide-react';
import axios from 'axios';

const socket = io('http://localhost:5000');

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    };
    fetchOrder();

    socket.emit('join_order_room', id);
    socket.on('order_status_updated', (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => socket.off('order_status_updated');
  }, [id]);

  if (!order) return <div className="p-20 text-center">Loading status...</div>;

  const steps = [
    { label: 'Received', icon: CheckCircle, status: 'Received' },
    { label: 'Preparing', icon: Utensils, status: 'Preparing' },
    { label: 'Ready', icon: Clock, status: 'Ready' },
    { label: 'On its way', icon: Truck, status: 'Out for Delivery' },
    { label: 'Delivered', icon: Home, status: 'Delivered' },
  ];

  const currentStep = steps.findIndex(s => s.status === order.orderStatus);

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Feast</h1>
      
      <div className="bg-white p-10 rounded-2xl shadow-lg relative">
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                  isActive ? 'bg-primary border-primary text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
                } transition-colors duration-500`}>
                  <Icon size={24} />
                </div>
                <p className={`mt-4 text-sm font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-16 left-20 right-20 h-1 bg-gray-100 z-0">
          <div 
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
        <h3 className="font-bold text-xl mb-4">Order Details</h3>
        <div className="space-y-2 text-gray-600">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.qty}x {item.name}</span>
              <span>₹{(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 font-bold text-gray-900 flex justify-between">
            <span>Total</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;