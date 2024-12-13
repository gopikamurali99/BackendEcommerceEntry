// routes/SellerRoutes/sellerRoutes.js
import express from 'express';
import {signup,verifyEmail,signin,signout,resetPassword} from './SellerControllers.js';
import {addProduct,updateProduct,deleteProduct,viewProduct,viewApprovedProducts,getAllProducts} from './SellerproductController.js'
import {getSellerOrders,getOrderById,updateOrderStatus} from './SellerOrderRecievingRoute.js';
import {addSellerProfile,getAllSellerProfiles,getSellerProfileById,updateSellerProfile,deleteSellerProfile} from './SellerProfileController.js';
import { authenticate } from './SellerAuthMiddleware.js';

const router = express.Router();


router.post('/signup', signup);


router.get('/verify/:token', verifyEmail);


router.post('/signin', signin);


router.post('/signout', signout);


router.post('/reset-password', resetPassword);


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


router.get('/sellerorders/:orderId', authenticate,  getOrderById);


router.put('/sellerorders/:orderId/status', authenticate, updateOrderStatus);

router.post('/profile',authenticate, addSellerProfile);


router.get('/', getAllSellerProfiles);

router.get('/:id', getSellerProfileById);


router.put('/profile/:id',authenticate, updateSellerProfile);


router.delete('/profile/:id',authenticate, deleteSellerProfile);

export default router;