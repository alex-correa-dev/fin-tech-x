describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display register form', () => {
    cy.get('[data-testid="input-name"]').should('be.visible');
    cy.get('[data-testid="input-email"]').should('be.visible');
    cy.get('[data-testid="input-password"]').should('be.visible');
    cy.get('[data-testid="input-confirmPassword"]').should('be.visible');
    cy.contains('Cadastrar').should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    cy.get('[data-testid="input-name"]').type('Test User');
    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="input-confirmPassword"]').type('different');
    cy.contains('Cadastrar').click();
    cy.contains('As senhas não coincidem').should('be.visible');
  });

  it('should show error when password is too short', () => {
    cy.get('[data-testid="input-name"]').type('Test User');
    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('123');
    cy.get('[data-testid="input-confirmPassword"]').type('123');
    cy.contains('Cadastrar').click();
    cy.contains('A senha deve ter entre 6 e 100 caracteres').should('be.visible');
  });

  it('should show error when name is too short', () => {
    cy.get('[data-testid="input-name"]').type('Te');
    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="input-confirmPassword"]').type('password123');
    cy.contains('Cadastrar').click();
    cy.contains('Nome deve ter no mínimo 3 caracteres').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.contains('Faça login').click();
    cy.url().should('include', '/login');
  });
});
