module.exports = {
  preset: 'ts-jest',
  
  testEnvironment: 'node',
  
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/infrastructure/http/server.ts'
  ],
  
  coverageDirectory: 'coverage',
  
  coverageReporters: ['text', 'html', 'json'],
  
  testTimeout: 10000,
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};