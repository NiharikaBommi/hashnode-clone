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