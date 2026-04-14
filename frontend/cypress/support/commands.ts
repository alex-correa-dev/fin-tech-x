declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      register(name?: string, email?: string, password?: string): Chainable<void>;
      mockAuthSuccess(): Chainable<void>;
      mockAuthFailure(): Chainable<void>;
      mockChatSuccess(): Chainable<void>;
      mockChatFailure(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockAuthSuccess', () => {
  cy.intercept('POST', '**/api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'fake-jwt-token',
      },
    },
  }).as('loginSuccess');

  cy.intercept('POST', '**/api/auth/register', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'fake-jwt-token',
      },
    },
  }).as('registerSuccess');
});

Cypress.Commands.add('mockAuthFailure', () => {
  cy.intercept('POST', '**/api/auth/login', {
    statusCode: 401,
    body: {
      success: false,
      error: 'Credenciais inválidas',
    },
  }).as('loginFailure');

  cy.intercept('POST', '**/api/auth/register', {
    statusCode: 400,
    body: {
      success: false,
      error: 'E-mail já existe',
    },
  }).as('registerFailure');
});

Cypress.Commands.add('mockChatSuccess', () => {
  cy.intercept('POST', '**/api/chat/ask', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        answer: 'Esta é uma resposta mockada do chat para testes E2E.',
        timestamp: new Date().toISOString(),
        model: 'gemini-mock',
      },
    },
  }).as('chatAsk');
});

Cypress.Commands.add('mockChatFailure', () => {
  cy.intercept('POST', '**/api/chat/ask', {
    statusCode: 500,
    body: {
      success: false,
      error: 'Erro ao processar pergunta',
    },
  }).as('chatFailure');
});

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('[data-testid="input-email"]').type(email);
  cy.get('[data-testid="input-password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add(
  'register',
  (name = 'Test User', email = 'test@example.com', password = 'password123') => {
    cy.visit('/register');
    cy.get('[data-testid="input-name"]').type(name);
    cy.get('[data-testid="input-email"]').type(email);
    cy.get('[data-testid="input-password"]').type(password);
    cy.get('[data-testid="input-confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();
  }
);
