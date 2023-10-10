/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import ErrorResponse from './interfaces/ErrorResponse';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error('errorHandler', err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('authenticate');
  try {
    const response = await fetch(`${process.env.AUTH_URL}/api/v1/token`, {
      headers: {
        Authorization: req.headers.authorization || '',
      },
    });
    if (!response.ok) {
      throw new CustomError('Authentication failed', 401);
    }
    const message = await response.json();
    const user = jwt.verify(message.token, process.env.JWT_SECRET as string);
    res.locals.user = message.user;
  } catch (error) {
    throw new CustomError('Authentication failed', 401);
  }
};

export {notFound, errorHandler, authenticate};
