import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema({
    
    address:{
        city:{
            type: String,
            required:true,
            trim: true
        },
        district:{
            type: String,
            required:true,
            trim: true
        },
        state:{
            type: String,
            required:true,
            trim: true
        },
        pin:{
            type: String,
            required:true,
            trim: true
        },
     } ,
    storeName: {
        type: String,
        required:true,
        trim: true
    },
    storeDescription: {
        type: String,
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Reference to the Product model
    }],
   
    bankAccount: {
        accountHolderName: {
            type: String,
            required:true,
            trim: true
        },
        accountNumber: {
            type: String,
            required:true,
            trim: true
        },
        routingNumber: {
            type: String,
            required:true,
            trim: true
        },
        bankName: {
            type: String,
            required:true,
            trim: true
        }
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

const SellerProfile = mongoose.model('SellerProfile', sellerProfileSchema);

export default SellerProfile