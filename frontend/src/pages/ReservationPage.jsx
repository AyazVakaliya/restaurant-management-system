import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '', partySize: 2, specialRequests: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reservations', formData);
      Swal.fire('Confirmed!', 'Your table has been reserved. Check your email for details.', 'success');
      setFormData({ name: '', email: '', phone: '', date: '', time: '', partySize: 2, specialRequests: '' });
    } catch (error) {
      Swal.fire('Error', 'Could not complete reservation.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center">Reserve a Table</h1>
        <p className="text-gray-500 text-center mb-8">Join us for an unforgettable dining experience.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input 
              type="text" required className="w-full p-3 border rounded-xl"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" required className="w-full p-3 border rounded-xl"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input 
              type="tel" required className="w-full p-3 border rounded-xl"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input 
              type="date" required className="w-full p-3 border rounded-xl"
              value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input 
              type="time" required className="w-full p-3 border rounded-xl"
              value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Party Size</label>
            <select 
              className="w-full p-3 border rounded-xl"
              value={formData.partySize} onChange={(e) => setFormData({...formData, partySize: e.target.value})}
            >
              {[1,2,3,4,5,6,7,8,10].map(n => <option key={n} value={n}>{n} People</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Special Requests</label>
            <textarea 
              rows="3" className="w-full p-3 border rounded-xl"
              value={formData.specialRequests} onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="md:col-span-2 btn-primary py-4 text-lg font-bold">
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;