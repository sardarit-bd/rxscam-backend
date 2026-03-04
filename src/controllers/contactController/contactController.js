import Contact from "../../models/Contact.js";
import contactSchema from "../../validationSchema//ContactSchama.js";






/********** get all product controller is here **********/
const getAllContact = async (req, res) => {




    try {


        const constact = await Contact.find();





        // Return response
        res.status(200).json({
            success: true,
            message: "Contact fetched successfully!",
            data: constact,
        });

    } catch (error) {
        console.error("Error fetching Contacts:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Contacts.",
        });
    }

};

















/********** create product controller is here **********/
const createContact = async (req, res) => {

    try {


        // Validate body data using Joi schema
        const { error, value } = contactSchema.validate(req.body, { abortEarly: false });


        // If validation fails, return 400 with all validation errors
        if (error) {
            const validationErrors = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Invalid Contact data.",
                errors: validationErrors,
            });
        }


        const saveableData = {
            name: value.name,
            email: value.email,
            subject: 'Subject',
            message: value.message,
        };



        // Create product in database
        const product = await Contact.create(saveableData);



        // Send success response
        res.status(201).json({
            success: true,
            message: "Contact created successfully!",
            data: product,
        });

    } catch (err) {
        console.error("Error creating Contact:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the Contact.",
        });
    }

};











/********** Delete  product controller is here **********/
const deleteContact = async (req, res) => {


    try {


        const { id } = req.params;


        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format.",
            });
        }



        // Attempt to delete the product
        const deletedProduct = await Contact.findByIdAndDelete(id);



        //If no product found
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Contact not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Contact deleted successfully!",
            data: deletedProduct,
        });


    } catch (err) {
        console.error("Error deleting Contact:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Contact.",
        });
    }


};









/*********** modules export from here ************/
export {
    createContact, deleteContact, getAllContact
};

