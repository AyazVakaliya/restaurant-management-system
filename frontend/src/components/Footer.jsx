import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Gourmet Palace</h3>
            <p className="text-gray-400">Exquisite dining experiences since 1995. Quality ingredients, master chefs, and a passion for food.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/menu" className="hover:text-primary">Menu</a></li>
              <li><a href="/reserve" className="hover:text-primary">Reservations</a></li>
              <li><a href="/about" className="hover:text-primary">Our Story</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Mon - Fri: 11:00 AM - 11:00 PM</li>
              <li>Sat - Sun: 09:00 AM - 12:00 AM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">123 Culinary Ave, Foodie City<br/>Phone: +1 (555) 123-4567<br/>Email: hello@gourmetpalace.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2026 Gourmet Palace Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;