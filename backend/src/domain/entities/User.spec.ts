import { User } from './User';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user', () => {
      const user = User.create('John Doe', 'john@email.com', '123456');

      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@email.com');
      expect(user.password).toBe('123456');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when name is too short', () => {
      expect(() => {
        User.create('Jo', 'john@email.com', '123456');
      }).toThrow('Nome deve ter no mínimo 3 caracteres');
    });

    it('should throw error when email is invalid', () => {
      expect(() => {
        User.create('John Doe', 'invalid-email', '123456');
      }).toThrow('E-mail inválido');
    });

    it('should throw error when password is too short', () => {
      expect(() => {
        User.create('John Doe', 'john@email.com', '123');
      }).toThrow('Senha deve ter no mínimo 6 caracteres');
    });
  });

  describe('validate', () => {
    it('should validate a correct user', () => {
      const user = new User(1, 'John Doe', 'john@email.com', 'hashed123');
      expect(() => user.validate()).not.toThrow();
    });

    it('should throw multiple validation errors', () => {
      const user = new User(1, 'Jo', 'invalid', '123');
      expect(() => user.validate()).toThrow();
    });
  });

  describe('toJSON', () => {
    it('should return user without password', () => {
      const user = new User(1, 'John Doe', 'john@email.com', 'hashed123');
      const json = user.toJSON();

      expect(json).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@email.com',
        createdAt: user.createdAt,
      });
      expect(json).not.toHaveProperty('password');
    });
  });
});
