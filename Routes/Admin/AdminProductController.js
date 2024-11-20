
import Product from '../../model/PrductRelatedModels/productModel.js'; 
import Category from '../../model/PrductRelatedModels/CategoryModel.js';


// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};




export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params; 
        const product = await Product.findById(productId); 

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params; 
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

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
        const { productId } = req.params; // Get product ID from URL parameters
        const deletedProduct = await Product.findByIdAndDelete(productId); // Delete the product

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

export const addCategory= async(req,res)=>{
    try {
        const {name,subCategory, images, description}=req.body;
        const newCategory = new Category({
            name,
            subCategory,
            images,
            description,
        });
        await newCategory.save();
        res.status(201).json({message:"Category added successfully!",category: newCategory})        
    } catch (error) {
        
    }
}

export const getAllCategory = async (req,res)=>{
    try {
        const category = await Category.find();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category', error: error.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params; 
        const category = await Category.findById(categoryId); 

        if (!category) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};