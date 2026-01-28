import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../store/slices/menuSlice';
import MenuCard from '../components/MenuCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const featuredItems = items.slice(0, 4);

  return (
    <div>
      <Hero />
      
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Chef's Recommendations</h2>
        {loading ? (
          <div className="flex justify-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Founded in 1995, Gourmet Palace has been at the forefront of culinary innovation. 
            Our master chefs use only the finest organic ingredients sourced from local farmers 
            to create unforgettable dining experiences.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;