process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.GEMINI_API_KEY = 'test_api_key';

jest.setTimeout(10000);

global.console.error = jest.fn();
global.console.log = jest.fn();