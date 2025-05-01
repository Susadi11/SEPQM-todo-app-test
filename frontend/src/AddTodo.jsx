import React, { useState } from "react";
import axios from "axios";

const AddTodo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation: Check if date is in the past
    if (new Date(formData.date) < new Date()) {
      setError("Please enter a valid date (today or future).");
      return; // Stop submission
    }

    try {
      await axios.post("http://localhost:5555/api/todos", formData);
      alert("Todo added successfully!");
      setFormData({ title: "", description: "", date: "" });
    } catch (error) {
      // Handle network/backend errors
      setError(error.response?.data?.message || "Failed to add todo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add New Todo
        </h2>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Date input with min attribute */}
        <div className="mb-5">
          <label htmlFor="date" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]} // Disable past dates in picker
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
};

export default AddTodo;