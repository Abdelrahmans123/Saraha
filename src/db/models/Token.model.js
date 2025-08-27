import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		jwtId: { type: String, required: true, unique: true },
		expireIn: { type: Date, required: true },
	},
	{
		timestamps: true,
	}
);
const Token = mongoose.model("Token", tokenSchema);
export default Token;
