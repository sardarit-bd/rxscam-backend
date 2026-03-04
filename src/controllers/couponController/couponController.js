import Coupons from "../../models/Coupons.js";
import couponsSchama from "../../validationSchema/couponsSchama.js";






/********** get all coupons controller is here **********/
const getAllCoupon = async (req, res) => {




    try {


        const coupon = await Coupons.find();





        // Return response
        res.status(200).json({
            success: true,
            message: "Coupons fetched successfully!",
            data: coupon,
        });

    } catch (error) {
        console.error("Error fetching Coupons:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Contacts.",
        });
    }

};

















/********** create coupons controller is here **********/
const createCoupon = async (req, res) => {

    try {


        // Validate body data using Joi schema
        const { error, value } = couponsSchama.validate(req.body, { abortEarly: false });


        // If validation fails, return 400 with all validation errors
        if (error) {
            const validationErrors = error.details.map((err) => err.message);
            console.log(validationErrors);
            return res.status(400).json({
                success: false,
                message: validationErrors[0],
                errors: validationErrors,
            });
        }


        const saveableData = {
            cName: value.cName,
            cCode: value.cCode,
            cDiscount: value.cDiscount,
        };



        // Create product in database
        const coupon = await Coupons.create(saveableData);



        // Send success response
        res.status(201).json({
            success: true,
            message: "Coupons created successfully!",
            data: coupon,
        });

    } catch (err) {
        console.error("Error creating Coupons:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the Contact.",
        });
    }

};









/********** apply coupons controller is here **********/
const applyCoupon = async (req, res) => {

    try {


        const { couponCode } = req.body;



        // find the all coupon code
        const coupon = await Coupons.find();


        // If no product found
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }


        const isCouponExist = coupon?.filter((c) => {
            return c.cCode === couponCode;
        });


        if (isCouponExist.length) {

            // Send success response
            res.status(201).json({
                success: true,
                message: "Coupon applied successfully!",
                data: isCouponExist[0],
            });



        } else {

            // no coupon match
            res.status(404).json({
                success: false,
                message: "Coupon Code Does Not Match",
            });


        }

    } catch (err) {
        console.error("Error while Apply Coupons:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the Contact.",
        });
    }

};










/********** Delete  coupons controller is here **********/
const deleteCoupon = async (req, res) => {


    try {


        const { id } = req.params;


        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid Coupon ID format.",
            });
        }



        // Attempt to delete the product
        const deletedCoupons = await Coupons.findByIdAndDelete(id);



        //If no product found
        if (!deletedCoupons) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully!",
            data: deletedCoupons,
        });


    } catch (err) {
        console.error("Error deleting Coupon:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Coupon.",
        });
    }


};









/*********** modules export from here ************/
export { applyCoupon, createCoupon, deleteCoupon, getAllCoupon };

