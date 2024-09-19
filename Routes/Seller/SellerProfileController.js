// controllers/sellerProfileController.js
import SellerProfile from '../../model/SellerRelatedModels/SellerProfileModel.js';

// Add a new seller profile
export const addSellerProfile = async (req, res) => {
    try {
        const newProfile = new SellerProfile(req.body);
        await newProfile.save();
        res.status(201).json({ message: 'Seller profile created successfully', profile: newProfile });
    } catch (error) {
        res.status(400).json({ message: 'Error creating seller profile', error: error.message });
    }
};

// Get all seller profiles
export const getAllSellerProfiles = async (req, res) => {
    try {
        const profiles = await SellerProfile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving seller profiles', error: error.message });
    }
};

// Get a specific seller profile by ID
export const getSellerProfileById = async (req, res) => {
    try {
        const profile = await SellerProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving seller profile', error: error.message });
    }
};

// Update a seller profile
export const updateSellerProfile = async (req, res) => {
    try {
        const profile = await SellerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profile) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }
        res.status(200).json({ message: 'Seller profile updated successfully', profile });
    } catch (error) {
        res.status(400).json({ message: 'Error updating seller profile', error: error.message });
    }
};

// Delete a seller profile
export const deleteSellerProfile = async (req, res) => {
    try {
        const profile = await SellerProfile.findByIdAndDelete(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }
        res.status(200).json({ message: 'Seller profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting seller profile', error: error.message });
    }
};