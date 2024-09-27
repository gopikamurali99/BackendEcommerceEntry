import express from 'express';
import productController from "./productController.js";
const router = express.Router();

router.get('/products', productController.getAllProducts);

// Get a product by ID
router.get('/products/:id', productController.getProductById);

router.get('/related/:category/:id', productController.getRelatedProducts);

export default router;