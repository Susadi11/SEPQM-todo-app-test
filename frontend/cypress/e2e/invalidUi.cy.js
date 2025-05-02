
describe('Todo UI Tests - Invalid Scenarios', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5555/api/todos', {
            statusCode: 200,
            body: [
                {
                    _id: '1',
                    title: 'Test Todo 1',
                    description: 'This is an incomplete task',
                    status: 'incomplete',
                    date: '2025-05-01'
                },
                {
                    _id: '2',
                    title: 'Test Todo 2',
                    description: 'This is a completed task',
                    status: 'completed',
                    date: '2025-05-02'
                }
            ]
        }).as('getTodos');
        cy.visit('/');
        cy.wait('@getTodos');
    });

    it('should not show Add Todo modal without clicking Add button', () => {
        cy.get('[data-testid="modal"]').should('not.exist');

            cy.contains('Task Dashboard').should('be.visible');
        cy.get('[data-testid="add-task-button"]').should('be.visible');

        cy.contains('Test Todo 1').should('be.visible');
        cy.get('[data-testid="modal"]').should('not.exist');

        cy.get('.fixed.inset-0').should('not.exist');

           cy.get('[data-testid="title-input"]').should('not.exist');
    });
});