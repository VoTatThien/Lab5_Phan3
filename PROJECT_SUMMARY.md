# Node.js MVC CRUD Application with Session & Cookie Management

## 🎯 Project Overview

This project demonstrates a complete Node.js MVC (Model-View-Controller) CRUD application with comprehensive session and cookie management functionality. The application includes user authentication, session handling, and various cookie management features suitable for testing with Postman.

## 🏗️ Architecture & Features

### Core Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **EJS** - Template engine
- **Express-Session** - Session management
- **bcryptjs** - Password hashing
- **Cookie-Parser** - Cookie handling
- **Connect-Flash** - Flash messages

### Authentication & Security Features
- ✅ User registration and login
- ✅ Password hashing with bcryptjs
- ✅ Session-based authentication
- ✅ Account locking after failed attempts
- ✅ Protected routes with middleware
- ✅ Session expiry and remember me functionality
- ✅ Secure cookie handling

### Session Management
- ✅ Express session configuration
- ✅ Session data persistence
- ✅ Custom session data storage
- ✅ Session info API endpoints
- ✅ Session activity logging

### Cookie Management
- ✅ Session cookies (connect.sid)
- ✅ Custom application cookies
- ✅ Cookie setting and clearing APIs
- ✅ HttpOnly and regular cookies
- ✅ Cookie expiry management

## 📁 Project Structure

```
node-mvc-crud-product-supplier/
├── app.js                      # Main application file
├── package.json                # Dependencies and scripts
├── seed.js                     # Database seeding script
├── TESTING_GUIDE.md           # Comprehensive testing guide
├── Postman_Collection.json    # Importable Postman collection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── productController.js   # Product CRUD operations
│   └── supplierController.js  # Supplier CRUD operations
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── User.js               # User model with authentication
│   ├── Product.js            # Product model
│   └── Supplier.js           # Supplier model
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── productRoutes.js      # Product routes
│   ├── supplierRoutes.js     # Supplier routes
│   └── sessionRoutes.js      # Session management API routes
├── views/
│   ├── auth/                 # Authentication views
│   │   ├── login.ejs        # Login form
│   │   ├── register.ejs     # Registration form
│   │   ├── dashboard.ejs    # User dashboard with session info
│   │   └── profile.ejs      # User profile management
│   ├── products/            # Product views
│   ├── suppliers/           # Supplier views
│   └── partials/            # Shared view components
└── public/
    └── css/
        └── style.css        # Application styles
```

## 🚀 Getting Started

### Prerequisites
1. Node.js (v14 or higher)
2. MongoDB (local or cloud)
3. Postman (for API testing)

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd node-mvc-crud-product-supplier

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed the database with test data
npm run seed

# Start the application
npm start
```

### Test User Accounts
After running the seed script, these accounts are available:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| testuser | test@example.com | test123 | user |
| admin | admin@example.com | admin123 | admin |
| demo | demo@example.com | demo123 | user |

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Select `Postman_Collection.json`
4. Create environment with `base_url: http://localhost:3000`

### Testing Workflow
1. **Registration** - Create new user account
2. **Login** - Authenticate and create session
3. **Session Management** - Test session data APIs
4. **Cookie Management** - Test cookie setting/getting
5. **Protected Routes** - Access authenticated pages
6. **Logout** - Destroy session and clear cookies

### Key Testing Points
- ✅ Session creation and persistence
- ✅ Cookie setting and retrieval
- ✅ Authentication protection
- ✅ Session data manipulation
- ✅ Cookie expiry behavior
- ✅ Logout and cleanup

## 📊 Session & Cookie Demonstration

### Session Features Demonstrated
1. **Session Creation**: Login creates unique session with ID
2. **Session Persistence**: Data persists across requests
3. **Custom Session Data**: Store/retrieve custom application data
4. **Session Expiry**: Configurable session timeout
5. **Remember Me**: Extended session for persistent login

### Cookie Features Demonstrated
1. **Session Cookie**: Automatic session ID cookie (`connect.sid`)
2. **Custom Cookies**: Application-specific cookies
3. **Cookie Options**: MaxAge, HttpOnly, Secure flags
4. **Cookie Clearing**: Proper cleanup on logout
5. **Multiple Cookies**: Different cookies with different lifespans

### API Endpoints for Testing

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (creates session)
- `GET /auth/logout` - User logout (destroys session)
- `GET /auth/dashboard` - Protected dashboard
- `GET /auth/profile` - User profile management

#### Session Management APIs
- `GET /session/info` - Get complete session information
- `POST /session/set` - Set custom session data
- `GET /session/get/:key` - Get specific session data
- `DELETE /session/clear` - Clear custom session data

#### Cookie Management APIs
- `POST /session/cookie/set` - Set custom cookie
- `GET /session/cookies` - Get all cookies
- `DELETE /session/cookie/clear/:name` - Clear specific cookie

## 🔒 Security Considerations

### Implemented Security Features
1. **Password Hashing**: bcryptjs with salt rounds
2. **Session Security**: Secure session configuration
3. **Account Protection**: Login attempt limiting
4. **Route Protection**: Middleware-based authentication
5. **Cookie Security**: HttpOnly and secure flags
6. **Input Validation**: Server-side validation
7. **Error Handling**: Secure error messages

### Production Recommendations
- Use HTTPS in production (set `cookie.secure: true`)
- Implement CSRF protection
- Add rate limiting
- Use environment variables for secrets
- Implement proper logging
- Add input sanitization
- Use session store (Redis/MongoDB) for scaling

## 📈 Learning Outcomes

This project demonstrates:
1. **MVC Architecture** - Proper separation of concerns
2. **Session Management** - Express session implementation
3. **Cookie Handling** - Manual and automatic cookie management
4. **Authentication Flow** - Complete user auth system
5. **API Design** - RESTful endpoints for testing
6. **Security Practices** - Basic security implementations
7. **Testing Methodology** - Postman testing strategies

## 🎥 Nam Media Video Reference

This implementation follows the concepts demonstrated in the Nam Media YouTube video:
"Using Postman to test Session and Cookie in Node JS"

### Key Concepts Covered
- Session creation and management
- Cookie setting and retrieval
- Authentication with sessions
- API testing with Postman
- Security considerations
- Production-ready implementations

## 🚀 Next Steps

To extend this project:
1. Add CSRF protection
2. Implement password reset functionality
3. Add email verification
4. Implement role-based access control
5. Add API rate limiting
6. Implement refresh tokens
7. Add OAuth integration
8. Enhance error handling
9. Add comprehensive testing
10. Deploy to production environment

## 📝 Conclusion

This project provides a solid foundation for understanding session and cookie management in Node.js applications. It demonstrates best practices for authentication, security, and API design while providing comprehensive testing capabilities through Postman.
