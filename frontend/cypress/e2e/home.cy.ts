describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display header', () => {
    cy.contains('FinTechX').should('be.visible');
  });

  it('should display robot image', () => {
    cy.get('img[alt="AI Robot"]').should('be.visible');
  });

  it('should display main title', () => {
    cy.contains('Unlock the Power Of Future AI').should('be.visible');
  });

  it('should display subtitle', () => {
    cy.contains('Chat with the smartest AI Future').should('be.visible');
  });

  it('should navigate to login when sign in button is clicked', () => {
    cy.contains('Sign In').click();
    cy.url().should('include', '/login');
  });
});
