import { ITokenPayload } from '../../shared/types';

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(payload: ITokenPayload): string;
  verifyToken(token: string): ITokenPayload;
}