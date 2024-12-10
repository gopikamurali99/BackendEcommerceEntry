
import Cart from '../../model/CustomerRelatedModels/CartModel.js'; 
import Product from '../../model/PrductRelatedModels/productModel.js'; 


export const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity,sizes} = req.body; 
        const userId = req.user.id; 

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

       
        const existingItem = cart.items.find(
            item => item.product.toString() === productId && item.sizes === sizes
        );

        if (existingItem) {
            
            existingItem.quantity += quantity;
        } else {
            
            cart.items.push({ product: productId, quantity, sizes});
        }

        await cart.save(); 
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};


export const viewCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        const cart = await Cart.findOne({ user: userId }).populate('items.product'); 

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error: error.message });
    }
};


export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params; 
        const { quantity } = req.body; 
        const userId = req.user.id; 


        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        
        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: 'Cart item updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};


export const removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params; 
        const userId = req.user.id; 

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};


export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        await Cart.findOneAndDelete({ user: userId }); 

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};
