import { Router } from 'express';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { userRole } from './user.const';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
const router = Router();
router.post(
  '/create-admin',
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.createUser,
);

router.patch(
  '/:id/block',
  auth('admin'),
  // validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUserActiveStatus,
);

router.get(
  '/get-my-data',
  auth(userRole.admin, userRole.customer),
  UserControllers.getUser,
);

router.get('/', auth(userRole.admin), UserControllers.getAllUsers);

export const userRoutes = router;
