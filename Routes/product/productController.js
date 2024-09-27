import Product from "../../model/PrductRelatedModels/productModel.js"; // Import the Product model

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

getRelatedProducts: async (req, res) => {
  try {
    const { category } = req.params;
    
    // Fetch related products based on category, excluding the current product
    const relatedProducts = await Product.find({ category, _id: { $ne: req.params.id } }).limit(8); // Limit to 4 for example
    
    if (relatedProducts.length === 0) {
      return res.status(404).json({ message: 'No related products found' });
    }
    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
}

export default productController;


