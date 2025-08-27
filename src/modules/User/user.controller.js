import express from "express";
import * as userService from "./user.service.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validation } from "../../middleware/validation.js";
import {
	freezeAccountSchema,
	logout,
	updateUserBodySchema,
	userIdParamSchema,
} from "./user.validation.js";
import { authorize } from "../../middleware/authorization.js";
import { localUploadFile } from "../../utils/localUploadFile.js";
const router = express.Router({
	caseSensitive: true,
	strict: true,
});
router.get("/", validation(logout), authenticate, userService.getAllUsers);
router.get("/:id", validation(userIdParamSchema), userService.getUserById);
router.patch(
	"/",
	validation(updateUserBodySchema),
	authenticate,
	userService.updateUserById
);
router.delete(
	"/freeze-account/{:id}",
	validation(freezeAccountSchema),
	authenticate,
	userService.freezeAccount
);
router.patch(
	"/restore-account/:id",
	validation(userIdParamSchema),
	authenticate,
	authorize({ roles: ["admin"] }),
	userService.restoreAccount
);
router.delete(
	"/delete-account/{:id}",
	validation(freezeAccountSchema),
	authenticate,
	authorize({ roles: ["admin"] }),
	userService.deleteAccount
);
router.patch(
	"/upload/:id",
	validation(userIdParamSchema),
	authenticate,
	localUploadFile("users").single("profilePicture"),
	userService.uploadProfilePicture
);
router.patch(
	"/delete-image/:id",
	validation(userIdParamSchema),
	authenticate,
	userService.deleteUserImage
);
export default router;
