import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../domain/usecases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../domain/usecases/auth/LoginUserUseCase';
import { RegisterDTO, LoginDTO } from '../../application/dtos/AuthDTO';
import { IApiResponse, IAuthResponse } from '../../shared/types';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new RegisterDTO(req.body);
      dto.validate();

      const result = await this.registerUseCase.execute({
        name: dto.name,
        email: dto.email,
        password: dto.password
      });

      const response: IApiResponse<IAuthResponse> = {
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: result
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new LoginDTO(req.body);
      dto.validate();

      const result = await this.loginUseCase.execute(dto.email, dto.password);

      const response: IApiResponse<IAuthResponse> = {
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}