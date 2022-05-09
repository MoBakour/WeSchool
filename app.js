// import dependencies
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// import middlewares
import { checkUser } from "./middlewares/authMiddleware.js";

// import routes
import pageRoutes from "./routes/pageRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// create express app
const app = express();

// app settings and configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");
dotenv.config();

// app variables
const PORT = parseInt(process.env.PORT || process.env.port || 3000);
const DB_URI = process.env.DB_URI;
export const SECRET = process.env.SECRET;

// connect to db
const db_connection_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose
    .connect(DB_URI, db_connection_options)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app running at port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));

// user authentication
app.use((req, res, next) => checkUser(req, res, SECRET, next));

// app routes
app.use(pageRoutes);
app.use("/user", userRoutes);
app.use("/class", classRoutes);
app.use("/student", studentRoutes);

// 404 page
app.get("*", (req, res) => {
    res.render("fof");
});
