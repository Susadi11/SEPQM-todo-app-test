describe('Add To-Do (Invalid Input)', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('[data-testid=add-task-button]').click();
      cy.get('[data-testid=modal]').should('be.visible');
    });
  
    it('rejects empty title', () => {
      cy.get('[data-testid=add-submit-button]').click();
  
      cy.contains('Title is required')
        .should('be.visible');
  
      cy.get('[data-testid=modal]').should('be.visible');
    });
  
    it('rejects a past date', () => {
      cy.get('[data-testid=title-input]').type('Has Past Date');
  
      cy.get('input#date').type('2000-01-01');
  
      cy.get('[data-testid=add-submit-button]').click();
  
      cy.contains('Please enter a valid date')
        .should('be.visible');
  
      cy.get('[data-testid=modal]').should('be.visible');
    });
  });
  