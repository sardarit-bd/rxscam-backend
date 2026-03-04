import express from "express";
import { emailBreachCcheck } from "../../controllers/emailBreachContoller/emailBreachContoller.js";


const router = express.Router();

/********* Import Here Controller Files **********/



router.post("/v1/free/breach-check", emailBreachCcheck);


export default router;
