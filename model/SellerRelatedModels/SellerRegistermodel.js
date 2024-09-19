import mongoose from "mongoose";

const sellerRegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    }, 
    verified: {
        type: Boolean,
        default: false, 
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verificationToken: {
        type: String,
        default: null, 
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    }
},
    {timestamps: true});

const SellerModel = mongoose.model('Seller', sellerRegisterSchema);

export default SellerModel