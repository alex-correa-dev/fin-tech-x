import { IAuthService } from '../ports/IAuthService';
import { ITokenPayload } from '../../shared/types';

export interface IHashService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface ITokenService {
  generateToken(payload: ITokenPayload): string;
  verifyToken(token: string): ITokenPayload;
}

export class AuthService implements IAuthService {
  constructor(
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return this.hashService.hash(password);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return this.hashService.compare(password, hashedPassword);
  }

  generateToken(payload: ITokenPayload): string {
    return this.tokenService.generateToken(payload);
  }

  verifyToken(token: string): ITokenPayload {
    return this.tokenService.verifyToken(token);
  }
}