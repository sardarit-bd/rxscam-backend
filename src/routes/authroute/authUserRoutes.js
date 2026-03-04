import express from "express";
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verifyOTp } from "../../controllers/authcontroller/authuserController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpass", forgotPassword);
router.post("/verifyotp", verifyOTp);
router.post("/changepassword", changePassword);


export default router;