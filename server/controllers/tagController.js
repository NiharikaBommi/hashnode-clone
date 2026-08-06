import Tag from "../models/Tag.js";
import Post from "../models/Post.js";


export const getAllTags = async (req, res, next) => {
    // Function to get all tags
    try {
        // Fetch all tags from the database by selecting only the name and slug fields
        const tags = await Tag.find().select("name slug");
        //calculate the number of posts for each tag
        const tagsWithPostCount = await Promise.all(tags.map(async (tag) => {
            const postCount = await Post.countDocuments({ tags: tag._id });
            return {
                _id: tag._id,
                name: tag.name,
                slug: tag.slug,
                postCount
            };
        }));
        return res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            data: {
                count: tagsWithPostCount.length,
                tags: tagsWithPostCount
            }
        });
    } catch (error) {
        return next(error);
    }
}

export const getPostByTag = async (req, res, next) => {
    // Function to get posts by tag slug
    const { slug } = req.params;
    try {
        // Find the tag by slug
        const tag = await Tag.findOne({ slug });
        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }
        // Find all posts with the tag id and status published, populate author and tags fields in descending order of createdAt
        const posts = await Post.find({ tags: tag._id, status: "published" })
            .populate("author", "name email")
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: {
                count: posts.length,
                posts
            }
        });
    } catch (error) {
        return next(error);
    }
}