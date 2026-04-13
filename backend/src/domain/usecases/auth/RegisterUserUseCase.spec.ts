import { RegisterUserUseCase } from './RegisterUserUseCase';
import { User } from '../../entities/User';

const mockUserRepository = {
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
};

const mockAuthService = {
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

describe('RegisterUserUseCase', () => {
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    registerUseCase = new RegisterUserUseCase(mockUserRepository, mockAuthService);
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockAuthService.hashPassword.mockResolvedValue('hashed_password');
    mockUserRepository.save.mockResolvedValue(
      new User(1, input.name, input.email, 'hashed_password')
    );
    mockAuthService.generateToken.mockReturnValue('fake_jwt_token');

    const result = await registerUseCase.execute(input);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.name).toBe(input.name);
    expect(result.user.email).toBe(input.email);
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAuthService.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should throw error if user already exists', async () => {
    const input = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: '123456',
    };

    mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: input.email });

    await expect(registerUseCase.execute(input)).rejects.toThrow(
      'Usuário já existe com este e-mail'
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error if name is invalid', async () => {
    const input = {
      name: 'Jo',
      email: 'john@example.com',
      password: '123456',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(registerUseCase.execute(input)).rejects.toThrow(
      'Nome deve ter no mínimo 3 caracteres'
    );
  });
});
