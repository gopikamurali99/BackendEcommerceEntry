import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const adminSchema = new mongoose.Schema({
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
    verified: {
        type: Boolean,
        default: false, 
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
    },
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;


