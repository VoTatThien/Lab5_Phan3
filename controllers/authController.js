const User = require('../models/User');

// Authentication controller
const authController = {
  // Show registration form
  showRegister: (req, res) => {
    res.render('auth/register', {
      title: 'Register',
      error: req.flash('error'),
      success: req.flash('success'),
      oldInput: req.flash('oldInput')[0] || {}
    });
  },

  // Handle registration
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword, fullName } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword || !fullName) {
        req.flash('error', 'All fields are required');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters long');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        req.flash('error', 'Username or email already exists');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      // Create new user
      const newUser = new User({
        username,
        email,
        password,
        fullName
      });

      await newUser.save();

      // Set success message and redirect to login
      req.flash('success', 'Registration successful! Please login.');
      res.redirect('/auth/login');

    } catch (error) {
      console.error('Registration error:', error);
      req.flash('error', 'Registration failed. Please try again.');
      req.flash('oldInput', req.body);
      res.redirect('/auth/register');
    }
  },

  // Show login form
  showLogin: (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session.user) {
      return res.redirect('/dashboard');
    }

    res.render('auth/login', {
      title: 'Login',
      error: req.flash('error'),
      success: req.flash('success'),
      oldInput: req.flash('oldInput')[0] || {}
    });
  },

  // Handle login
  login: async (req, res) => {
    try {
      const { identifier, password, rememberMe } = req.body;

      // Validation
      if (!identifier || !password) {
        req.flash('error', 'Username/Email and password are required');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/login');
      }

      // Find user by username or email
      const user = await User.findByUsernameOrEmail(identifier);

      if (!user) {
        req.flash('error', 'Invalid credentials');
        req.flash('oldInput', { identifier });
        return res.redirect('/auth/login');
      }

      // Check if account is locked
      if (user.isLocked) {
        req.flash('error', 'Account is temporarily locked due to too many failed login attempts. Please try again later.');
        return res.redirect('/auth/login');
      }

      // Check if account is active
      if (!user.isActive) {
        req.flash('error', 'Account is deactivated. Please contact administrator.');
        return res.redirect('/auth/login');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        // Increment login attempts
        await user.incLoginAttempts();
        req.flash('error', 'Invalid credentials');
        req.flash('oldInput', { identifier });
        return res.redirect('/auth/login');
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        loginTime: new Date()
      };

      // Set session cookie options based on "Remember Me"
      if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
      } else {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 1 day
      }

      // Set additional cookies for demonstration
      res.cookie('lastLogin', new Date().toISOString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: false // Allow JavaScript access for demo purposes
      });

      res.cookie('userPreference', JSON.stringify({
        theme: 'default',
        language: 'en',
        timezone: 'UTC'
      }), {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: false
      });

      req.flash('success', `Welcome back, ${user.displayName}!`);
      
      // Redirect to intended page or dashboard
      const redirectTo = req.session.returnTo || '/dashboard';
      delete req.session.returnTo;
      res.redirect(redirectTo);

    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Login failed. Please try again.');
      req.flash('oldInput', req.body);
      res.redirect('/auth/login');
    }
  },

  // Handle logout
  logout: (req, res) => {
    const username = req.session.user ? req.session.user.username : 'User';
    
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        req.flash('error', 'Error during logout');
        return res.redirect('/dashboard');
      }

      // Clear specific cookies
      res.clearCookie('connect.sid'); // Session cookie
      res.clearCookie('lastLogin');
      res.clearCookie('userPreference');

      // Set success message in a temporary cookie since session is destroyed
      res.cookie('logoutMessage', `Goodbye, ${username}! You have been logged out successfully.`, {
        maxAge: 5000, // 5 seconds
        httpOnly: false
      });

      res.redirect('/auth/login');
    });
  },

  // Show dashboard
  showDashboard: async (req, res) => {
    try {
      // Get user's full data
      const user = await User.findById(req.session.user.id);
      
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/auth/login');
      }

      // Get session info
      const sessionInfo = {
        sessionId: req.sessionID,
        sessionData: req.session,
        cookies: req.cookies,
        signedCookies: req.signedCookies
      };

      res.render('auth/dashboard', {
        title: 'Dashboard',
        user: user,
        sessionInfo: sessionInfo,
        success: req.flash('success'),
        error: req.flash('error')
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      req.flash('error', 'Error loading dashboard');
      res.redirect('/auth/login');
    }
  },

  // Show profile
  showProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id);
      
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/auth/login');
      }

      res.render('auth/profile', {
        title: 'Profile',
        user: user,
        success: req.flash('success'),
        error: req.flash('error'),
        oldInput: req.flash('oldInput')[0] || {}
      });

    } catch (error) {
      console.error('Profile error:', error);
      req.flash('error', 'Error loading profile');
      res.redirect('/dashboard');
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, email } = req.body;
      const userId = req.session.user.id;

      // Validation
      if (!fullName || !email) {
        req.flash('error', 'Full name and email are required');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/profile');
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email,
        _id: { $ne: userId }
      });

      if (existingUser) {
        req.flash('error', 'Email is already taken by another user');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/profile');
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        { fullName, email },
        { new: true, runValidators: true }
      );

      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/auth/login');
      }

      // Update session data
      req.session.user.fullName = user.fullName;
      req.session.user.email = user.email;

      req.flash('success', 'Profile updated successfully');
      res.redirect('/auth/profile');

    } catch (error) {
      console.error('Profile update error:', error);
      req.flash('error', 'Error updating profile');
      req.flash('oldInput', req.body);
      res.redirect('/auth/profile');
    }
  }
};

module.exports = authController;
