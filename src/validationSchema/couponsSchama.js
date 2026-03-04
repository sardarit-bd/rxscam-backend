import Joi from "joi";

const couponsSchama = Joi.object({
    cName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Coupon Name is required.",
            "string.min": "Coupon Name must be at least 2 characters.",
        }),

    cCode: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Coupon Code is required.",
        }),

    cDiscount: Joi.number()
        .min(1)
        .max(100)
        .required()
        .messages({
            "string.empty": "Discount is required.",
            "string.min": "Discount should be at least 1 characters.",
        }),
});

export default couponsSchama;
