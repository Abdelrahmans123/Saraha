import mongoose from "mongoose";
import genderEnum from "../../utils/genderEnum.js";
import roleEnum from "../../utils/roleEnum.js";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: String,
		confirmEmail: Date,
		gender: {
			type: String,
			enum: Object.values(genderEnum),
			default: genderEnum.male,
		},
		otp: { type: String, required: true },
		role: {
			type: String,
			enum: Object.values(roleEnum),
			default: roleEnum.user,
		},
		avatar: {
			public_id: String,
			url: String,
		},
		deletedAt: Date,
		deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		restoreAt: Date,
		restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		changeCredintialTime: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
userSchema.virtual("messages", {
	ref: "Message",
	localField: "_id",
	foreignField: "receiver",
});
const User = mongoose.model("User", userSchema);

export default User;
