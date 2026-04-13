import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../infrastructure/security/JWTService';
import { ITokenPayload } from '../../shared/types';

export interface AuthRequest extends Request {
  user?: ITokenPayload;
}

export const authMiddleware = (tokenService: ITokenService) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = tokenService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  };
};
