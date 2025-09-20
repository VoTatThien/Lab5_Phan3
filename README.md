# Product Supplier Management System

A comprehensive CRUD application for managing suppliers and products using Node.js, Express, MongoDB, and Mongoose with MVC architecture.

## Features

- **Supplier Management**: Create, read, update, and delete suppliers
- **Product Management**: Manage products with supplier relationships
- **Responsive Design**: Bootstrap-powered responsive UI
- **Data Validation**: Server-side and client-side validation
- **Flash Messages**: User feedback for all operations
- **Error Handling**: Comprehensive error handling and custom error pages
- **Seed Data**: Optional sample data for testing

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap 5, Font Awesome
- **Architecture**: MVC (Model-View-Controller)

## Project Structure

```
node-mvc-crud-product-supplier/
├── package.json
├── .env
├── app.js
├── seed.js
├── models/
│   ├── Supplier.js
│   └── Product.js
├── controllers/
│   ├── supplierController.js
│   └── productController.js
├── routes/
│   ├── supplierRoutes.js
│   └── productRoutes.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── 404.ejs
│   ├── 500.ejs
│   ├── suppliers/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   └── products/
│       ├── index.ejs
│       ├── new.ejs
│       └── edit.ejs
└── public/
    └── css/
        └── style.css
```

## Database Schema

### Suppliers
- `name`: String (required, max 100 chars)
- `address`: String (required, max 200 chars)
- `phone`: String (required, validated format)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Products
- `name`: String (required, max 100 chars)
- `price`: Number (required, min 0)
- `quantity`: Number (required, min 0)
- `supplierId`: ObjectId (required, references Supplier)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd node-mvc-crud-product-supplier
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Update the `.env` file with your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/product_supplier_db
   PORT=3000
   SESSION_SECRET=your-secret-key-here
   ```

4. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Ensure your cluster is running

5. **Optional - Seed the database with sample data:**
   ```bash
   npm run seed
   ```

6. **Start the application:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

7. **Access the application:**
   Open your browser and navigate to: `http://localhost:3000`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data

## API Endpoints

### Suppliers
- `GET /suppliers` - List all suppliers
- `GET /suppliers/new` - Show create supplier form
- `POST /suppliers` - Create new supplier
- `GET /suppliers/:id` - Show supplier details
- `GET /suppliers/:id/edit` - Show edit supplier form
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Products
- `GET /products` - List all products
- `GET /products/new` - Show create product form
- `POST /products` - Create new product
- `GET /products/:id` - Show product details
- `GET /products/:id/edit` - Show edit product form
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Features in Detail

### Data Validation
- Server-side validation using Mongoose schemas
- Client-side validation with JavaScript
- User-friendly error messages

### Responsive Design
- Mobile-first design approach
- Bootstrap 5 for responsive layout
- Custom CSS for enhanced styling

### Flash Messages
- Success messages for completed operations
- Error messages for failed operations
- Auto-dismissing alerts with Bootstrap

### Error Handling
- Custom 404 and 500 error pages
- Comprehensive error logging
- Graceful error recovery

## Development Notes

- Uses EJS templating for server-side rendering
- Method override middleware for PUT/DELETE requests
- Session-based flash messaging
- Mongoose virtual fields for relationships
- Comprehensive input validation and sanitization

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check the MONGO_URI in .env file
   - Verify network connectivity for MongoDB Atlas

2. **Port Already in Use:**
   - Change the PORT in .env file
   - Kill the process using the port: `lsof -ti:3000 | xargs kill`

3. **Dependencies Issues:**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Author

Lab5 Project - Node.js CRUD Application with MVC Architecture
