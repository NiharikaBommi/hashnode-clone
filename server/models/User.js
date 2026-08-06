import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, required: false, trim: true },
    avatarUrl: { type: String, required: false, trim: true }

}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;