import User from "../models/User.js";
import Post from "../models/Post.js";
import Tag from "../models/Tag.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        return next(error);
    }

}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = generateToken(user._id);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        return next(error);
    }

}
export const getCurrentUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Current user fetched successfully",
        data: {
            user: req.user
        }
    });
};

export const createPost = async (req, res, next) => {
    const { title, content, excerpt, coverImage, status, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
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
        // finding unique tags and creating them if they don't exist
        const uniqueTags = [...new Set((tags || []).map(tag =>
            tag.toLowerCase().trim()
        ))];
        // creating tags if they don't exist and getting their ids
        const tagIds = await Promise.all(
            uniqueTags.map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                //if the tag doesn't exist, create it and save it to the database
                if (!tag) {
                    const tagSlug = tagName
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "");

                    tag = new Tag({
                        name: tagName,
                        slug: tagSlug
                    });

                    await tag.save();
                }

                return tag._id;
            })
        );
        const author = req.user._id;
        const newPost = new Post({
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status,
            author,
            tags: tagIds
        });
        await newPost.save();
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: {
                post: newPost
            }
        });
    }
    catch (error) {
        return next(error);
    }
}
