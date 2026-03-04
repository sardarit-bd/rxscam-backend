import mongoose from "mongoose";

const couponsSchama = new mongoose.Schema(
    {
        cName: {
            type: String,
            trim: true,
            required: true,
        },

        cCode: {
            type: String,
            trim: true,
            required: true,
        },

        cDiscount: {
            type: Number,
            trim: true,
            required: true,
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.Coupons || mongoose.model("Coupons", couponsSchama);
