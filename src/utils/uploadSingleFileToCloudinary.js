import { cloudinary } from "../config/cloudinary.js";

const uploadSingleFileToCloudinary = async (fileData) => {
    try {
        if (!fileData) return null;

        const result = await cloudinary.uploader.upload(fileData, {
            folder: "spexnation",
            resource_type: "auto", // supports pdf, image, etc.
        });

        return result.secure_url;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export default uploadSingleFileToCloudinary;