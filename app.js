import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { authenticateUser } from "./middlewares/authentication.js";

import pagesController from "./controllers/pages.controller.js";
import classController from "./controllers/class.controller.js";
import studentController from "./controllers/student.controller.js";
import userController from "./controllers/user.controller.js";

// create express app
const app = express();

// app settings and configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");
dotenv.config();

// env variables
const PORT = parseInt(process.env.PORT || process.env.port || "3000");

// connect to db
mongoose
    .connect(process.env.DB_URI, {
        dbName: "HeroApp",
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));

// user authentication
app.use(authenticateUser);

// app routes
app.use(pagesController);
app.use("/user", userController);
app.use("/class", classController);
app.use("/student", studentController);

// 404 page
app.get("*", (req, res) => {
    res.render("fof");
});
