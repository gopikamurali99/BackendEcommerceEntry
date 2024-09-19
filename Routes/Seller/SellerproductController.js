// controllers/sellerProductController.js
import SellerProduct from '../../model/SellerRelatedModels/SellerProductModel.js';

export const addProduct = async (req, res) => {
    try {
        const newProduct = new SellerProduct({ ...req.body, seller: req.user.id });
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error: error.message });
    }
};



// Update an existing product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedProduct = await SellerProduct.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await SellerProduct.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product', error: error.message });
    }
};

// View a specific product
export const viewProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await SellerProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving product', error: error.message });
    }
};

// View approved products
export const viewApprovedProducts = async (req, res) => {
    try {
        const approvedProducts = await SellerProduct.find({ seller: req.user.id, approved: true });
        res.status(200).json(approvedProducts);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving approved products', error: error.message });
    }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await SellerProduct.find(); 
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};