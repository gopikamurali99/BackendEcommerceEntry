import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
               
            },
            name:{
                type: String,
                required: true,

            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            sizes: [
                {
                  type: String,
                  required: true,
                },
              ],
              images: [
                {
                  type: String,
                  required: true,
                },
              ],
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingDetails: {
        name: { type: String, required: true },
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String},
            state: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
        email: { type: String },
        phone: { type: String },
       
    },
   
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updatedAt field on save
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;