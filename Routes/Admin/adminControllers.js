// controllers/adminController.js
import Admin from '../../model/AdminModel/AdminModel.js';
import { sendEmail } from '../../utils/adminemail.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'


import jwt from 'jsonwebtoken';

// Admin signup
export const signup = async (req, res) => {
    const { Name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
   // const admin = new Admin({ Name, email, password: hashedPassword }); // Store the hashed password
    const admin = new Admin({ Name, email, password });
    const verificationToken = crypto.randomBytes(32).toString('hex')// Simple token generation
    console.log('Verification token generated:', verificationToken);
    admin.verificationToken = verificationToken;

    await admin.save();

    const verificationLink = `http://localhost:5173/admin/verify/${verificationToken}`;
    await sendEmail(email, 'Email Verification', `Please verify your email by clicking the link: ${verificationLink}`);

    res.status(201).json({ message: 'You are an admin now. Please verify your email.' });
};

// Email verification
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    console.log('Received token:', token); 
    const admin = await Admin.findOne({ verificationToken: token });
    console.log('Admin found:', admin);
    
    if (!admin) {
        console.log('No admin found with this token'); 
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    admin.verified = true;
    admin.verificationToken = null; // Clear the token
    await admin.save();
    res.json({ message: 'Email verified successfully' });
};

// Admin login
export const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
        console.log('No admin found with this email');
        return res.status(401).json({ message: 'Invalid email or password' });
    }
      const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }
    if (!admin.verified) {

        return res.status(403).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // Cookie expiration time (1 hour)
    });
    res.json({ message: 'Login successful', token });
};

// Admin logout
export const logout = (req, res) => {
    // Invalidate the token by removing it from the client side
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
};