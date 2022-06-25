import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/user';

const router = Router();

router.post('/create', createUser);

router.get('/get-all', getAllUsers);

export default router;
