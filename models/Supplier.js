const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Supplier address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\-\+\(\)\s]+$/, 'Please enter a valid phone number']
  }
}, {
  timestamps: true
});

// Virtual for getting products of this supplier
supplierSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplierId'
});

// Ensure virtual fields are serialized
supplierSchema.set('toJSON', { virtuals: true });
supplierSchema.set('toObject', { virtuals: true });

// Pre-remove middleware to handle cascade delete
supplierSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const Product = require('./Product');
  await Product.deleteMany({ supplierId: this._id });
});

module.exports = mongoose.model('Supplier', supplierSchema);
