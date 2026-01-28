import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const MenuCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, qty: 1 }));
    Swal.fire({
      icon: 'success',
      title: 'Added to cart!',
      text: `${item.name} has been added to your basket.`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
          <span className="text-primary font-bold">₹{item.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded capitalize">
            {item.category}
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-primary text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;