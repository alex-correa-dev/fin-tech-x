import DOMPurify from 'dompurify';
import validator from 'validator';
import xss from 'xss';

const xssStrictConfig = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

const xssLooseConfig = {
  whiteList: {
    b: [],
    strong: [],
    em: [],
    i: [],
    p: [],
    br: [],
    ul: [],
    ol: [],
    li: [],
    a: ['href', 'target', 'rel'],
    code: [],
    pre: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
};

export const sanitizeInput = (input: string): string => {
  if (!input) {
    return '';
  }

  let sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  sanitized = xss(sanitized, xssStrictConfig);
  sanitized = validator.trim(sanitized);
  sanitized = sanitized.substring(0, 500);

  return sanitized;
};

export const sanitizeResponse = (response: string): string => {
  if (!response) {
    return '';
  }

  let sanitized = DOMPurify.sanitize(response, {
    ALLOWED_TAGS: ['b', 'strong', 'em', 'i', 'p', 'br', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  sanitized = xss(sanitized, xssLooseConfig);
  sanitized = validator.trim(sanitized);
  sanitized = sanitized.substring(0, 5000);

  return sanitized;
};

export const sanitizeName = (name: string): string => {
  if (!name) {
    return '';
  }

  let sanitized = validator.trim(name);
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = xss(sanitized, xssStrictConfig);
  sanitized = sanitized.substring(0, 100);

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  if (!email) {
    return '';
  }

  const trimmedEmail = validator.trim(email);

  const normalized = validator.normalizeEmail(trimmedEmail, {
    all_lowercase: true,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  });

  let sanitized = normalized || trimmedEmail.toLowerCase();
  sanitized = validator.trim(sanitized);
  sanitized = xss(sanitized, xssStrictConfig);
  sanitized = validator.trim(sanitized);

  return sanitized;
};

export const sanitizeString = (value: string): string => {
  if (!value) {
    return '';
  }

  let sanitized = validator.trim(value);
  sanitized = validator.stripLow(sanitized);

  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  sanitized = xss(sanitized, xssStrictConfig);
  sanitized = validator.trim(sanitized);
  sanitized = sanitized.substring(0, 255);

  return sanitized;
};

export const isValidEmail = (email: string): boolean => {
  if (!email) {
    return false;
  }

  return validator.isEmail(email);
};

export const isValidPassword = (password: string): boolean => {
  if (!password) {
    return false;
  }

  return validator.isLength(password, { min: 6, max: 100 });
};
