const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier ID is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ supplierId: 1 });
productSchema.index({ name: 1 });

// Virtual to populate supplier information
productSchema.virtual('supplier', {
  ref: 'Supplier',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
