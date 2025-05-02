describe('Invalid Delete Todo Scenarios', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173');
      // Mock initial todos
      cy.intercept('GET', '/api/todos', {
        statusCode: 200,
        body: [{ 
          _id: '1', 
          title: 'Test Todo',
          status: 'incomplete'
        }]
      }).as('getTodos');
    });
  
    it('shows error when deleting non-existent todo', () => {
      cy.intercept('DELETE', '/api/todos/1', {
        statusCode: 404,
        body: { message: 'Todo not found' },
        delay: 100
      }).as('deleteFail');
      
      cy.get('[data-testid="delete-button"]').first().click();
      cy.wait('@deleteFail');
      cy.contains('Todo not found').should('be.visible');
    });
  
    it('shows error for server error during deletion', () => {
      cy.intercept('DELETE', '/api/todos/1', {
        statusCode: 500,
        body: { message: 'Server error' },
        delay: 100
      }).as('serverError');
      
      cy.get('[data-testid="delete-button"]').first().click();
      cy.wait('@serverError');
      cy.contains('Server error').should('be.visible');
    });
  
    it('shows error when unauthorized deletion attempted', () => {
      cy.intercept('DELETE', '/api/todos/1', {
        statusCode: 401,
        body: { message: 'Unauthorized' },
        delay: 100
      }).as('unauthorized');
      
      cy.get('[data-testid="delete-button"]').first().click();
      cy.wait('@unauthorized');
      cy.contains('Unauthorized').should('be.visible');
    });
  });