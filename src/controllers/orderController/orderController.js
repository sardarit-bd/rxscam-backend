import Order from "../../models/Order.js";
import createPdfFile from "../../utils/pdf-ganaration/createPdfFile.js";
import { sendEmail } from "../../utils/sendEmail.js";
import uploadSingleFileToCloudinary from "../../utils/uploadSingleFileToCloudinary.js";


/********** get all product controller is here **********/
const getAllOrders = async (req, res) => {


    try {


        // For each product, attach its reviews and reviewer info
        const order = await Order.find({});



        // Return response
        res.status(200).json({
            success: true,
            message: "Order fetched successfully!",
            data: order,
        });

    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching order.",
        });
    }


};






/********** get all product controller is here **********/
const myOrders = async (req, res) => {


    try {


        const { id } = req.params;;


        // For each product, attach its reviews and reviewer info
        const order = await Order.find();

        const myOrder = await Order.find({ userID: id });



        // Return response
        res.status(200).json({
            success: true,
            message: "My Order fetched successfully!",
            data: myOrder,
        });

    } catch (error) {
        console.error("Error fetching My order:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching order.",
        });
    }


};











/********** get single product controller is here **********/
const getSingleOrder = async (req, res) => {

    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid Order ID format." });
        }


        // Find product by ID
        const order = await Order.findById(id);


        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }




        // Return the product
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({
            success: false,
            error: "Something went wrong while order the product!",
        });
    }

};












/********** create product controller is here **********/
const createOrder = async (req, res) => {




    try {

        const bodyData = req.body;


        const orderID = `OID-${Date.now().toString().slice(-5)}`;

        // ganarate pdf file with prescription information
        const file = await createPdfFile(bodyData, orderID);
        const base64 = `data:application/pdf;base64,${file}`;
        const uploadFile = await uploadSingleFileToCloudinary(base64);


        // send email to the admin
        await sendEmail([bodyData.email, process.env.ADMIN_EMAIL], uploadFile);


        const PrescriptionImage = await uploadSingleFileToCloudinary(bodyData?.hasData[0]?.prescriptionImage);


        const value = { orderId: orderID, ...bodyData, pdf: uploadFile, PrescriptionImage: PrescriptionImage };

        const order = await Order.create(value);


        // Send success response
        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            data: order,
        });

    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the product.",
        });
    }

};





/********** Update  product controller is here **********/
const updateOrder = async (req, res) => {


    try {

        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID format.",
            });
        }



        const value = req.body;



        // Update the product
        const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, { deliveryStatus: value.deliveryStatus }, {
            new: true, // return updated document
            runValidators: true, // enforce schema validation
        });



        //If not found
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }


        //Success response
        res.status(200).json({
            success: true,
            message: "Order updated successfully!",
            data: updatedOrder,
        });


    } catch (err) {
        console.error("Error updating Order:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating the Order.",
        });
    }


};










/********** Delete  product controller is here **********/
const deleteOrder = async (req, res) => {


    try {


        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID format.",
            });
        }



        // Attempt to delete the product
        const deletedOrder = await Order.findByIdAndDelete(id);



        //If no product found
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Order deleted successfully!",
            data: deletedOrder,
        });


    } catch (err) {
        console.error("Error deleting Order:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Order.",
        });
    }


};









/*********** modules export from here ************/
export {
    createOrder, deleteOrder, getAllOrders, getSingleOrder, myOrders, updateOrder
};

