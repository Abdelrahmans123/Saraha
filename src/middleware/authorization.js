import asyncHandler from "../utils/asyncHandler.js";

export const authorize = ({ roles = [] } = {}) => {
	return asyncHandler(async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new Error("Forbidden", { cause: 403 }));
		}
		next();
	});
};
