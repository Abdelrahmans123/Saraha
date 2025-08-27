import Joi from "joi";

export const messageSchema = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object({
		message: Joi.string().min(2).max(1000).required(),
		messageAttachments: Joi.array().items(Joi.string().uri()).optional(),
	}).required()   ,
};
