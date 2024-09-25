import mongoose from 'mongoose';

// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // Reference to the Category model
  category: 
     { type: String, required: true },
  
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller', // Assuming you have a Seller model
    required: true,
  },
  brand: {
    type: String,
    index: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  colors: [
    {
      type: String,
      
    },
  ],
  sizes: [
    {
      type: String,
      required: true,
    },
  ],
  inventory: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;