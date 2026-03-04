import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {

        userID: {
            type: String,
            required: true,
            trim: true,
        },

        orderId: {
            type: String,
            required: true,
            trim: true,
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        address1: {
            type: String,
            required: true,
            trim: true,
        },

        address2: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        zipcode: {
            type: String,
            required: true,
            trim: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
        },

        paymentStatus: {
            type: String,
            required: true,
            trim: true,
            default: "Pending",
        },

        deliveryStatus: {
            type: String,
            required: true,
            trim: true,
            default: "Pending",
        },

        hasData: {
            type: Array,
            default: [],
            required: true,
        },
        pdf: {
            type: String,
            required: true,
            trim: true,
        },

        PrescriptionImage: {
            type: String,
            required: false,
            trim: true,
        },
        grandTotal: {
            type: Number,
            required: true,
            trim: true,
        },


    },
    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;