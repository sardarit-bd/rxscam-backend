import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String, required: true },
        base64: { type: String, required: true },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {

        brand: {
            type: String,
            required: true,
            trim: true,
        },

        ProductTitle: {
            type: String,
            required: true,
            trim: true,
        },


        shortdes: {
            type: String,
            required: true,
            default: "",
            trim: true,
        },


        product_price: {
            type: Number,
            default: 0,
            required: true,
            trim: true,
        },




        gender: {
            type: String,
            required: false,
            trim: true,
        },


        weight: {
            type: String,
            required: false,
            trim: true,
        },


        meterial: {
            type: String,
            required: false,
            trim: true,
        },

        fType: {
            type: String,
            required: false,
            trim: true,
        },

        fShape: {
            type: String,
            required: false,
            trim: true,
        },
        lensWidth: {
            type: String,
            required: false,
            trim: true,
        },
        lensHeight: {
            type: String,
            required: false,
            trim: true,
        },
        BridgeWidth: {
            type: String,
            required: false,
            trim: true,
        },
        ArmLength: {
            type: String,
            required: false,
            trim: true,
        },


        // Array of serviceImages (base64 objects)
        product_Images: {
            type: Array,
            required: true,
            validate: {
                validator: (arr) => arr.length > 0,
                message: "At least one product image is required"
            }
        },


        product_Discription: {
            type: String,
            required: true,
            default: "",
            trim: true,
        },



        status: {
            type: String,
            enum: ["In-Stock", "Out-of-Stock",],
            default: "In-Stock",
        },
    },
    {
        timestamps: true,
    }
);

const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
