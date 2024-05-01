// imports
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";

// check user
export const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return next();

        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (!err) {
                const user = await User.findById(decoded.userId);

                if (user) {
                    req.user = user;

                    res.locals.username = user.username;
                    res.locals.gender = user.gender;
                    res.locals.createdAt = user.createdAt;
                }
            }

            next();
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// block unauthenticated users
export const denyUnlogged = (req, res, next) => {
    if (!req.user) res.redirect("/login");
    else next();
};

// block authenticated users
export const denyLogged = (req, res, next) => {
    if (req.user) res.redirect("/");
    else next();
};

// requie teacher
export const requireTeacher = async (req, res, next) => {
    const { student, classId } = req.body;

    try {
        const isValid = classId
            ? await Class.findOne({
                  _id: classId,
                  classTeacher: req.user._id?.toString(),
              })
            : await Student.findOne({
                  _id: student,
                  classTeacher: req.user.username,
              });

        if (!isValid)
            return res
                .status(400)
                .json({ success: false, error: "Unauthorized Operation" });
        else next();
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
};

// check password
export const checkPassword = async (enteredPass, truePass) => {
    let passError = "";

    const passMatching = await bcrypt.compare(enteredPass, truePass);

    if (!passMatching) passError = "Incorrect password";
    if (!enteredPass) passError = "Please enter password";

    return passError;
};

// create & set cookie token
export const setToken = (userId, res) => {
    const minimumExpiry = 60 * 60 * 24 * 14;
    const token = jwt.sign({ userId }, process.env.SECRET, {
        expiresIn: minimumExpiry,
    });

    res.cookie("token", token, {
        maxAge: minimumExpiry * 1000,
        httpOnly: true,
    });
};
