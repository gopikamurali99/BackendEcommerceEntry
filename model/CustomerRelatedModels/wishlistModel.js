import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
        required: true,
    },
    items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          sizes: {
            type: String,  // Store the size
            required: true,
          }
        }
      ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


wishlistSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;