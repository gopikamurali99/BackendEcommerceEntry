// controllers/paymentController.js
import mongoose from "mongoose";
import Payment from '../../model/CustomerRelatedModels/PaymentModel.js'; // Import your Payment model
import Order from '../../model/CustomerRelatedModels/OrderModel.js'; // Import your Order model

// Create a new payment
export const createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amount, transactionId } = req.body; // Get payment details from request body
        const userId = req.user.id; // Get the authenticated user's ID
        console.log('User ID:', req.user.id);
        console.log('Request Body:', req.body);
        // Check if the order exists
        const order = await Order.findById(orderId);
        console.log('Order ID:', order);
        console.log('Order ID:', orderId);
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
     

        // Create a new payment
        const newPayment = new Payment({
            order: orderId,
            customer: userId,
            paymentMethod,
            amount,
            transactionId,
            status: 'Pending', // Initial status
        });

        await newPayment.save(); // Save the new payment
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }

};

// Get all payments (admin only)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order').populate('customer', 'name email'); // Populate order and customer details
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
};

// Get a specific payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params; // Get payment ID from URL parameters
        const payment = await Payment.findById(paymentId).populate('order').populate('customer', 'name email'); // Populate order and customer details

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payment', error: error.message });
    }
};

// Update the status of a payment (admin only)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params; // Get payment ID from URL parameters
        const { status } = req.body; // Get new status from request body

        // Check if the status is valid
        const validStatuses = ['Pending', 'Successful', 'Failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment status updated successfully', payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};