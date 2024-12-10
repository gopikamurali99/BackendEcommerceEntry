// controllers/orderController.js
import Order from '../../model/CustomerRelatedModels/OrderModel.js'; 
 



// Get all orders 
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email'); 
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

// Update the status of an order 
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const deletedOrder = await Order.findByIdAndDelete(orderId); 

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};