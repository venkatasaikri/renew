import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
