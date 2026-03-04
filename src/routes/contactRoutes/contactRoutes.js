import express from "express";
import { createContact, deleteContact, getAllContact } from "../../controllers/contactController/contactController.js";


const router = express.Router();

/********* Import Here Controller Files **********/


router.post("/contact", createContact);
router.get("/contact", getAllContact);
router.delete("/contact/:id", deleteContact);




export default router;
