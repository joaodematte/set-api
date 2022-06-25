import { Router } from 'express';
import createAuth from '../controllers/auth';

const router = Router();

router.post('/create', createAuth);

export default router;
