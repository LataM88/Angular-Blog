
import { Router } from 'express';
import { createUser, authenticateUser, logoutUser } from '../controllers/user.controller';

const router = Router();

router.post('/create', createUser);
router.post('/auth', authenticateUser);
router.delete('/logout/:id', logoutUser);

export default router;
