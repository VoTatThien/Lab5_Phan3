// Authentication middleware

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    // Store the original URL for redirect after login
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please log in to access this page');
    return res.redirect('/auth/login');
  }
};

// Middleware to require guest (not authenticated)
const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  } else {
    return next();
  }
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    req.flash('error', 'Access denied. Admin privileges required.');
    return res.redirect('/dashboard');
  }
};

// Middleware to make user data available in all views
const addUserToViews = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!(req.session && req.session.user);
  next();
};

// Middleware to log session activity (for debugging)
const logSessionActivity = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Session Activity:', {
      sessionId: req.sessionID,
      user: req.session.user ? req.session.user.username : 'Guest',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest,
  requireAdmin,
  addUserToViews,
  logSessionActivity
};
