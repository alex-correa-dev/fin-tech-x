import { JWTService } from './JWTService';

describe('JWTService', () => {
  let jwtService: JWTService;
  const secret = 'test_secret_key';
  const expiresIn = '1h';

  beforeEach(() => {
    jwtService = new JWTService(secret, expiresIn);
  });

  it('should generate a valid token', () => {
    const payload = {
      userId: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    const token = jwtService.generateToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid token', () => {
    const payload = {
      userId: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    const token = jwtService.generateToken(payload);
    const decoded = jwtService.verifyToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.name).toBe(payload.name);
  });

  it('should throw error for invalid token', () => {
    const invalidToken = 'invalid.token.here';

    expect(() => jwtService.verifyToken(invalidToken)).toThrow('Token inválido ou expirado');
  });

  it('should throw error for expired token', async () => {
    const shortExpiryJWT = new JWTService(secret, '1ms');
    const payload = { userId: 1, email: 'test@example.com', name: 'Test' };
    const token = shortExpiryJWT.generateToken(payload);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(() => shortExpiryJWT.verifyToken(token)).toThrow();
  });
});
