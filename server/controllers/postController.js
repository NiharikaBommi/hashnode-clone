import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
    try {

        //find all post with status published and populate author and tags fields in descending order of createdAt
        //enabling post search via search option
        const { search } = req.query;
        const query = {
            status: "published"
        };

        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }
        const posts = await Post.find(query)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const post = await Post.findOne({ slug, status: "published" })
            .populate("author", "name email");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

//Function to update post by id
export const updatePostById = async (req, res) => {
    const { id } = req.params;
    try {
        //check if the post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //check if the user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
        const {
            title,
            content,
            excerpt,
            coverImage,
            status,
            tags
        } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (status !== undefined) updateData.status = status;
        if (tags !== undefined) updateData.tags = tags;

        Object.assign(post, updateData);

        await post.save();

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


//function to delete post by id
export const deletePostById = async (req, res) => {
    const { id } = req.params;
    try {
        //find postby id
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        //check if the user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        //remove the post
        await post.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

//function to get all posts of the logged in user
export const getMyPosts = async (req, res) => {
    try {
        //fetch the user id from the request object
        const userId = req.user.id;

        //fetch all posts of the user and populate author field in descending order of createdAt
        const posts = await Post.find({ author: userId })
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}