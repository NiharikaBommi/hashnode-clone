import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful", token, user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } else {
        return res.status(400).json({ message: "Invalid credentials" });
    }
}
export const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};

export const createPost = async (req, res) => {
    const { title, content, excerpt, coverImage, status, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        let slug = title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

        const existingPost = await Post.findOne({ slug });

        if (existingPost) {
            const count = await Post.countDocuments({
                slug: new RegExp(`^${slug}(-\\d+)?$`)
            });

            slug = `${slug}-${count + 1}`;
        }
        const author = req.user._id;
        const newPost = new Post({
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status,
            author,
            tags
        });
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", post: newPost });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
