import { LoginUserUseCase } from './LoginUserUseCase';
import { User } from '../../entities/User';

const mockUserRepository = {
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn()
};

const mockAuthService = {
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn()
};

describe('LoginUserUseCase', () => {
  let loginUseCase: LoginUserUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUserUseCase(mockUserRepository, mockAuthService);
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const user = new User(1, 'John Doe', 'john@example.com', 'hashed_password');
    
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePassword.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue('fake_jwt_token');

    const result = await loginUseCase.execute('john@example.com', '123456');

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('john@example.com');
    expect(mockAuthService.generateToken).toHaveBeenCalledWith({
      userId: 1,
      email: 'john@example.com',
      name: 'John Doe'
    });
  });

  it('should throw error if user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute('notfound@example.com', '123456')).rejects.toThrow(
      'Credenciais inválidas'
    );
  });

  it('should throw error if password is incorrect', async () => {
    const user = new User(1, 'John Doe', 'john@example.com', 'hashed_password');
    
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePassword.mockResolvedValue(false);

    await expect(loginUseCase.execute('john@example.com', 'wrong')).rejects.toThrow(
      'Credenciais inválidas'
    );
  });
});