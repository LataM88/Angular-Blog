
import { Request, Response } from 'express';
import { Comment } from '../models/comment.model';

export const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        const mappedComments = comments.map(c => ({
            id: c._id,
            postId: c.postId,
            authorId: c.authorId,
            authorName: c.authorName,
            text: c.text,
            createdAt: c.createdAt
        }));
        res.json(mappedComments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const { authorId, authorName, text } = req.body;
        const newComment = new Comment({
            postId: req.params.postId,
            authorId,
            authorName,
            text
        });
        const savedComment = await newComment.save();
        res.json({
            id: savedComment._id,
            postId: savedComment.postId,
            authorId: savedComment.authorId,
            authorName: savedComment.authorName,
            text: savedComment.text,
            createdAt: savedComment.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { userId, postAuthorId } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const isCommentAuthor = comment.authorId === userId;
        const isPostAuthor = postAuthorId && userId === postAuthorId;

        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete comment' });
    }
};
