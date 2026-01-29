
import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/comment.controller';

const router = Router();

// Routes for comments under a specific post
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', createComment);

// Route for deleting a comment (top-level or mounted appropriately)
router.delete('/comments/:id', deleteComment);

export default router;
