import express from 'express';
import type { Router } from 'express';
import { refreshTokenPost } from '../controllers/refresh-token';
import { logoutPost } from '../controllers/logout-control';
const router: Router = express.Router();

router.post('/', logoutPost);

router.post('/refresh-token', refreshTokenPost);

export default router;
