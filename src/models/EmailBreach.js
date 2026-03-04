import mongoose from "mongoose";


const beach_schema = new mongoose.Schema({
    breach_count: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    is_breached: {
        type: Boolean,
        required: true,
        default: false
    },
    most_react_breach: {
        type: String,
        required: true,
        trim: true
    },
    most_sessitive_Data: {
        type: Array,
        required: true,
        trim: true
    },
    risk_tier: {
        type: String,
        required: true,
        trim: true,
        enum: ["none", "low", "medium", "high", "critical"],
        default: "none",
    }
});



const emailBreachSchema = new mongoose.Schema(
    {
        scan_id: {
            type: String,
            required: true,
            trim: true,
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

        checked_at: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        breach_summary: {
            type: beach_schema,
            required: true,
            trim: true,
        },

        breachs: {
            type: Array,
            required: true,
            trim: true,
        },
        ip: {
            type: String,
            required: true,
            trim: true,
        },
        text: {
            type: String,
            required: true,
            trim: true
        }


    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.EmailBreach || mongoose.model("EmailBreach", emailBreachSchema);
