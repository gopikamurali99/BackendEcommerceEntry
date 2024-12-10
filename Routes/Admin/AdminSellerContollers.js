// controllers/adminController.js
import SellerProduct from '../../model/SellerRelatedModels/SellerProductModel.js';
import Product from '../../model/PrductRelatedModels/productModel.js';
import Seller from '../../model/SellerRelatedModels/SellerRegistermodel.js'; // Import your main Product model

// Function to view pending product approval requests
export const viewPendingProducts = async (req, res) => {
    try {
        const pendingProducts = await SellerProduct.find({ approved: false }); // Fetch products that are not approved
        res.status(200).json(pendingProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending products', error: error.message });
    }
};

// Function to approve a product
export const approveProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const productToApprove = await SellerProduct.findById(id);
        if (!productToApprove) {
            return res.status(404).json({ message: 'Product not found' });
        }

       
        productToApprove.approved = true;
        await productToApprove.save();

        // Create a new product instance for the main product model
        const newProduct = new Product({
            name: productToApprove.name,
            description: productToApprove.description,
            price: productToApprove.price,
            category: productToApprove.category,
            brand: productToApprove.brand,
            images: productToApprove.images,
            colors: productToApprove.colors,
            sizes: productToApprove.sizes,
            inventory: productToApprove.inventory,
            sku: productToApprove.sku,
            seller: productToApprove.seller,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }); 

       
        await newProduct.save();

        res.status(200).json({ message: 'Product approved successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error approving product', error: error.message });
    }
};


export const rejectProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await SellerProduct.findByIdAndUpdate(
            id,
            { approved: false },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product rejected successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting product', error: error.message });
    }
};


export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find(); 
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sellers', error: error.message });
    }
};

// Delete a seller
export const deleteSeller = async (req, res) => {
    try {
        const { sellerId } = req.params; 
        const deletedSeller = await Seller.findByIdAndDelete(sellerId); 

        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting seller', error: error.message });
    }
};
export const getAllProductsSeller = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};