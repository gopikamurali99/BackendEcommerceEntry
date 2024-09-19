// controllers/cartController.js
import Cart from '../../model/CustomerRelatedModels/CartModel.js'; // Import your Cart model
import Product from '../../model/PrductRelatedModels/productModel.js'; // Import your Product model

// Add item to cart
export const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Get product ID and quantity from request body
        const userId = req.user.id; // Get the authenticated user's ID

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            // Update the quantity if it already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ product: productId, quantity });
        }

        await cart.save(); // Save the cart
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// View cart
export const viewCart = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Populate product details

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error: error.message });
    }
};

// Update item in cart
export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params; // Get item ID from URL parameters
        const { quantity } = req.body; // Get new quantity from request body
        const userId = req.user.id; // Get the authenticated user's ID

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the quantity
        item.quantity = quantity;
        await cart.save(); // Save the cart

        res.status(200).json({ message: 'Cart item updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params; // Get item ID from URL parameters
        const userId = req.user.id; // Get the authenticated user's ID

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }// Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();// Save the cart

        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        await Cart.findOneAndDelete({ user: userId }); // Delete the user's cart

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};
