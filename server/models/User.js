import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, required: false },
    avatarUrl: { type: String, required: false }

})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;