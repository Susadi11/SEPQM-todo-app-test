const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const app = require('express')();

dotenv.config();

const PORT = process.env.PORT || 5555;
const MONGOURI = process.env.MONGOURI;

// Middleware to parse JSON
app.use(express.json());

// Use the todo routes
app.use('/api/todos', todoRoutes);

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log('App connected to the database');
    app.listen(PORT, () => {
      console.log(`App is listening to port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  
  module.exports = app;

