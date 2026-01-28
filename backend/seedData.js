const Menu = require('./models/Menu');
const User = require('./models/User');
const Order = require('./models/Order');
const Reservation = require('./models/Reservation');
const Review = require('./models/Review');

dotenv.config();

const menuItems = [
  // ... (keeping menu items same)
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear EVERYTHING
    await Menu.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();
    await Review.deleteMany();

    // Create ONLY the Admin User
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@gourmet.com',
      password: 'ayaz@123',
      role: 'admin'
    });

    // Create Menu Items
    await Menu.insertMany(menuItems);

    console.log('Data Seeded Successfully!');
    console.log('Admin Email: admin@gourmet.com');
    console.log('Admin Password: ayaz@123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();