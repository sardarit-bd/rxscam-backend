import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },

        email: {
            type: String,
            trim: true,
            default: "",
            validate: {
                validator: function (v) {
                    if (v === "") return true; // allow empty
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // basic email regex
                },
                message: "Invalid email format",
            },
        },

        subject: {
            type: String,
            required: [false, "Subject is required"],
            trim: true,
            minlength: [5, "Subject should be at least 5 characters"],
            maxlength: [100, "Subject cannot exceed 100 characters"],
        },

        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [5, "Message should be at least 5 characters"],
            maxlength: [5000, "Message cannot exceed 5000 characters"],
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
