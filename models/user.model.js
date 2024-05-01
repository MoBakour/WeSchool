// imports
import mongoose from "mongoose";

// user schema object
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            maxlength: 30,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// user model
const User = mongoose.model("user", userSchema);

// export model
export default User;
