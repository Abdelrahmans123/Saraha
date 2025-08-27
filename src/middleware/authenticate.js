import Token from "../db/models/Token.model.js";
import User from "../db/models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyJWT } from "../utils/jwt.js";

export const authenticate = asyncHandler(async (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		return next(new Error("Authentication token is missing", { cause: 401 }));
	}
	const decoded = verifyJWT(token);
	const tokenModel = await Token.findOne({
		jwtId: decoded.jti,
	});
	if (decoded.jti && tokenModel) {
		return next(
			new Error("Session expired, please login again", { cause: 401 })
		);
	}
	const user = await User.findById(decoded.id);
	if (user.changeCredintialTime?.getTime() > decoded.iat * 1000) {
		return next(
			new Error("Session expired, please login again", { cause: 401 })
		);
	}
	req.user = decoded;
	next();
});
