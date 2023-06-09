import {Router} from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getAllMyModels);
router.get('/:id', userController.getMyModel);
router.post('/', userController.createMyModel);

export default router;