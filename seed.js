require('dotenv').config();
const mongoose = require('mongoose');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB for seeding');
  seedDatabase();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create suppliers
    const suppliers = [
      {
        name: 'Tech Solutions Inc.',
        address: '123 Technology Drive, Silicon Valley, CA 94043',
        phone: '+1 (555) 123-4567'
      },
      {
        name: 'Global Electronics Ltd.',
        address: '456 Commerce Street, New York, NY 10001',
        phone: '+1 (555) 987-6543'
      },
      {
        name: 'Premium Components Co.',
        address: '789 Industrial Boulevard, Chicago, IL 60601',
        phone: '+1 (555) 456-7890'
      },
      {
        name: 'Modern Supplies Corp.',
        address: '321 Business Ave, Austin, TX 73301',
        phone: '+1 (555) 234-5678'
      },
      {
        name: 'Quality Hardware Group',
        address: '654 Manufacturing Lane, Detroit, MI 48201',
        phone: '+1 (555) 345-6789'
      }
    ];

    const createdSuppliers = await Supplier.insertMany(suppliers);
    console.log(`✅ Created ${createdSuppliers.length} suppliers`);

    // Create users
    const users = [
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        fullName: 'Test User',
        role: 'user'
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Administrator',
        role: 'admin'
      },
      {
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123',
        fullName: 'Demo User',
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    const products = [
      {
        name: 'Wireless Bluetooth Mouse',
        price: 29.99,
        quantity: 150,
        supplierId: createdSuppliers[0]._id
      },
      {
        name: 'USB-C Charging Cable',
        price: 19.99,
        quantity: 200,
        supplierId: createdSuppliers[0]._id
      },
      {
        name: '24-inch LED Monitor',
        price: 199.99,
        quantity: 75,
        supplierId: createdSuppliers[1]._id
      },
      {
        name: 'Mechanical Keyboard',
        price: 89.99,
        quantity: 100,
        supplierId: createdSuppliers[1]._id
      },
      {
        name: 'Webcam HD 1080p',
        price: 49.99,
        quantity: 80,
        supplierId: createdSuppliers[1]._id
      },
      {
        name: 'Laptop Stand Aluminum',
        price: 39.99,
        quantity: 120,
        supplierId: createdSuppliers[2]._id
      },
      {
        name: 'Wireless Charger Pad',
        price: 24.99,
        quantity: 90,
        supplierId: createdSuppliers[2]._id
      },
      {
        name: 'External Hard Drive 1TB',
        price: 79.99,
        quantity: 60,
        supplierId: createdSuppliers[3]._id
      },
      {
        name: 'Gaming Headset',
        price: 69.99,
        quantity: 45,
        supplierId: createdSuppliers[3]._id
      },
      {
        name: 'Smartphone Case',
        price: 14.99,
        quantity: 300,
        supplierId: createdSuppliers[4]._id
      },
      {
        name: 'Bluetooth Speaker',
        price: 59.99,
        quantity: 85,
        supplierId: createdSuppliers[4]._id
      },
      {
        name: 'Power Bank 10000mAh',
        price: 34.99,
        quantity: 110,
        supplierId: createdSuppliers[0]._id
      },
      {
        name: 'HDMI Cable 6ft',
        price: 12.99,
        quantity: 250,
        supplierId: createdSuppliers[2]._id
      },
      {
        name: 'Desk Organizer',
        price: 22.99,
        quantity: 95,
        supplierId: createdSuppliers[3]._id
      },
      {
        name: 'LED Desk Lamp',
        price: 45.99,
        quantity: 70,
        supplierId: createdSuppliers[4]._id
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n📊 Seeding Summary:');
    console.log(`   Suppliers: ${createdSuppliers.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    
    // Display some statistics
    const totalValue = createdProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    
    console.log(`   Total Inventory Value: $${totalValue.toLocaleString()}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('You can now run the application with: npm start');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⏹️  Seeding interrupted...');
  await mongoose.connection.close();
  process.exit(0);
});
