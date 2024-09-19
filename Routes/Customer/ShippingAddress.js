// controllers/shippingAddressController.js
import ShippingAddress from '../../model/CustomerRelatedModels/ShippimgAddress.js'; // Import your ShippingAddress model

// Create a new shipping address
export const createShippingAddress = async (req, res) => {
    try {
        const { name, address1, address2, city, state, country, zipCode, phone, addressType } = req.body;
        const userId = req.user.id; // Get the authenticated user's ID

        const newAddress = new ShippingAddress({
            user: userId,
            name,
            address1,
            address2,
            city,
            state,
            country,
            zipCode,
            phone,
            addressType,
        });

        await newAddress.save(); // Save the new shipping address
        res.status(201).json({ message: 'Shipping address created successfully', address: newAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error creating shipping address', error: error.message });
    }
};

// Get all shipping addresses for the authenticated user
export const getAllShippingAddresses = async (req, res) => {
    
    console.log('hii');

    try {
        const userId = req.user.id; // Get the authenticated user's ID
        console.log('User ID:', userId);
        console.log('hii');
        console.log('ID being queried:', req.params.id)
        const addresses = await ShippingAddress.find({ user: userId }); // Find addresses for the user

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving shipping addresses', error: error.message });
    }
};

// Get a specific shipping address by ID
export const getShippingAddressById = async (req, res) => {
    try {
        const { addressId } = req.params; // Get address ID from URL parameters
        const address = await ShippingAddress.findById(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Shipping address not found' });
        }

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving shipping address', error: error.message });
    }
};

// Update a shipping address
export const updateShippingAddress = async (req, res) => {
    try {
        const { addressId } = req.params; // Get address ID from URL parameters
        const updatedAddress = await ShippingAddress.findByIdAndUpdate(addressId, req.body, { new: true });

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Shipping address not found' });
        }

        res.status(200).json({ message: 'Shipping address updated successfully', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating shipping address', error: error.message });
    }
};

// Delete a shipping address
export const deleteShippingAddress = async (req, res) => {
    try {
        const { addressId } = req.params; // Get address ID from URL parameters
        const deletedAddress = await ShippingAddress.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Shipping address not found' });
        }

        res.status(200).json({ message: 'Shipping address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shipping address', error: error.message });
    }
};