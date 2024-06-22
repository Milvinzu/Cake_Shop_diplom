import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderCakesIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'OrderCake',
        required: false,
    },
    bakeryIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'RegularBakery',
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['created','paid', 'processing', 'cooking', 'done', 'on the wayg','delivered'],
        default: 'created',
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },  
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model('Order', OrderSchema);
