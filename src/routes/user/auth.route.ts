import { Router } from 'express';
import { AuthController } from '../../controllers/user/auth.controller';
import { validateRequest } from '../../validations';
import { loginSchema, refreshTokenSchema, registerSchema } from '../../validations/auth.validation';

export class AuthRoute {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  private routes() {
    this.router.post(
      '/register',
      validateRequest(registerSchema),
      this.authController.register.bind(this.authController)
    );
    this.router.post(
      '/login',
      validateRequest(loginSchema),
      this.authController.login.bind(this.authController)
    );
    this.router.post(
      '/refresh',
      validateRequest(refreshTokenSchema),
      this.authController.refresh.bind(this.authController)
    );
  }
}
