// routes/adminRoutes.js
import express from 'express';
import { authenticate } from '../Admin/AdminauthMiddleware.js';
import {signup,verifyEmail,login,logout} from '../Admin/adminControllers.js';
import { viewPendingProducts, approveProduct, rejectProduct, getAllSellers,deleteSeller } from './AdminSellerContollers.js'
import {getAllCustomers,getCustomerById,deleteCustomer,activateCustomer} from './AdminCustomerController.js';

import { getAllOrders,updateOrderStatus,deleteOrder} from './AdminOrderController.js';
import {getAllProducts,getProductById,updateProduct,deleteProduct,getAllCategory,addCategory,getCategoryById} from './AdminProductController.js';




const router = express.Router();


router.post('/signup', signup);

router.get('/verify/:token', verifyEmail);

router.post('/login', login);

router.post('/logout',logout); 


router.use(authenticate); 
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

router.get('/products/pending', authenticate, viewPendingProducts);


router.put('/products/approve/:id', authenticate, approveProduct);


router.put('/products/reject/:id', authenticate, rejectProduct);

router.put('/getseller',authenticate,getAllSellers);
router.post('/deleteseller',authenticate,deleteSeller);


router.get('/customers', authenticate,  getAllCustomers);


router.get('/customers/:customerId', authenticate,  getCustomerById);


router.delete('/customers/:customerId', authenticate,  deleteCustomer);


router.put('/customers/:customerId/activate', authenticate,  activateCustomer);

router.get('/orders', authenticate,  getAllOrders);



router.put('/order/:orderId/status', authenticate,  updateOrderStatus);


router.delete('/order/:orderId', authenticate,  deleteOrder);




router.get('/products', authenticate,  getAllProducts);


router.get('/products/:productId', authenticate, getProductById);


router.put('/products/:productId', authenticate,  updateProduct);


router.delete('/products/:productId', authenticate, deleteProduct);

router.get('/category', authenticate,  getAllCategory);


router.get('/category/:categoryId',getCategoryById );
router.post('/category', authenticate,addCategory);

export default router;