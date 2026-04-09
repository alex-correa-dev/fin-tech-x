import { Router } from 'express';
import { AuthController } from '../../../interfaces/controllers/AuthController';
import { validateRegister, validateLogin } from '../../../interfaces/validators/authValidator';

export const authRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', validateRegister, (req, res, next) => {
    authController.register(req, res, next);
  });

  router.post('/login', validateLogin, (req, res, next) => {
    authController.login(req, res, next);
  });

  return router;
};