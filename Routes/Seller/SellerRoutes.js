// routes/SellerRoutes/sellerRoutes.js
import express from 'express';
import {signup,verifyEmail,signin,signout,resetPassword} from './SellerControllers.js';
import {addProduct,updateProduct,deleteProduct,viewProduct,viewApprovedProducts,getAllProducts} from './SellerproductController.js'
import {getSellerOrders,getOrderById,updateOrderStatus} from './SellerOrderRecievingRoute.js';
import {addSellerProfile,getAllSellerProfiles,getSellerProfileById,updateSellerProfile,deleteSellerProfile} from './SellerProfileController.js';
import { authenticate } from './SellerAuthMiddleware.js';

const router = express.Router();

// Seller signup
router.post('/signup', signup);

// Email verification
router.get('/verify/:token', verifyEmail);

// Seller sign-in
router.post('/signin', signin);

// Seller sign-out
router.post('/signout', signout);

// Reset password
router.post('/reset-password', resetPassword);

// Create seller profile (protected route)
//router.post('/profile', authenticate, createProfile);
// Route for sellers to add a new product
router.post('/addproduct', authenticate, addProduct);
//get all product
router.get('/getproducts', authenticate, getAllProducts)

// Route for sellers to update an existing product
router.put('/updateproduct/:productId', authenticate, updateProduct);

// Route for sellers to delete a product
router.delete('/deleteproduct/:productId', authenticate, deleteProduct);

// Route for sellers to view a specific product
router.get('/viewproduct/:productId', authenticate, viewProduct);

// Route for sellers to view their approved products
router.get('/approvedproducts', authenticate, viewApprovedProducts);
// Route for getting all orders for the authenticated seller
router.get('/sellerorders', authenticate,  getSellerOrders);

// Route for getting a specific order by ID
router.get('/sellerorders/:orderId', authenticate,  getOrderById);

// Route for updating the status of an order
router.put('/sellerorders/:orderId/status', authenticate, updateOrderStatus);

router.post('/profile', addSellerProfile);

// Route to get all seller profiles
router.get('/', getAllSellerProfiles);

// Route to get a specific seller profile by ID
router.get('/:id', getSellerProfileById);

// Route to update a seller profile
router.put('/profile/:id', updateSellerProfile);

// Route to delete a seller profile
router.delete('/profile/:id', deleteSellerProfile);

export default router;