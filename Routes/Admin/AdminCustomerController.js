// controllers/adminCustomerController.js
import Customer from '../../model/CustomerRelatedModels/CustomerModel.js'; // Import your Customer model

// Get all customers
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers from the database
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error: error.message });
    }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const { customerId } = req.params; // Get customer ID from URL parameters
        const customer = await Customer.findById(customerId); // Fetch customer by ID

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error: error.message });
    }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
    try {
        const { customerId } = req.params; // Get customer ID from URL parameters
        const deletedCustomer = await Customer.findByIdAndDelete(customerId); // Delete the customer

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

// Activate or deactivate a customer
export const activateCustomer = async (req, res) => {
    try {
        const { customerId } = req.params; // Get customer ID from URL parameters
        const customer = await Customer.findById(customerId); // Find the customer

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Toggle the isActive status
        customer.isActive = !customer.isActive;
        await customer.save();

        res.status(200).json({ message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`, customer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer status', error: error.message });
    }
};


