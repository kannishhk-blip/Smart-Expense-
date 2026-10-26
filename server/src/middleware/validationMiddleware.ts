import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        const firstMessage = error.errors[0]?.message || 'Invalid input data';
        return res.status(400).json({
          success: false,
          message: firstMessage,
          errors: errorMessages,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        const firstMessage = error.errors[0]?.message || 'Invalid query parameters';
        return res.status(400).json({
          success: false,
          message: firstMessage,
          errors: errorMessages,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
      });
    }
  };
};
