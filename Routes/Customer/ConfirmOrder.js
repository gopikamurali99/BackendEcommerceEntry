// controllers/confirmOrderController.js
import Product from '../../model/CustomerRelatedModels/confirmOrder.js'; // Import your Product model
import ShippingAddress from '../../model/CustomerRelatedModels/ShippimgAddress.js'; // Import your ShippingAddress model
import Payment from '../../model/CustomerRelatedModels/PaymentModel.js'; // Import your Payment model

// Confirm an order
export const confirmOrder = async (req, res) => {
    try {
        const { productIds, shippingAddressId, paymentId } = req.body; // Get product IDs, shipping address ID, and payment ID from the request body

        // Fetch product details
        const products = await Product.find({ _id: { $in: productIds } });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Fetch shipping address details
        const shippingAddress = await ShippingAddress.findById(shippingAddressId);
        if (!shippingAddress) {
            return res.status(404).json({ message: 'Shipping address not found' });
        }

        // Fetch payment details
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Prepare the order summary
        const orderSummary = {
            products,
            shippingAddress,
            payment,
            totalAmount: products.reduce((total, product) => total + product.price, 0), // Calculate total amount
        };

        res.status(200).json({ message: 'Order summary prepared successfully', orderSummary });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming order', error: error.message });
    }
};