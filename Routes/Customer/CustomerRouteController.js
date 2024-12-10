import Customer from "../../model/CustomerRelatedModels/CustomerModel.js"
import { sendEmail } from '../../utils/email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import mongoose from "mongoose";

//sign-up 
export const signup = async (req,res)=>{

    const {Name,email,password}= req.body;

    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if(!passwordRegex.test(password)){
        return res.status(400).json({message:'Password must be atleast  8 characters long and include a number, a lowercase letter, an uppercase letter, and a special character.'})
    }
    const existingCustomer = await Customer.findOne({ email })
    if(existingCustomer){
        return res.status(400).json({message:'Customer already exist'})
    }
     const hashedPassword = await bcrypt.hash(password,10);
     const newCustomer= new Customer({Name,email,password: hashedPassword})
    
     await newCustomer.save()

    //send varification email
    const verificationToken= jwt.sign({id: newCustomer._id}, process.env.JWT_SECRET_CUSTOMER,{expiresIn: '1h'});
    const verificationLink=`${process.env.BASE_URL}/customer/verify/${verificationToken}`;
     
    await sendEmail(email,'Emaile verfication',`Please verify your email by clicking the link: ${verificationLink}`)
    res.status(201).json({ message: 'Account created. Please verify your email.' });
    console.log(newCustomer)
};
 
//email verification
export const verifyEmail= async (req,res)=>{
    const {token} = req.params;
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_CUSTOMER);
        const customer = await Customer.findById(decoded.id);
        if(!customer) return res.status(404).json({message:'Customer not found'});

        customer.isActive = true;
        await customer.save();
        res.json({ message: 'Email verified successfully' });
    }
    catch(error){
        res.status(400).json({message:'Invalid or expired token'})
    }

};

//login
export const signin = async (req, res) => {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email })
   if(!customer || !(await bcrypt.compare(password,customer.password))){

       return res.status(401).json({message:'invalid email or password'});
   }
   const token = jwt.sign({id: customer._id},process.env.JWT_SECRET_CUSTOMER,{expiresIn:'1h'});
   res.cookie('token', token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000, // Cookie expiration time (1 hour)
});
res.json({ token, name: customer.Name,userId:customer._id });
}; 

//logout
export const signout = (req, res) => {
    // Invalidate the token on the client side
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
};

export const getCustomerById = async (req, res) => {
    try {
        const { customerId } = req.params; // Get customer ID from URL parameters
        const customer = await Customer.findById(customerId);
         // Fetch customer by ID
         console.log('Received customerId:', customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer, name: customer.Name });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error: error.message });
    }
};


    
