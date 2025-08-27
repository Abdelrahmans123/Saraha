import Joi from "joi";
export const loginSchema = {
	body: Joi.object({
		email: Joi.string().email().required().messages({
			"string.email": "Please provide a valid email address",
			"any.required": "Email is required",
		}),
		password: Joi.string().min(8).required().messages({
			"string.min": "Password must be at least 8 characters long",
			"any.required": "Password is required",
		}),
	}),
};

export const registerSchema = {
	body: loginSchema.body.append({
		name: Joi.string().empty().min(2).max(50).required().messages({
			"string.min": "Name must be at least 2 characters long",
			"string.max": "Name cannot exceed 50 characters",
			"any.required": "Name is required",
			"string.empty": "Name cannot be empty",
		}),
		gender: Joi.string().valid("male", "female").required().messages({
			"any.only": "Gender must be either male or female",
			"any.required": "Gender is required",
		}),
		confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
			"any.only": "Confirm password must match password",
			"any.required": "Confirm password is required",
		}),
		phone: Joi.string()
			.pattern(/^[0-9]{10,15}$/)
			.required()
			.messages({
				"string.pattern.base":
					"Phone number must be between 10 to 15 digits and contain only numbers",
				"any.required": "Phone number is required",
			}),
		role: Joi.string().valid("user", "admin").default("user").messages({
			"any.only": "Role must be either user or admin",
		}),
	}),
};
