import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../users/user.validation';

const authRoutes = Router();

authRoutes.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.register,
);

authRoutes.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

authRoutes.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export default authRoutes;
