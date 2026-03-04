import express from "express";
import { adminDeshboard } from "../../controllers/adminController/adminController.js";


const router = express.Router();

router.get("/deshboard", adminDeshboard);


export default router;