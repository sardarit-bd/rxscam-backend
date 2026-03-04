import Joi from "joi";

const productSchema = Joi.object({


    brand: Joi.string().min(2).max(100).required(),

    ProductTitle: Joi.string().min(2).max(100).required(),

    shortdes: Joi.string().allow("").required(),

    product_price: Joi.number().allow("").required(),

    gender: Joi.string().allow("").optional(),

    weight: Joi.string().allow("").optional(),

    meterial: Joi.string().allow("").optional(),

    fType: Joi.string().min(1).max(100).allow("").optional(),

    fShape: Joi.string().min(1).max(100).allow("").optional(),

    lensWidth: Joi.string().min(1).max(25).allow("").optional(),

    lensHeight: Joi.string().min(1).max(25).allow("").optional(),

    BridgeWidth: Joi.string().min(1).max(25).allow("").optional(),

    ArmLength: Joi.string().min(1).max(25).allow("").optional(),

    product_Images: Joi.array()
        .min(1)
        .max(5)
        .required(),

    product_Discription: Joi.string().allow("").required(),
});

export default productSchema;
