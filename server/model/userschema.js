import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String, // Keep it String unless storing nested objects
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    profilePic: {  // Changed `profile` to `profilePic` for consistency
        type: String,
        required: false // Allow registration without an image
    },
    role: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
