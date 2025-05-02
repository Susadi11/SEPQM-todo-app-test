
describe('Todo UI Tests', () => {
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

    it('should display todo cards with correct styling', () => {
        cy.contains('Test Todo 1')
            .should('be.visible')
            .closest('.bg-white')
            .should('have.class', 'border-l-4')
            .and('have.class', 'border-red-500');

           cy.contains('Test Todo 2')
            .should('be.visible')
            .closest('.bg-white')
            .should('have.class', 'border-l-4')
            .and('have.class', 'border-green-500')
            .and('have.class', 'opacity-90');
    });
});