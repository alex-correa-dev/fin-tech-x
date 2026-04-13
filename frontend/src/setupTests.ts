import '@testing-library/jest-dom';

const mockScrollIntoView = jest.fn();

Object.defineProperty(window, 'HTMLElement', {
  value: class extends HTMLElement {
    scrollIntoView = mockScrollIntoView;
  },
});

Object.defineProperty(global, 'scrollTo', {
  value: jest.fn(),
});

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Element.prototype.scrollIntoView = mockScrollIntoView;
