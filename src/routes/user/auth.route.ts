import { Router } from 'express';
import { AuthController } from '../../controllers/user/auth.controller';
import { verifyToken } from '../../middlewares';
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
      verifyToken,
      this.authController.register.bind(this.authController)
    );
  }
}
