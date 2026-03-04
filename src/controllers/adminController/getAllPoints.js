import Point from "../../models/Point.js";
import User from "../../models/User.js";


/********** get all product controller is here **********/
const getAdminAllPoints = async (req, res) => {

    try {


        const onlyuserArray = [];
        const passingDataarray = [];

        // Count total documents for pagination metadata
        const AllPoints = await Point.find();
        const AllUser = await User.find();

        // only user find
        for (let i = 0; i < AllUser.length; i++) {
            if (AllUser[i].role === "user") {
                onlyuserArray.push(AllUser[i]);
            }
        }


        onlyuserArray?.map((item, index) => {

            const currentId = item?._id?.toString();

            let count = 0;

            AllPoints?.map((point, index) => {

                if (point?.userId?.toString() == currentId) {

                    count++;
                }

            })

            passingDataarray.push({ ...item._doc, point: count });

        })



        // Return response
        res.status(200).json({
            success: true,
            message: "Credits fetched successfully!",
            data: passingDataarray,
        });

    } catch (error) {
        console.error("Error fetching Credits:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching products.",
        });
    }

};


/*********** modules export from here ************/
export {
    getAdminAllPoints
};

