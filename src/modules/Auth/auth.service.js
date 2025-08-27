import User from "../../db/models/User.model.js";
import {
	create,
	findOne,
	update,
	updateOne,
} from "../../db/services/db.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { generateJWT } from "../../utils/jwt.js";
import { compareHash, encrypt, generateHash } from "../../utils/security.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { customAlphabet, nanoid } from "nanoid";
import Token from "../../db/models/Token.model.js";

export const register = asyncHandler(async (req, res, next) => {
	const { name, password, email, phone, gender, role } = req.body;

	const existingUser = await findOne(User, { email });
	if (existingUser) {
		return next(new Error("Email Already Exist", { cause: 409 }));
	}
	const hashedPassword = generateHash({ plainText: password });
	const encryptPhone = encrypt({
		plainText: phone,
		secretKey: process.env.SECRET_KEY,
	});
	const otp = customAlphabet("0123456789", 6)();
	const otpHash = generateHash({ plainText: otp });
	const newUser = await create(User, {
		name,
		password: hashedPassword,
		email,
		phone: encryptPhone,
		gender,
		otp: otpHash,
		role,
	});
	await sendEmail({
		to: email,
		subject: "Welcome to Saraha App",
		text: `Hello ${name},\n\nThank you for registering with Saraha App. We are excited to have you on board!\n\nBest regards,\nSaraha Team`,
		html: `<h1>Hello ${name},</h1><p>Thank you for registering with Saraha App. We are excited to have you on board!</p><p>Best regards,<br>Saraha Team</p>
		<p>Your OTP is: <strong>${otp}</strong></p>`,
	});
	res.status(201).json({
		message: "User registered successfully",
		data: newUser,
	});
});

export const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await findOne(User, { email });

	if (!user) {
		return next(new Error("Invalid email or password", { cause: 401 }));
	}
	const isPasswordValid = compareHash({
		plainText: password,
		hash: user.password,
	});
	if (!isPasswordValid) {
		return next(new Error("Invalid email or password", { cause: 401 }));
	}
	const isEmailConfirmed = user.confirmEmail;
	if (!isEmailConfirmed) {
		return next(
			new Error("Please confirm your email before logging in", { cause: 403 })
		);
	}
	const jwtId = nanoid().toString();

	console.log("🚀 ~ jwtId:", jwtId);

	const accessToken = generateJWT(user, "3000s", jwtId);
	const refreshToken = generateJWT(user, "1d", jwtId);

	return res.status(200).json({
		message: "User logged in successfully",
		data: { accessToken, refreshToken },
	});
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
	const { email, otp } = req.body;
	const user = await findOne(User, {
		email,
		confirmEmail: { $exists: false },
		otp: { $exists: true },
	});
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	const isOtpValid = compareHash({
		plainText: otp,
		hash: user.otp,
	});
	if (!isOtpValid) {
		return next(new Error("Invalid OTP", { cause: 400 }));
	}
	update(User, { email }, { confirmEmail: new Date(), otp: null });
	res.status(200).json({
		message: "Email confirmed successfully",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await findOne(User, { email });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	const otp = customAlphabet("0123456789", 6)();
	const otpHash = generateHash({ plainText: otp });
	await update(User, { email }, { otp: otpHash });
	await sendEmail({
		to: email,
		subject: "Password Reset OTP",
		text: `Your OTP for password reset is: ${otp}`,
		html: `<h1>Password Reset OTP</h1><p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
	});
	res.status(200).json({
		message: "OTP sent to your email",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const resetPassword = asyncHandler(async (req, res, next) => {
	const { email, otp, newPassword } = req.body;
	const user = await findOne(User, {
		email,
		confirmEmail: { $exists: false },
		otp: { $exists: true },
	});
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	const isOtpValid = compareHash({
		plainText: otp,
		hash: user.otp,
	});
	if (!isOtpValid) {
		return next(new Error("Invalid OTP", { cause: 400 }));
	}
	const hashedPassword = generateHash({ plainText: newPassword });
	await update(User, { email }, { password: hashedPassword, otp: null });
	res.status(200).json({
		message: "Password reset successfully",
		data: { userId: user._id, name: user.name, email: user.email },
	});
});
export const logout = asyncHandler(async (req, res, next) => {
	const { flag } = req.body;
	let status = 200;
	switch (flag) {
		case "all":
			await updateOne(
				User,
				{ _id: req.user.id },
				{ $set: { changeCredintialTime: new Date() } }
			);
			break;
		default:
			const oneYearInSeconds = 60 * 60 * 24 * 365;
			const expireIn = new Date((req.user.iat + oneYearInSeconds) * 1000);
			await create(Token, {
				jwtId: req.user.jti,
				expireIn,
				userId: req.user.id,
			});
			status = 201;
			break;
	}

	res.status(status).json({ message: "User logged out successfully" });
});
