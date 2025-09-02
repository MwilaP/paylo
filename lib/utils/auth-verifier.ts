import jwt from 'jsonwebtoken';
import { Logger } from './logger';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export function verifyJwt(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    Logger.error('JWT_SECRET environment variable not set');
    throw new Error('Authentication configuration error');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    Logger.error('JWT verification failed', { error });
    throw new Error('Invalid or expired token');
  }
}