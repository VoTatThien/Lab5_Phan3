require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

// Import routes
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const { addUserToViews, logSessionActivity } = require('./middleware/auth');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash middleware
app.use(flash());

// Authentication middleware - add user data to views
app.use(addUserToViews);

// Session activity logging (development only)
app.use(logSessionActivity);

// Global middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Product Supplier Management - Home',
    messages: req.flash()
  });
});

// Redirect dashboard to auth dashboard
app.get('/dashboard', (req, res) => {
  res.redirect('/auth/dashboard');
});

// Authentication routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);
app.use('/session', sessionRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    messages: req.flash(),
    url: req.originalUrl
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    req.flash('error', messages.join(', '));
    return res.redirect('back');
  }
  
  // Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    req.flash('error', 'Invalid ID provided');
    return res.redirect('/');
  }
  
  // Default error
  res.status(500).render('500', {
    title: 'Server Error',
    messages: req.flash(),
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/product_supplier_db'}`);
});

module.exports = app;
