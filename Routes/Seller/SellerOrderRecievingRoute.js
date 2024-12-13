
import Order from '../../model/CustomerRelatedModels/OrderModel.js'; // Import your Order model


export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id; 

        
        const orders = await Order.find({ 'items.product': { $in: sellerId } }) // Assuming items.product is an array of product IDs
            .populate('items.product') 
            .populate('customer', 'name email'); 

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this seller' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const order = await Order.findById(orderId)
            .populate('items.product') 
            .populate('customer', 'name email'); 

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const { status } = req.body; 

        
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};