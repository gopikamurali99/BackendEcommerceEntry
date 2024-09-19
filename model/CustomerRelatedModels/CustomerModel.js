import mongoose from "mongoose";
//import bcrypt from 'bcrypt';


const customerSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:false,
    },
    
    verificationToken: {
        type: String,
        default: null, 
    },
}, { timestamps: true });

//customerSchema.methods.comparePassword = async function(candidatePassword) {
   // return await bcrypt.compare(candidatePassword, this.password);
//};

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;


