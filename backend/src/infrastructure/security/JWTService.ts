import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../../shared/types';

export interface ITokenService {
  generateToken(payload: ITokenPayload): string;
  verifyToken(token: string): ITokenPayload;
}

export class JWTService implements ITokenService {
  constructor(
    private secret: string,
    private expiresIn: string = '7d'
  ) {}

  generateToken(payload: ITokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, this.secret) as ITokenPayload;
    } catch {
      throw new Error('Token inválido ou expirado');
    }
  }
}
