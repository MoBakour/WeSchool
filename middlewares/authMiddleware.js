// imports
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Class from "../models/class.js";
import Student from "../models/student.js";

// check user
export const checkUser = (req, res, SECRET, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (!err) {
                try {
                    const userId = decoded.userId;
                    const user = await User.findById(userId);

                    if (user) {
                        req.userId = userId;
                        req.userInfo = user;

                        res.locals.username = user.username;
                        res.locals.gender = user.gender;
                        res.locals.createdAt = user.createdAt;
                    }
                } catch (err) {
                    // empty catch because next() will be called anyways
                }
            }

            next();
        });
    } else next();
};

// block unauthenticated users
export const denyUnlogged = (req, res, next) => {
    if (!req.userId) res.redirect("/login");
    else next();
};

// block authenticated users
export const denyLogged = (req, res, next) => {
    if (req.userId) res.redirect("/");
    else next();
};

// requie teacher
export const requireTeacher = async (req, res, next) => {
    const { student, classId } = req.body;

    try {
        const isValid = classId
            ? await Class.findOne({
                  _id: classId,
                  classTeacher: req.userId,
              })
            : await Student.findOne({
                  _id: student,
                  classTeacher: req.userInfo.username,
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
export const setToken = (userId, SECRET, res) => {
    const minimumExpiry = 60 * 60 * 24 * 14;
    const token = jwt.sign({ userId }, SECRET, { expiresIn: minimumExpiry });

    res.cookie("token", token, {
        maxAge: minimumExpiry * 1000,
        httpOnly: true,
    });
};
