// imports
import express from "express";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import { getAvatar } from "../middlewares/generators.js";
import { requireTeacher } from "../middlewares/authentication.js";

// router
const router = express.Router();

// create student
router.post("/create", requireTeacher, async (req, res) => {
    const { classId, className, studentName, studentGender } = req.body;

    let validationError;
    if (!studentName) validationError = "Enter student name";
    else if (!studentGender) validationError = "Specify student gender";

    if (validationError)
        return res.status(400).json({ success: false, error: validationError });

    const studentAvatar = getAvatar(studentGender);

    const student = {
        name: studentName,
        gender: studentGender,
        avatar: studentAvatar,
        classId,
        className,
        classTeacher: req.user.username,
    };

    try {
        const newStudent = await Student.create(student);
        await Class.findByIdAndUpdate(classId, {
            $push: { classStudents: newStudent._id.toString() },
        });

        res.status(200).json({
            success: true,
            student: newStudent,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: "Operation Failed" });
    }
});

// edit student
router.patch("/edit", requireTeacher, async (req, res) => {
    const { student, name, gender } = req.body;

    const newAvatar = getAvatar(gender);

    try {
        await Student.findByIdAndUpdate(student, {
            name,
            gender,
            avatar: newAvatar,
        });

        res.status(200).json({
            success: true,
            name: name.trim(),
            gender,
            newAvatar,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// edit student points
router.patch("/points", requireTeacher, async (req, res) => {
    let { increment, value, student } = req.body;

    if (!value || isNaN(value)) {
        console.log("NOT A NUMBER");
        return res
            .status(400)
            .json({ success: false, error: "Invalid value provided" });
    }

    if (!increment) value = -value;

    try {
        await Student.findByIdAndUpdate(student, { $inc: { points: value } });

        return res.status(200).json({ success: true, value });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
});

// delete student
router.delete("/delete", requireTeacher, async (req, res) => {
    const student = req.body.student;

    try {
        await Student.findByIdAndDelete(student);

        await Class.findOneAndUpdate(
            { classStudent: { $all: student } },
            { $pull: { classStudents: student } }
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// export router
export default router;
