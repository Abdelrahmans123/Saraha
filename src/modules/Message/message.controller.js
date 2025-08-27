import express from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../middleware/validation.js";
import { userIdParamSchema } from "../User/user.validation.js";
import { authenticate } from "../../middleware/authenticate.js";
import { localUploadFile } from "../../utils/localUploadFile.js";
import { messageSchema } from "./message.validation.js";
const router = express.Router({
	caseSensitive: true,
	strict: true,
});
router.post(
	"/:id/sender",
	validation(userIdParamSchema),
	authenticate,
	localUploadFile("messages").array("messageAttachments", 2),
	validation(messageSchema),
	messageService.sendMessage
);
router.post(
	"/:id",
	validation(userIdParamSchema),
	localUploadFile("messages").array("messageAttachments", 2),
	validation(messageSchema),
	messageService.sendMessage
);
router.delete(
	"/:id",
	validation(userIdParamSchema),
	authenticate,
	messageService.deleteMessage
);
router.get("/:id", authenticate, messageService.getMessageById);
router.patch("/freeze-message/:id", authenticate, messageService.freezeMessage);
router.get("/", authenticate, messageService.getAllMessages);
export default router;
