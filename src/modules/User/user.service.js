import User from "../../db/models/User.model.js";
import {
	findAll,
	findByIdAndUpdate,
	findOne,
	remove,
	updateOne,
} from "../../db/services/db.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
	cloudinaryConfig,
	deleteFromCloudinary,
	uploadToCloudinary,
} from "../../utils/cloudinary.js";
import roleEnum from "../../utils/roleEnum.js";
import { encrypt } from "../../utils/security.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
	if (!req.user || req.user.role !== roleEnum.admin) {
		return next(new Error("Unauthorized access", { cause: 403 }));
	}
	const users = await findAll(User);
	return res.json({
		message: "Users fetched successfully",
		data: users,
	});
});
export const getUserById = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await findOne(
		User,
		{
			_id: userId,
			confirmEmail: { $exists: true },
		},
		{
			password: 0,
			otp: 0,
		},
		{
			path: "messages",
			select: "content sender createdAt",
		}
	);
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	return res.json({
		message: "User fetched successfully",
		data: user,
	});
});
export const updateUserById = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const { name, phone } = req.body;
	if (req.user.id.toString() !== userId) {
		return next(new Error("Unauthorized access", { cause: 403 }));
	}
	const user = await findOne(
		User,
		{
			_id: userId,
			confirmEmail: { $exists: true },
		},
		{
			password: 0,
			otp: 0,
		}
	);
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	let encryptedPhone;
	if (phone) {
		encryptedPhone = encrypt({
			plainText: phone,
			secretKey: process.env.PHONE_SECRET_KEY,
		});
	}
	const updatedUser = await updateOne(
		User,
		{ _id: userId },
		{ name, phone: encryptedPhone }
	);
	return res.json({
		message: "User updated successfully",
		data: {
			user: updatedUser,
		},
	});
});
export const freezeAccount = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	if (userId && req.user.role !== roleEnum.admin) {
		return next(
			new Error("Only admins can freeze other users' accounts", { cause: 403 })
		);
	}
	const user = await findByIdAndUpdate(
		User,
		{ _id: userId || req.user.id, deletedAt: { $exists: false } },
		{ deletedAt: Date.now(), deletedBy: req.user.id }
	);
	res.status(200).json({
		message: "Account frozen successfully",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const restoreAccount = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await findByIdAndUpdate(
		User,
		{ _id: userId, deletedAt: { $exists: true }, deletedBy: { $ne: userId } },
		{
			deletedAt: null,
			deletedBy: null,
			restoredBy: req.user.id,
			restoredAt: Date.now(),
		}
	);
	res.status(200).json({
		message: "Account restored successfully",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const deleteAccount = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await remove(User, {
		_id: userId,
		deletedAt: { $exists: true },
	});
	res.status(200).json({
		message: "Account Deleted successfully",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const uploadProfilePicture = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await findOne(User, { _id: userId });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	if (!req.file) {
		return next(new Error("No file uploaded", { cause: 400 }));
	}

	const cloudinaryUpload = await uploadToCloudinary(
		req.file.path,
		`users/${userId}`
	);
	const profilePictureURL = cloudinaryUpload.secure_url;
	const profilePicturePublicID = cloudinaryUpload.public_id;
	const updatedUser = await updateOne(
		User,
		{ _id: userId },
		{
			avatar: {
				public_id: profilePicturePublicID,
				url: profilePictureURL,
			},
		}
	);
	return res.json({
		message: "Profile picture uploaded successfully",
		data: { user: updatedUser },
	});
});
export const deleteUserImage = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await findOne(User, { _id: userId });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	if (!user.avatar || !user.avatar.public_id) {
		return next(new Error("No image to delete", { cause: 400 }));
	}
	await deleteFromCloudinary(user.avatar.public_id);
	const updatedUser = await updateOne(User, { _id: userId }, { avatar: null });
	return res.json({
		message: "User image deleted successfully",
		data: { user: updatedUser },
	});
});
