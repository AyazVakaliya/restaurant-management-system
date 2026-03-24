const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('./models/Menu');
const User = require('./models/User');
const Order = require('./models/Order');
const Reservation = require('./models/Reservation');
const Review = require('./models/Review');

dotenv.config();

const menuItems = [
  // --- STARTERS ---
  {
    name: "Paneer Tikka",
    description: "Spiced cottage cheese cubes grilled to perfection in a tandoor",
    price: 220,
    category: "starters",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    name: "Crispy Chicken Wings",
    description: "Deep-fried wings tossed in a spicy buffalo sauce",
    price: 280,
    category: "starters",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Classic French Fries",
    description: "Golden crispy potato fries with a pinch of sea salt",
    price: 120,
    category: "starters",
    image: "https://images.unsplash.com/photo-1573015084245-7da888cb0f7e?auto=format&fit=crop&w=800&q=80",
    stock: 100
  },
  {
    name: "Cheesy Garlic Bread",
    description: "Toasted baguette topped with garlic butter and melted mozzarella",
    price: 150,
    category: "starters",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    stock: 60
  },
  {
    name: "Veg Spring Rolls",
    description: "Crispy pastry rolls filled with fresh sautéed vegetables",
    price: 180,
    category: "starters",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },

  // --- MAINS ---
  {
    name: "Margherita Pizza",
    description: "Hand-tossed pizza with fresh basil and premium mozzarella",
    price: 299,
    category: "mains",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    name: "Classic Beef Burger",
    description: "Grilled beef patty with cheddar cheese and fresh veggies",
    price: 199,
    category: "mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato-butter sauce",
    price: 350,
    category: "mains",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    stock: 30
  },
  {
    name: "White Sauce Pasta",
    description: "Penne pasta in a rich, creamy Alfredo herb sauce",
    price: 249,
    category: "mains",
    image: "https://images.unsplash.com/photo-1645112481338-3560e99af31a?auto=format&fit=crop&w=800&q=80",
    stock: 35
  },

  // --- DESSERTS ---
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate center",
    price: 180,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daa510?auto=format&fit=crop&w=800&q=80",
    stock: 30
  },
  {
    name: "Gulab Jamun (2 pcs)",
    description: "Deep-fried milk solids in warm cardamom sugar syrup",
    price: 90,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80",
    stock: 100
  },
  {
    name: "New York Cheesecake",
    description: "Classic velvety smooth cheesecake with a graham cracker crust",
    price: 250,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    stock: 25
  },
  {
    name: "Ice Cream Sundae",
    description: "Three scoops of ice cream with chocolate sauce and nuts",
    price: 160,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c849a135?auto=format&fit=crop&w=800&q=80",
    stock: 45
  },
  {
    name: "Warm Brownie",
    description: "Rich fudgy brownie served with vanilla ice cream",
    price: 190,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1564355808539-22dade4976ff?auto=format&fit=crop&w=800&q=80",
    stock: 35
  },

  // --- DRINKS ---
  {
    name: "Coca-Cola",
    description: "Chilled Classic Soda (500ml)",
    price: 45,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80",
    stock: 100
  },
  {
    name: "Pepsi",
    description: "Refreshing Chilled Pepsi (500ml)",
    price: 45,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1546673067-57a81307f236?auto=format&fit=crop&w=800&q=80",
    stock: 100
  },
  {
    name: "Red Bull",
    description: "Premium Energy Drink can",
    price: 125,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    name: "Fanta Orange",
    description: "Bright and bubbly orange soda",
    price: 45,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80",
    stock: 100
  },
  {
    name: "Monster Energy",
    description: "Mean Energy Drink (500ml)",
    price: 145,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1538e?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Fresh Lime Soda",
    description: "Zesty lemon soda with salt or sugar",
    price: 80,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    stock: 100
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Menu.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();
    await Review.deleteMany();

    await User.create({
      name: 'Royal Palace Admin',
      email: 'royaladmin@gmail.com',
      password: 'ayaz@123',
      role: 'admin'
    });

    await Menu.insertMany(menuItems);

    console.log('--- SEEDING COMPLETE ---');
    console.log(`Added ${menuItems.length} items with stable image links.`);
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();