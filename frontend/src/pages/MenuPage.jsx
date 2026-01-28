import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../store/slices/menuSlice';
import MenuCard from '../components/MenuCard';

const MenuPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.menu);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks'];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full capitalize transition-all ${
              activeCategory === cat 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">Loading amazing food...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;