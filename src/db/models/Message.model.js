import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: function () {
				return !this.attachments || this.attachments.length === 0;
			},
		},
		attachments: [{ secure_url: String, public_id: String }],
		deletedAt: Date,
		deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
