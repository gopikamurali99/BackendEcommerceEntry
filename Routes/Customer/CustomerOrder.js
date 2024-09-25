// controllers/orderController.js
import UserPaymentModel from "../../model/CustomerRelatedModels/PaymentModel.js"; // Import your Payment model
import Order from '../../model/CustomerRelatedModels/OrderModel.js';//order model
import Stripe from "stripe"; // Import stripe 
import Product from "../../model/PrductRelatedModels/productModel.js";
import Cart from "../../model/CustomerRelatedModels/CartModel.js";
import ShippingAddress from "../../model/CustomerRelatedModels/ShippimgAddress.js";// Import your Cart model (if needed)

// Create a new order


const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
// Add or update shipping address

export const userPaymentDetails =async (req, res) => {
    const { amount, items } = req.body;
    
    console.log('req.body is',req.body); // Log the request body
    console.log('secret key is',process.env.STRIPE_SECRET_KEY)
       const userId = req.params.userId
    try {

        // Convert amount to paisa (smallest unit)
        const amountInPaisa = amount * 100;

        // Create a Payment Intent with INR as the currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa,  // Amount in paisa (e.g., 50000 paisa for ₹500)
            currency: 'inr',  // Set currency to Indian Rupee
            payment_method_types: ['card'],
            
        });


        // Calculate total amount based on items (in case you want to verify the total)
        const calculatedAmount = items.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);

         

        // Save the payment details in the database
        const payment = new UserPaymentModel({
            userId: userId,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            currency: "inr",  // Currency set to INR
            paymentMethod:"card",  // Can be dynamic depending on the user's choice
            status: paymentIntent.status,
            transactionId: paymentIntent.id,  // Use the paymentIntent ID as the transaction ID
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                images: item.images,
                sizes: item.sizes,
                totalAmount: item.quantity * item.price,
            })),
        
        
        });

        await payment.save();

        res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body; // Get items and total amount from request body
        const userId = req.user.id; // Get the authenticated user's ID

        // Create a new order
        const newOrder = new Order({
            customer: userId,
            items,
            totalAmount,
        });

        await newOrder.save(); // Save the new order

        // Optionally, clear the user's cart after creating the order
        await Cart.findOneAndDelete({ user: userId });

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};




// Get a specific order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params; // Get order ID from URL parameters
        const order = await Order.findById(orderId).populate('customer', 'name email'); // Populate customer details

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};

// Get all orders for the authenticated customer
export const getCustomerOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const orders = await Order.find({ customer: userId }).populate('items.product'); // Populate product details

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer orders', error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Get order ID from URL parameters
        const userId = req.user.id; // Get the authenticated user's ID

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the user
        if (!order.customer.equals(userId)) {
            return res.status(403).json({ message: 'You are not authorized to cancel this order' });
        }

        // Check the order status to determine if it can be canceled
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be canceled at this stage' });
        }

        // Update the order status to canceled
        order.status = 'Cancelled';
        await order.save(); // Save the changes

        res.status(200).json({ message: 'Order canceled successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling order', error: error.message });
    }
};