// Import the necessary libraries
import Stripe from "stripe";
import Cart from "../../model/CustomerRelatedModels/CartModel.js";
import Order from "../../model/CustomerRelatedModels/OrderModel.js" 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Route to create a Stripe Checkout session
export const Checkout = async (req, res) => {
    const { items } = req.body;

    try {
        // Log the items being processed
        console.log("Items:", items);
        
        const lineItems = items.map((item) => {
            const validImages = item.product.images.filter(image => typeof image === 'string' && image.trim() !== '');
            if (validImages.length === 0) {
                console.error(`Product ID: ${item.product._id} has no valid images.`);
            }
            items.forEach(item => {
                console.log(`Product: ${item.product.name}, Images:`, item.product.images);
            });
           
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.product.name,
                        images: validImages,
                    },
                    unit_amount: item.product.price * 100,
                },
                quantity: item.quantity,
            };
            
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['IN', 'US', 'CA'],  // Allow shipping to certain countries (e.g., India, US, Canada)
              },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/paymentsuccess`,
            cancel_url: `${process.env.BASE_URL}/paymentCancel`,
        });
        
        
        res.json({id: session.id });
        console.log("sessionId",session.id)
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
};



// Endpoint to fetch checkout session details
export const getcheckoutAddress = async (req, res) => {
    const sessionId = req.query.session_id;  
    console.log('Session ID from request:', sessionId);  // Ensure this logs the session ID
  
    if (!sessionId) {
      console.error('No session ID in request');
      return res.status(400).json({ error: 'No session ID provided' });
    }
  
    try {
      console.log('Fetching session details from Stripe...');
      const session = await stripe.checkout.sessions.retrieve(sessionId,{
        expand: ['line_items.data.price.product']
      });
      console.log('Session data from Stripe:', session); 

      const customerDetails = session.customer_details;
      const purchasedItems = session.line_items.data.map(item => ({
        
        name: item.description,
        quantity: item.quantity,
        images: item.price.product.images,
        sizes:item.sizes,
        price: item.amount_subtotal / 100,
        // Ensure each property exists before using it
     // Fallback to 0 if price is missing
        
      }));
      console.log("purchased item:",purchasedItems)
      console.table(purchasedItems);

      const newOrder = await Order.create({
        customer: req.user.id, 
        items: purchasedItems,
        totalAmount: session.amount_total / 100,
        shippingDetails: {
          email: session.customer_details.email,
          name: session.shipping_details.name, // Convert to currency
        address: {
            line1: customerDetails.address.line1,
            city: customerDetails.address.city,
            state: customerDetails.address.state,
            postal_code: customerDetails.address.postal_code,
            country: customerDetails.address.country,
        }},
        status: 'Completed',
    });
    console.log("Order saved:", newOrder);
    
      res.status(200).json({
        shippingDetails: session.shipping_details,
        orderId: session.id,
        items: purchasedItems 
      });
     
    } catch (error) {
      console.error('Error fetching checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

export const clearcartItem = async (req, res) => {
    const { userId, itemIds } = req.body;
  
    try {
      // Find the user's cart by userId
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      // Remove the items that were purchased by filtering them out
      cart.items = cart.items.filter(item => !itemIds.includes(item._id.toString()));
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Selected items removed from cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure user authentication to get the user's ID
        const orders = await Order.find({ customer: userId }).populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};

