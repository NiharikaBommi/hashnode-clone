import User from '../models/User.js';
import Post from '../models/Post.js';

//Get the public user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        //find the user by ID 
        const user = await User.findById(id).select("name bio avatarUrl");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //User found, now get all the posts by this user that are published, populate the author and tags fields in descending order of createdAt
        const posts = await Post.find({ author: user._id, status: "published" })
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            user,
            posts
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Update the current logged in user's profile
export const updateUserProfile = async (req, res) => {
    const { name, bio, avatarUrl } = req.body;
    //Get the current logged in user from the request object
    const userId = req.user.id;
    try {
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        //Update the user profile with the new data and return the updated user
        const user = await User.findByIdAndUpdate(userId, updateData,
            { new: true, runValidators: true })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}