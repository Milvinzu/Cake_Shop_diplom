import mongoose from 'mongoose';

const SpecialCakeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['sent','recieved','paid', 'processing', 'cooking', 'done', 'on the way','delivered'],
        default: 'sent',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('SpecialCake', SpecialCakeSchema);
