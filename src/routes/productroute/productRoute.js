import express from "express";
import { createProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from '../../controllers/productController/productController.js';
import { authorize, protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();



router.get("/allproducts", getAllProduct);

router.get("/singleProduct/:id", getSingleProduct);

router.post("/createProduct", protect, authorize("admin"), createProduct);

router.put("/updateProduct/:id", protect, authorize("admin"), updateProduct);

router.delete("/deleteProduct/:id", protect, authorize("admin"), deleteProduct);



export default router;