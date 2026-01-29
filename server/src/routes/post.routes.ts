
import { Router } from 'express';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    votePoll,
    ratePost
} from '../controllers/post.controller';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/vote', votePoll);
router.post('/:id/rate', ratePost);

export default router;
