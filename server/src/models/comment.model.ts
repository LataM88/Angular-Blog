
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Comment = mongoose.model('Comment', CommentSchema);
