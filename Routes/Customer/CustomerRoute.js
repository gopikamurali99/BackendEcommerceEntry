import express from 'express'
import { signup,signin,verifyEmail,signout } from './CustomerRouteController.js'
import {addItemToCart,viewCart,updateCartItem,removeItemFromCart,clearCart} from './CartController.js';
import {addItemToWishlist,viewWishlist,removeItemFromWishlist,clearWishlist} from './wishlistController.js';
import {createOrder,getOrderById,cancelOrder,getCustomerOrders,userPaymentDetails} from './CustomerOrder.js';
import {confirmOrder} from './ConfirmOrder.js';
import {createShippingAddress,getAllShippingAddresses,getShippingAddressById,updateShippingAddress,deleteShippingAddress} from './ShippingAddress.js';

import { CustomerAuthMiddleware } from './customerAuthMiddleware.js';
import { getAllProducts, getProductById} from '../Admin/AdminProductController.js';
import { Checkout, clearcartItem, getcheckoutAddress } from './checkout.js';

const router =express.Router()

router.post('/signup',signup)
router.get('/verify/:token', verifyEmail);

router.post('/login',signin)

router.post('/logout',signout)
router.post('/cart', CustomerAuthMiddleware, addItemToCart);

// Route for viewing the cart
router.get('/cart', CustomerAuthMiddleware, viewCart);

// Route for updating an item in the cart
router.put('/cart/:itemId', CustomerAuthMiddleware, updateCartItem);

// Route for removing an item from the cart
router.delete('/cart/:itemId',  CustomerAuthMiddleware, removeItemFromCart);

// Route for clearing the cart
router.delete('/cart', CustomerAuthMiddleware, clearCart);

// Route for adding an item to the wishlist
router.post('/wishlist',  CustomerAuthMiddleware, addItemToWishlist);

// Route for viewing the wishlist
router.get('/wishlist',  CustomerAuthMiddleware, viewWishlist);

// Route for removing an item from the wishlist
router.delete('/wishlist/:itemId', CustomerAuthMiddleware, removeItemFromWishlist);

// Route for clearing the wishlist
router.delete('/wishlist',  CustomerAuthMiddleware, clearWishlist);

router.post('/order',  CustomerAuthMiddleware, createOrder);
router.get('/order/:orderId',  CustomerAuthMiddleware, getOrderById);
router.get('/myorders',  CustomerAuthMiddleware, getCustomerOrders);
router.put('/orderId/:orderId',  CustomerAuthMiddleware, cancelOrder);
router.post('/confirmorder',  CustomerAuthMiddleware, confirmOrder);

router.post('/address', CustomerAuthMiddleware, createShippingAddress);

// Route for getting all shipping addresses for the authenticated user
router.get('/youraddress', CustomerAuthMiddleware, getAllShippingAddresses);

// Route for getting a specific shipping address by ID
router.get('/address/:addressId',  CustomerAuthMiddleware, getShippingAddressById);

// Route for updating a shipping address
router.put('/address/:addressId',  CustomerAuthMiddleware, updateShippingAddress);

// Route for deleting a shipping address
router.delete('/address/:addressId', CustomerAuthMiddleware, deleteShippingAddress);

//router.post('/payment/:userId', CustomerAuthMiddleware,userPaymentDetails );

// Route for creating a new payment

//Get all product
/*router.get('/product',  CustomerAuthMiddleware, getAllProducts);
router.get('/product/:id',  CustomerAuthMiddleware, getProductById);*/
router.post('/checkoutsession',Checkout)
router.get('/checkoutaddress',getcheckoutAddress)
router.post('/clearorderitem',clearcartItem)
export default router;
