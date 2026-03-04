import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {


        otp: {
            type: Number,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },

        userId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// Prevent redefining in watch mode / hot reload
const OTP = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default OTP;
