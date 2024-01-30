import express from 'express';
import { logOut } from '../controllers/LogOutController';


const router = express.Router();

router.get('/logout', logOut)

export default router;