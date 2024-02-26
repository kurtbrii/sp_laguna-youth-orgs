/* eslint-disable @typescript-eslint/no-explicit-any */
// server/cloudinary.js
import cloudinaryLib from 'cloudinary'

const cloudinary = cloudinaryLib.v2

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
})

const cloudinaryUpload = async (filesToUpload: any[]) => {
  try {
    const uploadPromises = filesToUpload.map(async (fileToUpload) => {
      const data = await cloudinary.uploader.upload(fileToUpload, {
        resource_type: "auto",
      });
      return data?.secure_url;
    });

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);

    return uploadedUrls;
  } catch (e) {
    throw new Error("Cloudinary upload failed");
  }
};



export default cloudinaryUpload;
