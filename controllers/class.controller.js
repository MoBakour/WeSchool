// imports
import express from "express";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import { denyUnlogged, requireTeacher } from "../middlewares/authentication.js";
import { getClassName, getAvatar } from "../middlewares/generators.js";

// router
const router = express.Router();

// create class
router.post("/create", denyUnlogged, async (req, res) => {
    const { classData, studentsData } = req.body;

    if (!classData.className) classData.className = getClassName();
    classData.classTeacher = req.user._id.toString();

    try {
        const newClass = await Class.create(classData);

        studentsData.forEach((student) => {
            if (!student.gender) student.gender = "male";

            student.avatar = getAvatar(student.gender);
            student.classId = newClass._id.toString();
            student.className = classData.className;
            student.classTeacher = req.user.username;
        });

        const newStudents = await Student.insertMany(studentsData);

        const identifications = [];
        newStudents.forEach((student) =>
            identifications.push(student._id.toString())
        );

        await Class.findByIdAndUpdate(newClass._id, {
            $set: { classStudents: identifications },
        });

        res.status(200).json({
            success: true,
            classId: newClass._id.toString(),
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// edit class
router.patch("/edit", requireTeacher, async (req, res) => {
    let { classId, newName, newTheme } = req.body;

    if (!newName) newName = getClassName();

    try {
        const { classStudents } = await Class.findByIdAndUpdate(classId, {
            className: newName,
            classTheme: newTheme,
        });

        await Student.updateMany(
            { _id: { $in: classStudents } },
            { className: newName }
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: "Operation Failed" });
    }
});

// delete class
router.delete("/delete", requireTeacher, async (req, res) => {
    const classId = req.body.classId;

    try {
        await Class.findByIdAndDelete(classId);
        await Student.deleteMany({ classId });

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
});

// export router
export default router;
