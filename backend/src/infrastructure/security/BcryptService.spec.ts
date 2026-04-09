import { BcryptService } from './BcryptService';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(() => {
    bcryptService = new BcryptService(10);
  });

  it('should hash a password correctly', async () => {
    const password = 'mySecret123';
    const hashed = await bcryptService.hash(password);
    
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(password);
    expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/);
  });

  it('should compare password correctly', async () => {
    const password = 'mySecret123';
    const hashed = await bcryptService.hash(password);
    
    const isValid = await bcryptService.compare(password, hashed);
    expect(isValid).toBe(true);
  });

  it('should return false for wrong password', async () => {
    const password = 'mySecret123';
    const wrongPassword = 'wrongPassword';
    const hashed = await bcryptService.hash(password);
    
    const isValid = await bcryptService.compare(wrongPassword, hashed);
    expect(isValid).toBe(false);
  });

  it('should generate different hashes for same password', async () => {
    const password = 'mySecret123';
    
    const hash1 = await bcryptService.hash(password);
    const hash2 = await bcryptService.hash(password);
    
    expect(hash1).not.toBe(hash2);
  });
});