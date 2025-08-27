const asyncHandler = (fn) => {
	return async (req, res, next) => {
		await fn(req, res, next).catch((error) => {
			return next(error);
		});
	};
};
export default asyncHandler;
