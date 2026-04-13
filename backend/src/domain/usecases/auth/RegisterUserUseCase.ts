import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IAuthService } from '../../../application/ports/IAuthService';
import { IAuthResponse } from '../../../shared/types';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(input: RegisterUserInput): Promise<IAuthResponse> {
    const { name, email, password } = input;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já existe com este e-mail');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = User.create(name, email, hashedPassword);

    const savedUser = await this.userRepository.save(user);

    const token = this.authService.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
    });

    return {
      user: savedUser.toJSON(),
      token,
    };
  }
}
