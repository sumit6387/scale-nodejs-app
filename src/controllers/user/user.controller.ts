import { Request, Response } from 'express';
import { logError, ResponseHandler } from '../../handlers';
import { User } from '../../models';

const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 100;

export class UserController {
  constructor() {}

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phoneNumber, age } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        ResponseHandler.error(res, {
          msg: 'An account with this email already exists',
          statusCode: 409,
        });
        return;
      }

      const user = await User.create({ name, email, phoneNumber, age });

      ResponseHandler.success(res, {
        msg: 'User created successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Failed to create user',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(
        MAX_PAGE_LIMIT,
        Math.max(1, parseInt(req.query.limit as string, 10) || DEFAULT_PAGE_LIMIT)
      );
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        User.countDocuments(),
      ]);

      ResponseHandler.success(res, {
        msg: 'Users fetched successfully',
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logError(`/api/v1/users`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Failed to fetch users',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id).lean();

      if (!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }

      ResponseHandler.success(res, {
        msg: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users/${req.params.id}`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Failed to fetch user',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).lean();

      if (!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }

      ResponseHandler.success(res, {
        msg: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users/${req.params.id}`, 'PATCH', error as Error);
      ResponseHandler.error(res, {
        msg: 'Failed to update user',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.id).lean();

      if (!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }

      ResponseHandler.success(res, {
        msg: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/users/${req.params.id}`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Failed to delete user',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
