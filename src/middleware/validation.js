import asyncHandler from "../utils/asyncHandler.js";

export const validation = (schema) => {
	return asyncHandler(async (req, res, next) => {
		const validatonError = [];
		for (const key of Object.keys(schema)) {
			if (schema[key]) {
				const { error } = schema[key].validate(req[key]);
				if (error) {
					validatonError.push({ key, message: error.details[0].message });
				}
			}
		}
		if (validatonError.length) {
			return res.status(400).json({
				message: "Validation Error",
				errors: validatonError,
			});
		}
		next();
	});
};
