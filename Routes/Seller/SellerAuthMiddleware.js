// routes/SellerRoutes/sellerMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
     // Extract token from the Authorization header
     console.log('Received Token:', token); 
     
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER); // Verify the token
        req.user = decoded; // Attach the decoded user info to the request object
        next(); 
        console.log('Decoded User:', req.user);// Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token Verification Error:', error.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};