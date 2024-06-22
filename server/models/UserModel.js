import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'customer'
    }
},{
    timestamps: true,
});

export default mongoose.model('User', UserSchema);
