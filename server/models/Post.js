import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,

        trim: true
    },
    coverImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {
    timestamps: true
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;