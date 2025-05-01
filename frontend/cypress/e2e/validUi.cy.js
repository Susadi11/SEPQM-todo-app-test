describe('Todo App UI Visibility Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5555/api/todos', {
            statusCode: 200,
            body: [
                {
                    _id: '1',
                    title: 'Test Todo 1',
                    description: 'Test description 1',
                    date: '2023-12-31',
                    status: 'incomplete'
                },
                {
                    _id: '2',
                    title: 'Test Todo 2',
                    description: 'Test description 2',
                    date: '2023-12-25',
                    status: 'completed'
                }
            ]
        }).as('getTodos');

        cy.visit('/');
        cy.wait('@getTodos');
    });

    it('should display the main header and Add button', () => {
        // Check main header
        cy.get('h1')
            .should('be.visible')
            .and('contain', 'Task Dashboard')
            .and('have.class', 'text-indigo-700');

        // Check Add button
        cy.get('button')
            .contains('Add New Task')
            .should('be.visible')
            .and('have.class', 'bg-indigo-600')
            .and('have.class', 'text-white');
    });

    it('should display two columns for todos', () => {
        // Check column structure
        cy.get('.grid').should('have.class', 'md:grid-cols-2');

        // Check "To Do" column header
        cy.contains('h2', 'To Do')
            .should('be.visible')
            .parent()
            .should('contain', '1');

        // Check "Done" column header
        cy.contains('h2', 'Done')
            .should('be.visible')
            .parent()
            .should('contain', '1');
    });

    it('should display todo cards with correct styling', () => {
        // Check incomplete todo card
        cy.contains('.bg-white', 'Test Todo 1')
            .should('be.visible')
            .and('have.class', 'border-l-4')
            .and('have.class', 'border-red-500');

        // Check complete todo card
        cy.contains('.bg-white', 'Test Todo 2')
            .should('be.visible')
            .and('have.class', 'border-l-4')
            .and('have.class', 'border-green-500')
            .and('have.class', 'opacity-90');
    });

    it('should show the Add Todo modal when button is clicked', () => {
        // Click Add button
        cy.get('button').contains('Add New Task').click();

        // Check modal visibility
        cy.get('.fixed').should('be.visible');
        cy.contains('h2', 'Add New Task').should('be.visible');

        // Check form fields
        cy.get('input[name="title"]').should('be.visible');
        cy.get('textarea[name="description"]').should('be.visible');
        cy.get('input[name="date"]').should('be.visible');

        // Check buttons
        cy.contains('button', 'Cancel').should('be.visible');
        cy.contains('button', 'Add Task')
            .should('be.visible')
            .and('have.class', 'bg-indigo-600');
    });

    it('should display action buttons on todo cards', () => {
        // Check incomplete todo actions
        cy.contains('.bg-white', 'Test Todo 1')
            .within(() => {
                cy.contains('button', 'Complete')
                    .should('be.visible')
                    .and('have.class', 'bg-green-50');
            });

        // Check complete todo actions
        cy.contains('.bg-white', 'Test Todo 2')
            .within(() => {
                cy.contains('button', 'Undo')
                    .should('be.visible')
                    .and('have.class', 'bg-gray-100');
            });

        // Check delete buttons - count all SVG icons but verify count
        cy.get('svg[fill="currentColor"]').then($svgs => {
            cy.log(`Found ${$svgs.length} SVG elements`);
            cy.wrap($svgs).should('have.length', 3);
        });
    });

    it('should display dates correctly formatted', () => {
        // Check date formatting - search for the date with more flexible approach
        cy.contains('.bg-white', 'Test Todo 1')
            .within(() => {
                cy.log('Looking for date within the todo card');

                cy.contains(/12[-\/]31[-\/]2023|2023[-\/]12[-\/]31|31[-\/]12[-\/]2023/)
                    .should('exist');
            });
    });

    it('should show empty state messages when no todos', () => {
        // Clear mock and setup empty response
        cy.intercept('GET', 'http://localhost:5555/api/todos', {
            statusCode: 200,
            body: []
        }).as('getEmptyTodos');

        cy.reload();
        cy.wait('@getEmptyTodos');

        // Check empty states
        cy.contains('No tasks here yet').should('be.visible');
        cy.contains('No completed tasks yet').should('be.visible');
    });
});