import express from "express";
import * as authService from "./auth.service.js";
import { validation } from "../../middleware/validation.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { authenticate } from "../../middleware/authenticate.js";
const router = express.Router({
	caseSensitive: true,
	strict: true,
});
router.post("/register", validation(registerSchema), authService.register);
router.post("/login", validation(loginSchema), authService.login);
router.post("/logout", authenticate, authService.logout);
router.patch("/confirm-email", authService.confirmEmail);
router.post("/forgot-password", authService.forgotPassword);
router.patch("/reset-password", authService.resetPassword);

export default router;
