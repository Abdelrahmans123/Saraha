import { v2 as cloudinary } from "cloudinary";
export const cloudinaryConfig = () => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true,
	});
	return cloudinary;
};
export const uploadToCloudinary = async (filePath, folder) => {
	const cloudinary = cloudinaryConfig();
	return await cloudinary.uploader.upload(filePath, {
		folder: `${process.env.APP_NAME}/${folder}`,
	});
};
export const deleteFromCloudinary = async (publicId) => {
	const cloudinary = cloudinaryConfig();
	return await cloudinary.uploader.destroy(publicId);
};
export const uploadManyToCloudinary = async (files, folder) => {
	const results = [];
	for (const file of files) {
		const uploaded = await uploadToCloudinary(file.path, folder);
		results.push({
			url: uploaded.secure_url,
			public_id: uploaded.public_id,
		});
	}
	return results;
};
