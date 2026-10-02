import { Router } from 'express';
import { UserController } from '../../controllers/user/user.controller';
import { validateRequest } from '../../validations';
import { verifyToken } from '../../middlewares';
import { createUserSchema, updateUserSchema } from '../../validations/user.validation';

export class UserRoute {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.routes();
  }

  private routes() {
    this.router.use(verifyToken);

    this.router.post(
      '/',
      validateRequest(createUserSchema),
      this.userController.createUser.bind(this.userController)
    );
    this.router.get('/', this.userController.getUsers.bind(this.userController));
    this.router.get('/:id', this.userController.getUserById.bind(this.userController));
    this.router.patch(
      '/:id',
      validateRequest(updateUserSchema),
      this.userController.updateUser.bind(this.userController)
    );
    this.router.delete('/:id', this.userController.deleteUser.bind(this.userController));
  }
}
