// imports
import express from "express";
import Class from "../models/class.js";
import { denyLogged, denyUnlogged } from "../middlewares/authMiddleware.js";
import Student from "../models/student.js";

// create router
const router = express.Router();

// page routes
router.get("/", async (req, res) => {
    if (req.userId) {
        const classes = await Class.find({
            classTeacher: req.userId,
        });

        res.render("app", { classes, page: "app" });
    } else {
        res.render("home");
    }
});

router.get("/signup", denyLogged, (req, res) => {
    res.render("sign", { action: "signup" });
});

router.get("/login", denyLogged, (req, res) => {
    res.render("sign", { action: "login" });
});

router.get(
    "/class/:classId",
    denyUnlogged,

    async (req, res, next) => {
        const classId = req.params.classId;

        try {
            const classData = await Class.findById(classId);
            if (classData.classTeacher !== req.userId) return next();

            const classStudents = await Student.find({
                classId: classData._id,
            });

            if (classData) {
                res.render("class", {
                    classData,
                    classStudents,
                    page: "class",
                });
            } else {
                next();
            }
        } catch (err) {
            next();
        }
    }
);

router.get("/profile", denyUnlogged, async (req, res) => {
    const classes = await Class.find({ classTeacher: req.userId });

    const classesNumber = classes.length;
    const studentsNumber = (() => {
        let num = 0;
        classes.forEach((cls) => {
            num += cls.classStudents.length;
        });

        return num;
    })();

    res.render("profile", {
        classesNumber,
        studentsNumber,
    });
});

router.get("/profile/edit", denyUnlogged, async (req, res) => {
    res.render("edit");
});

router.get("/leaderboard", async (req, res) => {
    const students = await Student.find().limit(100).sort({ points: -1 });

    res.render("leaderboard", { students });
});

export default router;
