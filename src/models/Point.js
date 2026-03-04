import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
    {


        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // reference to your User model
            required: true,
        },
        point: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// Prevent redefining in watch mode / hot reload
const Point = mongoose.models.Point || mongoose.model("Point", pointSchema);

export default Point;
