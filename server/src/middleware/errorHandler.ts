import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Custom Operational Application Error Class
 * Allows throwing explicit HTTP status errors across controllers and services.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized Express Error Boundary Middleware
 * 
 * Intercepts all synchronous and asynchronous errors forwarded via next(err).
 * Normalizes error signatures across different layers:
 * 1. Zod Schema Validation Errors -> 400 Bad Request with granular field paths
 * 2. JWT Authentication/Expiration Errors -> 401 Unauthorized
 * 3. Prisma ORM Database Errors -> 400/404/409 with sanitized messages
 * 4. Custom AppError instances -> Specified status code and operational message
 * 5. Unhandled Runtime Exceptions -> 500 Internal Server Error (hides stack trace in production)
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log telemetry details for observability
  console.error(`[Error Boundary] ${req.method} ${req.path} failed:`, {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
  });

  // 1. Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Input validation failed. Please check your submission.',
      errors: formattedErrors,
    });
  }

  // 2. Handle JWT Authentication & Token Expiry Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid session token. Please log in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please log in again.',
    });
  }

  // 3. Handle Prisma Database Constraint Errors
  if (err.code === 'P2002') {
    // Unique constraint violation (e.g. duplicate email)
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`,
    });
  }

  if (err.code === 'P2025') {
    // Record not found during update/delete
    return res.status(404).json({
      success: false,
      message: 'The requested record does not exist or has been removed.',
    });
  }

  // 4. Operational / Controlled Application Errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "We couldn't complete that request. Please try again.";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
