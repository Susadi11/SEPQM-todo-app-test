describe('Add To-Do (Valid Input)', () => {
    beforeEach(() => {
      cy.visit('/')  
    });
  
    it('opens the modal, adds "vinuk", and shows it on the dashboard', () => {
      cy.get('[data-testid=add-task-button]').click();
      cy.get('[data-testid=modal]').should('be.visible');
  
      cy.get('[data-testid=title-input]')
        .type('vinuk')
        .should('have.value', 'vinuk');
  
      cy.get('textarea#description')
        .type('Test description')
        .should('have.value', 'Test description');
  
      cy.get('input#date')
        .type('2025-05-29')
        .should('have.value', '2025-05-29');
  
      cy.get('[data-testid=add-submit-button]').click();
  
      cy.get('[data-testid=modal]').should('not.exist');
  
      cy.contains('.border-red-500', 'vinuk')
        .should('be.visible');
    });
  });
  