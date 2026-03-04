/****** core modules import here *******/
import cors from "cors";
import express from "express";


/*******internal files import here *******/
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import adminRoutes from './routes/adminRoutes/adminRoutes.js';
import authRoutes from './routes/authroute/authUserRoutes.js';
import contactRoutes from "./routes/contactRoutes/contactRoutes.js";
import couponRoutes from "./routes/couponRoutes/couponRoutes.js";
import healthRoutes from "./routes/health/healthRoute.js";
import orderRoute from "./routes/orderRoute/orderRoute.js";
import productRoutes from './routes/productroute/productRoute.js';
import reviewRoutes from './routes/review/reviewRoutes.js';
import userRoutes from './routes/userroute/userRoutes.js';
import "./workers/product.worker.js";
import emailBreachRoutes from "./routes/emailBreachRoutes/emailBreachRoutes.js";



/****** express app initilazation here *******/
const app = express();






/********* Body Data Parse **********/
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));


/*********** CORS  Middleware Here ***********/
const allowedOrigins = [
    process.env.LIVE_SITE_URL,
    "http://localhost:3000",
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // allow non-browser requests
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);




/********** auth Routes Define Here *********/
app.use("/", authRoutes);


/********** user Routes Define Here *********/
app.use("/", userRoutes);



/********** Product Routes Define Here *********/
app.use("/", productRoutes);



/********** Profile Routes Define Here *********/
app.use("/", reviewRoutes);



/********** Contact Routes Define Here *********/
app.use("/", contactRoutes);



/**************** Order Routes Define Here *********************/
app.use("/", orderRoute);



/********** Admin Routes Define Here *********/
app.use("/", adminRoutes);




/********** Admin Routes Define Here *********/
app.use("/", couponRoutes);








/****************  Email Breach Checker  *********************/
app.use("/", emailBreachRoutes);









/********** health check Routes Define Here *********/
app.use("/", healthRoutes);






//global error handling middlewares
app.use(notFound);
app.use(errorHandler);




/******* Export the module ******/
export default app;
