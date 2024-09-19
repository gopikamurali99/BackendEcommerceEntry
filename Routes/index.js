// routes/index.js
import express from 'express';
import adminRoutes from './Admin/AdminMainRoute.js';
import sellerRoutes from './Seller/SellerRoutes.js';
import customerRoutes from './Customer/CustomerRoute.js';
import productRoutes from './product/productRoute.js'

const router = express.Router();

// Use the admin and seller routes
router.use('/admin', adminRoutes);
router.use('/seller', sellerRoutes);
router.use('/customer',customerRoutes);
router.use('/product',productRoutes);

export default router;