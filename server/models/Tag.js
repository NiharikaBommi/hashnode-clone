import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
export default Tag;