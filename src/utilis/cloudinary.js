import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || jawadmughaldev,
    api_key: process.env.CLOUDINARY_API_KEY || 273434779457487,
    api_secret: process.env.CLOUDINARY_API_SECRET || "Gu3a2tA5-1SiWA9IGP40NNprMWU"
});

const uploadCloudinary = async (localFilePath) => {

    try {
        console.log(localFilePath)
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file uploaded on cloudinary")
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {

        fs.unlinkSync(localFilePath)
        console.log("file is not uploaded on cloudinary ")
        return null;
    }
}

export { uploadCloudinary }