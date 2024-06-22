import mongoose from 'mongoose';

const RegularBakerySchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    weight:{
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    img: {
        type: String, 
        required: false,
    }
}, {
    timestamps: true,
});

export default mongoose.model('RegularBakery', RegularBakerySchema);
