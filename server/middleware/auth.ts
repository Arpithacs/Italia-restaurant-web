import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'italia-fallback-secret-key-12345';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
     res.status(401).json({ error: 'Access denied. No token provided.' });
     return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
     res.status(401).json({ error: 'Invalid token format. Use: Bearer <token>' });
     return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; name: string };
    req.user = decoded;
    next();
  } catch (err) {
     res.status(401).json({ error: 'Invalid or expired token.' });
     return;
  }
}
