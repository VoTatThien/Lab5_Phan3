const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /session/info - Get session information
router.get('/info', requireAuth, (req, res) => {
  res.json({
    sessionId: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
    timestamp: new Date().toISOString()
  });
});

// POST /session/set - Set session data
router.post('/set', (req, res) => {
  const { key, value } = req.body;
  
  if (!key || value === undefined) {
    return res.status(400).json({
      error: 'Both key and value are required',
      received: { key, value }
    });
  }
  
  // Initialize session data if it doesn't exist
  if (!req.session.data) {
    req.session.data = {};
  }
  
  req.session.data[key] = value;
  
  res.json({
    message: 'Session data set successfully',
    sessionId: req.sessionID,
    data: req.session.data,
    timestamp: new Date().toISOString()
  });
});

// GET /session/get/:key - Get specific session data
router.get('/get/:key', (req, res) => {
  const { key } = req.params;
  
  const value = req.session.data ? req.session.data[key] : undefined;
  
  res.json({
    key,
    value,
    sessionId: req.sessionID,
    allSessionData: req.session.data || {},
    timestamp: new Date().toISOString()
  });
});

// DELETE /session/clear - Clear session data
router.delete('/clear', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to clear session',
        details: err.message
      });
    }
    
    res.json({
      message: 'Session cleared successfully',
      timestamp: new Date().toISOString()
    });
  });
});

// POST /session/cart/add - Add item to cart (session-based)
router.post('/cart/add', (req, res) => {
  const { productId, productName, quantity = 1 } = req.body;
  
  if (!productId || !productName) {
    return res.status(400).json({
      error: 'Product ID and name are required'
    });
  }
  
  // Initialize cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  // Check if item already exists in cart
  const existingItem = req.session.cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    req.session.cart.push({
      productId,
      productName,
      quantity: parseInt(quantity),
      addedAt: new Date().toISOString()
    });
  }
  
  res.json({
    message: 'Item added to cart',
    cart: req.session.cart,
    cartCount: req.session.cart.length,
    sessionId: req.sessionID,
    timestamp: new Date().toISOString()
  });
});

// GET /session/cart - Get cart contents
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const cartCount = cart.length;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  res.json({
    cart,
    cartCount,
    totalItems,
    sessionId: req.sessionID,
    timestamp: new Date().toISOString()
  });
});

// DELETE /session/cart/clear - Clear cart
router.delete('/cart/clear', (req, res) => {
  req.session.cart = [];
  
  res.json({
    message: 'Cart cleared successfully',
    cart: req.session.cart,
    sessionId: req.sessionID,
    timestamp: new Date().toISOString()
  });
});

// POST /session/visit - Track visits
router.post('/visit', (req, res) => {
  const { page } = req.body;
  
  // Initialize visit tracking
  if (!req.session.visits) {
    req.session.visits = [];
    req.session.visitCount = 0;
  }
  
  req.session.visitCount++;
  req.session.visits.push({
    page: page || req.headers.referer || 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });
  
  // Keep only last 10 visits
  if (req.session.visits.length > 10) {
    req.session.visits = req.session.visits.slice(-10);
  }
  
  res.json({
    message: 'Visit tracked',
    visitCount: req.session.visitCount,
    currentSession: {
      sessionId: req.sessionID,
      visits: req.session.visits,
      startTime: req.session.cookie.originalMaxAge ? 
        new Date(Date.now() - (req.session.cookie.originalMaxAge - req.session.cookie.maxAge)) : 
        'Unknown'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
