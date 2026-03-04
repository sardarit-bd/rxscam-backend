import { cloudinary } from "../config/cloudinary.js";

const uploadFilesToCloudinary = async (files) => {
    try {
        if (!files || !files.length) return [];

        const uploads = files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(
                    file?.img?.base64 || file?.img,
                    {
                        folder: "spexnation",
                        resource_type: "auto",
                    },
                    (err, result) => {
                        if (err) {
                            console.error("Cloudinary Upload Error:", err);
                            reject(err);
                        } else {
                            resolve({
                                ...file,                 // keep full object
                                img: result.secure_url   // replace base64 with URL
                            });
                        }
                    }
                );
            });
        });

        return await Promise.all(uploads);

    } catch (error) {
        console.error("Upload Error:", error);
        return [];
    }
};

export default uploadFilesToCloudinary;