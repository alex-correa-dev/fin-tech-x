describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="input-email"]').should('be.visible');
    cy.get('[data-testid="input-password"]').should('be.visible');
    cy.contains('Entrar').should('be.visible');
  });

  it('should display back button', () => {
    cy.get('[data-testid="back-button"]').should('be.visible');
  });

  it('should navigate to home when back button is clicked', () => {
    cy.get('[data-testid="back-button"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should navigate to register page', () => {
    cy.contains('Cadastre-se').click();
    cy.url().should('include', '/register');
  });
});
