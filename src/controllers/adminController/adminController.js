import getTotalPrice from "../..//utils/getTotalPrice.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";





/************** get all admin deshboard data *****************/
const adminDeshboard = async (req, res) => {

    try {

        //find  users and service category area and review
        const product = await Product.find();
        const order = await Order.find();




        //make the total value
        const totalproduct = product.length;
        const totalOrder = order.length;
        const totalPending = order.filter((order) => order.paymentStatus === "Pending");
        const totalDelivered = order.filter((order) => order.paymentStatus === "Delivered");
        const totalPaid = order.filter((order) => order.paymentStatus === "Pending");
        const totalRevenueArr = [];
        for (let i = 0; i < totalPaid?.length; i++) {
            const total = getTotalPrice(totalPaid[i]?.hasData[0]?.total);
            totalRevenueArr.push(total);
        }
        const totalRevenue = totalRevenueArr?.reduce((a, b) => a + b, 0);





        res.status(200).json({
            success: true,
            message: "Admin deshboard data fetched successfully!",
            data: {
                totalproduct,
                totalOrder,
                totalPending: totalPending?.length,
                totalDelivered: totalDelivered?.length,
                totalPaid: totalPaid?.length,
                totalRevenue
            }
        });
    } catch (error) {
        console.error("Error fetching admin deshboard data:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching admin deshboard data.",
        });
    }
}







/*********** modules export from here ************/
export { adminDeshboard };

