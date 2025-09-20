# Testing Session and Cookie Functionality with Postman

This guide demonstrates how to test the session and cookie functionality in our Node.js MVC application using Postman.

## 🚀 Getting Started

### Prerequisites
1. Application running on `http://localhost:3000`
2. MongoDB running and seeded with test data
3. Postman installed

### Test User Accounts
The following test accounts are available (created via seed script):

| Username | Email | Password | Role |
|----------|-------|----------|------|
| testuser | test@example.com | test123 | user |
| admin | admin@example.com | admin123 | admin |
| demo | demo@example.com | demo123 | user |

## 📋 Testing Scenarios

### 1. User Registration
**Method:** POST  
**URL:** `http://localhost:3000/auth/register`  
**Body (x-www-form-urlencoded):**
```
fullName: John Doe
username: newuser
email: newuser@example.com
password: password123
confirmPassword: password123
```

**Expected Response:** Redirect to login page with success message

### 2. User Login (Session Creation)
**Method:** POST  
**URL:** `http://localhost:3000/auth/login`  
**Body (x-www-form-urlencoded):**
```
identifier: testuser
password: test123
rememberMe: true
```

**Expected Response:** 
- Status: 302 (Redirect)
- Location: `/dashboard`
- Sets session cookie (`connect.sid`)
- Sets additional demo cookies (`lastLogin`, `userPreference`)

**Important:** Make sure to enable "Automatically follow redirects" in Postman settings or manually follow the redirect.

### 3. Check Session Status
**Method:** GET  
**URL:** `http://localhost:3000/session/info`  
**Headers:** Include cookies from login response

**Expected Response:**
```json
{
  "sessionId": "session-id-here",
  "session": {
    "cookie": {...},
    "user": {
      "id": "user-id",
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "Test User",
      "role": "user",
      "loginTime": "2025-09-20T..."
    }
  },
  "cookies": {...},
  "signedCookies": {...}
}
```

### 4. Access Protected Dashboard
**Method:** GET  
**URL:** `http://localhost:3000/dashboard`  
**Headers:** Include session cookies

**Expected Response:** Dashboard HTML page with user information and session details

### 5. Session Data Manipulation

#### Set Custom Session Data
**Method:** POST  
**URL:** `http://localhost:3000/session/set`  
**Body (JSON):**
```json
{
  "key": "userPreference",
  "value": "dark-mode"
}
```

#### Get Custom Session Data
**Method:** GET  
**URL:** `http://localhost:3000/session/get/userPreference`

#### Clear Custom Session Data
**Method:** DELETE  
**URL:** `http://localhost:3000/session/clear`

### 6. Cookie Management

#### Set Custom Cookie
**Method:** POST  
**URL:** `http://localhost:3000/session/cookie/set`  
**Body (JSON):**
```json
{
  "name": "testCookie",
  "value": "testValue",
  "maxAge": 3600000
}
```

#### Get All Cookies
**Method:** GET  
**URL:** `http://localhost:3000/session/cookies`

#### Clear Specific Cookie
**Method:** DELETE  
**URL:** `http://localhost:3000/session/cookie/clear/testCookie`

### 7. Profile Management
**Method:** GET  
**URL:** `http://localhost:3000/auth/profile`  
**Headers:** Include session cookies

**Method:** POST  
**URL:** `http://localhost:3000/auth/profile`  
**Body (x-www-form-urlencoded):**
```
fullName: Updated Name
email: updated@example.com
```

### 8. Logout (Session Destruction)
**Method:** GET or POST  
**URL:** `http://localhost:3000/auth/logout`  
**Headers:** Include session cookies

**Expected Response:**
- Status: 302 (Redirect)
- Location: `/auth/login`
- Clears session cookie
- Clears additional cookies
- Sets temporary logout message cookie

## 🔍 What to Observe

### Session Behavior
1. **Session Creation**: Login creates a new session with unique ID
2. **Session Persistence**: Session data persists across requests
3. **Session Expiry**: Session expires after configured time (24 hours default)
4. **Remember Me**: Extended session duration when "Remember Me" is checked

### Cookie Behavior
1. **Session Cookie**: `connect.sid` cookie stores session ID
2. **Additional Cookies**: `lastLogin`, `userPreference` cookies set during login
3. **Cookie Security**: HttpOnly vs. regular cookies
4. **Cookie Expiry**: Different expiry times for different cookies

### Security Features
1. **Authentication Protection**: Protected routes redirect to login when not authenticated
2. **Guest Protection**: Login/register routes redirect to dashboard when already authenticated
3. **Password Hashing**: Passwords are hashed using bcryptjs
4. **Account Locking**: Multiple failed login attempts lock the account

## 🧪 Postman Collection Setup

### Environment Variables
Create a Postman environment with:
```
base_url: http://localhost:3000
username: testuser
password: test123
```

### Pre-request Scripts
For authenticated requests, add this pre-request script:
```javascript
// This will automatically handle session cookies
pm.request.headers.add({
    key: 'Cookie',
    value: pm.environment.get('session_cookie')
});
```

### Test Scripts
Add this test script to login request to capture session cookie:
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(302);
});

// Capture session cookie
const cookies = pm.response.headers.get('Set-Cookie');
if (cookies) {
    const sessionCookie = cookies.split(';')[0];
    pm.environment.set('session_cookie', sessionCookie);
}
```

## 🔧 Troubleshooting

### Common Issues
1. **No Session Cookie**: Ensure you're following redirects or manually capturing cookies
2. **401 Unauthorized**: Make sure session cookie is included in subsequent requests
3. **Session Expired**: Re-login to get a new session
4. **CORS Issues**: Not applicable for same-origin requests

### Debugging Tips
1. Check browser developer tools for cookie values
2. Use `/session/info` endpoint to verify session state
3. Check server logs for session activity
4. Verify MongoDB connection and user data

## 📚 Additional Testing

### Browser Testing
1. Open `http://localhost:3000/auth/login` in browser
2. Login with test credentials
3. Open browser developer tools → Application → Cookies
4. Observe session and custom cookies
5. Navigate to different pages and observe session persistence
6. Test logout and observe cookie clearing

### API Testing with cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -d "identifier=testuser&password=test123" \
  -c cookies.txt \
  -L

# Access protected route
curl -X GET http://localhost:3000/session/info \
  -b cookies.txt
```

## 📊 Expected Results

After successful testing, you should observe:
1. ✅ User registration creates new users
2. ✅ Login creates session and sets cookies
3. ✅ Protected routes require authentication
4. ✅ Session data persists across requests
5. ✅ Cookies are properly set and managed
6. ✅ Logout destroys session and clears cookies
7. ✅ Session expiry works as expected
8. ✅ Remember me functionality extends session

This demonstrates a complete session and cookie management system suitable for production use with proper security considerations.
