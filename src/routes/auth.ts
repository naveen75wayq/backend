import express from 'express';
import { signIn } from '../controllers/AuthController';

const router = express.Router();

router.post('/signin', signIn)

export default router;