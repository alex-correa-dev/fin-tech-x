describe('Header Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display logo', () => {
    cy.contains('FinTechX').should('be.visible');
  });

  it('should display theme toggle button', () => {
    cy.get('[data-testid="theme-toggle-button"]').should('be.visible');
  });

  it('should display sign in button when not authenticated', () => {
    cy.contains('Sign In').should('be.visible');
  });

  it('should navigate to login when sign in button is clicked', () => {
    cy.contains('Sign In').click();
    cy.url().should('include', '/login');
  });

  it('should toggle theme when theme button is clicked', () => {
    cy.get('[data-testid="theme-toggle-button"]').click();
    cy.get('html').should('have.class', 'dark-mode');
    cy.get('[data-testid="theme-toggle-button"]').click();
    cy.get('html').should('have.class', 'light-mode');
  });
});
