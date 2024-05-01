// imports
import express from "express";
import bcrypt from "bcrypt";
import validate from "../middlewares/validation.js";
import {
    denyLogged,
    denyUnlogged,
    setToken,
    checkPassword,
} from "../middlewares/authentication.js";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";

// create router
const router = express.Router();

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
            setToken(user._id.toString(), res);
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
            setToken(user._id.toString(), res);

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
    const passError = await checkPassword(req.body.password, req.user.password);
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
        await User.findByIdAndUpdate(req.user._id.toString(), {
            username: req.body.username,
            gender: req.body.gender,
        });

        await Student.updateMany(
            { classTeacher: req.user.username },
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
        req.user.password
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

        await User.findByIdAndUpdate(req.user._id.toString(), {
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
router.delete("/delete", denyUnlogged, async (req, res) => {
    const passError = await checkPassword(req.body.password, req.user.password);

    if (passError) {
        return res.status(400).json({ success: false, error: passError });
    }

    try {
        await User.findByIdAndDelete(req.user._id.toString());
        await Class.deleteMany({ classTeacher: req.user._id.toString() });
        await Student.deleteMany({ classTeacher: req.user.username });

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
