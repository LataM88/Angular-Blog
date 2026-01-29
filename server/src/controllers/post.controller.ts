
import { Request, Response } from 'express';
import { Post } from '../models/post.model';

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ _id: -1 });
        const mappedPosts = posts.map(p => ({
            id: p._id,
            title: p.title,
            text: p.text,
            image: p.image,
            authorId: p.authorId,
            likes: p.likes || 0,
            likedBy: p.likedBy || [],
            pollEnabled: p.pollEnabled || false,
            pollQuestion: p.pollQuestion,
            pollOptions: p.pollOptions || [],
            pollVoters: p.pollVoters || [],
            averageRating: p.averageRating || 0,
            ratingCount: p.ratingCount || 0,
            ratings: p.ratings || []
        }));
        res.json(mappedPosts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.json({
            id: post._id,
            title: post.title,
            text: post.text,
            image: post.image,
            authorId: post.authorId,
            likes: post.likes || 0,
            likedBy: post.likedBy || [],
            pollEnabled: post.pollEnabled || false,
            pollQuestion: post.pollQuestion,
            pollOptions: post.pollOptions || [],
            pollVoters: post.pollVoters || [],
            averageRating: post.averageRating || 0,
            ratingCount: post.ratingCount || 0,
            ratings: post.ratings || []
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch post' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, text, image, authorId, pollEnabled, pollQuestion, pollOptions } = req.body;
        const newPost = new Post({
            title,
            text,
            image,
            authorId,
            pollEnabled: pollEnabled || false,
            pollQuestion: pollQuestion || 'Jak oceniasz ten post?',
            pollOptions: pollEnabled ? (pollOptions || [
                { text: 'Pomocny', votes: 0 },
                { text: 'Ciekawy', votes: 0 },
                { text: 'Interesujący', votes: 0 }
            ]) : []
        });
        const savedPost = await newPost.save();
        res.json({
            id: savedPost._id,
            title: savedPost.title,
            text: savedPost.text,
            image: savedPost.image,
            authorId: savedPost.authorId,
            pollEnabled: savedPost.pollEnabled,
            pollQuestion: savedPost.pollQuestion,
            pollOptions: savedPost.pollOptions
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { title, text, image, authorId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId !== authorId) {
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        post.title = title;
        post.text = text;
        post.image = image;
        const updatedPost = await post.save();

        return res.json({
            id: updatedPost._id,
            title: updatedPost.title,
            text: updatedPost.text,
            image: updatedPost.image,
            authorId: updatedPost.authorId
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update post' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId !== authorId) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete post' });
    }
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likedBy = post.likedBy || [];
        const userIndex = likedBy.indexOf(userId);
        let isLiked: boolean;

        if (userIndex === -1) {
            likedBy.push(userId);
            post.likes = (post.likes || 0) + 1;
            isLiked = true;
        } else {
            likedBy.splice(userIndex, 1);
            post.likes = Math.max((post.likes || 0) - 1, 0);
            isLiked = false;
        }

        post.likedBy = likedBy;
        await post.save();

        return res.json({
            likes: post.likes,
            likedBy: post.likedBy,
            isLiked
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to toggle like' });
    }
};

export const votePoll = async (req: Request, res: Response) => {
    try {
        const { userId, optionIndex } = req.body;
        if (!userId || optionIndex === undefined) {
            return res.status(400).json({ error: 'userId and optionIndex are required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.pollEnabled) {
            return res.status(400).json({ error: 'Poll is not enabled for this post' });
        }

        if (post.pollVoters && post.pollVoters.includes(userId)) {
            return res.status(400).json({ error: 'User already voted' });
        }

        if (post.pollOptions && post.pollOptions[optionIndex]) {
            post.pollOptions[optionIndex].votes = (post.pollOptions[optionIndex].votes || 0) + 1;
            post.pollVoters = post.pollVoters || [];
            post.pollVoters.push(userId);
            await post.save();

            return res.json({
                pollOptions: post.pollOptions,
                pollVoters: post.pollVoters
            });
        }

        return res.status(400).json({ error: 'Invalid option index' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to vote' });
    }
};

export const ratePost = async (req: Request, res: Response) => {
    try {
        const { userId, stars } = req.body;
        if (!userId || !stars || stars < 1 || stars > 5) {
            return res.status(400).json({ error: 'userId and stars (1-5) are required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId === userId) {
            return res.status(400).json({ error: 'Cannot rate your own post' });
        }

        const ratings = post.ratings || [];
        const existingRatingIndex = ratings.findIndex((r: any) => r.userId === userId);

        if (existingRatingIndex !== -1) {
            ratings[existingRatingIndex].stars = stars;
        } else {
            ratings.push({ userId, stars });
        }

        const totalStars = ratings.reduce((sum: number, r: any) => sum + r.stars, 0);
        post.ratings = ratings;
        post.ratingCount = ratings.length;
        post.averageRating = Math.round((totalStars / ratings.length) * 10) / 10;

        await post.save();

        return res.json({
            averageRating: post.averageRating,
            ratingCount: post.ratingCount,
            userRating: stars
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to rate post' });
    }
};
