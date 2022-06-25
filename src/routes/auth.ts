import { Router } from 'express';
import { createAuth, getUserByJWT } from '../controllers/auth';

const router = Router();

router.post('/create', createAuth);

router.get('/by-jwt', getUserByJWT);

export default router;
