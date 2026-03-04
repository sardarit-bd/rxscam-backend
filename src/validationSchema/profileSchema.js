import Joi from "joi";

const profileSchema = Joi.object({
    authuserId: Joi.string().required(),
    fristName: Joi.string().min(3).max(50).optional(),
    middleName: Joi.string().min(3).max(50).optional(),
    lastName: Joi.string().min(3).max(50).optional(),
    userName: Joi.string().min(3).max(50).required(),
    role: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .message("Phone number must contain 10–15 digits")
        .optional(),
    city: Joi.string().optional(),
    zipCode: Joi.string().min(3).max(50).optional(),
    address: Joi.string().max(255).optional(),
    addressTwo: Joi.string().max(255).optional(),
    avatar: Joi.string().uri().optional(),
    maxCatagorySelect: Joi.number().integer().min(1).max(50).optional().default(10),
    maxAreaSelect: Joi.number().integer().min(1).max(50).optional().default(10),
    isUpdated: Joi.boolean().optional().default(false),
});

export default profileSchema;
