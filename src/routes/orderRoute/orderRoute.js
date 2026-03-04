import express from "express";
import {
    createOrder, deleteOrder, getAllOrders, getSingleOrder,
    myOrders,
    updateOrder
} from "../../controllers/orderController/orderController.js";
import { authorize, protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/createorder", createOrder);
router.get("/allorders", protect, authorize("admin"), getAllOrders);
router.get("/myorders/:id", protect, authorize("user"), myOrders);
router.get("/singleorder/:id", protect, authorize("admin", "user"), getSingleOrder);
router.put("/updateorder/:id", protect, authorize("admin", "user"), updateOrder);
router.delete("/deleteorder/:id", protect, authorize("admin", "user"), deleteOrder);



export default router;