import { RegisterDTO, LoginDTO } from './AuthDTO';

describe('AuthDTOs', () => {
  describe('RegisterDTO', () => {
    it('should create valid RegisterDTO', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456'
      };
      
      const dto = new RegisterDTO(data);
      
      expect(dto.name).toBe(data.name);
      expect(dto.email).toBe(data.email);
      expect(dto.password).toBe(data.password);
    });

    it('should validate valid data', () => {
      const dto = new RegisterDTO({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456'
      });
      
      expect(() => dto.validate()).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const dto = new RegisterDTO({
        name: '',
        email: 'john@example.com',
        password: '123456'
      });
      
      expect(() => dto.validate()).toThrow('Nome é obrigatório');
    });

    it('should throw error when email is invalid', () => {
      const dto = new RegisterDTO({
        name: 'John Doe',
        email: 'invalid',
        password: '123456'
      });
      
      expect(() => dto.validate()).toThrow('E-mail inválido');
    });

    it('should throw error when password is too short', () => {
      const dto = new RegisterDTO({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      });
      
      expect(() => dto.validate()).toThrow('Senha deve ter no mínimo 6 caracteres');
    });
  });

  describe('LoginDTO', () => {
    it('should create valid LoginDTO', () => {
      const dto = new LoginDTO({
        email: 'john@example.com',
        password: '123456'
      });
      
      expect(dto.email).toBe('john@example.com');
      expect(dto.password).toBe('123456');
    });

    it('should validate valid data', () => {
      const dto = new LoginDTO({
        email: 'john@example.com',
        password: '123456'
      });
      
      expect(() => dto.validate()).not.toThrow();
    });

    it('should throw error when email is missing', () => {
      const dto = new LoginDTO({
        email: '',
        password: '123456'
      });
      
      expect(() => dto.validate()).toThrow('E-mail e senha são obrigatórios');
    });

    it('should throw error when password is missing', () => {
      const dto = new LoginDTO({
        email: 'john@example.com',
        password: ''
      });
      
      expect(() => dto.validate()).toThrow('E-mail e senha são obrigatórios');
    });
  });
});