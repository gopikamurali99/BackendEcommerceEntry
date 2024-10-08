// controllers/wishlistController.js
import mongoose from 'mongoose'; 
import Wishlist from '../../model/CustomerRelatedModels/wishlistModel.js'; // Import your Wishlist model
import Product from '../../model/PrductRelatedModels/productModel.js'; // Import your Product model

// Add item to wishlist
export const addItemToWishlist = async (req, res) => {
    try {
        const { productId,sizes } = req.body; // Get product ID from request body
        const userId = req.user.id; // Get the authenticated user's ID
     
        if (!productId || !sizes) {
            return res.status(400).json({ message: 'Product ID and sizes are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

         
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        else{
            console.log('product is valid')
        }
     

        // Find the user's wishlist or create a new one
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }
        console.log('Wishlist found:', wishlist);
        console.log('Product ID:', productId);
        console.log('Sizes:', sizes);

        if (!Array.isArray(wishlist.items)) {
            wishlist.items = [];
        }
        // Check if the item already exists in the wishlist
        const existingItem = wishlist.items.find(item => item.product && item.product.toString() === productId && item.sizes === sizes);

    if (existingItem) {
      return res.status(400).json({ message: 'Item with this size already exists in the wishlist' });
    }

        // Add new item to the wishlist
        wishlist.items.push({ product: productId, sizes: sizes });
        await wishlist.save(); // Save the wishlist
        
        res.status(200).json({ message: 'Item added to wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to wishlist', error: error.message });
    }
};

// View wishlist
export const viewWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product', 'name price images sizes'); // Populate product details

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving wishlist', error: error.message });
    }
};

// Remove item from wishlist
export const removeItemFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.params; // Get item ID from URL parameters
        const userId = req.user.id; // Get the authenticated user's ID

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Remove the item from the wishlist
        wishlist.items.pull(itemId);
        await wishlist.save(); // Save the wishlist

        res.status(200).json({ message: 'Item removed from wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from wishlist', error: error.message });
    }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        await Wishlist.findOneAndDelete({ user: userId }); // Delete the user's wishlist

        res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
    }
};