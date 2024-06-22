import mongoose from 'mongoose';

const TasteSchema = new mongoose.Schema({
    cakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShablonCake',
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
    img: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Taste', TasteSchema);
