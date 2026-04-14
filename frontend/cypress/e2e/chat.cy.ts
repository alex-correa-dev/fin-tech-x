describe('Chat Interface', () => {
  beforeEach(() => {
    cy.mockAuthSuccess();
    cy.mockChatSuccess();
    cy.login();
    cy.url().should('include', '/dashboard');
  });

  it('should display chat header', () => {
    cy.contains('BrainBox').should('be.visible');
  });

  it('should display welcome message', () => {
    cy.contains('Olá! Como posso ajudar você hoje?').should('be.visible');
  });

  it('should display input field', () => {
    cy.get('textarea[placeholder="Enviar uma mensagem."]').should('be.visible');
  });

  it('should display send button', () => {
    cy.get('[data-testid="send-button"]').should('be.visible');
  });

  it('should display suggestion chips', () => {
    cy.contains('Quais são os horários de atendimento?').should('be.visible');
    cy.contains('Onde estão localizados os escritórios?').should('be.visible');
    cy.contains('Quem fundou a FinTechX?').should('be.visible');
  });

  it('should send message and receive response', () => {
    cy.get('textarea[placeholder="Enviar uma mensagem."]').type('What are your hours?');
    cy.get('[data-testid="send-button"]').click();

    cy.wait('@chatAsk');

    cy.contains('What are your hours?').should('be.visible');
    cy.contains('Esta é uma resposta mockada do chat para testes E2E.').should('be.visible');
  });

  it('should populate input when suggestion chip is clicked', () => {
    cy.contains('Quais são os horários de atendimento?').click();
    cy.get('textarea[placeholder="Enviar uma mensagem."]').should('have.value', 'Quais são os horários de atendimento?');
  });

  it('should send message with Enter key', () => {
    cy.get('textarea[placeholder="Enviar uma mensagem."]').type('Hello{enter}');
    cy.wait('@chatAsk');
    cy.contains('Hello').should('be.visible');
  });

  it('should show retry button on error', () => {
    cy.mockChatFailure();
    cy.get('textarea[placeholder="Enviar uma mensagem."]').type('Hello');
    cy.get('[data-testid="send-button"]').click();

    cy.wait('@chatFailure');
    cy.contains('Gerar Resposta Novamente').should('be.visible');
  });
});
