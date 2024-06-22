import mongoose from "mongoose";

const OrderCakeSchema = new mongoose.Schema(
  {
    shablonCakeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ShablonCake",
    },
    tasteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Taste",
    },
    number: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    words: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OrderCake", OrderCakeSchema);
