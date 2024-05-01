// imports
import mongoose from "mongoose";

// class schema object
const classSchema = new mongoose.Schema(
    {
        classTeacher: {
            type: String,
            required: true,
            trim: true,
        },
        className: {
            type: String,
            required: true,
            trim: true,
        },
        classTheme: {
            type: String,
            trim: true,
        },
        classStudents: Array,
    },
    { timestamps: true }
);

// class model
const Class = mongoose.model("class", classSchema);

// export class model
export default Class;
