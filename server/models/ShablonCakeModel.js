import mongoose from 'mongoose';

const ShablonCakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
    },
    weight:{
        type: String, 
        required: false,
    },
    img: {
        type: String, 
        required: false,
    }
}, {
    timestamps: true,
});

export default mongoose.model('ShablonCake', ShablonCakeSchema);
