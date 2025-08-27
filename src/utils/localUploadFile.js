import multer from "multer";
import path from "path";
import fs from "fs";
export const localUploadFile = (dest) => {
	let uploadPath = `uploads/${dest}`;
	const fullPath = path.resolve(uploadPath);
	if (!fs.existsSync(fullPath)) {
		fs.mkdirSync(fullPath, { recursive: true });
	}

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.resolve(fullPath));
		},
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			req.savedFileUrl = path
				.join("/uploads", dest, uniqueSuffix + path.extname(file.originalname))
				.replace(/\\/g, "/");
			cb(null, uniqueSuffix + path.extname(file.originalname));
		},
	});

	// File filter to accept only images
	const fileFilter = (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed!"), false);
		}
	};

	const upload = multer({
		storage: storage,
		fileFilter: fileFilter,
		limits: { fileSize: 5 * 1024 * 1024 },
	});

	return upload;
};
