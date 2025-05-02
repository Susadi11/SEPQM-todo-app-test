describe('Todo API Tests', () => {
    const API_URL = 'http://localhost:5555/api/todos';
    let testTodoId;
  
    const createTestTodo = (overrides = {}) => ({
      title: 'Test Todo',
      description: 'Test description',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      ...overrides
    });
  
    before(() => {
      cy.request('GET', API_URL).its('status').should('eq', 200);
    });
  
    after(() => {
      if (testTodoId) {
        cy.request('DELETE', `${API_URL}/${testTodoId}`);
      }
    });
  
    describe('Create Todo (POST /api/todos)', () => {
      
      it('should create a new todo with valid data', () => {
        const newTodo = createTestTodo();
        
        cy.request('POST', API_URL, newTodo)
          .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.include.keys(
              'title', 'description', 'date', 'status', 'createdAt', 'updatedAt'
            );
            expect(response.body).to.include({
              title: newTodo.title,
              description: newTodo.description,
              status: 'incomplete'
            });
            testTodoId = response.body._id;
          });
      });
  
      it('should create todo without optional description', () => {
        const newTodo = createTestTodo();
        delete newTodo.description;
        
        cy.request('POST', API_URL, newTodo)
          .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.description).to.eq('');
          });
      });
  
      
      it('should reject todo with past date', () => {
        const invalidTodo = createTestTodo({
          date: new Date(Date.now() - 86400000).toISOString() // Yesterday
        });
  
        cy.request({
          method: 'POST',
          url: API_URL,
          body: invalidTodo,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.include('valid date');
        });
      });
  
      it('should reject todo without title', () => {
        const invalidTodo = createTestTodo();
        delete invalidTodo.title;
  
        cy.request({
          method: 'POST',
          url: API_URL,
          body: invalidTodo,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
  
      it('should reject todo with empty title', () => {
        const invalidTodo = createTestTodo({ title: '   ' });
  
        cy.request({
          method: 'POST',
          url: API_URL,
          body: invalidTodo,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
  
      it('should reject todo with invalid date format', () => {
        const invalidTodo = createTestTodo({ date: 'not-a-date' });
  
        cy.request({
          method: 'POST',
          url: API_URL,
          body: invalidTodo,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
  
    describe('Get All Todos (GET /api/todos)', () => {
     
      it('should return an array of todos', () => {
        cy.request('GET', API_URL)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
          });
      });
  
      it('should return empty array when no todos exist', () => {
        // Delete all todos first
        cy.request('GET', API_URL).then((response) => {
          response.body.forEach(todo => {
            cy.request('DELETE', `${API_URL}/${todo._id}`);
          });
        });
  
        cy.request('GET', API_URL)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.empty;
          });
      });
  
      it('should handle invalid query parameters', () => {
        cy.request({
          method: 'GET',
          url: `${API_URL}?invalid=param`,
          failOnStatusCode: false
        }).then((response) => {
          expect([200, 400]).to.include(response.status);
        });
      });
    });
  
    describe('Get Single Todo (GET /api/todos/:id)', () => {
      beforeEach(() => {
        // Create a test todo for these tests
        cy.request('POST', API_URL, createTestTodo())
          .then((response) => {
            testTodoId = response.body._id;
          });
      });
  
      it('should return a specific todo', () => {
        cy.request('GET', `${API_URL}/${testTodoId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body._id).to.eq(testTodoId);
          });
      });
  
       
      it('should return 404 for non-existent todo', () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        cy.request({
          method: 'GET',
          url: `${API_URL}/${nonExistentId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body.message).to.eq('Todo not found');
        });
      });
  
      it('should return 400 for malformed ID', () => {
        const malformedId = 'invalid-id-format';
        
        cy.request({
          method: 'GET',
          url: `${API_URL}/${malformedId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
  
    describe('Update Todo (PUT /api/todos/:id)', () => {
      beforeEach(() => {
        // Create a test todo for these tests
        cy.request('POST', API_URL, createTestTodo())
          .then((response) => {
            testTodoId = response.body._id;
          });
      });
  
     
      it('should update an existing todo', () => {
        const updatedData = {
          title: 'Updated Title',
          description: 'Updated description',
          status: 'completed'
        };
  
        cy.request('PUT', `${API_URL}/${testTodoId}`, updatedData)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include(updatedData);
          });
      });
  
      it('should update with partial fields', () => {
        const partialUpdate = { status: 'completed' };
  
        cy.request('PUT', `${API_URL}/${testTodoId}`, partialUpdate)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq('completed');
          });
      });
  
     
      it('should reject update with invalid status', () => {
        const invalidUpdate = { status: 'invalid-status' };
  
        cy.request({
          method: 'PUT',
          url: `${API_URL}/${testTodoId}`,
          body: invalidUpdate,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
  
      it('should reject update with past date', () => {
        const invalidUpdate = { 
          date: new Date(Date.now() - 86400000).toISOString() 
        };
  
        cy.request({
          method: 'PUT',
          url: `${API_URL}/${testTodoId}`,
          body: invalidUpdate,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
  
      it('should return 404 when updating non-existent todo', () => {
        const nonExistentId = '507f1f77bcf86cd799439012';
        const updateData = { title: 'Attempt to update non-existent' };
  
        cy.request({
          method: 'PUT',
          url: `${API_URL}/${nonExistentId}`,
          body: updateData,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  
    describe('Delete Todo (DELETE /api/todos/:id)', () => {
      beforeEach(() => {
        // Create a test todo for these tests
        cy.request('POST', API_URL, createTestTodo())
          .then((response) => {
            testTodoId = response.body._id;
          });
      });
  
      
      it('should delete a todo', () => {
        cy.request('DELETE', `${API_URL}/${testTodoId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Todo deleted successfully');
          });
  
        // Verify deletion
        cy.request({
          method: 'GET',
          url: `${API_URL}/${testTodoId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
  
       
      it('should return 404 when deleting non-existent todo', () => {
        const nonExistentId = '507f1f77bcf86cd799439013';
        
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/${nonExistentId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
  
      it('should return 400 when using malformed ID for deletion', () => {
        const malformedId = 'invalid-id-format';
        
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/${malformedId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
   
  });