// routes/SellerRoutes/sellerControllers.js
import Seller from '../../model/SellerRelatedModels/SellerRegistermodel.js';
import { sendEmail } from '../../utils/email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

// Sign-up
export const signup = async (req, res) => {
    const { name, email, password, phone,} = req.body;

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include a number, a lowercase letter, an uppercase letter, and a special character.' });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
        return res.status(400).json({ message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ name, email, password: hashedPassword, phone});
   

    
    await newSeller.save();

    // Send verification email
    const verificationToken = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET_SELLER, { expiresIn: '1h' });
    const verificationLink = `${process.env.BASE_URL}/seller/verify/${verificationToken}`;
    await sendEmail(email, 'Email Verification', `Please verify your email by clicking the link: ${verificationLink}`);

    res.status(201).json({ message: 'Seller created. Please verify your email.' });
};

// Email verification
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER);
        const seller = await Seller.findById(decoded.id);
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        seller.isActive = true; // Activate the seller account
        await seller.save();
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

// Sign-in
export const signin = async (req, res) => {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller || !(await bcrypt.compare(password, seller.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET_SELLER, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // Cookie expiration time (1 hour)
    });
    res.json({ token });
};

// Sign-out
export const signout = (req, res) => {
    // Invalidate the token on the client side
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include a number, a lowercase letter, an uppercase letter, and a special character.' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
    }

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();
    res.json({ message: 'Password reset successfully' });
};

// Create Profile
//export const createProfile = async (req, res) => {
    //const { storeName, storeDescription, bankAccount, gstDetails } = req.body;

    //const sellerId = req.seller.id; // Get seller ID from the authenticated request
    /*const seller = await Seller.findById(sellerId);

    if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
    }

    seller.storeName = storeName;
    seller.storeDescription = storeDescription;
    seller.bankAccount = bankAccount;
    seller.gstDetails = gstDetails;

    await seller.save();
    res.json({ message: 'Profile created successfully', seller });
};*/