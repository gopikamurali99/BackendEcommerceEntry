// models/SellerProduct.js
import mongoose from 'mongoose';

const sellerProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  images: [{ type: String }],
  inventory: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerModel',
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SellerProduct = mongoose.model('SellerProduct', sellerProductSchema);

export default SellerProduct;