import asyncHandler from "../../utils/asyncHandler.js";
import * as DBService from "../../db/services/db.service.js";
import User from "../../db/models/User.model.js";
import { uploadManyToCloudinary } from "../../utils/cloudinary.js";
import Message from "../../db/models/Message.model.js";
export const sendMessage = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { message } = req.body;
	let attachments = [];
	const user = await DBService.findOne(
		User,
		{
			_id: id,
			deleteAt: { $exists: false },
			confirmEmail: { $exists: true },
		},
		{
			password: 0,
			otp: 0,
		}
	);
	if (!user) {
		return res.status(404).json({
			message: "User not found",
		});
	}
	if (req.files && req.files.length > 0) {
		attachments = await uploadManyToCloudinary(req.files, `messages/${id}`);
	}
	const messages = await DBService.create(Message, {
		sender: req.user?._id,
		receiver: id,
		content: message,
		attachments,
	});
	res.status(201).json({
		message: "Message sent successfully",
		data: {
			messages,
		},
	});
});
export const deleteMessage = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const message = await DBService.findOne(Message, {
		_id: id,
		deletedAt: { $exists: true },
	});
	if (!message) {
		return res.status(404).json({
			message: "Message not found",
		});
	}
	if (message.sender.toString() !== req.user?._id.toString()) {
		return res.status(403).json({
			message: "Unauthorized access",
		});
	}
	await DBService.remove(Message, { _id: id });
	res.status(200).json({
		message: "Message deleted successfully",
	});
});
export const getMessageById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const message = await DBService.findOne(Message, {
		_id: id,
		deletedAt: { $exists: false },
	});
	if (!message) {
		return res.status(404).json({
			message: "Message not found",
		});
	}
	res.status(200).json({
		message: "Message fetched successfully",
		data: {
			message,
		},
	});
});
export const freezeMessage = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const message = await DBService.findOne(Message, { _id: id });
	if (!message) {
		return res.status(404).json({
			message: "Message not found",
		});
	}
	if (message.sender !== req.user?._id) {
		return res.status(403).json({
			message: "Unauthorized access",
		});
	}
	await DBService.updateOne(
		Message,
		{ _id: id },
		{ deletedAt: Date.now(), deletedBy: req.user.id }
	);
	res.status(200).json({
		message: "Message frozen successfully",
	});
});
export const getAllMessages = asyncHandler(async (req, res) => {
	const messages = await DBService.findAll(Message, {
		deletedAt: { $exists: false },
	});
	res.status(200).json({
		message: "Messages fetched successfully",
		data: {
			messages,
		},
	});
});
