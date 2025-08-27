import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimiter } from "express-rate-limit";
import connectDB from "./db/connection.db.js";
import authController from "./modules/Auth/auth.controller.js";
import userController from "./modules/User/user.controller.js";
import messageController from "./modules/Message/message.controller.js";
const bootstrap = () => {
	const app = express();
	const PORT = process.env.PORT || 3000;
	app.use(express.json());
	connectDB();
	app.use(cors());
	app.use(helmet());
	app.use(
		rateLimiter({
			windowMs: 15 * 60 * 1000,
			limit: 10000,
			message: "Too many requests from this IP, please try again later.",
		})
	);
	app.use("/api/auth", authController);
	app.use("/api/users", userController);
	app.use("/api/messages", messageController);
	app.all("/{*dummy}", (req, res, next) => {
		res.status(404).json({
			message: "Route Not Found",
		});
	});
	app.use((error, req, res, next) => {
		res.status(error.cause || 500).json({
			message: error.message || "Internal Server Error",
			stack: error.stack ? error.stack : undefined,
		});
	});
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
};

export default bootstrap;
