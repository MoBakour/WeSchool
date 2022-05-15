// imports
import mongoose from "mongoose";

// student schema object
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
        trim: true,
    },
    points: {
        type: Number,
        default: 0,
    },
    classId: {
        type: String,
        required: true,
        trim: true,
    },
    className: {
        type: String,
        required: true,
        trim: true,
    },
    classTeacher: {
        type: String,
        required: true,
        trim: true,
    },
});

// student model
const Student = mongoose.model("student", studentSchema);

// export model
export default Student;
