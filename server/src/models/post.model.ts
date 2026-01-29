
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: String,
    text: String,
    image: String,
    authorId: String,
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    // Poll fields
    pollEnabled: { type: Boolean, default: false },
    pollQuestion: { type: String, default: 'Jak oceniasz ten post?' },
    pollOptions: [{
        text: String,
        votes: { type: Number, default: 0 }
    }],
    pollVoters: [{ type: String }],
    // Rating fields
    ratings: [{
        userId: String,
        stars: Number
    }],
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
});

export const Post = mongoose.model('Post', PostSchema);
