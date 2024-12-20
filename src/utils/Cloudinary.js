import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log(localFilePath);

    try {
        if (!localFilePath) {
            console.log("Local File Path is not found!");
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("Uploaded:", response.url);
        return response;
    } 
    catch (error) {
        console.error("Cloudinary Error:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };