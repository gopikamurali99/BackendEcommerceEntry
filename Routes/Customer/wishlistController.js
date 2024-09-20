// controllers/wishlistController.js
import Wishlist from '../../model/CustomerRelatedModels/wishlistModel.js'; // Import your Wishlist model
import Product from '../../model/PrductRelatedModels/productModel.js'; // Import your Product model

// Add item to wishlist
export const addItemToWishlist = async (req, res) => {
    try {
        const { productId } = req.body; // Get product ID from request body
        const userId = req.user.id; // Get the authenticated user's ID
     
        const productSam = await Product.findById("66e070a5cbc7374f136ee792");
        if(!productSam){
            console.log("product")
        }
        else{
            console.log("cant find")
        }

         
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's wishlist or create a new one
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        // Check if the item already exists in the wishlist
        if (wishlist.items.includes(productId)) {
            return res.status(400).json({ message: 'Item already exists in the wishlist' });
        }

        // Add new item to the wishlist
        wishlist.items.push(productId);
        await wishlist.save(); // Save the wishlist
        console.log('User ID:', userId);
        console.log('Product ID:', productId);
        res.status(200).json({ message: 'Item added to wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to wishlist', error: error.message });
    }
};

// View wishlist
export const viewWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items', 'name price'); // Populate product details

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