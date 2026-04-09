import { PostgresUserRepository } from './PostgresUserRepository';
import { User } from '../../domain/entities/User';

const mockQuery = jest.fn();
const mockDatabase = {
  query: mockQuery,
  getPool: jest.fn().mockReturnValue({}),
  connect: jest.fn(),
  disconnect: jest.fn()
};

describe('PostgresUserRepository', () => {
  let repository: PostgresUserRepository;

  beforeEach(() => {
    repository = new PostgresUserRepository(mockDatabase as any);
    jest.clearAllMocks();
  });

  it('should save a user successfully', async () => {
    const user = User.create('John Doe', 'john@example.com', 'hashed123');
    const expectedRow = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      created_at: new Date()
    };
    
    mockQuery.mockResolvedValue({ rows: [expectedRow] });

    const savedUser = await repository.save(user);

    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.id).toBe(1);
    expect(savedUser.name).toBe('John Doe');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should find user by email', async () => {
    const expectedRow = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed123',
      created_at: new Date()
    };
    
    mockQuery.mockResolvedValue({ rows: [expectedRow] });

    const user = await repository.findByEmail('john@example.com');

    expect(user).toBeInstanceOf(User);
    expect(user?.email).toBe('john@example.com');
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = $1',
      ['john@example.com']
    );
  });

  it('should return null when user not found by email', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const user = await repository.findByEmail('notfound@example.com');

    expect(user).toBeNull();
  });

  it('should find user by id', async () => {
    const expectedRow = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed123',
      created_at: new Date()
    };
    
    mockQuery.mockResolvedValue({ rows: [expectedRow] });

    const user = await repository.findById(1);

    expect(user).toBeInstanceOf(User);
    expect(user?.id).toBe(1);
  });

  it('should check if user exists', async () => {
    mockQuery.mockResolvedValue({ rows: [{ exists: true }] });

    const exists = await repository.exists('john@example.com');

    expect(exists).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      ['john@example.com']
    );
  });
});