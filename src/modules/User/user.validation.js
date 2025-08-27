import Joi from "joi";
import { Types } from "mongoose";
export const userIdParamSchema = {
	params: Joi.object({
		id: Joi.string()
			.custom((value, helper) => {
				return Types.ObjectId.isValid(value)
					? value
					: helper.message("Invalid user ID");
			})
			.hex()
			.length(24)
			.required()
			.messages({
				"string.base": "User ID should be a type of 'text'",
				"string.length": "User ID must be 24 characters long",
				"string.hex": "User ID must be a valid hexadecimal",
				"any.required": "User ID is a required field",
			}),
	}),
};
export const updateUserBodySchema = {
	body: Joi.object({
		name: Joi.string().min(3).max(30).optional().messages({
			"string.base": "Name should be a type of 'text'",
			"string.min": "Name should have a minimum length of {#limit}",
			"string.max": "Name should have a maximum length of {#limit}",
		}),
		phone: Joi.string()
			.pattern(/^[0-9]{10,15}$/)
			.optional()
			.messages({
				"string.base": "Phone number should be a type of 'text'",
				"string.pattern.base": "Phone number must be between 10 to 15 digits",
			}),
	}),
	params: Joi.object({
		id: Joi.string()
			.custom((value, helper) => {
				return Types.ObjectId.isValid(value)
					? value
					: helper.message("Invalid user ID");
			})
			.hex()
			.length(24)
			.required()
			.messages({
				"string.base": "User ID should be a type of 'text'",
				"string.length": "User ID must be 24 characters long",
				"string.hex": "User ID must be a valid hexadecimal",
				"any.required": "User ID is a required field",
			}),
	}),
};
export const freezeAccountSchema = {
	params: Joi.object({
		id: Joi.string()
			.custom((value, helper) => {
				return Types.ObjectId.isValid(value)
					? value
					: helper.message("Invalid user ID");
			})
			.hex()
			.length(24)
			.messages({
				"string.base": "User ID should be a type of 'text'",
				"string.length": "User ID must be 24 characters long",
				"string.hex": "User ID must be a valid hexadecimal",
			}),
	}),
};
export const logout = {
	body: Joi.object({
		flag: Joi.string().required().messages({
			"string.base": "flag should be a type of 'text'",
			"any.required": "flag is a required field",
		}),
	}),
};
