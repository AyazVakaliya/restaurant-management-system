import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReservationPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: today, time: '12:00', partySize: 2, specialRequests: ''
  });

  const timeOptions = [];
  for (let h = 10; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const timeVal = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const timeLabel = `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
      timeOptions.push({ value: timeVal, label: timeLabel });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      return Swal.fire('Error', 'Phone number must be exactly 10 digits.', 'error');
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return Swal.fire('Error', 'Please enter a valid email address.', 'error');
    }

    // Date/Time validation
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      return Swal.fire('Error', 'Cannot select a past date or time.', 'error');
    }

    try {
      await axios.post('/api/reservations', formData);
      Swal.fire('Confirmed!', 'Your table has been reserved. Check your email for details.', 'success');
      setFormData({ name: '', email: '', phone: '', date: today, time: '12:00', partySize: 2, specialRequests: '' });
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
              placeholder="xyz111@gmail.com"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input 
              type="text" required maxLength="10" className="w-full p-3 border rounded-xl"
              placeholder="10-digit number"
              value={formData.phone} 
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input 
              type="date" required min={today} className="w-full p-3 border rounded-xl"
              value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <select 
              required className="w-full p-3 border rounded-xl"
              value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
            >
              {timeOptions.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
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