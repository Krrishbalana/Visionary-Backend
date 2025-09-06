import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null; //if no file path is provided

    //upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded succesfull
    //console.log('file is uploaded on cloudinary: ', response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed(unlinkSync is a synchronous method to delete the file , sync is used to ensure the file is deleted before proceeding further)
    return null;
  }
};

export { uploadOnCloudinary };
