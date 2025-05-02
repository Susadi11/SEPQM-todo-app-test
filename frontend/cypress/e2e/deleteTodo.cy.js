describe('Delete a To-Do', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173'); // Make sure this matches your app's URL
    });
  
    it('Adds a to-do, deletes it, and verifies removal', () => {
      const todoText = 'Test To-Do for Deletion';
      
      // Wait for page to load
      cy.get('body').should('be.visible');
      
      // Add to-do with increased timeout
      cy.get('[data-testid="add-task-button"]', { timeout: 10000 })
        .should('be.visible')
        .click();
        
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="title-input"]').type(todoText);
      cy.get('[data-testid="add-submit-button"]').click();
  
      // Verify addition
      cy.contains(todoText).should('exist');
  
      // Delete to-do
      cy.contains(todoText)
        .parent()
        .find('[data-testid="delete-button"]')
        .click();
  
      // Verify deletion
      cy.contains(todoText).should('not.exist');
    });
  });