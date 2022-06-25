import { Router } from 'express';

import userRoutes from './user';
import authRoutes from './auth';

const router = Router();

router.use('/user', userRoutes);

router.use('/auth', authRoutes);

export default router;
