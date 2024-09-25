// routes/adminRoutes.js
import express from 'express';
import { authenticate } from '../Admin/AdminauthMiddleware.js';
import {signup,verifyEmail,login,logout} from '../Admin/adminControllers.js';
import { viewPendingProducts, approveProduct, rejectProduct, getAllSellers,deleteSeller } from './AdminSellerContollers.js'
import {getAllCustomers,getCustomerById,deleteCustomer,activateCustomer} from './AdminCustomerController.js';

import { getAllOrders,updateOrderStatus,deleteOrder} from './AdminOrderController.js';
import {getAllProducts,getProductById,updateProduct,deleteProduct} from './AdminProductController.js';




const router = express.Router();


router.post('/signup', signup);

router.get('/verify/:token', verifyEmail);

router.post('/login', login);

router.post('/logout',logout); // Protect logout route

// Protect other routes that require authentication
router.use(authenticate); // Apply auth middleware to all subsequent routes
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});
// Route for admin to view pending products
router.get('/products/pending', authenticate, viewPendingProducts);

// Route for admin to approve a product
router.put('/products/approve/:id', authenticate, approveProduct);

// Route for admin to reject a product
router.put('/products/reject/:id', authenticate, rejectProduct);

router.put('/getseller',authenticate,getAllSellers);
router.post('/deleteseller',authenticate,deleteSeller);

//route for customer related functionalities of admin
router.get('/customers', authenticate,  getAllCustomers);

// Route for admin to get a customer by ID
router.get('/customers/:customerId', authenticate,  getCustomerById);

// Route for admin to delete a customer
router.delete('/customers/:customerId', authenticate,  deleteCustomer);

// Route for admin to activate or deactivate a customer
router.put('/customers/:customerId/activate', authenticate,  activateCustomer);

router.get('/orders', authenticate,  getAllOrders);


// Route for updating the status of an order (admin only)
router.put('/order/:orderId/status', authenticate,  updateOrderStatus);

// Route for deleting an order (admin only)
router.delete('/order/:orderId', authenticate,  deleteOrder);
// Route for getting all payments (admin only)


// Route for admin to get all products
router.get('/products', authenticate,  getAllProducts);

// Route for admin to get a product by ID
router.get('/products/:productId', authenticate, getProductById);

// Route for admin to update a product
router.put('/products/:productId', authenticate,  updateProduct);

// Route for admin to delete a product
router.delete('/products/:productId', authenticate, deleteProduct);

export default router;