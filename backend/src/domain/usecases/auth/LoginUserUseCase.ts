import { IUserRepository } from '../../repositories/IUserRepository';
import { IAuthService } from '../../../application/ports/IAuthService';
import { IAuthResponse } from '../../../shared/types';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string): Promise<IAuthResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await this.authService.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    return {
      user: user.toJSON(),
      token
    };
  }
}