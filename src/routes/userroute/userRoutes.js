import express from "express";
import { getAllUsers, getUser, updateUser } from '../../controllers/userController/userController.js';
import { authorize, protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();



router.get("/allusers", protect, authorize("admin",), getAllUsers);
router.get("/user/:id", protect, authorize("admin", "user"), protect, getUser);
router.put("/user/:id", protect, authorize("admin", "user"), protect, updateUser);



export default router;