import Joi from "joi";

const contactSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 2 characters.",
        }),

    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .allow("") // optional email
        .messages({
            "string.email": "Invalid email format.",
        }),

    subject: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .optional()
        .messages({
            "string.empty": "Subject is required.",
            "string.min": "Subject should be at least 5 characters.",
        }),

    message: Joi.string()
        .trim()
        .min(5)
        .max(5000)
        .required()
        .messages({
            "string.empty": "Message is required.",
            "string.min": "Message should be at least 5 characters.",
        }),
});

export default contactSchema;
