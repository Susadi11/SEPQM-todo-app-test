import React, { useState } from "react";
import axios from "axios";

const AddTodo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/todos", formData);
      alert("Todo added successfully!");
      setFormData({ title: "", description: "", date: "" });
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add New Todo
        </h2>

        <div className="mb-5">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="date"
            className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
