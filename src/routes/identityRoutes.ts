import {Router} from 'express';
import * as identityController from '../controllers/identityController';

const router = Router();
router.post('/register', identityController.register);
router.post('/login', identityController.login);
router.post('/refresh', identityController.refreshToken);

export default router;