import { ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../handlers/response.handler';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      console.log(errors);

      return ResponseHandler.error(res, {
        statusCode: 400,
        msg: errors[0],
        error: errors,
      });
    }

    req.body = result.data;
    next();
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatZodErrors = (error: any): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return JSON.parse(error?.message)?.map((err: any) => {
    const path = err.path.length ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
};
