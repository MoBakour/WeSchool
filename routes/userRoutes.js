// imports
import { SECRET } from "../app.js";
import express from "express";
import bcrypt from "bcrypt";
import validate from "../middlewares/validateUser.js";
import {
    denyLogged,
    denyUnlogged,
    setToken,
    checkPassword,
} from "../middlewares/authMiddleware.js";
import User from "../models/user.js";
import Class from "../models/class.js";
import Student from "../models/student.js";

// create router
const router = express.Router();

// unauthorize
router.use((req, res, next) => {
    if (req.url.includes("edit") || req.url.includes("delete") || req.url.includes("signup")) {
        return res.status(401).json({ success: false, error: "Unauthorized operation" });
    } else next();
});

// user signup
router.post("/signup", denyLogged, async (req, res) => {
    const userData = req.body;
    const error = validate(userData);

    if (error) {
        return res.status(400).json({ success: false, error });
    } else {
        try {
            delete userData.repassword;

            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(userData.password, salt);
            userData.password = hashedPass;

            const user = await User.create(userData);
            setToken(user._id.toString(), SECRET, res);
            res.status(200).json({ success: true });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: "Username already registered",
                });
            }
            console.log(err);
        }
    }
});

// user login
router.post("/login", denyLogged, async (req, res) => {
    const { username, password } = req.body;

    const missing =
        username == "" ? "username" : password == "" ? "password" : null;
    if (missing) {
        return res
            .status(400)
            .json({ success: false, error: `Please enter ${missing}` });
    }

    const user = await User.findOne({ username });
    if (user) {
        const matching = await bcrypt.compare(password, user.password);

        if (matching) {
            setToken(user._id.toString(), SECRET, res);

            return res.status(200).json({ success: true });
        } else {
            return res
                .status(400)
                .json({ success: false, error: "Incorrect password" });
        }
    } else {
        return res
            .status(400)
            .json({ success: false, error: "Incorrect username" });
    }
});

// user logout
router.post("/logout", denyUnlogged, (req, res) => {
    res.cookie("token", "", { maxAge: 1, httpOnly: true });
    res.status(200).json({ success: true });
});

// edit username
router.patch("/edit/username", denyUnlogged, async (req, res) => {
    // confirm password
    const passError = await checkPassword(
        req.body.password,
        req.userInfo.password
    );
    if (passError)
        return res.status(400).json({ success: false, error: passError });

    // validate username
    const validationError = validate(
        { username: req.body.username, gender: req.body.gender },
        "username"
    );
    if (validationError)
        return res.status(400).json({ success: false, error: validationError });

    // edit user
    try {
        await User.findByIdAndUpdate(req.userId, {
            username: req.body.username,
            gender: req.body.gender,
        });

        await Student.updateMany(
            { classTeacher: req.userInfo.username },
            { classTeacher: req.body.username }
        );

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ success: false, error: "Operation failed" });
    }
});

// edit user password
router.patch("/edit/password", denyUnlogged, async (req, res) => {
    // confirm password
    const passError = await checkPassword(
        req.body.passwordCheck,
        req.userInfo.password
    );
    if (passError)
        return res.status(400).json({ success: false, error: passError });

    // validate new password
    const validationError = validate(
        { password: req.body.password, repassword: req.body.repassword },
        "password"
    );
    if (validationError)
        return res.status(400).json({ success: false, error: validationError });

    // edit user
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await User.findByIdAndUpdate(req.userId, {
            password: hashedPassword,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ success: false, error: "Operation failed" });
    }
});

// delete user
router.delete("/delete", async (req, res) => {
    const passError = await checkPassword(
        req.body.password,
        req.userInfo.password
    );

    if (passError) {
        return res.status(400).json({ success: false, error: passError });
    }

    try {
        await User.findByIdAndDelete(req.userId);
        await Class.deleteMany({ classTeacher: req.userId });
        await Student.deleteMany({ classTeacher: req.userInfo.username });

        res.cookie("token", "", { maxAge: 1, httpOnly: true });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ success: false, error: "Operation failed" });
    }
});

// export router
export default router;
