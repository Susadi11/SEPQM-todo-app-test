import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        date: '',
        status: 'incomplete'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch todos from backend
    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/todos');
            setTodos(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const toggleStatus = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo._id === id);
            const newStatus = todoToUpdate.status === 'incomplete' ? 'completed' : 'incomplete';

            await axios.put(`http://localhost:5555/api/todos/${id}`, {
                status: newStatus
            });

            fetchTodos(); // Refresh the list after update
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/api/todos/${id}`);
            fetchTodos(); // Refresh the list after delete
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTodo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (newTodo.title.trim() === '') {
            setError("Title is required");
            return;
        }
      
        try {
            await axios.post('http://localhost:5555/api/todos', newTodo);
            fetchTodos();
            setNewTodo({ title: '', description: '', date: '', status: 'incomplete' });
            setShowModal(false);
            setError(null); // Clear previous errors
        } catch (err) {
            // Check if this is our custom validation error
            if (err.response?.status === 400 && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.response?.data?.message || "Failed to add task. Please try again.");
            }
        }
    };

    const incompleteTodos = todos.filter(todo => todo.status === 'incomplete');
    const completeTodos = todos.filter(todo => todo.status === 'completed');

    if (loading) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Loading...</div>;
    if (error && !showModal) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setError(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {error && (
                                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleAddTodo}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newTodo.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newTodo.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={newTodo.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setError(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header with title and button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">Task Dashboard</h1>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setError(null);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Task
                    </button>
                </div>

                {/* Error message (for non-modal errors) */}
                {error && !showModal && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        Error: {error}
                    </div>
                )}

                {/* Todo Lists - Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Incomplete Tasks Column */}
                    <div>
                        <div className="flex items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                To Do
                            </h2>
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {incompleteTodos.length}
                            </span>
                        </div>

                        {incompleteTodos.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p className="text-gray-500">No tasks here yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {incompleteTodos.map(todo => (
                                    <div key={todo._id} className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900">{todo.title}</h3>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => toggleStatus(todo._id)}
                                                        className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 transition-colors"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTodo(todo._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">{todo.description}</p>
                                            {todo.date && (
                                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(todo.date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Completed Tasks Column */}
                    <div>
                        <div className="flex items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Done
                            </h2>
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {completeTodos.length}
                            </span>
                        </div>

                        {completeTodos.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p className="text-gray-500">No completed tasks yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {completeTodos.map(todo => (
                                    <div key={todo._id} className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow opacity-90 hover:opacity-100">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900 line-through">{todo.title}</h3>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => toggleStatus(todo._id)}
                                                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                                                    >
                                                        Undo
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTodo(todo._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-through">{todo.description}</p>
                                            {todo.date && (
                                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(todo.date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;